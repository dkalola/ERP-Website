import React from "react";
import { Check } from "lucide-react";

export default function PricingView({ setActiveTab }) {
  const pricingPlans = [
    {
      name: "Starter",
      price: "$49",
      period: "/month",
      desc: "Ideal for small retail shops and boutique manufacturers.",
      users: "Up to 5 Users",
      features: [
        "Core ERPNext Modules",
        "Standard Support",
        "Daily Backups",
        "Basic Telemetry",
      ],
    },
    {
      name: "Professional",
      price: "$149",
      period: "/month",
      desc: "Perfect for growing machining units and distributors.",
      users: "Up to 25 Users",
      features: [
        "Advanced Manufacturing & BOM",
        "Priority Email Support",
        "Hourly Backups",
        "Advanced Telemetry & API",
        "Custom DocTypes",
      ],
    },
    {
      name: "Enterprise",
      price: "$349",
      period: "/month",
      desc: "Unlimited power for large-scale industrial foundries.",
      users: "Unlimited Users",
      features: [
        "Dedicated Instance Hosting",
        "24/7 Phone & Slack Support",
        "Real-time Health Monitoring",
        "Custom Client Scripts",
        "SLA Guarantee",
      ],
    },
  ];

  return (
    <main className="max-w-7xl mx-auto px-6 py-16 space-y-16">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-4xl font-extrabold text-slate-900">
          Simple, Transparent Pricing
        </h1>
        <p className="text-slate-600">
          Choose the right plan for your business scale. All plans include full
          ERPNext customizability.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {pricingPlans.map((plan, idx) => (
          <div
            key={idx}
            className={`bg-white border ${idx === 1 ? "border-indigo-600 shadow-xl ring-2 ring-indigo-600/20" : "border-slate-200 shadow-sm"} rounded-3xl p-8 flex flex-col justify-between relative`}
          >
            {idx === 1 && (
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full uppercase tracking-wider shadow-sm">
                Most Popular
              </span>
            )}
            <div>
              <h3 className="font-bold text-xl text-slate-900 mb-2">
                {plan.name}
              </h3>
              <p className="text-slate-600 text-sm mb-6">{plan.desc}</p>
              <div className="flex items-baseline space-x-1 mb-6">
                <span className="text-4xl font-black text-slate-900">
                  {plan.price}
                </span>
                <span className="text-slate-500 text-sm">{plan.period}</span>
              </div>
              <div className="text-xs font-semibold uppercase text-indigo-600 mb-4 tracking-wider">
                {plan.users}
              </div>
              <ul className="space-y-3 mb-8">
                {plan.features.map((feat, fIdx) => (
                  <li
                    key={fIdx}
                    className="flex items-center space-x-3 text-sm text-slate-700"
                  >
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
            <button
              onClick={() => setActiveTab("portal")}
              className={`w-full py-3.5 font-bold rounded-xl transition-all shadow-sm ${idx === 1 ? "bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-600/30" : "bg-slate-900 hover:bg-slate-800 text-white"}`}
            >
              Get Started
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
