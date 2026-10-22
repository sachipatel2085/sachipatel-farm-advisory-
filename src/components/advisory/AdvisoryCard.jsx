import React from "react";
import {
  AlertTriangle,
  Bug,
  Droplets,
  Leaf,
  Sparkles,
  Wheat,
  Lightbulb,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Info,
} from "lucide-react";

const getCategoryIcon = (category = "") => {
  const cat = category.toLowerCase();
  if (cat.includes("pest")) return <Bug size={18} className="text-amber-400" />;
  if (cat.includes("disease")) return <ShieldAlert size={18} className="text-rose-400" />;
  if (cat.includes("irrigation") || cat.includes("water")) return <Droplets size={18} className="text-sky-400" />;
  if (cat.includes("nutrition") || cat.includes("fertilizer")) return <Leaf size={18} className="text-emerald-400" />;
  if (cat.includes("flower") || cat.includes("fruit")) return <Sparkles size={18} className="text-purple-400" />;
  if (cat.includes("harvest") || cat.includes("yield")) return <Wheat size={18} className="text-amber-300" />;
  return <Lightbulb size={18} className="text-blue-400" />;
};

const getPriorityStyle = (priority = "green") => {
  switch (priority.toLowerCase()) {
    case "red":
      return {
        cardBorder: "border-rose-500/30 hover:border-rose-500/60 bg-rose-950/20",
        badge: "bg-rose-500/20 text-rose-300 border border-rose-500/40",
        badgeText: "Critical Alert",
        dot: "bg-rose-500",
        actionBg: "bg-rose-500/10 border-rose-500/30 text-rose-200",
      };
    case "yellow":
      return {
        cardBorder: "border-amber-500/30 hover:border-amber-500/60 bg-amber-950/20",
        badge: "bg-amber-500/20 text-amber-300 border border-amber-500/40",
        badgeText: "Action Needed",
        dot: "bg-amber-400",
        actionBg: "bg-amber-500/10 border-amber-500/30 text-amber-200",
      };
    case "green":
    default:
      return {
        cardBorder: "border-emerald-500/30 hover:border-emerald-500/60 bg-emerald-950/20",
        badge: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
        badgeText: "Good Practice",
        dot: "bg-emerald-400",
        actionBg: "bg-emerald-500/10 border-emerald-500/30 text-emerald-200",
      };
  }
};

export default function AdvisoryCard({ advisory, cropName }) {
  if (!advisory) return null;

  const priorityStyle = getPriorityStyle(advisory.priority);

  return (
    <div
      className={`relative rounded-xl border p-4 sm:p-5 transition-all duration-200 backdrop-blur-sm ${priorityStyle.cardBorder}`}
    >
      {/* Card Header */}
      <div className="flex items-start justify-between gap-3 mb-2.5">
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10 flex-shrink-0">
            {getCategoryIcon(advisory.category)}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h4 className="font-semibold text-white text-base">
                {advisory.title || "Crop Advisory"}
              </h4>
              {cropName && (
                <span className="text-xs px-2 py-0.5 rounded bg-white/10 text-gray-300 font-medium">
                  {cropName}
                </span>
              )}
            </div>
            {advisory.stage && (
              <p className="text-xs text-gray-400 mt-0.5">
                Stage: <span className="text-gray-300">{advisory.stage}</span>
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 flex-shrink-0">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${priorityStyle.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dot} animate-pulse`} />
            {priorityStyle.badgeText}
          </span>
        </div>
      </div>

      {/* Advisory Message */}
      <div className="text-sm text-gray-200 leading-relaxed mb-3.5 pl-0.5">
        {advisory.message}
      </div>

      {/* Recommended Action Box */}
      {advisory.recommendedAction && (
        <div
          className={`rounded-lg p-3 text-xs sm:text-sm border flex items-start gap-2.5 ${priorityStyle.actionBg}`}
        >
          <CheckCircle2 size={16} className="flex-shrink-0 mt-0.5 text-current opacity-90" />
          <div className="leading-snug">
            <span className="font-semibold uppercase tracking-wider text-[11px] block opacity-80 mb-0.5">
              Recommended Action
            </span>
            {advisory.recommendedAction}
          </div>
        </div>
      )}

      {/* Footer Meta */}
      <div className="mt-3 pt-2.5 border-t border-white/5 flex items-center justify-between text-xs text-gray-400 flex-wrap gap-2">
        <span className="capitalize text-gray-400 flex items-center gap-1">
          <Info size={12} className="opacity-70" />
          Category: <span className="text-gray-300 font-medium">{advisory.category || "General"}</span>
        </span>
        {advisory.source && (
          <span className="text-gray-500 text-[11px]">
            {advisory.source}
          </span>
        )}
      </div>
    </div>
  );
}
