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
} from "lucide-react";
import { deleteInstance } from "../services/erpApi"; // Import delete API

export default function InstanceDetailView({ instance, onBack }) {
  const [copied, setCopied] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false);

  // Delete 2FA Confirmation State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [deleting, setDeleting] = useState(false);

  const customPythonScript = `
# Frappe Server Script / Whitelisted Method for ${instance.client} (${instance.domain})
# Zero-Trust Secure Verification via Cloud Function
# License Key: ${instance.license}

import frappe
import requests
from frappe.utils import now_datetime, get_datetime

@frappe.whitelist()
def verify_client_license():
    assigned_key = "${instance.license}"
    current_key = frappe.db.get_single_value("System Settings", "custom_erp_license_key")
    if current_key != assigned_key:
        frappe.throw("SECURITY LOCK: Invalid or unauthorized license key configured for this instance.")
        
    verify_url = "https://us-central1-erp-master-565f8.cloudfunctions.net/verifyLicense"
    payload = {"license": assigned_key}
    
    try:
        response = requests.post(verify_url, json=payload, timeout=5)
        res_data = response.json()
        
        if response.status_code != 200 or not res_data.get("valid"):
            error_msg = res_data.get("message", "License validation failed.")
            frappe.throw(f"LICENSE ERROR: {error_msg}. System locked.")
            
        expires_at_str = res_data.get("expiresAt")
        if expires_at_str and get_datetime(expires_at_str) < now_datetime():
            frappe.throw("LICENSE EXPIRED: Your subscription for ${instance.client} has expired. System locked.")
    except Exception as e:
        if "LICENSE" in str(e) or "SECURITY" in str(e):
            raise e
        frappe.log_error(f"License verification failed: {str(e)}", "Nexus ERP License Error")
        
    return {"status": "Active", "client": "${instance.client}"}
  `.trim();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDeleteConfirm = async () => {
    if (confirmText !== instance.client) return;
    setDeleting(true);
    const res = await deleteInstance(instance.id);
    setDeleting(false);

    if (res.success) {
      onBack(); // Return to dashboard
    } else {
      alert("Failed to delete instance.");
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
              <span>
                verify_license_
                {instance.client.toLowerCase().replace(/\s+/g, "_")}.py
              </span>
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
              <span>{copied ? "Copied Custom Code!" : "Copy Snippet"}</span>
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
          {/* Modal content from before */}
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
                className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl"
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
    </main>
  );
}
