import React, { useState } from "react";
import {
  X,
  CheckCircle,
  Building,
  Phone,
  Briefcase,
  Layers,
} from "lucide-react";
import { submitDemoRequest } from "../services/erpApi";

export default function DemoRequestModal({ isOpen, onClose }) {
  const initialFormState = {
    companyName: "",
    contactNumber: "",
    industry: "Manufacturing / Forging",
    companySize: "10-50 employees",
    useCase: "",
    selectedFeatures: [],
  };

  const [formData, setFormData] = useState(initialFormState);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const availableFeatures = [
    "Die Master & Forging Tags",
    "Dispatch & Logistics Logs",
    "Heat Number Traceability",
    "Production Tracking",
    "Inventory & Stock Management",
    "Financial Accounting & Billing",
  ];

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => {
      const exists = prev.selectedFeatures.includes(feature);
      return {
        ...prev,
        selectedFeatures: exists
          ? prev.selectedFeatures.filter((f) => f !== feature)
          : [...prev.selectedFeatures, feature],
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.contactNumber || !formData.useCase) {
      alert("Please fill in all required fields.");
      return;
    }

    setSubmitting(true);
    const res = await submitDemoRequest(formData);
    setSubmitting(false);

    if (res.success) {
      setSuccess(true);
      // Reset form data back to initial empty state upon successful submission
      setFormData(initialFormState);
    } else {
      alert("Failed to submit request. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-3xl max-w-xl w-full p-8 space-y-6 relative shadow-2xl my-8">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <h3 className="text-xl font-extrabold text-slate-900">
              Book a Nexus ERP Demo
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Tell us about your requirements and we'll get in touch.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        {success ? (
          <div className="py-12 text-center space-y-4">
            <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />
            <h4 className="text-xl font-bold text-slate-900">
              Demo Request Submitted!
            </h4>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              Thank you. Our team has received your requirements and will reach
              out to your contact number shortly.
            </p>
            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl text-sm cursor-pointer"
            >
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Company Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ganga Technocast"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Contact Number *
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={formData.contactNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, contactNumber: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Industry
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  <option value="Investment Casting & Forging">
                    Investment Casting & Forging
                  </option>
                  <option value="Pump Manufacturing">Pump Manufacturing</option>
                  <option value="Oil & Gas Piping">Oil & Gas Piping</option>
                  <option value="General Engineering">
                    General Engineering
                  </option>
                  <option value="Other Manufacturing">
                    Other Manufacturing
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                  Company Size
                </label>
                <select
                  value={formData.companySize}
                  onChange={(e) =>
                    setFormData({ ...formData, companySize: e.target.value })
                  }
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 cursor-pointer"
                >
                  <option value="1-10 employees">1-10 employees</option>
                  <option value="10-50 employees">10-50 employees</option>
                  <option value="50-200 employees">50-200 employees</option>
                  <option value="200+ employees">200+ employees</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-1">
                Use Case / Specific Requirements *
              </label>
              <textarea
                required
                rows={3}
                placeholder="Describe your current production workflow or specific bottlenecks..."
                value={formData.useCase}
                onChange={(e) =>
                  setFormData({ ...formData, useCase: e.target.value })
                }
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-600 resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase mb-2">
                Required Features (Select all that apply)
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {availableFeatures.map((feat) => {
                  const selected = formData.selectedFeatures.includes(feat);
                  return (
                    <button
                      type="button"
                      key={feat}
                      onClick={() => handleFeatureToggle(feat)}
                      className={`text-left px-3 py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                        selected
                          ? "bg-indigo-50 border-indigo-300 text-indigo-700"
                          : "bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {selected ? "✓ " : "+ "} {feat}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="pt-2 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-slate-100 text-slate-700 font-bold rounded-xl text-sm cursor-pointer hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-600/20 cursor-pointer"
              >
                {submitting ? "Submitting..." : "Submit Request"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
