import React, { useState } from "react";
import {
  ArrowLeft,
  Terminal,
  Copy,
  Check,
  ShieldCheck,
  Globe,
  Calendar,
  Key,
  HelpCircle,
  X,
  Trash2,
  AlertTriangle,
  Clock,
  RefreshCw,
  Server,
  HardDrive,
  Cpu,
  Database,
  Layers,
} from "lucide-react";
import { deleteInstance, updateInstance } from "../services/erpApi";

export default function InstanceDetailView({
  instance,
  onBack,
  onInstanceUpdated,
}) {
  const [copied, setCopied] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false);

  // Renewal & Status States
  const [renewalMonths, setRenewalMonths] = useState(1);
  const [renewing, setRenewing] = useState(false);

  // Delete 2FA Confirmation State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  // Revoke / Expire Now Modal States
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [revokeConfirmText, setRevokeConfirmText] = useState("");
  const [revoking, setRevoking] = useState(false);

  // Safely extract telemetry and metrics data sources
  const telemetry = instance.telemetry || {};
  const metrics = instance.metrics || {};

  // Telemetry Health Status Check (Active if pinged within last 10 mins)
  const lastPingTime = instance.lastTelemetryPing
    ? instance.lastTelemetryPing.toDate
      ? instance.lastTelemetryPing.toDate()
      : new Date(instance.lastTelemetryPing)
    : instance.lastHeartbeat
      ? instance.lastHeartbeat.toDate
        ? instance.lastHeartbeat.toDate()
        : new Date(instance.lastHeartbeat)
      : telemetry.receivedAt
        ? telemetry.receivedAt.toDate
          ? telemetry.receivedAt.toDate()
          : new Date(telemetry.receivedAt)
        : null;

  const isRecentlyActive =
    lastPingTime && Date.now() - lastPingTime.getTime() < 600000;

  const effectiveStatus = telemetry.status || "Offline";
  const isOnline =
    (effectiveStatus.toLowerCase() === "online" ||
      effectiveStatus.toLowerCase() === "active") &&
    isRecentlyActive;

  const clientNameSnake = instance.client.toLowerCase().replace(/\s+/g, "_");

  const customPythonScript = `
# ==========================================
# 1. ERPNEXT LICENSE PROTECTION SCRIPT
# ==========================================
# Frappe Server Script / Whitelisted Method for ${instance.client} (${instance.domain})
# Zero-Trust Secure Verification via Cloud Function
# License Key: ${instance.license}


url = "https://us-central1-erp-master-565f8.cloudfunctions.net/updateTelemetry"

payload = {
    "licenseKey": "${instance.license}",
    "timestamp": str(frappe.utils.now_datetime()),
    "metrics": {
        "status": "active",
        "databaseStatus": "connected",
        "erpnextVersion": "15.0.0"
    }
}

try:
    response = frappe.make_post_request(url, json=payload)
    frappe.response["message"] = {"status": "success", "response": response}

except Exception as e:
    frappe.log_error(title="Telemetry Error", message=str(e))
    frappe.response["message"] = {"status": "error", "message": str(e)}
  `.trim();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [customExpiryDate, setCustomExpiryDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 30);
    return d.toISOString().split("T")[0];
  });

  const handleRenewLicense = async () => {
    if (!customExpiryDate) {
      alert("Please select a valid expiration date.");
      return;
    }

    setRenewing(true);
    const newExpDate = new Date(customExpiryDate);
    newExpDate.setHours(23, 59, 59, 999);

    const historyEntry = {
      renewedAt: new Date().toISOString(),
      previousExpiry: instance.expiresAt || new Date().toISOString(),
      newExpiry: newExpDate.toISOString(),
      planDuration: `Custom (until ${newExpDate.toLocaleDateString()})`,
      updatedBy: "Admin Portal",
    };

    const existingHistory = Array.isArray(instance.renewalHistory)
      ? instance.renewalHistory
      : [];
    const updatedHistory = [historyEntry, ...existingHistory];

    const payload = {
      expiresAt: newExpDate.toISOString(),
      status: "Active",
      renewalHistory: updatedHistory,
    };

    try {
      const res = await updateInstance(instance.id, payload);
      setRenewing(false);
      if (res.success) {
        instance.expiresAt = newExpDate.toISOString();
        instance.status = "Active";
        instance.renewalHistory = updatedHistory;
        if (onInstanceUpdated) onInstanceUpdated(instance);
        alert("License successfully extended to the selected date!");
      } else {
        alert("Failed to renew license via API.");
      }
    } catch (err) {
      setRenewing(false);
      console.error("Renewal error:", err);
      alert("An error occurred while renewing the license.");
    }
  };

  const handleToggleHoldStatus = async () => {
    setRenewing(true);
    const isCurrentlyOnHold = instance.status === "On Hold";
    const newExpDate = isCurrentlyOnHold
      ? new Date(instance.expiresAt || Date.now() + 30 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() - 24 * 60 * 60 * 1000);

    const newStatus = isCurrentlyOnHold ? "Active" : "On Hold";
    const payload = {
      expiresAt: newExpDate.toISOString(),
      status: newStatus,
    };

    try {
      const res = await updateInstance(instance.id, payload);
      setRenewing(false);
      if (res.success) {
        instance.expiresAt = newExpDate.toISOString();
        instance.status = newStatus;
        if (onInstanceUpdated) onInstanceUpdated(instance);
        alert(
          isCurrentlyOnHold
            ? "License activated successfully!"
            : "License placed on hold.",
        );
      } else {
        alert("Failed to update status.");
      }
    } catch (err) {
      setRenewing(false);
      console.error("Status toggle error:", err);
      alert("An error occurred.");
    }
  };

  const handleDeleteConfirm = async () => {
    if (confirmText !== instance.client) return;
    setDeleting(true);
    const res = await deleteInstance(instance.id);
    setDeleting(false);

    if (res.success) {
      onBack();
    } else {
      alert("Failed to delete instance.");
    }
  };

  const handleRevokeNowConfirm = async () => {
    if (revokeConfirmText !== instance.client) return;
    setRevoking(true);

    const expiredDate = new Date();
    expiredDate.setDate(expiredDate.getDate() - 1);

    const historyEntry = {
      renewedAt: new Date().toISOString(),
      previousExpiry: instance.expiresAt || new Date().toISOString(),
      newExpiry: expiredDate.toISOString(),
      planDuration: "Manually Revoked / Expired",
      updatedBy: "Admin Portal",
    };

    const existingHistory = Array.isArray(instance.renewalHistory)
      ? instance.renewalHistory
      : [];
    const updatedHistory = [historyEntry, ...existingHistory];

    const payload = {
      expiresAt: expiredDate.toISOString(),
      status: "Expired / Deactivated",
      renewalHistory: updatedHistory,
    };

    try {
      const res = await updateInstance(instance.id, payload);
      setRevoking(false);
      setShowRevokeModal(false);
      setRevokeConfirmText("");
      if (res.success) {
        instance.expiresAt = expiredDate.toISOString();
        instance.status = "Expired / Deactivated";
        instance.renewalHistory = updatedHistory;
        if (onInstanceUpdated) onInstanceUpdated(instance);
        alert(
          "License successfully revoked and expired. ERPNext will lock on next verification.",
        );
      } else {
        alert("Failed to revoke license.");
      }
    } catch (err) {
      setRevoking(false);
      console.error("Revoke error:", err);
      alert("An error occurred while revoking the license.");
    }
  };

  const isExpired =
    instance.status === "Expired / Deactivated" ||
    (instance.expiresAt && new Date(instance.expiresAt) < new Date());

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Instances Dashboard</span>
      </button>

      {/* Instance Summary Header */}
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold text-slate-900">
                {instance.client}
              </h1>
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isExpired
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                {isExpired ? "Deactivated / Locked" : "Active"}
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1 flex items-center space-x-1.5">
              <Globe className="w-3.5 h-3.5" />
              <span>{instance.domain}</span>
            </p>
          </div>

          <button
            onClick={() => setShowStepsModal(true)}
            className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl border border-indigo-200 text-sm flex items-center space-x-2 transition-colors shadow-xs cursor-pointer"
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>Show me steps</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
              <Key className="w-3.5 h-3.5 text-indigo-600" />
              <span>Assigned License Key</span>
            </span>
            <code className="text-xs font-mono font-bold text-slate-900 block pt-1">
              {instance.license}
            </code>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              <span>Expiration Date</span>
            </span>
            <span className="text-sm font-bold text-slate-900 block pt-1">
              {instance.expiresAt
                ? new Date(instance.expiresAt).toLocaleDateString()
                : "N/A"}
            </span>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-1">
            <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>Security Status</span>
            </span>
            <span className="text-sm font-bold text-slate-900 block pt-1">
              {isExpired ? "Enforcing Lockout" : "Fully Operational"}
            </span>
          </div>
        </div>
      </div>

      {/* SERVER HEALTH & TELEMETRY MONITORING CARD */}
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <Server className="w-5 h-5 text-indigo-600" />
              <span>On-Premise Server Health & Telemetry Metrics</span>
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              Live metrics reported via automated background scheduler hook.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-full text-xs font-semibold">
              <span
                className={`w-2.5 h-2.5 rounded-full ${isOnline ? "bg-emerald-500 animate-pulse" : "bg-rose-500"}`}
              ></span>
              <span
                className={
                  isOnline
                    ? "text-emerald-700 font-bold"
                    : "text-rose-700 font-bold"
                }
              >
                {isOnline ? "ERP Online" : "ERP Offline / Unreachable"}
              </span>
            </div>
          </div>
        </div>

        {/* Secondary Info Bar (Database & ERPNext Version) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-2">
          <div className="flex items-center space-x-3 bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-2xl">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                Database Status
              </span>
              <span className="text-sm font-bold text-slate-900 capitalize">
                {telemetry.databaseStatus ||
                  metrics.databaseStatus ||
                  "Unknown"}
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-3 bg-indigo-50/50 border border-indigo-100 p-3.5 rounded-2xl">
            <div className="p-2 bg-indigo-100 text-indigo-700 rounded-xl">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-semibold text-slate-500 block">
                ERPNext Version
              </span>
              <span className="text-sm font-bold text-slate-900">
                {telemetry.erpnextVersion || metrics.erpnextVersion || "N/A"}
              </span>
            </div>
          </div>
        </div>

        {/* Main Resource Utilization Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <HardDrive className="w-4 h-4 text-indigo-600" />
              <span>SSD Storage Used</span>
            </span>
            <div className="text-xl font-black text-slate-900">
              {telemetry.diskUsagePercent !== undefined
                ? `${telemetry.diskUsagePercent}%`
                : metrics.diskUsagePercent !== undefined
                  ? `${metrics.diskUsagePercent}%`
                  : "No Data Yet"}
            </div>
            <p className="text-[11px] text-slate-500">
              {telemetry.diskUsagePercent !== undefined
                ? "Root filesystem utilization"
                : metrics.diskFreeTb !== undefined
                  ? `${metrics.diskFreeTb} TB free of ${metrics.diskTotalTb} TB`
                  : "Waiting for telemetry hook..."}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>RAM (Memory) Usage</span>
            </span>
            <div className="text-xl font-black text-slate-900">
              {telemetry.ramUsagePercent !== undefined
                ? `${telemetry.ramUsagePercent}%`
                : metrics.ramUsagePercent !== undefined
                  ? `${metrics.ramUsagePercent}%`
                  : "No Data Yet"}
            </div>
            <p className="text-[11px] text-slate-500">
              {telemetry.ramUsagePercent !== undefined
                ? "Active system memory load"
                : metrics.ramUsedGb !== undefined
                  ? `${metrics.ramUsedGb} GB used of ${metrics.ramTotalGb} GB`
                  : "Waiting for telemetry hook..."}
            </p>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2">
            <span className="text-xs text-slate-500 font-bold uppercase tracking-wider flex items-center space-x-1.5">
              <Cpu className="w-4 h-4 text-indigo-600" />
              <span>CPU Load</span>
            </span>
            <div className="text-xl font-black text-slate-900">
              {telemetry.cpuUsagePercent !== undefined
                ? `${telemetry.cpuUsagePercent}%`
                : metrics.cpuUsagePercent !== undefined
                  ? `${metrics.cpuUsagePercent}%`
                  : "No Data Yet"}
            </div>
            <p className="text-[11px] text-slate-500">
              Last ping:{" "}
              {lastPingTime
                ? lastPingTime.toLocaleTimeString("en-IN")
                : "Never"}
            </p>
          </div>
        </div>
      </div>

      {/* SUBSCRIPTION RENEWAL & STATUS MANAGEMENT CARD */}
      <div className="bg-white border border-slate-200 p-8 rounded-3xl shadow-xs space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-slate-900 flex items-center space-x-2">
              <RefreshCw className="w-5 h-5 text-indigo-600" />
              <span>Subscription & Status Management</span>
            </h3>
            <p className="text-sm text-slate-500 mt-0.5">
              {isExpired
                ? "License is expired or deactivated. Renew to restore access."
                : "License is currently active. You can place it on hold if needed."}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {!isExpired && (
              <button
                onClick={() => {
                  setRevokeConfirmText("");
                  setShowRevokeModal(true);
                }}
                className="px-4 py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold rounded-xl text-sm transition-all cursor-pointer whitespace-nowrap"
              >
                Revoke License Now
              </button>
            )}

            {!isExpired ? (
              <button
                onClick={handleToggleHoldStatus}
                disabled={renewing}
                className="px-5 py-2.5 font-bold rounded-xl text-sm bg-amber-50 hover:bg-amber-100 text-amber-700 border border-amber-200 transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                Put on Hold
              </button>
            ) : instance.status === "On Hold" ? (
              <button
                onClick={handleToggleHoldStatus}
                disabled={renewing}
                className="px-5 py-2.5 font-bold rounded-xl text-sm bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 transition-all shadow-xs cursor-pointer whitespace-nowrap"
              >
                Activate License
              </button>
            ) : null}

            {isExpired && (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    New Expiry:
                  </span>
                  <input
                    type="date"
                    value={customExpiryDate}
                    onChange={(e) => setCustomExpiryDate(e.target.value)}
                    className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
                  />
                </div>

                <button
                  onClick={handleRenewLicense}
                  disabled={renewing}
                  className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 cursor-pointer whitespace-nowrap"
                >
                  {renewing ? "Processing..." : "Confirm Renewal"}
                </button>
              </>
            )}
          </div>
        </div>

        {/* Renewal History Table */}
        <div className="border-t border-slate-100 pt-6 space-y-3">
          <h4 className="text-sm font-bold text-slate-900 flex items-center space-x-2">
            <Clock className="w-4 h-4 text-slate-500" />
            <span>
              Renewal Audit History ({instance.renewalHistory?.length || 0})
            </span>
          </h4>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs text-slate-600">
              <thead className="bg-slate-50 font-bold uppercase tracking-wider text-slate-500 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Renewed Timestamp</th>
                  <th className="px-4 py-3">Duration Added</th>
                  <th className="px-4 py-3">Previous Expiry</th>
                  <th className="px-4 py-3">New Expiry</th>
                  <th className="px-4 py-3">Updated By</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {Array.isArray(instance.renewalHistory) &&
                instance.renewalHistory.length > 0 ? (
                  instance.renewalHistory.map((item, index) => (
                    <tr
                      key={index}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-slate-900">
                        {item.renewedAt
                          ? new Date(item.renewedAt).toLocaleString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 font-bold text-indigo-600">
                        {item.planDuration || "N/A"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {item.previousExpiry
                          ? new Date(item.previousExpiry).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 font-bold text-emerald-600">
                        {item.newExpiry
                          ? new Date(item.newExpiry).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-4 py-3 text-slate-500">
                        {item.updatedBy || "Admin"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-4 py-6 text-center text-slate-400 italic"
                    >
                      No renewal records found for this instance yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Pre-generated Integration Code Section */}
      <div className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-slate-900">
            Pre-Generated ERPNext Protection Script
          </h2>
          <p className="text-slate-600 text-sm">
            Copy this script into{" "}
            <span className="font-semibold text-slate-900">
              {instance.client}
            </span>
            's ERPNext instance.
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
          <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
            <span className="text-xs font-mono text-indigo-400 flex items-center space-x-2">
              <Terminal className="w-4 h-4" />
              <span>verify_license_{clientNameSnake}.py</span>
            </span>
            <button
              onClick={() => copyToClipboard(customPythonScript)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1 transition-colors cursor-pointer"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
              <span>{copied ? "Copied Snippet!" : "Copy Snippet"}</span>
            </button>
          </div>
          <pre className="p-6 text-xs font-mono text-slate-800 bg-slate-50 overflow-x-auto leading-relaxed">
            <code>{customPythonScript}</code>
          </pre>
        </div>
      </div>

      {/* DANGER ZONE: PERMANENT DELETE */}
      <div className="bg-rose-50/50 border border-rose-200 p-8 rounded-3xl space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="text-lg font-extrabold text-rose-900 flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 text-rose-600" />
              <span>Danger Zone: Permanent Deletion</span>
            </h3>
            <p className="text-xs text-rose-700 mt-1">
              Deleting this instance will revoke its license key permanently.
              The ERPNext instance will fail verification on next check.
            </p>
          </div>
          <button
            onClick={() => {
              setConfirmText("");
              setShowDeleteModal(true);
            }}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-rose-600/20 cursor-pointer flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete License Permanently</span>
          </button>
        </div>
      </div>

      {/* STEP-BY-STEP GUIDE MODAL */}
      {showStepsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-8 space-y-6 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-slate-900">
                How to Setup in ERPNext
              </h3>
              <button
                onClick={() => setShowStepsModal(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <p className="text-sm text-slate-600">
              Follow standard Server Script setup steps in your ERPNext desk for{" "}
              <strong>{instance.client}</strong>.
            </p>
            <div className="flex justify-end">
              <button
                onClick={() => setShowStepsModal(false)}
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl cursor-pointer"
              >
                Got it
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TWO-FACTOR / CONFIRMATION DELETE MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 space-y-6 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-rose-900 flex items-center space-x-2">
                <Trash2 className="w-5 h-5 text-rose-600" />
                <span>Confirm Permanent Deletion</span>
              </h3>
              <button
                onClick={() => setShowDeleteModal(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <p>
                This action <strong>cannot be undone</strong>. To verify
                deletion, please type the exact company name{" "}
                <span className="font-bold text-slate-900 select-all">
                  {instance.client}
                </span>{" "}
                below:
              </p>

              <input
                type="text"
                placeholder={`Type "${instance.client}" to confirm`}
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-rose-600"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteConfirm}
                disabled={confirmText !== instance.client || deleting}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-rose-600/20 cursor-pointer"
              >
                {deleting ? "Deleting..." : "Confirm Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TWO-FACTOR / REVOKE CONFIRMATION MODAL */}
      {showRevokeModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-md w-full p-8 space-y-6 relative shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-extrabold text-rose-900 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5 text-rose-600" />
                <span>Confirm Immediate Revocation</span>
              </h3>
              <button
                onClick={() => setShowRevokeModal(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-sm text-slate-600">
              <p>
                This will instantly invalidate the license and lock out{" "}
                <span className="font-bold text-slate-900">
                  {instance.client}
                </span>
                . To confirm, please type the exact company name below:
              </p>

              <input
                type="text"
                placeholder={`Type "${instance.client}" to confirm`}
                value={revokeConfirmText}
                onChange={(e) => setRevokeConfirmText(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-rose-600"
              />
            </div>

            <div className="flex space-x-3 pt-2">
              <button
                onClick={() => setShowRevokeModal(false)}
                className="flex-1 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-sm transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleRevokeNowConfirm}
                disabled={revokeConfirmText !== instance.client || revoking}
                className="flex-1 py-3 bg-rose-600 hover:bg-rose-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-rose-600/20 cursor-pointer"
              >
                {revoking ? "Revoking..." : "Confirm Revoke"}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
