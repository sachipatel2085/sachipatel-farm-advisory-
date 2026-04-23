import React, { useEffect, useState } from "react";
import api from "../api/axios";

const EditCropModal = ({ isOpen, crop, onClose, onSuccess }) => {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (crop) setForm(crop);
  }, [crop]);

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        {/* TITLE */}
        <h2 className="text-lg font-semibold">✏️ Edit Crop</h2>

        <form onSubmit={updateCrop} className="space-y-3">
          <input
            name="cropName"
            value={form.cropName || ""}
            onChange={handleChange}
            placeholder="Crop Name"
            required
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:ring-2 focus:ring-green-500"
          />

          <input
            name="variety"
            value={form.variety || ""}
            onChange={handleChange}
            placeholder="Variety"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
          />

          <select
            name="season"
            value={form.season}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
          >
            <option value="kharif">Kharif</option>
            <option value="rabi">Rabi</option>
            <option value="summer">Summer</option>
          </select>

          <input
            type="date"
            name="sowingDate"
            value={form.sowingDate?.slice(0, 10)}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
          />

          <input
            type="number"
            name="expectedDurationDays"
            value={form.expectedDurationDays}
            onChange={handleChange}
            placeholder="Duration (days)"
            required
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
          />

          <input
            type="number"
            name="expectedYield"
            value={form.expectedYield || ""}
            onChange={handleChange}
            placeholder="Expected Yield (kg)"
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
          >
            <option value="active">🌱 Active</option>
            <option value="harvested">🌾 Harvested</option>
            <option value="failed">❌ Failed</option>
          </select>

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCropModal;
