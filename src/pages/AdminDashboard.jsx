import React, { useEffect, useState } from "react";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import adminService from "../services/adminService";
import { AlertTriangle } from "lucide-react";

// Modular Admin Components
import AdminSidebar from "../components/admin/AdminSidebar";
import AdminTopbar from "../components/admin/AdminTopbar";
import AdminOverview from "../components/admin/AdminOverview";
import AdminUsers from "../components/admin/AdminUsers";
import AdminAdvisoryRules from "../components/admin/AdminAdvisoryRules";
import AdminGeneralTasks from "../components/admin/AdminGeneralTasks";
import AdminCommunityModeration from "../components/admin/AdminCommunityModeration";
import AdminDiagnostics from "../components/admin/AdminDiagnostics";
import ClaimAdminModal from "../components/admin/ClaimAdminModal";

export default function AdminDashboard() {
  const { user, isAdmin, refreshUser, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation & UI State
  const [activeTab, setActiveTab] = useState("overview"); // overview | users | advisory | community | telemetry
  const [adminSidebarOpen, setAdminSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [error, setError] = useState(null);

  // Cross-component user edit selection (e.g. from Overview recent users table)
  const [selectedUserToEdit, setSelectedUserToEdit] = useState(null);

  // Claim admin modal state
  const [showClaimModal, setShowClaimModal] = useState(false);

  // Fetch Overview Data
  const fetchOverview = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await adminService.getOverview();
      setOverview(data);
    } catch (err) {
      console.error("Admin overview fetch error:", err);
      if (err.response?.status === 403) {
        setError(
          "Admin access restricted. Please elevate your account or use the Admin Claim key."
        );
      } else {
        setError(
          err.response?.data?.message || "Failed to load admin overview metrics."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOverview();
  }, []);

  const kpis = overview?.kpis || {};
  const systemTelemetry = overview?.systemTelemetry || {};

  const titlesMap = {
    overview: "Overview & Analytics",
    users: "User Management",
    advisory: "Advisory Rules Engine",
    "general-tasks": "General Crop Tasks",
    community: "Community Moderation",
    telemetry: "System Diagnostics",
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 flex selection:bg-emerald-500 selection:text-white">
      {/* 1. DEDICATED ADMIN SIDEBAR */}
      <AdminSidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        mobileOpen={adminSidebarOpen}
        onCloseMobile={() => setAdminSidebarOpen(false)}
        kpis={kpis}
        user={user}
        onLogout={() => {
          logout();
          navigate("/");
        }}
        onBackToApp={() => navigate("/dashboard")}
      />

      {/* 2. RIGHT MAIN CONTAINER */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-64">
        {/* DEDICATED ADMIN TOPBAR */}
        <AdminTopbar
          currentTitle={titlesMap[activeTab] || "Admin Console"}
          isAdmin={isAdmin}
          loading={loading}
          onOpenSidebar={() => setAdminSidebarOpen(true)}
          onRefresh={fetchOverview}
          onClaimAdmin={() => setShowClaimModal(true)}
          onBackToApp={() => navigate("/dashboard")}
        />

        {/* MAIN BODY VIEW */}
        <main className="flex-1 w-full max-w-7xl mx-auto p-3.5 sm:p-5 md:p-6 lg:p-8 space-y-5 sm:space-y-6">
          {/* ACCESS DENIED ALERT */}
          {error && !isAdmin && (
            <div className="p-4 sm:p-5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-amber-400 shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-sm text-white">
                    Elevated Privileges Required
                  </h4>
                  <p className="text-xs text-amber-200/90 mt-0.5">{error}</p>
                </div>
              </div>
              <button
                onClick={() => setShowClaimModal(true)}
                className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold rounded-xl transition shrink-0"
              >
                Enter Admin Passkey
              </button>
            </div>
          )}

          {/* VIEW 1: OVERVIEW & ANALYTICS */}
          {activeTab === "overview" && (
            <AdminOverview
              overview={overview}
              loading={loading}
              onNavigateToUsers={() => setActiveTab("users")}
              onSelectUserToEdit={(u) => {
                setSelectedUserToEdit(u);
                setActiveTab("users");
              }}
            />
          )}

          {/* VIEW 2: USER MANAGEMENT */}
          {activeTab === "users" && (
            <AdminUsers
              selectedUserToEdit={selectedUserToEdit}
              setSelectedUserToEdit={setSelectedUserToEdit}
              onUserUpdated={fetchOverview}
            />
          )}

          {/* VIEW 3: ADVISORY RULES ENGINE */}
          {activeTab === "advisory" && (
            <AdminAdvisoryRules onRulesUpdated={fetchOverview} />
          )}

          {/* VIEW 3B: GENERAL CROP TASKS */}
          {activeTab === "general-tasks" && (
            <AdminGeneralTasks onTasksUpdated={fetchOverview} />
          )}

          {/* VIEW 4: COMMUNITY MODERATION */}
          {activeTab === "community" && (
            <AdminCommunityModeration onPostDeleted={fetchOverview} />
          )}

          {/* VIEW 5: SYSTEM DIAGNOSTICS */}
          {activeTab === "telemetry" && (
            <AdminDiagnostics
              systemTelemetry={systemTelemetry}
              kpis={kpis}
            />
          )}
        </main>
      </div>

      {/* 3. CLAIM ADMIN PASSKEY MODAL */}
      <ClaimAdminModal
        isOpen={showClaimModal}
        onClose={() => setShowClaimModal(false)}
        onSuccess={() => {
          refreshUser();
          fetchOverview();
        }}
      />
    </div>
  );
}
