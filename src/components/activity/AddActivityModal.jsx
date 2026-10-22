import React, { useState, useEffect } from "react";
import cropActivityService from "../../services/cropActivityService";
import api from "../../api/axios";
import { X, Calendar, AlertCircle, ShieldAlert, FlaskConical } from "lucide-react";

export default function AddActivityModal({
  isOpen,
  onClose,
  onSuccess,
  defaultCropId = "",
  defaultDate = "",
}) {
  const [crops, setCrops] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    cropId: defaultCropId || "",
    title: "",
    activityType: "fertilizer",
    dueDate: defaultDate || new Date().toISOString().split("T")[0],
    priority: "medium",
    notes: "",
    cost: "",
    growthStage: "",
    dosage: "",
    stageWarning: "",
    targetPests: "",
  });

  useEffect(() => {
    if (isOpen) {
      setError("");
      setFormData((prev) => ({
        ...prev,
        cropId: defaultCropId || prev.cropId || "",
        dueDate: defaultDate || prev.dueDate || new Date().toISOString().split("T")[0],
      }));

      // Fetch user's crops for dropdown if not already loaded
      api
        .get("/crops")
        .then((res) => {
          const list = Array.isArray(res.data) ? res.data : res.data?.crops || [];
          setCrops(list);
          if (!defaultCropId && list.length > 0 && !formData.cropId) {
            setFormData((prev) => ({ ...prev, cropId: list[0]._id }));
          }
        })
        .catch((err) => console.error("Error loading crops:", err));
    }
  }, [isOpen, defaultCropId, defaultDate]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.cropId) {
      setError("Please select a crop.");
      return;
    }
    if (!formData.title.trim()) {
      setError("Please enter a task title.");
      return;
    }
    if (!formData.dueDate) {
      setError("Please select a scheduled due date.");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      const pestArray = formData.targetPests
        ? formData.targetPests
            .split(",")
            .map((p) => p.trim())
            .filter(Boolean)
        : [];

      await cropActivityService.createActivity({
        cropId: formData.cropId,
        title: formData.title.trim(),
        activityType: formData.activityType,
        dueDate: formData.dueDate,
        priority: formData.priority,
        notes: formData.notes,
        cost: formData.cost ? Number(formData.cost) : 0,
        growthStage: formData.growthStage,
        dosage: formData.dosage,
        stageWarning: formData.stageWarning,
        targetPests: pestArray,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Failed to create activity:", err);
      setError(
        err.response?.data?.message || "Failed to create activity. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl p-5 sm:p-6 shadow-2xl text-slate-200 my-8 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Calendar size={18} className="text-emerald-400" />
            Schedule Crop Activity
          </h3>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
          >
            <X size={18} />
          </button>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-rose-500/10 border border-rose-500/20 text-rose-300 rounded-lg text-xs flex items-center gap-2">
            <AlertCircle size={15} className="flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-3.5 text-sm">
          {/* Crop Selector */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Select Crop *
            </label>
            <select
              value={formData.cropId}
              onChange={(e) =>
                setFormData({ ...formData, cropId: e.target.value })
              }
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              required
            >
              <option value="">-- Choose Crop --</option>
              {crops.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.cropName} {c.farmName ? `(${c.farmName})` : ""}
                </option>
              ))}
            </select>
          </div>

          {/* Title */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Activity Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Basal Dose: DAP + MOP + Zinc, or Neem Spray..."
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              required
            />
          </div>

          {/* Type & Priority */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Activity Type
              </label>
              <select
                value={formData.activityType}
                onChange={(e) =>
                  setFormData({ ...formData, activityType: e.target.value })
                }
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500 capitalize"
              >
                <option value="fertilizer">Fertilizer / Nutrition</option>
                <option value="spray">Spray / Pesticide</option>
                <option value="irrigation">Irrigation / Watering</option>
                <option value="weeding">Weeding / Interculture</option>
                <option value="harvest">Harvesting</option>
                <option value="scouting">Scouting & Inspection</option>
                <option value="soil_test">Soil Testing</option>
                <option value="general">General Farm Work</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Priority
              </label>
              <select
                value={formData.priority}
                onChange={(e) =>
                  setFormData({ ...formData, priority: e.target.value })
                }
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              >
                <option value="high">High (Urgent)</option>
                <option value="medium">Medium (Scheduled)</option>
                <option value="low">Low (Optional)</option>
              </select>
            </div>
          </div>

          {/* Due Date & Growth Stage */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Scheduled Due Date *
              </label>
              <input
                type="date"
                value={formData.dueDate}
                onChange={(e) =>
                  setFormData({ ...formData, dueDate: e.target.value })
                }
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Growth Stage (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Flowering, Seedling, Tillering"
                value={formData.growthStage}
                onChange={(e) =>
                  setFormData({ ...formData, growthStage: e.target.value })
                }
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Dosage & Chemical Formula */}
          <div>
            <label className="block text-xs font-medium text-teal-400 mb-1 flex items-center gap-1.5">
              <FlaskConical size={13} />
              Recommended Dosage & Input Formula (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. 0:52:34 @ 5g/L + Boron 20% @ 1g/L or Coragen @ 0.4ml/L"
              value={formData.dosage}
              onChange={(e) =>
                setFormData({ ...formData, dosage: e.target.value })
              }
              className="w-full bg-slate-800 border border-teal-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-teal-500"
            />
          </div>

          {/* Stage Vulnerability / Disease Warning */}
          <div>
            <label className="block text-xs font-medium text-amber-400 mb-1 flex items-center gap-1.5">
              <ShieldAlert size={13} />
              Stage Disease & Pest Warning (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g. ⚠️ High risk of Early Blight & Whitefly-transmitted Leaf Curl Virus"
              value={formData.stageWarning}
              onChange={(e) =>
                setFormData({ ...formData, stageWarning: e.target.value })
              }
              className="w-full bg-slate-800 border border-amber-500/30 rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-amber-500"
            />
          </div>

          {/* Target Pests & Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Target Pests / Diseases (Comma separated)
              </label>
              <input
                type="text"
                placeholder="e.g. Aphids, Late Blight, Borers"
                value={formData.targetPests}
                onChange={(e) =>
                  setFormData({ ...formData, targetPests: e.target.value })
                }
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-400 mb-1">
                Estimated Cost (₹)
              </label>
              <input
                type="number"
                placeholder="e.g. 750"
                value={formData.cost}
                onChange={(e) =>
                  setFormData({ ...formData, cost: e.target.value })
                }
                className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
                min="0"
              />
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-gray-400 mb-1">
              Application Instructions / Notes
            </label>
            <textarea
              rows="2"
              placeholder="Application timing, water volume, spray nozzle tips..."
              value={formData.notes}
              onChange={(e) =>
                setFormData({ ...formData, notes: e.target.value })
              }
              className="w-full bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-emerald-500"
            />
          </div>

          <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-lg text-xs font-medium transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-medium transition shadow-lg shadow-emerald-600/20 disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Schedule Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
