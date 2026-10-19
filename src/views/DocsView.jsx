import React from "react";
import { Terminal, Copy, Check } from "lucide-react";

export default function DocsView({ frappeScript, copiedKey, copyToClipboard }) {
  return (
    <main className="max-w-5xl mx-auto px-6 py-12 space-y-8">
      <div className="space-y-3">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          ERPNext Integration Script
        </h1>
        <p className="text-slate-600 text-sm">
          Add this server-side Python script as a Whitelisted Server Script
          inside your ERPNext instance to enable license validation and
          telemetry reporting.
        </p>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-indigo-400 flex items-center space-x-2">
            <Terminal className="w-4 h-4" />
            <span>frappe_license_telemetry.py</span>
          </span>
          <button
            onClick={() => copyToClipboard(frappeScript)}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-lg flex items-center space-x-1 transition-colors"
          >
            {copiedKey ? (
              <Check className="w-3.5 h-3.5 text-emerald-400" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
            <span>{copiedKey ? "Copied Code!" : "Copy Snippet"}</span>
          </button>
        </div>
        <pre className="p-6 text-xs font-mono text-slate-800 bg-slate-50 overflow-x-auto leading-relaxed">
          <code>{frappeScript}</code>
        </pre>
      </div>
    </main>
  );
}
