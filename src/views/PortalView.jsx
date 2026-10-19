import React, { useState } from "react";
import {
  Key,
  Lock,
  Activity,
  Globe,
  Check,
  Copy,
  Calendar,
  Building,
  Phone,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

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
  setValidityDays,
  clientEmail,
  setClientEmail,
  clientPhone,
  setClientPhone,
  maxUsers,
  setMaxUsers,
  loading,
  handleGenerateLicense,
  generatedLicense,
  copiedKey,
  copyToClipboard,
  instances,
  onSelectInstance,
  demoLeads = [],
  onCloseLead,
}) {
  const [isCustomValidity, setIsCustomValidity] = useState(false);
  const [customDaysValue, setCustomDaysValue] = useState("45");

  // Search & Pagination States for Instances Directory
  const [instanceSearchQuery, setInstanceSearchQuery] = useState("");
  const [instancePage, setInstancePage] = useState(1);
  const itemsPerPage = 10;

  // Search & Pagination States for Demo Requests
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleValidityChange = (e) => {
    const val = e.target.value;
    if (val === "custom") {
      setIsCustomValidity(true);
      setValidityDays(customDaysValue);
    } else {
      setIsCustomValidity(false);
      setValidityDays(val);
    }
  };

  const handleCustomDaysChange = (e) => {
    const val = e.target.value;
    setCustomDaysValue(val);
    setValidityDays(val);
  };

  // 1. Filter and paginate Instances
  const filteredInstances = instances.filter((inst) => {
    const query = instanceSearchQuery.toLowerCase();
    const client = (inst.client || "").toLowerCase();
    const person = (inst.clientPerson || "").toLowerCase();
    const domain = (inst.domain || "").toLowerCase();
    return (
      client.includes(query) || person.includes(query) || domain.includes(query)
    );
  });

  const totalInstancePages =
    Math.ceil(filteredInstances.length / itemsPerPage) || 1;
  const instanceStartIndex = (instancePage - 1) * itemsPerPage;
  const currentInstances = filteredInstances.slice(
    instanceStartIndex,
    instanceStartIndex + itemsPerPage,
  );

  // 2. Filter and paginate Demo Leads
  const filteredLeads = demoLeads.filter((lead) => {
    const query = searchQuery.toLowerCase();
    const company = (lead.companyName || "").toLowerCase();
    const phone = (lead.contactNumber || "").toLowerCase();
    return company.includes(query) || phone.includes(query);
  });

  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLeads = filteredLeads.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Client Portal & License Manager
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Register time-bound licenses, manage client telemetry, and review
            incoming demo leads.
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
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Client Contact Person
              </label>
              <input
                type="text"
                required
                placeholder="e.g. John Doe"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Company / Organization
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Ganga Forging LTD"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  placeholder="client@domain.com"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Phone Number
                </label>
                <input
                  type="text"
                  placeholder="+91 98765..."
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Instance URL / Domain
              </label>
              <input
                type="text"
                required
                placeholder="erp.clientdomain.com"
                value={instanceUrl}
                onChange={(e) => setInstanceUrl(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Plan Tier
                </label>
                <select
                  value={selectedPlan}
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600"
                >
                  <option value="Starter">Starter</option>
                  <option value="Professional">Professional</option>
                  <option value="Enterprise">Enterprise</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                  Max Users
                </label>
                <input
                  type="number"
                  min="1"
                  value={maxUsers}
                  onChange={(e) => setMaxUsers(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 text-xs text-slate-900 focus:outline-none focus:border-indigo-600 font-bold text-indigo-600"
                />
              </div>
            </div>

            {/* VALIDITY DURATION & CUSTOM DAYS INPUT */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 mb-1.5">
                Validity Duration
              </label>
              <select
                value={isCustomValidity ? "custom" : validityDays}
                onChange={handleValidityChange}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-600 font-bold text-indigo-600"
              >
                <option value="7">7 Days (Trial)</option>
                <option value="30">30 Days (Monthly)</option>
                <option value="90">90 Days (Quarterly)</option>
                <option value="365">365 Days (Annual)</option>
                <option value="custom">Custom Number of Days...</option>
              </select>

              {isCustomValidity && (
                <div className="mt-2.5">
                  <input
                    type="number"
                    min="1"
                    placeholder="Enter custom days (e.g. 45)"
                    value={customDaysValue}
                    onChange={handleCustomDaysChange}
                    className="w-full bg-indigo-50/50 border border-indigo-200 rounded-xl px-4 py-2.5 text-sm text-indigo-900 font-bold focus:outline-none focus:border-indigo-600"
                  />
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-md shadow-indigo-600/20 mt-2 flex items-center justify-center space-x-2 disabled:opacity-50 cursor-pointer"
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
                  className="text-slate-500 hover:text-slate-900 p-1 cursor-pointer"
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

        {/* Right Column: Telemetry Table & Demo Leads Table */}
        <div className="space-y-8 lg:col-span-2">
          {/* Registered Instances Table with Search & Pagination */}
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-bold flex items-center space-x-2 text-slate-900">
                <Activity className="w-5 h-5 text-indigo-600" />
                <span>
                  Registered Instances & Client Directory (
                  {filteredInstances.length})
                </span>
              </h2>

              {/* Instances Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search client, contact or domain..."
                  value={instanceSearchQuery}
                  onChange={(e) => {
                    setInstanceSearchQuery(e.target.value);
                    setInstancePage(1); // Reset page on search
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                    <th className="py-3 px-4">Client / Contact</th>
                    <th className="py-3 px-4">Status / Users</th>
                    <th className="py-3 px-4">Expires At</th>
                    <th className="py-3 px-4">License Key</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {currentInstances.length > 0 ? (
                    currentInstances.map((inst, idx) => {
                      const isExpired = inst.status === "Expired / Deactivated";
                      return (
                        <tr
                          key={inst.id || idx}
                          className="hover:bg-slate-50 transition-colors"
                        >
                          <td className="py-4 px-4">
                            <div className="font-semibold text-slate-900">
                              {inst.client}
                            </div>
                            <div className="text-xs text-slate-500">
                              {inst.clientPerson} •{" "}
                              {inst.clientEmail ||
                                inst.clientPhone ||
                                inst.domain}
                            </div>
                          </td>
                          <td className="py-4 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-xs font-semibold ${isExpired ? "bg-rose-50 text-rose-700 border border-rose-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"}`}
                            >
                              {isExpired ? "Deactivated" : "Active"}
                            </span>
                            <div className="text-xs text-slate-400 mt-1">
                              Users: {inst.maxUsers || "10"}
                            </div>
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
                            >
                              {inst.license} ↗
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td
                        colSpan="4"
                        className="py-8 text-center text-slate-400 italic text-xs"
                      >
                        No registered instances found matching your search.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Instances Pagination Bar */}
            {filteredInstances.length > itemsPerPage && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-600">
                <span>
                  Showing page{" "}
                  <strong className="text-slate-900">{instancePage}</strong> of{" "}
                  <strong className="text-slate-900">
                    {totalInstancePages}
                  </strong>{" "}
                  ({filteredInstances.length} total instances)
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setInstancePage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={instancePage === 1}
                    className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg cursor-pointer flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={() =>
                      setInstancePage((prev) =>
                        Math.min(prev + 1, totalInstancePages),
                      )
                    }
                    disabled={instancePage === totalInstancePages}
                    className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg cursor-pointer flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Incoming Demo Requests Table with Search & Pagination */}
          <div className="bg-white border border-slate-200 p-8 rounded-2xl shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-xl font-bold flex items-center space-x-2 text-slate-900">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <span>Incoming Demo Requests ({filteredLeads.length})</span>
              </h2>

              {/* Search Bar */}
              <div className="relative w-full md:w-72">
                <Search className="absolute left-3.5 top-3 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search company or phone..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1); // Reset page on search
                  }}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2 text-xs font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-xs font-semibold uppercase text-slate-500">
                    <th className="py-3 px-4">Company & Contact</th>
                    <th className="py-3 px-4">Industry / Size</th>
                    <th className="py-3 px-4">Use Case & Requirements</th>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm">
                  {currentLeads.length > 0 ? (
                    currentLeads.map((lead) => (
                      <tr
                        key={lead.id}
                        className="hover:bg-slate-50 transition-colors"
                      >
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-900">
                            {lead.companyName}
                          </div>
                          <div className="text-xs font-mono text-indigo-600">
                            {lead.contactNumber}
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="font-semibold text-slate-800 text-xs">
                            {lead.industry}
                          </div>
                          <div className="text-xs text-slate-400">
                            {lead.companySize}
                          </div>
                        </td>
                        <td className="py-4 px-4 max-w-xs">
                          <p
                            className="text-xs text-slate-700 truncate"
                            title={lead.useCase}
                          >
                            {lead.useCase}
                          </p>
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {lead.selectedFeatures?.map((f, i) => (
                              <span
                                key={i}
                                className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium"
                              >
                                {f}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 px-4 text-xs text-slate-500">
                          {lead.createdAt
                            ? new Date(lead.createdAt).toLocaleDateString()
                            : "N/A"}
                        </td>
                        <td className="py-4 px-4 text-right">
                          <button
                            onClick={() => onCloseLead(lead.id)}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-600 font-bold rounded-lg text-xs transition-all cursor-pointer whitespace-nowrap"
                          >
                            Close Request
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="5"
                        className="py-8 text-center text-slate-400 italic text-xs"
                      >
                        No matching demo requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination Bar (Only displays when records exceed 10 items) */}
            {filteredLeads.length > itemsPerPage && (
              <div className="flex items-center justify-between pt-4 border-t border-slate-100 text-xs text-slate-600">
                <span>
                  Showing page{" "}
                  <strong className="text-slate-900">{currentPage}</strong> of{" "}
                  <strong className="text-slate-900">{totalPages}</strong> (
                  {filteredLeads.length} total leads)
                </span>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                    className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg cursor-pointer flex items-center space-x-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Previous</span>
                  </button>
                  <button
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                    className="p-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-30 disabled:cursor-not-allowed rounded-lg cursor-pointer flex items-center space-x-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
