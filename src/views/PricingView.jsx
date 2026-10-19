import React, { useState, useEffect } from "react";
import {
  Check,
  Calendar,
  Wrench,
  Layers,
  Cpu,
  ShieldCheck,
  ArrowRight,
  Building2,
  HardDrive,
  Server,
  IndianRupee,
  Users,
} from "lucide-react";
import { fetchCachedLiveStats } from "../utils/metricsCache";
import DemoRequestModal from "../components/DemoRequestModal";

export default function PricingView({ setActiveTab }) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState("10-25");
  const [selectedModules, setSelectedModules] = useState([
    "Inventory & Stock Management",
    "Inward Job Work & Challans",
    "Machine Production Tracking",
  ]);
  const [liveStats, setLiveStats] = useState({
    activeInquiries: 0,
    runningLicenses: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const stats = await fetchCachedLiveStats();
      setLiveStats(stats);
    }
    loadStats();
  }, []);

  const availableModules = [
    {
      id: "Inventory & Stock Management",
      name: "Inventory Management & Raw Materials",
      desc: "Stock levels, item catalog, and reorder alerts.",
    },
    {
      id: "Inward Job Work & Challans",
      name: "Inward Job Work & Challans",
      desc: "Drawings, metal grade, approx machining time & inward challans.",
    },
    {
      id: "Machine Production Tracking",
      name: "CNC Machine & Shop Floor Tracking",
      desc: "Machine work allocation, daily output, and machine additions.",
    },
    {
      id: "QC & Dispatch Inspection",
      name: "QC Documents & Dispatch Checklist",
      desc: "Quality inspection logs, parameters, and delivery sign-offs.",
    },
    {
      id: "Outward & Delivery Challans",
      name: "Outward & Delivery Logistics",
      desc: "Finished goods dispatch, delivery challans, and transport logs.",
    },
    {
      id: "Customer Directory & CRM",
      name: "Customer Directory & Contacts",
      desc: "Client phone numbers, billing addresses, and order histories.",
    },
    {
      id: "Tools & Consumables Inventory",
      name: "Tools, Bits & Maintenance Inventory",
      desc: "CNC cutting bits, machine oil, spares, and maintenance parts.",
    },
  ];

  const pricingTiers = [
    { size: "1-10 employees", price: "5,000", range: "1-10" },
    { size: "10-25 employees", price: "10,000", range: "10-25" },
    { size: "25-50 employees", price: "18,000", range: "25-50" },
    { size: "50+ employees", price: "30,000+", range: "50+" },
  ];

  const currentTierPrice =
    pricingTiers.find((t) => t.range === selectedSize)?.price || "10,000";

  const handleModuleToggle = (modName) => {
    setSelectedModules((prev) =>
      prev.includes(modName)
        ? prev.filter((m) => m !== modName)
        : [...prev, modName],
    );
  };

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 space-y-16 animate-[fadeIn_0.5s_ease-out]">
      {/* Header */}
      <div className="text-center space-y-4 max-w-3xl mx-auto animate-[slideUp_0.6s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold tracking-wide shadow-xs mb-2">
          <IndianRupee className="w-4 h-4 text-indigo-600" />
          <span>Pay Only For What You Use • Zero Bloatware</span>
        </div>

        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Functionality Over Flash. Simple Monthly Pricing.
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          We don't compete on market pricing gimmicks or sell you generic
          features you'll never touch. You select your exact operational
          modules, keeping your software clean, intuitive, and remarkably
          cost-effective.
        </p>
      </div>

      {/* Prominent Live Platform Metrics Showcase Section */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-3xl space-y-3 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-bold tracking-wide uppercase mb-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live Platform Traction</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            Active Deployments & Plant Inquiries in Real-Time
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Monitor our network scale as manufacturing plants and machining job
            works transition to lean, on-premise ERP architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between backdrop-blur-md">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Running Inquiries & Demos
              </span>
              <div className="text-4xl md:text-5xl font-black text-white font-mono">
                {liveStats.activeInquiries}
              </div>
              <p className="text-xs text-slate-400">
                Plants currently evaluating custom module scoping.
              </p>
            </div>
            <div className="w-14 h-14 bg-indigo-600/30 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-300">
              <Users className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between backdrop-blur-md">
            <div className="space-y-1">
              <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                Active ERP Licenses
              </span>
              <div className="text-4xl md:text-5xl font-black text-emerald-400 font-mono">
                {liveStats.runningLicenses}
              </div>
              <p className="text-xs text-slate-400">
                On-premise production instances actively running.
              </p>
            </div>
            <div className="w-14 h-14 bg-emerald-600/30 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-300">
              <Cpu className="w-7 h-7" />
            </div>
          </div>
        </div>
      </section>

      {/* How the System Works & What You Pay For */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center border border-indigo-100">
            <Server className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900">
              How Deployment Works
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              Your ERP is installed as a{" "}
              <strong>private, on-premise system</strong> directly on your
              company's local computer hardware or server network. This ensures
              your manufacturing data, drawings, and logs remain completely
              secure and accessible even without uninterrupted high-speed
              internet.
            </p>
          </div>
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl space-y-2">
            <div className="flex items-center space-x-2 text-amber-900 font-bold text-xs uppercase tracking-wider">
              <HardDrive className="w-4 h-4 text-amber-600" />
              <span>Minimum Hardware Requirements</span>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed">
              Requires a dedicated local machine with a{" "}
              <strong>minimum of 16 GB RAM</strong> and{" "}
              <strong>500 GB to 1 TB Hard Drive (SSD preferred)</strong>. If
              your facility does not have hardware available, server setup and
              hardware procurement can be arranged at an additional cost.
            </p>
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm space-y-6">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center border border-emerald-100">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-slate-900">
              What Your Monthly Fee Covers
            </h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              We operate on a{" "}
              <strong>monthly fixed service and support model</strong> rather
              than one-time payouts. Your fee guarantees continuous technical
              backing, system maintenance, security updates, telemetry health
              checks, and routine backups.
            </p>
          </div>
          <ul className="space-y-2.5 text-xs text-slate-700">
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Ongoing technical support and troubleshooting</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Custom workflow modifications as your plant grows</span>
            </li>
            <li className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Routine automated data backups and security patches</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Real-World CNC Machining Example Section */}
      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 md:p-12 text-white shadow-xl space-y-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="max-w-2xl space-y-3">
          <span className="inline-block px-3 py-1 bg-indigo-500/30 text-indigo-300 text-xs font-bold rounded-lg uppercase tracking-wider border border-indigo-500/30 mb-2">
            Tailored Module Architecture
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Designed for Machining Foundries & Job Works
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Your system is structured specifically around shop floor
            realities—tracking raw material inward challans, specific CNC
            machine workloads, quality control documents, and cutting bits
            inventory.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2 backdrop-blur-xs">
            <Layers className="w-5 h-5 text-indigo-400 mb-2" />
            <h3 className="font-bold text-white text-sm">
              Inward Job Management
            </h3>
            <p className="text-xs text-slate-400">
              Tracks incoming client parts, machining technical drawings, raw
              metal grades, and approx processing time.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2 backdrop-blur-xs">
            <Cpu className="w-5 h-5 text-indigo-400 mb-2" />
            <h3 className="font-bold text-white text-sm">
              Machine & Shop Floor
            </h3>
            <p className="text-xs text-slate-400">
              Assigns parts to specific CNC machines, logs active work status,
              records daily output, and allows adding new machines.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2 backdrop-blur-xs">
            <ShieldCheck className="w-5 h-5 text-indigo-400 mb-2" />
            <h3 className="font-bold text-white text-sm">
              QC & Dispatch Checklists
            </h3>
            <p className="text-xs text-slate-400">
              Enforces strict quality control inspection documents before
              generating delivery challans and outward logs.
            </p>
          </div>
          <div className="bg-white/5 border border-white/10 p-5 rounded-2xl space-y-2 backdrop-blur-xs">
            <Wrench className="w-5 h-5 text-indigo-400 mb-2" />
            <h3 className="font-bold text-white text-sm">
              Tools & Consumables
            </h3>
            <p className="text-xs text-slate-400">
              Monitors cutting bits inventory, machine maintenance parts,
              coolant oils, and replacement spares.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Monthly Pricing Calculator */}
      <div className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-slate-100 pb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-900">
              Monthly Support Calculator (INR)
            </h2>
            <p className="text-slate-600 text-sm mt-1">
              Select your company team size and pick your required modules for
              an instant monthly quote.
            </p>
          </div>
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center space-x-2 cursor-pointer"
          >
            <Calendar className="w-4 h-4" />
            <span>Book Custom Demo & Discussion</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                1. Select Company Size (Determines Monthly Base Fee)
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {pricingTiers.map((tier) => (
                  <button
                    key={tier.range}
                    type="button"
                    onClick={() => setSelectedSize(tier.range)}
                    className={`py-3 px-4 rounded-xl border transition-all cursor-pointer text-center ${
                      selectedSize === tier.range
                        ? "bg-indigo-50 border-indigo-600 text-indigo-700 shadow-xs"
                        : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                    }`}
                  >
                    <div className="font-bold text-xs">{tier.size}</div>
                    <div className="text-[11px] font-mono text-indigo-600 mt-1">
                      ₹{tier.price}/mo
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                2. Select Required Modules & Workflows
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {availableModules.map((mod) => {
                  const isSelected = selectedModules.includes(mod.id);
                  return (
                    <div
                      key={mod.id}
                      onClick={() => handleModuleToggle(mod.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start space-x-3 ${
                        isSelected
                          ? "bg-indigo-50/60 border-indigo-300 shadow-xs"
                          : "bg-slate-50/50 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      <div
                        className={`mt-0.5 w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 ${isSelected ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-300 bg-white"}`}
                      >
                        {isSelected && (
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                        )}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-sm">
                          {mod.name}
                        </h4>
                        <p className="text-slate-500 text-xs mt-0.5">
                          {mod.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 p-6 rounded-2xl flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <h3 className="font-bold text-slate-900 text-base border-b border-slate-200 pb-3 flex items-center space-x-2">
                <Building2 className="w-4 h-4 text-indigo-600" />
                <span>Monthly Support Estimate</span>
              </h3>

              <div className="space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Team Size Tier:</span>
                  <span className="font-bold text-slate-900">
                    {selectedSize} Employees
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Selected Modules:</span>
                  <span className="font-bold text-slate-900">
                    {selectedModules.length} Modules
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 space-y-1">
                <span className="text-xs uppercase font-bold text-slate-400 tracking-wider">
                  Recurring Support Fee
                </span>
                <div className="flex items-baseline space-x-1">
                  <span className="text-3xl font-black text-slate-900">
                    ₹{currentTierPrice}
                  </span>
                  <span className="text-slate-500 text-xs">/month</span>
                </div>
                <p className="text-[11px] text-slate-500 italic mt-1">
                  * Covers monthly service, routine maintenance, data backups,
                  and technical support. Hardware setup billed separately if
                  needed.
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsDemoModalOpen(true)}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition-all shadow-md shadow-indigo-600/20 flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Book Discovery & Demo</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <DemoRequestModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </main>
  );
}
