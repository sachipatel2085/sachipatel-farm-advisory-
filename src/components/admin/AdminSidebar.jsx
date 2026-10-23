import React from "react";
import {
  Shield,
  BarChart3,
  Users,
  Sparkles,
  Calendar,
  MessageSquare,
  Cpu,
  ArrowLeft,
  LogOut,
  X,
} from "lucide-react";

export default function AdminSidebar({
  activeTab,
  onSelectTab,
  mobileOpen,
  onCloseMobile,
  kpis = {},
  user,
  onLogout,
  onBackToApp,
}) {
  const adminNavItems = [
    {
      id: "overview",
      label: "Overview & Analytics",
      icon: <BarChart3 size={18} />,
      badge: null,
    },
    {
      id: "users",
      label: "User Management",
      icon: <Users size={18} />,
      badge: kpis.totalUsers > 0 ? kpis.totalUsers : null,
    },
    {
      id: "advisory",
      label: "Advisory Rules Engine",
      icon: <Sparkles size={18} />,
      badge: kpis.totalAdvisories > 0 ? kpis.totalAdvisories : null,
    },
    {
      id: "general-tasks",
      label: "General Crop Tasks",
      icon: <Calendar size={18} />,
      badge: kpis.totalGeneralTasks > 0 ? kpis.totalGeneralTasks : null,
    },
    {
      id: "community",
      label: "Community Moderation",
      icon: <MessageSquare size={18} />,
      badge: null,
    },
    {
      id: "telemetry",
      label: "System Diagnostics",
      icon: <Cpu size={18} />,
      badge: "LIVE",
    },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Admin Sidebar Aside */}
      <aside
        className={`
          fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 border-r border-white/10 flex flex-col justify-between
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Sidebar Header Branding */}
        <div className="h-16 px-4 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold shrink-0">
              <Shield size={20} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-white text-base tracking-tight">SmartFarm</span>
                <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase font-semibold">
                  {user?.role || "ADMIN"}
                </span>
              </div>
              <p className="text-[11px] text-gray-400">Admin Control Center</p>
            </div>
          </div>

          <button
            onClick={onCloseMobile}
            className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            aria-label="Close Sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Navigation Items */}
        <nav className="p-3 space-y-1.5 flex-1 overflow-y-auto">
          <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
            Governance & Controls
          </div>

          {adminNavItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  if (onCloseMobile) onCloseMobile();
                }}
                className={`
                  w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-medium transition text-left
                  ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/25 font-semibold"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <span className={isActive ? "text-white" : "text-gray-400"}>
                    {item.icon}
                  </span>
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      isActive
                        ? "bg-white/20 text-white"
                        : item.badge === "LIVE"
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                        : "bg-white/10 text-gray-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="p-3 border-t border-white/10 space-y-2 shrink-0">
          {/* Back to Farmer App Button */}
          <button
            onClick={onBackToApp}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-600/10 hover:bg-emerald-600 hover:text-white border border-emerald-500/20 transition"
            title="Return to Farmer Dashboard"
          >
            <ArrowLeft size={16} />
            <span>Back to Farmer App</span>
          </button>

          {/* Admin User Card & Logout */}
          <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 flex items-center justify-between gap-2">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">
                {user?.name || "Administrator"}
              </p>
              <p className="text-[10px] text-gray-400 truncate capitalize">
                {user?.role || "admin"} account
              </p>
            </div>
            <button
              onClick={onLogout}
              className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/20 transition"
              title="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
