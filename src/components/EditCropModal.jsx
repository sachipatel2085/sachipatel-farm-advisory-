import React, { useEffect } from "react";
import api from "../api/axios";
import { X, Sprout, Leaf, Calendar, Timer, Wheat, Layers } from "lucide-react";

const EditCropModal = ({ isOpen, crop, onClose, onSuccess }) => {
  const [form, setForm] = React.useState({});

  useEffect(() => {
    if (crop) setForm(crop);
  }, [crop]);

  /* ===== PREVENT BACKGROUND SCROLL ===== */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const updateCrop = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/crops/${crop._id}`, form);
      onSuccess();
      onClose();
    } catch {
      alert("Failed to update crop");
    }
  };

  if (!isOpen || !crop) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-[#0f172a] w-full max-w-md rounded-xl border border-white/10 shadow-xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Sprout size={18} /> Edit Crop
          </h2>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto flex-1">
          <form onSubmit={updateCrop} className="space-y-4">
            {/* NAME */}
            <div className="relative">
              <Leaf size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                name="cropName"
                value={form.cropName || ""}
                onChange={handleChange}
                placeholder="Crop Name"
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* VARIETY */}
            <div className="relative">
              <Layers
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                name="variety"
                value={form.variety || ""}
                onChange={handleChange}
                placeholder="Variety"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
              />
            </div>

            {/* SEASON */}
            <select
              name="season"
              value={form.season}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
            >
              <option value="kharif">Kharif</option>
              <option value="rabi">Rabi</option>
              <option value="summer">Summer</option>
            </select>

            {/* DATE */}
            <div className="relative">
              <Calendar
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="date"
                name="sowingDate"
                value={form.sowingDate?.slice(0, 10)}
                onChange={handleChange}
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
              />
            </div>

            {/* DURATION */}
            <div className="relative">
              <Timer
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="number"
                name="expectedDurationDays"
                value={form.expectedDurationDays}
                onChange={handleChange}
                placeholder="Duration (days)"
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
              />
            </div>

            {/* YIELD */}
            <div className="relative">
              <Wheat
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="number"
                name="expectedYield"
                value={form.expectedYield || ""}
                onChange={handleChange}
                placeholder="Expected Yield (kg)"
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
              />
            </div>

            {/* STATUS */}
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
            >
              <option value="active">🌱 Active</option>
              <option value="harvested">🌾 Harvested</option>
              <option value="failed">❌ Failed</option>
            </select>
          </form>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={updateCrop}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm flex items-center gap-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCropModal;
