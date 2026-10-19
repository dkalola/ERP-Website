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
  ExternalLink,
} from "lucide-react";

export default function InstanceDetailView({ instance, onBack }) {
  const [copied, setCopied] = useState(false);
  const [showStepsModal, setShowStepsModal] = useState(false); // <-- Step modal state

  const customPythonScript = `
# Frappe Server Script / Whitelisted Method for ${instance.client} (${instance.domain})
# Direct Firestore REST API Verification (No Backend Server Needed)
# License Key: ${instance.license}

import frappe
import requests
from frappe.utils import now_datetime, get_datetime

@frappe.whitelist()
def verify_client_license():
    assigned_key = "${instance.license}"
    
    # 1. Verify local license key matches
    current_key = frappe.db.get_single_value("System Settings", "custom_erp_license_key")
    if current_key != assigned_key:
        frappe.throw("SECURITY LOCK: Invalid or unauthorized license key configured for this instance.")
        
    # 2. Query Firestore directly via Firebase REST API
    project_id = "YOUR_PROJECT_ID"
    api_key = "YOUR_FIREBASE_API_KEY"
    
    firestore_url = f"https://firestore.googleapis.com/v1/projects/{project_id}/databases/(default)/documents:runQuery?key={api_key}"
    
    query_payload = {
        "structuredQuery": {
            "from": [{"collectionId": "erp_instances"}],
            "where": {
                "fieldFilter": {
                    "field": {"fieldPath": "license"},
                    "op": "EQUAL",
                    "value": {"stringValue": assigned_key}
                }
            }
        }
    }
    
    try:
        response = requests.post(firestore_url, json=query_payload, timeout=5)
        results = response.json()
        
        if not results or not results[0].get("document"):
            frappe.throw("LICENSE ERROR: License key not found in central database.")
            
        doc_fields = results[0]["document"]["fields"]
        expires_at_str = doc_fields.get("expiresAt", {}).get("stringValue")
        
        # 3. Check Expiration Date
        if expires_at_str and get_datetime(expires_at_str) < now_datetime():
            frappe.throw("LICENSE EXPIRED: Your subscription for ${instance.client} has expired. System locked. Please renew through the Nexus ERP portal.")
            
    except Exception as e:
        frappe.log_error(f"License verification failed: {str(e)}", "Nexus ERP License Error")
        
    return {
        "status": "Active",
        "client": "${instance.client}",
        "message": "Direct Firestore verification passed successfully."
    }
  `.trim();

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const isExpired =
    instance.status === "Expired / Deactivated" ||
    (instance.expiresAt && new Date(instance.expiresAt) < new Date());

  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center space-x-2 text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
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

          {/* Show Me Steps Button */}
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
        <div className="flex items-center justify-between">
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
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1 transition-colors"
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

      {/* STEP-BY-STEP GUIDE MODAL */}
      {showStepsModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-3xl max-w-2xl w-full p-8 space-y-6 relative shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl border border-indigo-100">
                  <Terminal className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-extrabold text-slate-900">
                    How to Setup in ERPNext
                  </h3>
                  <p className="text-xs text-slate-500">
                    Step-by-step installation guide for {instance.client}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowStepsModal(false)}
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-6 text-sm text-slate-700">
              {/* Step 1 */}
              <div className="flex space-x-4">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  1
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">
                    Open Server Scripts in ERPNext
                  </h4>
                  <p className="text-slate-600">
                    Log into your client's ERPNext desk as Administrator. In the
                    global search bar, type and open{" "}
                    <strong>Server Script</strong>.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex space-x-4">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  2
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">
                    Create a New Whitelisted Script
                  </h4>
                  <p className="text-slate-600">
                    Click <strong>New</strong>. Set the Script Type to{" "}
                    <strong>API Method</strong> and give it a Method Name such
                    as{" "}
                    <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-indigo-600">
                      verify_client_license
                    </code>
                    .
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex space-x-4">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  3
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">
                    Paste the Custom Python Code
                  </h4>
                  <p className="text-slate-600">
                    Copy the pre-generated Python script snippet from this
                    portal page and paste it into the code editor box.
                  </p>
                </div>
              </div>

              {/* Step 4 */}
              <div className="flex space-x-4">
                <div className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center shrink-0 text-xs">
                  4
                </div>
                <div className="space-y-1">
                  <h4 className="font-bold text-slate-900">
                    Configure System Settings Key
                  </h4>
                  <p className="text-slate-600">
                    Go to <strong>System Settings</strong> in ERPNext, ensure
                    you have your license key{" "}
                    <code className="text-xs bg-slate-100 px-1.5 py-0.5 rounded font-mono text-indigo-600">
                      {instance.license}
                    </code>{" "}
                    stored in your custom license field, and click{" "}
                    <strong>Save</strong>.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowStepsModal(false)}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-md transition-all cursor-pointer"
              >
                Got it, close guide
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
