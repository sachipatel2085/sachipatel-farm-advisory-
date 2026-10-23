import React from "react";
import { Menu, Lock, RefreshCw, ArrowLeft } from "lucide-react";

export default function AdminTopbar({
  currentTitle = "Admin Console",
  isAdmin = false,
  loading = false,
  onOpenSidebar,
  onRefresh,
  onClaimAdmin,
  onBackToApp,
}) {
  return (
    <header className="sticky top-0 z-30 w-full bg-slate-900/95 border-b border-white/10 backdrop-blur-md px-3 sm:px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2.5 sm:gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-200 transition"
          aria-label="Open Admin Menu"
        >
          <Menu size={20} />
        </button>

        <h2 className="text-sm sm:text-base md:text-lg font-bold text-white capitalize flex items-center gap-2">
          {currentTitle}
        </h2>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {!isAdmin && (
          <button
            onClick={onClaimAdmin}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold transition shadow-sm"
          >
            <Lock size={13} />
            <span>Claim Admin</span>
          </button>
        )}

        <button
          onClick={onRefresh}
          disabled={loading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 transition disabled:opacity-50"
          title="Refresh Current Telemetry"
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        <button
          onClick={onBackToApp}
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 text-xs font-semibold transition"
          title="Exit to Farmer Dashboard"
        >
          <ArrowLeft size={14} />
          <span>Farmer App</span>
        </button>
      </div>
    </header>
  );
}
