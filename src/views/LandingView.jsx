import React, { useState, useEffect } from "react";
import {
  ShieldCheck,
  Calendar,
  Terminal,
  Factory,
  ShoppingBag,
  Layers,
  Wrench,
  HelpCircle,
  Users,
  Cpu,
  Clock,
  Server,
  HardDrive,
  Monitor,
} from "lucide-react";
import { fetchCachedLiveStats } from "../utils/metricsCache";
import DemoRequestModal from "../components/DemoRequestModal";

export default function LandingView({ setActiveTab, onOpenVideo }) {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
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

  const industries = [
    {
      title: "Manufacturing & Foundries",
      desc: "Multi-level BOMs, work orders, shop floor scheduling, and quality inspection.",
      icon: Factory,
    },
    {
      title: "Retail & POS",
      desc: "Lightning-fast billing, multi-store inventory synchronization, and loyalty programs.",
      icon: ShoppingBag,
    },
    {
      title: "Inventory & Warehousing",
      desc: "Batch tracking, serial numbers, reorder level alerts, and stock transfers.",
      icon: Layers,
    },
    {
      title: "Machining & Job Works",
      desc: "Subcontracting orders, machine hour tracking, and precise job costing.",
      icon: Wrench,
    },
  ];

  const faqs = [
    {
      q: "Can I customize the specific modules and workflows for my plant?",
      a: "Yes! Our platform is built specifically to avoid unnecessary software bloat. You can select, enable, or tailor exact modules—such as die masters, heat number traceability, or machining job challans—to fit your exact shop floor requirements.",
    },
    {
      q: "Can I host ERPNext on my own private server?",
      a: "Yes! Our licensing and telemetry mechanism is fully compatible with self-hosted Docker environments, AWS, Google Cloud, or local on-premise hardware.",
    },
    {
      q: "What happens if a license expires?",
      a: "The server script will trigger a grace period warning notification inside your ERPNext desk. You can renew your subscription anytime through the client portal to instantly reactivate.",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-24 animate-[fadeIn_0.5s_ease-out]">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12 animate-[slideUp_0.6s_cubic-bezier(0.16,1,0.3,1)]">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold tracking-wide shadow-xs transition-transform hover:scale-105 duration-300">
          <ShieldCheck className="w-4 h-4 text-indigo-600" />
          <span>Powered by ERPNext & Frappe Framework</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black max-w-4xl mx-auto leading-tight tracking-tight text-slate-900">
          Next-Gen ERP Solutions for{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-cyan-600 bg-clip-text text-transparent">
            Modern Manufacturing & Scale
          </span>
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
          Empower your business with modular, robust enterprise resource
          planning. Fully customizable workflows, real-time telemetry, and
          secure cryptographic licensing.
        </p>

        {/* Call to Action Buttons */}
        <div className="flex flex-wrap justify-center items-center gap-4 pt-4">
          <button
            onClick={() => setIsDemoModalOpen(true)}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 transition-all transform hover:-translate-y-1 active:translate-y-0 flex items-center space-x-3 cursor-pointer duration-200"
          >
            <Calendar className="w-5 h-5 animate-pulse" />
            <span>Book a Demo</span>
          </button>
        </div>
      </section>

      {/* Prominent Live Platform Metrics Showcase Section */}
      <section className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 md:p-12 text-white shadow-xl border border-slate-800 relative overflow-hidden transition-all duration-500 hover:shadow-2xl">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none animate-pulse"></div>
        <div className="max-w-3xl space-y-3 mb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 rounded-full text-xs font-bold tracking-wide uppercase">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
            <span>Live Platform Traction</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white mt-3">
            Active Deployments & Plant Inquiries in Real-Time
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Monitor our network scale as manufacturing plants and machining job
            works transition to lean, on-premise ERP architecture.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-indigo-500/40 hover:scale-[1.01]">
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
            <div className="w-14 h-14 bg-indigo-600/30 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-300 shadow-inner">
              <Users className="w-7 h-7" />
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl flex items-center justify-between backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-emerald-500/40 hover:scale-[1.01]">
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
            <div className="w-14 h-14 bg-emerald-600/30 border border-emerald-500/30 rounded-2xl flex items-center justify-center text-emerald-300 shadow-inner">
              <Cpu className="w-7 h-7" />
            </div>
          </div>
        </div>
      </section>

      {/* USP / Lean Architecture Section */}
      <section className="bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xs space-y-8">
        <div className="max-w-3xl space-y-3">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider border border-indigo-100 mb-2">
            The Nexus ERP Difference
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            No Bloated Features. No Confusing Desks. Just What Your Plant
            Actually Uses.
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            We don’t compete on trying to match every generic feature in the
            market. We compete on{" "}
            <strong>simplicity, clarity, and speed</strong>. You only pay for
            the exact modules your operators need—keeping your software
            lightning-fast and your monthly overhead low.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
          <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 transition-all duration-300 hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1.5">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm">
              01
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Zero Unnecessary Bloat
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              If your machining shop doesn’t need retail POS or complex
              multi-currency accounting, it won’t be in your software. Cut the
              clutter, cut the cost.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 transition-all duration-300 hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1.5">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm">
              02
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Designed for Shop Floor Speed
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Clean interfaces with zero crowded menus. Your operators can log
              challans and update machine production in seconds without formal
              technical training.
            </p>
          </div>

          <div className="p-6 bg-slate-50 border border-slate-100 rounded-2xl space-y-2 transition-all duration-300 hover:shadow-lg hover:border-indigo-200 hover:-translate-y-1.5">
            <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-sm">
              03
            </div>
            <h3 className="font-bold text-slate-900 text-base">
              Pay Only For Use
            </h3>
            <p className="text-slate-600 text-xs leading-relaxed">
              Modular monthly pricing aligned strictly with your company size
              and specific workflows. You never pay for software modules
              gathering digital dust.
            </p>
          </div>
        </div>
      </section>

      {/* Pictorial / Architectural Workflow: How On-Premise Browser ERP Works */}
      <section className="bg-slate-50 border border-slate-200 rounded-3xl p-8 md:p-12 space-y-10 shadow-xs">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <span className="inline-block px-3 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg uppercase tracking-wider border border-indigo-100 mb-2">
            Cross-Device Browser Architecture
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Runs on Any Device with a Web Browser
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Your ERP is hosted securely on your private local server hardware
            and accessed seamlessly through any modern browser—allowing your
            team to log data from office PCs, shop floor touchscreens, tablets,
            or smartphones without installing any client software.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
          {/* Step 1 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm relative group hover:border-indigo-500 transition-all">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg border border-indigo-100">
              01
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <HardDrive className="w-4 h-4 text-indigo-600" />
                <span>On-Premise Local Server</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Hosted securely inside your facility on local hardware (Min:
                16GB RAM, 500GB+ SSD) running isolated Docker containers.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm relative group hover:border-indigo-500 transition-all">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg border border-indigo-100">
              02
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <Monitor className="w-4 h-4 text-indigo-600" />
                <span>Any Device & Browser</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Accessible instantly via Chrome, Safari, or Firefox on office
                desktops, plant tablets, or mobile devices over your local
                network.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl space-y-4 shadow-sm relative group hover:border-indigo-500 transition-all">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold text-lg border border-indigo-100">
              03
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-indigo-600" />
                <span>Cloud License Validation</span>
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Our lightweight Python server script periodically pings our
                secure Firebase cloud portal to confirm licensing status and
                telemetry health.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Implementation & Deployment Timeline Section */}
      <section className="bg-gradient-to-br from-slate-900 to-indigo-950 rounded-3xl p-8 md:p-12 text-white shadow-xl border border-slate-800 space-y-8">
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 rounded-full text-xs font-bold tracking-wide uppercase mb-2">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Rapid On-Premise Rollout</span>
          </div>
          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-white">
            From Scope to Live Plant Floor in Record Time
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            Deployment timelines scale smoothly with your company size. Once the
            core development and module configurations are finalized, hosting
            and going live takes <strong>just one week</strong> on your local
            server hardware.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 bg-indigo-600/30 text-indigo-300 rounded-xl flex items-center justify-center font-bold text-sm border border-indigo-500/30">
              1-10
            </div>
            <h3 className="font-bold text-white text-base">
              Small Team / Workshop
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Standard module setup with basic inventory and job tracking.
              Development takes 1-2 weeks, followed by a{" "}
              <strong>1-week rapid live rollout</strong> on your local hardware.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 bg-indigo-600/30 text-indigo-300 rounded-xl flex items-center justify-center font-bold text-sm border border-indigo-500/30">
              10-50
            </div>
            <h3 className="font-bold text-white text-base">
              Mid-Size Foundry / Plant
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Custom die masters, CNC tracking, and quality checklists. Tailored
              development completed swiftly, with <strong>just one week</strong>{" "}
              required for final staging, server testing, and live deployment.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl space-y-3 backdrop-blur-md">
            <div className="w-10 h-10 bg-indigo-600/30 text-indigo-300 rounded-xl flex items-center justify-center font-bold text-sm border border-indigo-500/30">
              50+
            </div>
            <h3 className="font-bold text-white text-base">
              Large Enterprise Facility
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Multi-department integration with advanced accounts and warehouse
              logs. Post-development hosting, data migration, and live plant
              testing complete smoothly in <strong>one operational week</strong>
              .
            </p>
          </div>
        </div>
      </section>

      {/* Industry Verticals Grid */}
      <section className="space-y-10">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">
            Tailored for Every Industry
          </h2>
          <p className="text-slate-600">
            Specialized workflows built directly into our ERP framework.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {industries.map((ind, idx) => {
            const IconComponent = ind.icon;
            return (
              <div
                key={idx}
                className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-500 hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between shadow-xs group"
              >
                <div>
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 border border-indigo-100 transition-transform duration-300 group-hover:rotate-6 group-hover:scale-110">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-slate-900">
                    {ind.title}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {ind.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto space-y-8 bg-white border border-slate-200 rounded-3xl p-8 md:p-12 shadow-xs">
        <div className="text-center space-y-3">
          <div className="inline-flex p-2 bg-indigo-50 text-indigo-600 rounded-xl">
            <HelpCircle className="w-6 h-6 animate-spin duration-1000" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-600">
            Everything you need to know about licensing and deployment.
          </p>
        </div>
        <div className="space-y-6 pt-4">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="border-b border-slate-100 pb-6 last:border-0 transition-all duration-200 hover:pl-3"
            >
              <h3 className="font-bold text-lg text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Render the Demo Request Modal */}
      <DemoRequestModal
        isOpen={isDemoModalOpen}
        onClose={() => setIsDemoModalOpen(false)}
      />
    </main>
  );
}
