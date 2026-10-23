import React from "react";

export default function AdminKpiCard({ title, value, subtext, icon, accent = "emerald" }) {
  const accentMap = {
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    teal: "text-teal-400 bg-teal-500/10 border-teal-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between hover:border-emerald-500/40 transition">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-gray-400 truncate">{title}</span>
        <div className={`p-2 rounded-xl border ${accentMap[accent] || accentMap.emerald} shrink-0`}>
          {icon}
        </div>
      </div>

      <div className="mt-3">
        <h3 className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight">{value}</h3>
        <p className="text-[11px] text-gray-400 mt-1 truncate">{subtext}</p>
      </div>
    </div>
  );
}
