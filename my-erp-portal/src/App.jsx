import React, { useState, useEffect } from "react";
import { Server, Key, Play, X, LogOut, Lock } from "lucide-react";
import { fetchAllInstances, registerInstance } from "./services/erpApi";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";

// Import Views
import LandingView from "./views/LandingView";
import PortalView from "./views/PortalView";
import DocsView from "./views/DocsView";
import PricingView from "./views/PricingView";
import LoginView from "./views/LoginView";
import InstanceDetailView from "./views/InstanceDetailView";

export default function App() {
  // Initialize state from localStorage so refresh doesn't wipe it out
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem("nexus_active_tab") || "landing";
  });

  const [selectedInstance, setSelectedInstance] = useState(() => {
    const saved = localStorage.getItem("nexus_selected_instance");
    return saved ? JSON.parse(saved) : null;
  });

  const [user, setUser] = useState(null);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);

  // Portal State
  const [clientName, setClientName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [instanceUrl, setInstanceUrl] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("Enterprise");
  const [validityDays, setValidityDays] = useState("30");
  const [generatedLicense, setGeneratedLicense] = useState(null);
  const [copiedKey, setCopiedKey] = useState(false);
  const [loading, setLoading] = useState(false);
  const [instances, setInstances] = useState([]);

  // Save activeTab to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("nexus_active_tab", activeTab);
  }, [activeTab]);

  // Save selectedInstance to localStorage whenever it changes
  useEffect(() => {
    if (selectedInstance) {
      localStorage.setItem(
        "nexus_selected_instance",
        JSON.stringify(selectedInstance),
      );
    } else {
      localStorage.removeItem("nexus_selected_instance");
    }
  }, [selectedInstance]);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (currentUser) =>
      setUser(currentUser),
    );
    return () => unsubscribe();
  }, []);

  // Fetch instances and refresh selectedInstance data if on detail page
  useEffect(() => {
    async function loadData() {
      const res = await fetchAllInstances();
      if (res.success && res.instances.length > 0) {
        setInstances(res.instances);

        // If we are currently viewing an instance detail page, refresh its data with the latest from Firestore
        if (selectedInstance) {
          const freshMatch = res.instances.find(
            (i) =>
              i.id === selectedInstance.id ||
              i.license === selectedInstance.license,
          );
          if (freshMatch) {
            setSelectedInstance(freshMatch);
          }
        }
      }
    }
    loadData();
  }, []);

  const handleGenerateLicense = async (e) => {
    e.preventDefault();
    if (!clientName || !companyName || !instanceUrl) return;

    setLoading(true);
    const result = await registerInstance({
      clientName,
      companyName,
      instanceUrl,
      selectedPlan,
      validityDays,
    });
    setLoading(false);

    if (result.success) {
      setGeneratedLicense(result.license);
      setInstances([result.data, ...instances]);
      setClientName("");
      setCompanyName("");
      setInstanceUrl("");
    } else {
      alert("Failed to register instance in Firestore.");
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleLogout = async () => {
    await signOut(getAuth());
    localStorage.clear();
    setUser(null);
    setActiveTab("landing");
  };

  const frappeScript = `# General Integration Script Doc...`;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => {
              setActiveTab("landing");
              setSelectedInstance(null);
            }}
          >
            <div className="p-2.5 bg-indigo-600 rounded-xl text-white shadow-md shadow-indigo-600/20">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-900 to-indigo-600 bg-clip-text text-transparent">
                NEXUS ERP
              </span>
              <span className="block text-xs text-slate-500 font-medium">
                Enterprise Solutions
              </span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium">
            <button
              onClick={() => {
                setActiveTab("landing");
                setSelectedInstance(null);
              }}
              className={`transition-colors ${activeTab === "landing" ? "text-indigo-600 font-semibold" : "text-slate-600 hover:text-indigo-600"}`}
            >
              Overview
            </button>
            <button
              onClick={() => {
                setActiveTab("pricing");
                setSelectedInstance(null);
              }}
              className={`transition-colors ${activeTab === "pricing" ? "text-indigo-600 font-semibold" : "text-slate-600 hover:text-indigo-600"}`}
            >
              Pricing
            </button>
            <button
              onClick={() => {
                setActiveTab("docs");
                setSelectedInstance(null);
              }}
              className={`transition-colors ${activeTab === "docs" ? "text-indigo-600 font-semibold" : "text-slate-600 hover:text-indigo-600"}`}
            >
              Integration Docs
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => {
                    setActiveTab("portal");
                    setSelectedInstance(null);
                  }}
                  className="px-4 py-2 bg-indigo-50 text-indigo-700 font-semibold rounded-xl border border-indigo-200 text-sm flex items-center space-x-1.5 cursor-pointer"
                >
                  <Key className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 transition-colors cursor-pointer"
                  title="Logout"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setActiveTab("login")}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl text-sm transition-all flex items-center space-x-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Owner Login</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Views */}
      {activeTab === "landing" && (
        <LandingView
          setActiveTab={setActiveTab}
          onOpenVideo={(clip) => {
            setSelectedVideo(clip);
            setIsPlayingVideo(true);
          }}
        />
      )}
      {activeTab === "pricing" && <PricingView setActiveTab={setActiveTab} />}
      {activeTab === "docs" && (
        <DocsView
          frappeScript={frappeScript}
          copiedKey={copiedKey}
          copyToClipboard={copyToClipboard}
        />
      )}
      {activeTab === "login" && (
        <LoginView onLoginSuccess={() => setActiveTab("portal")} />
      )}

      {activeTab === "portal" &&
        (user ? (
          <PortalView
            {...{
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
              loading,
              handleGenerateLicense,
              generatedLicense,
              copiedKey,
              copyToClipboard,
              instances,
            }}
            onSelectInstance={(inst) => {
              setSelectedInstance(inst);
              setActiveTab("instance-detail");
            }}
          />
        ) : (
          <LoginView onLoginSuccess={() => setActiveTab("portal")} />
        ))}

      {activeTab === "instance-detail" && selectedInstance && (
        <InstanceDetailView
          instance={selectedInstance}
          onBack={() => {
            setSelectedInstance(null);
            setActiveTab("portal");
          }}
        />
      )}
    </div>
  );
}
