import React from "react";
import {
  ShieldCheck,
  ArrowRight,
  Terminal,
  Factory,
  ShoppingBag,
  Layers,
  Wrench,
  HelpCircle,
  Play,
} from "lucide-react";

export default function LandingView({ setActiveTab, onOpenVideo }) {
  const videoClips = [
    {
      title: "Advanced Manufacturing & BOM Routing",
      duration: "1:45",
      category: "Production",
    },
    {
      title: "Real-time Multi-Company Accounting",
      duration: "2:10",
      category: "Finance",
    },
    {
      title: "Automated Inventory & Barcode Scans",
      duration: "1:30",
      category: "Supply Chain",
    },
  ];

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
      q: "How does the license key work with ERPNext?",
      a: "When you generate a license key from our portal, you embed it into your ERPNext instance using our provided Python Server Script. The instance periodically pings our server to validate authenticity and report system telemetry.",
    },
    {
      q: "Can I host ERPNext on my own private server?",
      a: "Yes! Our licensing and telemetry mechanism is fully compatible with self-hosted Docker environments, AWS, Google Cloud, or DigitalOcean.",
    },
    {
      q: "What happens if a license expires?",
      a: "The server script will trigger a grace period warning notification inside your ERPNext desk. You can renew your subscription anytime through the client portal to instantly reactivate.",
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-12 space-y-24">
      {/* Hero Section */}
      <section className="text-center space-y-8 py-12">
        <div className="inline-flex items-center space-x-2 px-4 py-2 bg-indigo-50 border border-indigo-100 rounded-full text-indigo-700 text-xs font-semibold tracking-wide shadow-xs">
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
        <div className="flex justify-center space-x-4 pt-4">
          <button
            onClick={() => setActiveTab("portal")}
            className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-2xl shadow-lg shadow-indigo-600/25 transition-all flex items-center space-x-3"
          >
            <span>Register ERP Instance</span>
            <ArrowRight className="w-5 h-5" />
          </button>
          <button
            onClick={() => setActiveTab("docs")}
            className="px-8 py-4 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold rounded-2xl shadow-xs transition-all flex items-center space-x-3"
          >
            <Terminal className="w-5 h-5 text-indigo-600" />
            <span>View Script Docs</span>
          </button>
        </div>
      </section>

      {/* Video Walkthrough Section */}
      <section className="space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-3xl font-extrabold text-slate-900">
            See ERP in Action
          </h2>
          <p className="text-slate-600">
            Watch quick video clips of our modules handling complex operations.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videoClips.map((clip, idx) => (
            <div
              key={idx}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden group hover:border-indigo-500/50 hover:shadow-xl transition-all shadow-sm"
            >
              <div className="h-48 bg-slate-900 relative flex items-center justify-center">
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent opacity-60"></div>
                <span className="absolute top-3 left-3 px-3 py-1 bg-indigo-600/90 text-white text-xs font-semibold rounded-lg shadow-sm">
                  {clip.category}
                </span>
                <button
                  onClick={() => onOpenVideo(clip)}
                  className="w-14 h-14 bg-indigo-600 hover:bg-indigo-500 rounded-full flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform z-10"
                >
                  <Play className="w-6 h-6 fill-current ml-1" />
                </button>
                <span className="absolute bottom-3 right-3 px-2 py-1 bg-slate-950/80 text-slate-200 text-xs rounded font-mono">
                  {clip.duration}
                </span>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2 text-slate-900">
                  {clip.title}
                </h3>
                <p className="text-slate-600 text-sm">
                  Optimized for speed and minimal server latency across
                  multi-user enterprise environments.
                </p>
              </div>
            </div>
          ))}
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
                className="bg-white border border-slate-200 p-6 rounded-2xl hover:border-indigo-500 hover:shadow-lg transition-all flex flex-col justify-between shadow-xs"
              >
                <div>
                  <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4 border border-indigo-100">
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
            <HelpCircle className="w-6 h-6" />
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
              className="border-b border-slate-100 pb-6 last:border-0"
            >
              <h3 className="font-bold text-lg text-slate-900 mb-2">{faq.q}</h3>
              <p className="text-slate-600 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
