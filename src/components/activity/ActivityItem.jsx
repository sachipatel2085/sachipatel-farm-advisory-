import React, { useState } from "react";
import {
  Check,
  Droplets,
  Leaf,
  Bug,
  Wheat,
  Eye,
  Calendar,
  AlertTriangle,
  Trash2,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
  FlaskConical,
  ShieldAlert,
  Lock,
  User,
} from "lucide-react";

export const getActivityTypeConfig = (type = "") => {
  switch (type.toLowerCase()) {
    case "fertilizer":
      return {
        label: "Fertilizer / Nutrition",
        icon: <Leaf size={14} className="text-emerald-400" />,
        badge: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
      };
    case "spray":
      return {
        label: "Spray / Pesticide",
        icon: <Bug size={14} className="text-rose-400" />,
        badge: "bg-rose-500/15 text-rose-300 border-rose-500/30",
      };
    case "irrigation":
      return {
        label: "Irrigation",
        icon: <Droplets size={14} className="text-sky-400" />,
        badge: "bg-sky-500/15 text-sky-300 border-sky-500/30",
      };
    case "weeding":
      return {
        label: "Weeding / Hoeing",
        icon: <Sparkles size={14} className="text-amber-400" />,
        badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      };
    case "harvest":
      return {
        label: "Harvest",
        icon: <Wheat size={14} className="text-amber-300" />,
        badge: "bg-amber-500/15 text-amber-300 border-amber-500/30",
      };
    case "scouting":
      return {
        label: "Scouting",
        icon: <Eye size={14} className="text-indigo-400" />,
        badge: "bg-indigo-500/15 text-indigo-300 border-indigo-500/30",
      };
    default:
      return {
        label: "Activity",
        icon: <Calendar size={14} className="text-gray-400" />,
        badge: "bg-white/10 text-gray-300 border-white/10",
      };
  }
};

export default function ActivityItem({
  activity,
  onToggle,
  onDelete,
  showCropName = true,
}) {
  const [expanded, setExpanded] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [deleting, setDeleting] = useState(false);

  if (!activity) return null;

  const isCompleted = activity.status === "completed";
  const dueDate = new Date(activity.dueDate);
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const endOfToday = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59,
    999
  );

  const isOverdue = !isCompleted && dueDate < startOfToday;
  const isToday = !isCompleted && dueDate >= startOfToday && dueDate <= endOfToday;

  const typeConfig = getActivityTypeConfig(activity.activityType);
  const hasWarning = !!activity.stageWarning;
  const hasDosage = !!activity.dosage;
  const targetPests = Array.isArray(activity.targetPests) ? activity.targetPests : [];

  const handleToggle = async (e) => {
    e.stopPropagation();
    setToggling(true);
    try {
      await onToggle(activity._id);
    } finally {
      setToggling(false);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete activity: "${activity.title}"?`)) {
      setDeleting(true);
      try {
        await onDelete(activity._id);
      } finally {
        setDeleting(false);
      }
    }
  };

  return (
    <div
      className={`rounded-xl border transition-all duration-200 p-3.5 sm:p-4 backdrop-blur-sm ${
        isCompleted
          ? "bg-white/[0.02] border-white/5 opacity-65"
          : isOverdue
          ? "bg-rose-950/20 border-rose-500/40 hover:border-rose-500/60 shadow-lg shadow-rose-950/20"
          : hasWarning
          ? "bg-amber-950/15 border-amber-500/30 hover:border-amber-500/50"
          : isToday
          ? "bg-amber-950/20 border-amber-500/30 hover:border-amber-500/50"
          : "bg-white/5 border-white/10 hover:border-white/20"
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Toggle Checkbox */}
        <button
          onClick={handleToggle}
          disabled={toggling}
          className={`w-6 h-6 rounded-lg border flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
            isCompleted
              ? "bg-emerald-500 border-emerald-500 text-white"
              : "border-gray-500 hover:border-emerald-400 bg-white/5"
          }`}
          title={isCompleted ? "Mark pending" : "Mark completed"}
        >
          {isCompleted ? (
            <Check size={14} className="stroke-[3]" />
          ) : toggling ? (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          ) : null}
        </button>

        {/* Content */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setExpanded(!expanded)}>
          <div className="flex items-start justify-between gap-2 flex-wrap">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span
                  className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${typeConfig.badge}`}
                >
                  {typeConfig.icon}
                  {typeConfig.label}
                </span>

                {activity.priority === "high" && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold uppercase">
                    Urgent
                  </span>
                )}

                {activity.growthStage && (
                  <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-gray-300 border border-white/10">
                    Stage: {activity.growthStage}
                  </span>
                )}

                {/* Distinction between General Task vs Farmer's Private Task */}
                {activity.isGeneralTask || activity.autoGenerated ? (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-teal-500/15 text-teal-300 border border-teal-500/30 font-medium">
                    General Task
                  </span>
                ) : (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-purple-500/15 text-purple-300 border border-purple-500/30 font-medium inline-flex items-center gap-1">
                    <Lock size={10} /> My Custom Task
                  </span>
                )}

                {showCropName && activity.crop?.cropName && (
                  <span className="text-xs text-gray-400 font-medium">
                    {activity.crop.cropName}
                  </span>
                )}
              </div>

              <h4
                className={`text-sm sm:text-base font-semibold mt-1 leading-snug ${
                  isCompleted ? "line-through text-gray-400" : "text-white"
                }`}
              >
                {activity.title}
              </h4>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-1.5 ml-auto flex-shrink-0">
              {activity.cost > 0 && (
                <span className="text-xs px-2 py-0.5 rounded bg-white/5 border border-white/10 text-emerald-400 font-medium">
                  ₹{activity.cost}
                </span>
              )}

              <button
                onClick={handleDelete}
                disabled={deleting}
                className="p-1.5 rounded-lg text-gray-500 hover:text-rose-400 hover:bg-rose-500/10 transition"
                title="Delete Activity"
              >
                <Trash2 size={14} />
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setExpanded(!expanded);
                }}
                className="p-1 rounded text-gray-400 hover:text-white"
                title="Toggle details"
              >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          {/* CRITICAL STAGE DISEASE & PEST WARNING CALLOUT */}
          {hasWarning && !isCompleted && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-200 text-xs flex items-start gap-2">
              <ShieldAlert size={16} className="text-amber-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <strong className="text-amber-300 font-semibold uppercase tracking-wider text-[10px] block mb-0.5">
                  Vulnerability Alert
                </strong>
                {activity.stageWarning}
              </div>
            </div>
          )}

          {/* RECOMMENDED DOSAGE / INPUT PRESCRIPTION */}
          {hasDosage && (
            <div className="mt-2 p-2.5 rounded-lg bg-teal-500/10 border border-teal-500/20 text-teal-200 text-xs flex items-start gap-2">
              <FlaskConical size={15} className="text-teal-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="text-teal-300 font-semibold uppercase tracking-wider text-[10px] block mb-0.5">
                  A-to-Z Dosage & Formula
                </span>
                <span className="font-medium text-white">{activity.dosage}</span>
              </div>
            </div>
          )}

          {/* TARGET PESTS / DISEASES PILL TAGS */}
          {targetPests.length > 0 && (
            <div className="flex items-center gap-1.5 mt-2 flex-wrap text-[11px]">
              <span className="text-gray-400">Target Pathogens:</span>
              {targetPests.map((pest, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium"
                >
                  {pest}
                </span>
              ))}
            </div>
          )}

          {/* Date Meta Row */}
          <div className="flex items-center gap-3 mt-2.5 text-xs flex-wrap">
            {isCompleted ? (
              <span className="text-emerald-400 flex items-center gap-1 font-medium">
                <CheckCircle2 size={13} />
                Done{" "}
                {activity.completedDate
                  ? new Date(activity.completedDate).toLocaleDateString()
                  : ""}
              </span>
            ) : isOverdue ? (
              <span className="text-rose-400 flex items-center gap-1 font-medium">
                <AlertTriangle size={13} />
                Overdue: {dueDate.toLocaleDateString()}
              </span>
            ) : isToday ? (
              <span className="text-amber-400 flex items-center gap-1 font-medium">
                <Clock size={13} />
                Due Today
              </span>
            ) : (
              <span className="text-gray-400 flex items-center gap-1">
                <Calendar size={13} />
                Due: {dueDate.toLocaleDateString()}
              </span>
            )}

            {activity.autoGenerated && (
              <span className="text-[10px] text-teal-400/80 bg-teal-500/10 px-1.5 py-0.2 rounded font-medium">
                A-to-Z Auto-Schedule
              </span>
            )}
          </div>

          {/* Expanded Notes & Details */}
          {expanded && activity.notes && (
            <div className="mt-3 pt-2.5 border-t border-white/10 text-xs text-gray-300 leading-relaxed bg-white/[0.02] p-2.5 rounded-lg">
              <strong className="text-emerald-400 block mb-1 font-medium">
                Agronomic Guidelines:
              </strong>
              {activity.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
