import React, { useEffect, useState } from "react";
import cropActivityService from "../../services/cropActivityService";
import ActivityItem from "./ActivityItem";
import AddActivityModal from "./AddActivityModal";
import {
  Calendar,
  Plus,
  Wand2,
  CheckCircle2,
  Clock,
  Sparkles,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

export default function CropActivitiesTab({ cropId, crop }) {
  const [activities, setActivities] = useState([]);
  const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0, completionRate: 0 });
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'warning', message: string }

  const loadActivities = async () => {
    setLoading(true);
    try {
      const data = await cropActivityService.getCropActivities(cropId);
      setActivities(data?.activities || []);
      setStats(data?.stats || { total: 0, pending: 0, completed: 0, completionRate: 0 });
    } catch (err) {
      console.error("Failed to load crop activities:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cropId) {
      loadActivities();
    }
  }, [cropId]);

  const handleToggle = async (activityId) => {
    try {
      await cropActivityService.toggleStatus(activityId);
      await loadActivities();
    } catch (err) {
      console.error("Toggle error:", err);
    }
  };

  const handleDelete = async (activityId) => {
    try {
      await cropActivityService.deleteActivity(activityId);
      await loadActivities();
    } catch (err) {
      console.error("Delete error:", err);
    }
  };

  const handleGenerateSchedule = async () => {
    setGenerating(true);
    setFeedback(null);
    try {
      const res = await cropActivityService.generateSchedule(cropId);
      if (res?.isAvailable === false) {
        setFeedback({
          type: "warning",
          message:
            res.message ||
            `Standard schedule is not available for ${crop?.cropName || "this crop"}. General tasks have not been configured by an admin or moderator yet.`,
        });
      } else {
        setFeedback({
          type: "success",
          message:
            res.message ||
            `Generated ${res.addedCount || 0} standard general crop tasks for ${crop?.cropName || "this crop"}.`,
        });
      }
      await loadActivities();
      setTimeout(() => setFeedback(null), 8000);
    } catch (err) {
      console.error("Generate schedule error:", err);
      setFeedback({
        type: "warning",
        message:
          "Failed to generate schedule: " +
          (err.response?.data?.message || err.message),
      });
    } finally {
      setGenerating(false);
    }
  };

  const filteredList = activities.filter((act) => {
    if (filterStatus === "pending") return act.status !== "completed";
    if (filterStatus === "completed") return act.status === "completed";
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner & Progress */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800/80 to-slate-900 border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Calendar size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Crop Activities & Schedule
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-gray-300 font-normal">
                  {stats.completed} of {stats.total} Completed
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Scheduled sprays, fertilizers, irrigation, and field tasks for {crop?.cropName}.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleGenerateSchedule}
              disabled={generating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-teal-500/20 hover:bg-teal-500/30 border border-teal-500/30 text-teal-300 text-xs font-medium transition disabled:opacity-50"
              title="Generate standard agronomic package-of-practices milestones"
            >
              <Wand2 size={13} className={generating ? "animate-spin" : ""} />
              {generating ? "Generating..." : "Auto-Schedule Care"}
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium transition shadow-lg shadow-emerald-600/20"
            >
              <Plus size={14} /> Add Task
            </button>
          </div>
        </div>

        {/* Completion Progress Bar */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-300">
            <span>Overall Completion Rate</span>
            <span className="font-semibold text-emerald-400">{stats.completionRate}%</span>
          </div>
          <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${stats.completionRate}%` }}
            />
          </div>
        </div>

        {feedback && (
          <div
            className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 ${
              feedback.type === "warning"
                ? "bg-amber-500/10 border-amber-500/30 text-amber-200"
                : "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            }`}
          >
            {feedback.type === "warning" ? (
              <AlertCircle size={15} className="flex-shrink-0 text-amber-400 mt-0.5" />
            ) : (
              <Sparkles size={15} className="flex-shrink-0 text-emerald-400 mt-0.5" />
            )}
            <span className="leading-relaxed">{feedback.message}</span>
          </div>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-white/5 border border-white/10 p-2 sm:p-2.5 rounded-xl text-xs">
        <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          <button
            onClick={() => setFilterStatus("all")}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              filterStatus === "all"
                ? "bg-emerald-500 text-white"
                : "text-gray-400 hover:text-white"
            }`}
          >
            All ({stats.total})
          </button>
          <button
            onClick={() => setFilterStatus("pending")}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              filterStatus === "pending"
                ? "bg-amber-500 text-black font-semibold"
                : "text-amber-400 hover:text-white"
            }`}
          >
            Pending ({stats.pending})
          </button>
          <button
            onClick={() => setFilterStatus("completed")}
            className={`px-2.5 sm:px-3 py-1.5 rounded-lg font-medium transition shrink-0 ${
              filterStatus === "completed"
                ? "bg-emerald-600 text-white"
                : "text-emerald-400 hover:text-white"
            }`}
          >
            Completed ({stats.completed})
          </button>
        </div>

        <button
          onClick={loadActivities}
          className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/5 transition shrink-0"
          title="Refresh"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
        </button>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 bg-white/5 rounded-xl border border-white/10" />
          <div className="h-16 bg-white/5 rounded-xl border border-white/10" />
          <div className="h-16 bg-white/5 rounded-xl border border-white/10" />
        </div>
      ) : filteredList.length === 0 ? (
        <div className="p-8 text-center bg-white/5 rounded-2xl border border-white/10 space-y-3">
          <Calendar size={36} className="mx-auto text-gray-500" />
          <p className="text-white font-medium text-sm">
            {filterStatus === "all"
              ? "No activities scheduled yet for this crop."
              : `No ${filterStatus} tasks found.`}
          </p>
          <p className="text-gray-400 text-xs max-w-md mx-auto">
            Click <strong>"Auto-Schedule Care"</strong> to generate a complete 9-stage agronomic package of fertilizer, irrigation, and spray milestones based on the sowing date.
          </p>
          <div className="pt-2 flex justify-center gap-3">
            <button
              onClick={handleGenerateSchedule}
              disabled={generating}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white rounded-xl text-xs font-medium transition flex items-center gap-1.5"
            >
              <Wand2 size={13} /> Auto-Schedule Care
            </button>
            <button
              onClick={() => setShowAddModal(true)}
              className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-medium transition flex items-center gap-1.5"
            >
              <Plus size={13} /> Add Custom Task
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredList.map((act) => (
            <ActivityItem
              key={act._id}
              activity={act}
              onToggle={handleToggle}
              onDelete={handleDelete}
              showCropName={false}
            />
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      <AddActivityModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSuccess={loadActivities}
        defaultCropId={cropId}
      />
    </div>
  );
}
