import React, { useState } from "react";
import { Key, Lock, Activity, Globe, Check, Copy } from "lucide-react";

export default function PortalView({
  clientName,
  setClientName,
  companyName,
  setCompanyName,
  instanceUrl,
  setInstanceUrl,
  selectedPlan,
  setSelectedPlan,
  validityDays,
  setValidityDays, // <-- Add these props
  loading,
  handleGenerateLicense,
  generatedLicense,
  copiedKey,
  copyToClipboard,
  instances,
  onSelectInstance,
}) {
  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Client Portal & License Manager
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Register time-bound licenses with automated expiration tracking.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Registration Form */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-6 lg:col-span-1">
          <h2 className="text-xl font-bold flex items-center space-x-2 text-slate-900">
            <Key className="w-5 h-5 text-indigo-600" />
            <span>Register Timed Instance</span>
          </h2>

          <form onSubmit={handleGenerateLicense} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Client Name
              </label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Company / Organization
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Acme Foundries"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Instance URL / Domain
              </label>
              <input
                type="text"
                required
                placeholder="e.g. erp.acme.com"
                value={instanceUrl}
                onChange={(e) => setInstanceUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Subscription Plan
              </label>
              <select
                value={selectedPlan}
                onChange={(e) => setSelectedPlan(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                <option value="Starter">Starter (Up to 5 Users)</option>
                <option value="Professional">
                  Professional (Up to 25 Users)
                </option>
                <option value="Enterprise">Enterprise (Unlimited Users)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-2">
                Validity Duration
              </label>
              <select
                value={validityDays}
                onChange={(e) => setValidityDays(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 font-bold text-indigo-600"
              >
                <option value="7">7 Days (Trial)</option>
                <option value="30">30 Days (Monthly)</option>
                <option value="90">90 Days (Quarterly)</option>
                <option value="365">365 Days (Annual)</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 mt-2 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              <Lock className="w-4 h-4" />
              <span>
                {loading ? "Generating..." : "Generate Timed License"}
              </span>
            </button>
          </form>

          {generatedLicense && (
            <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl space-y-2 mt-4">
              <span className="text-xs text-indigo-700 font-semibold uppercase">
                Generated License Key
              </span>
              <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-indigo-200">
                <code className="text-xs text-indigo-600 font-mono font-bold">
                  {generatedLicense}
                </code>
                <button
                  onClick={() => copyToClipboard(generatedLicense)}
                  className="text-slate-500 hover:text-slate-900 p-1"
                >
                  {copiedKey ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Telemetry & Expiry Status Table */}
        <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center space-x-2 text-slate-900">
              <Activity className="w-5 h-5 text-indigo-600" />
              <span>Instance Status & Expiration Tracking</span>
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                  <th className="py-3 px-4">Client / Domain</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Expires At</th>
                  <th className="py-3 px-4">License Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm">
                {instances.map((inst, idx) => {
                  const isExpired = inst.status === "Expired / Deactivated";
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-4 px-4">
                        <div className="font-semibold text-slate-900">
                          {inst.client}
                        </div>
                        <div className="text-xs text-slate-500 flex items-center space-x-1">
                          <Globe className="w-3 h-3" />
                          <span>{inst.domain}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            isExpired
                              ? "bg-rose-50 text-rose-700 border border-rose-200"
                              : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          }`}
                        >
                          {inst.status}
                        </span>
                      </td>
                      <td className="py-4 px-4 font-mono text-xs text-slate-700">
                        {inst.expiresAt
                          ? new Date(inst.expiresAt).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="py-4 px-4 font-mono text-xs">
                        <button
                          onClick={() => onSelectInstance(inst)}
                          className="text-indigo-600 font-bold hover:underline cursor-pointer bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100"
                          title="Click to view pre-generated integration code"
                        >
                          {inst.license} ↗
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
