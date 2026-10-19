import React from "react";
import {
  Factory,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
  Terminal,
  Heart,
} from "lucide-react";

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand & About */}
        <div className="space-y-4 md:col-span-1">
          <div className="flex items-center space-x-3 text-white">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-600/30">
              <Factory className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight text-white">
              Nexus ERP
            </span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Lean, modular on-premise ERP solutions engineered specifically for
            machining foundries, casting plants, and manufacturing units. Pay
            only for what your plant actually uses.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            Quick Navigation
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button
                onClick={() => {
                  setActiveTab("landing");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Overview & Features
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("pricing");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Modular Pricing Calculator
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("portal");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Client Instance Portal
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setActiveTab("docs");
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
                className="hover:text-white transition-colors cursor-pointer"
              >
                Server Script Docs
              </button>
            </li>
          </ul>
        </div>

        {/* Technical Specs & Hosting */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            System Architecture
          </h4>
          <ul className="space-y-2 text-xs text-slate-400">
            <li className="flex items-center space-x-2">
              <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
              <span>On-Premise Docker & Linux Deployments</span>
            </li>
            <li className="flex items-center space-x-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Cryptographic License Verification</span>
            </li>
            <li className="text-[11px] text-slate-500 pt-1">
              Minimum hardware: 16 GB RAM, 500GB - 1TB SSD Hard Drive
              recommended.
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            Contact & Office
          </h4>
          <ul className="space-y-2.5 text-xs">
            <li className="flex items-start space-x-2.5">
              <MapPin className="w-4 h-4 text-indigo-400 shrink-0 mt-0.5" />
              <span>Rajkot, Gujarat, India</span>
            </li>
            <li className="flex items-center space-x-2.5">
              <Phone className="w-4 h-4 text-indigo-400 shrink-0" />
              <a
                href="tel:9687620711"
                className="hover:text-white transition-colors"
              >
                +91 96876 20711
              </a>
            </li>
            <li className="flex items-center space-x-2.5">
              <Mail className="w-4 h-4 text-indigo-400 shrink-0" />
              <a
                href="mailto:divyanshukalola88@gmail.com"
                className="hover:text-white transition-colors truncate"
              >
                divyanshukalola88@gmail.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-slate-800/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p>© {new Date().getFullYear()} Nexus ERP. All rights reserved.</p>
          <p className="flex items-center space-x-1">
            <span>Engineered with precision for manufacturing excellence</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
