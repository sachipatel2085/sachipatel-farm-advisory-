import React, { useState, useEffect } from "react";
import {
  Calendar,
  Plus,
  X,
  Edit2,
  Trash2,
  Sprout,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Layers,
  Leaf,
  Bug,
  Droplets,
  Wheat,
  Eye,
  Sparkles,
} from "lucide-react";
import adminService from "../../services/adminService";

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
        label: "General Activity",
        icon: <Calendar size={14} className="text-gray-400" />,
        badge: "bg-white/10 text-gray-300 border-white/10",
      };
  }
};

export default function AdminGeneralTasks({ onTasksUpdated }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedCrop, setSelectedCrop] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    cropName: "",
    title: "",
    dayOffset: 0,
    activityType: "fertilizer",
    priority: "medium",
    growthStage: "Seedling",
    dosage: "",
    stageWarning: "",
    notes: "",
    estimatedCost: 0,
    active: true,
  });

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const data = await adminService.getGeneralTasks();
      setTasks(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Fetch general tasks error:", err);
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // Distinct crop names for filter buttons
  const cropNames = Array.from(
    new Set(tasks.map((t) => t.cropName).filter(Boolean))
  ).sort();

  const handleOpenAdd = () => {
    setEditingTask(null);
    setFormData({
      cropName: selectedCrop !== "all" ? selectedCrop : "",
      title: "",
      dayOffset: 0,
      activityType: "fertilizer",
      priority: "medium",
      growthStage: "Seedling",
      dosage: "",
      stageWarning: "",
      notes: "",
      estimatedCost: 0,
      active: true,
    });
    setShowModal(true);
  };

  const handleOpenEdit = (task) => {
    setEditingTask(task);
    setFormData({
      cropName: task.cropName || "",
      title: task.title || "",
      dayOffset: task.dayOffset || 0,
      activityType: task.activityType || "general",
      priority: task.priority || "medium",
      growthStage: task.growthStage || "Seedling",
      dosage: task.dosage || "",
      stageWarning: task.stageWarning || "",
      notes: task.notes || "",
      estimatedCost: task.estimatedCost || 0,
      active: task.active !== undefined ? task.active : true,
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.cropName.trim() || !formData.title.trim()) {
      alert("Crop Name and Title are required.");
      return;
    }

    try {
      if (editingTask) {
        await adminService.updateGeneralTask(editingTask._id, formData);
      } else {
        await adminService.createGeneralTask(formData);
      }
      setShowModal(false);
      fetchTasks();
      if (onTasksUpdated) onTasksUpdated();
    } catch (err) {
      alert("Failed to save task: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this general crop task?")) return;
    try {
      await adminService.deleteGeneralTask(taskId);
      fetchTasks();
      if (onTasksUpdated) onTasksUpdated();
    } catch (err) {
      alert("Failed to delete task: " + (err.response?.data?.message || err.message));
    }
  };

  const handleToggleActive = async (task) => {
    try {
      await adminService.updateGeneralTask(task._id, { active: !task.active });
      fetchTasks();
      if (onTasksUpdated) onTasksUpdated();
    } catch (err) {
      console.error("Toggle active error:", err);
    }
  };

  const filteredTasks = tasks.filter((t) => {
    if (selectedCrop !== "all" && t.cropName.toLowerCase() !== selectedCrop.toLowerCase()) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = (t.title || "").toLowerCase().includes(q);
      const matchCrop = (t.cropName || "").toLowerCase().includes(q);
      const matchStage = (t.growthStage || "").toLowerCase().includes(q);
      if (!matchTitle && !matchCrop && !matchStage) return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* HEADER & ACTION */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-base font-semibold text-white flex items-center gap-2">
            <Calendar size={18} className="text-emerald-400" />
            General Crop Tasks (Crop Calendar Schedule)
          </h3>
          <p className="text-xs text-gray-400 mt-0.5">
            Admin & Moderator template tasks for specific crops. Farmers auto-schedule their crop care from these standard general tasks while keeping their custom tasks private.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-semibold transition shadow-lg shadow-emerald-600/20 shrink-0"
        >
          <Plus size={15} /> Add General Task
        </button>
      </div>

      {/* FILTER BAR */}
      <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
        {/* Crop Selector Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
          <button
            onClick={() => setSelectedCrop("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 ${
              selectedCrop === "all"
                ? "bg-emerald-500 text-white"
                : "bg-white/5 text-gray-400 hover:text-white"
            }`}
          >
            All Crops ({tasks.length})
          </button>
          {cropNames.map((c) => {
            const count = tasks.filter((t) => t.cropName.toLowerCase() === c.toLowerCase()).length;
            return (
              <button
                key={c}
                onClick={() => setSelectedCrop(c)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition shrink-0 flex items-center gap-1 ${
                  selectedCrop.toLowerCase() === c.toLowerCase()
                    ? "bg-emerald-500 text-white"
                    : "bg-white/5 text-gray-400 hover:text-white"
                }`}
              >
                <Sprout size={13} />
                {c} ({count})
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative min-w-[200px]">
          <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500"
          />
        </div>
      </div>

      {/* TASK LIST / TABLE */}
      {loading ? (
        <div className="space-y-3 animate-pulse">
          <div className="h-16 bg-white/5 rounded-xl border border-white/10" />
          <div className="h-16 bg-white/5 rounded-xl border border-white/10" />
          <div className="h-16 bg-white/5 rounded-xl border border-white/10" />
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="p-10 text-center bg-white/5 rounded-2xl border border-white/10 space-y-3">
          <Calendar size={36} className="mx-auto text-gray-500" />
          <h4 className="text-white font-medium text-sm">No General Tasks Configured</h4>
          <p className="text-gray-400 text-xs max-w-md mx-auto">
            {selectedCrop === "all"
              ? "No general crop tasks are currently in the database. Add standard tasks for specific crops like Tomato, Wheat, or Cotton."
              : `No general tasks configured for ${selectedCrop}. Add tasks so farmers can auto-schedule calendar activities for this crop.`}
          </p>
          <button
            onClick={handleOpenAdd}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition"
          >
            <Plus size={13} /> Add Task for {selectedCrop === "all" ? "a Crop" : selectedCrop}
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredTasks.map((task) => {
            const config = getActivityTypeConfig(task.activityType);
            return (
              <div
                key={task._id}
                className={`p-4 rounded-xl border transition-all ${
                  task.active
                    ? "bg-white/[0.03] border-white/10 hover:border-white/20"
                    : "bg-white/[0.01] border-white/5 opacity-60"
                }`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-semibold border border-emerald-500/30 flex items-center gap-1">
                        <Sprout size={12} /> {task.cropName}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-gray-300 border border-white/10">
                        Day {task.dayOffset}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium border ${config.badge}`}
                      >
                        {config.icon}
                        {config.label}
                      </span>
                      {task.priority === "high" && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 border border-rose-500/30 uppercase font-bold">
                          Urgent
                        </span>
                      )}
                      {task.growthStage && (
                        <span className="text-[11px] px-2 py-0.5 rounded bg-white/5 text-gray-400 border border-white/10">
                          {task.growthStage}
                        </span>
                      )}
                      {!task.active && (
                        <span className="text-[10px] px-2 py-0.5 rounded bg-gray-500/20 text-gray-400 border border-gray-500/30">
                          Disabled
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-semibold text-white tracking-wide">
                      {task.title}
                    </h4>

                    {task.stageWarning && (
                      <p className="text-xs text-amber-300/90 bg-amber-500/10 border border-amber-500/20 rounded-lg p-2 flex items-start gap-1.5">
                        <AlertTriangle size={13} className="shrink-0 mt-0.5 text-amber-400" />
                        <span>{task.stageWarning}</span>
                      </p>
                    )}

                    {task.dosage && (
                      <p className="text-xs text-emerald-300/90 flex items-center gap-1.5">
                        <Leaf size={12} className="shrink-0" />
                        <span>Recommended Dosage: <strong>{task.dosage}</strong></span>
                      </p>
                    )}

                    {task.notes && (
                      <p className="text-xs text-gray-400 line-clamp-2">
                        {task.notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleToggleActive(task)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg border transition ${
                        task.active
                          ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300 hover:bg-emerald-500/25"
                          : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                      }`}
                      title={task.active ? "Click to deactivate" : "Click to activate"}
                    >
                      {task.active ? "Active" : "Inactive"}
                    </button>
                    <button
                      onClick={() => handleOpenEdit(task)}
                      className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 transition"
                      title="Edit Task"
                    >
                      <Edit2 size={13} />
                    </button>
                    <button
                      onClick={() => handleDelete(task._id)}
                      className="p-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 border border-rose-500/20 transition"
                      title="Delete Task"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="w-full max-w-xl bg-slate-900 border border-white/15 rounded-2xl shadow-2xl p-5 sm:p-6 space-y-4 my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Calendar size={18} className="text-emerald-400" />
                {editingTask ? "Edit General Crop Task" : "Add General Crop Task"}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Crop Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tomato, Wheat, Cotton"
                    value={formData.cropName}
                    onChange={(e) =>
                      setFormData({ ...formData, cropName: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Day Offset from Sowing <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="number"
                    min="0"
                    required
                    value={formData.dayOffset}
                    onChange={(e) =>
                      setFormData({ ...formData, dayOffset: Number(e.target.value) })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Task Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Basal Nutrition: DAP + MOP + Zinc Sulphate"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Activity Type
                  </label>
                  <select
                    value={formData.activityType}
                    onChange={(e) =>
                      setFormData({ ...formData, activityType: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="fertilizer">Fertilizer / Nutrition</option>
                    <option value="spray">Spray / Pesticide</option>
                    <option value="irrigation">Irrigation</option>
                    <option value="weeding">Weeding / Hoeing</option>
                    <option value="harvest">Harvest</option>
                    <option value="scouting">Scouting</option>
                    <option value="soil_test">Soil Test</option>
                    <option value="general">General Activity</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Priority
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) =>
                      setFormData({ ...formData, priority: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="high">High (Urgent)</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-300 mb-1">
                    Growth Stage
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Vegetative, Flowering"
                    value={formData.growthStage}
                    onChange={(e) =>
                      setFormData({ ...formData, growthStage: e.target.value })
                    }
                    className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Dosage / Product Recommendation
                </label>
                <input
                  type="text"
                  placeholder="e.g. DAP @ 50 kg/acre + Zinc Sulphate 21% @ 10 kg/acre"
                  value={formData.dosage}
                  onChange={(e) =>
                    setFormData({ ...formData, dosage: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Stage Caution / Pest Warning
                </label>
                <input
                  type="text"
                  placeholder="e.g. ⚠️ Severe Vector Warning: Whiteflies transmit Leaf Curl Virus"
                  value={formData.stageWarning}
                  onChange={(e) =>
                    setFormData({ ...formData, stageWarning: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-300 mb-1">
                  Agronomic Notes & Instructions
                </label>
                <textarea
                  rows="2"
                  placeholder="Detailed instructions for farmers..."
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  className="w-full bg-slate-800 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <label className="flex items-center gap-2 cursor-pointer text-xs text-gray-300">
                  <input
                    type="checkbox"
                    checked={formData.active}
                    onChange={(e) =>
                      setFormData({ ...formData, active: e.target.checked })
                    }
                    className="rounded bg-slate-800 border-white/20 text-emerald-500 focus:ring-0"
                  />
                  <span>Active & Ready for Auto-Scheduling</span>
                </label>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="px-3.5 py-2 rounded-xl text-xs font-medium bg-white/5 hover:bg-white/10 text-gray-300 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition shadow-lg shadow-emerald-600/20"
                  >
                    {editingTask ? "Update Task" : "Save General Task"}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
