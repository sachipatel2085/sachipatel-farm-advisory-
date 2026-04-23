import React, { useEffect, useState } from "react";
import api from "../api/axios";

const AddCropModal = ({ isOpen, onClose, onSuccess }) => {
  const [farms, setFarms] = useState([]);

  const [form, setForm] = useState({
    farmId: "",
    cropName: "",
    variety: "",
    season: "kharif",
    sowingDate: "",
    expectedDurationDays: "",
    expectedYield: "",
  });

  useEffect(() => {
    if (isOpen) {
      api.get("/farms").then((res) => setFarms(res.data));
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitCrop = async (e) => {
    e.preventDefault();
    try {
      await api.post("/crops", form);
      onSuccess();
      onClose();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to add crop");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-semibold">🌱 Add Crop</h2>

        <form onSubmit={submitCrop} className="space-y-3">
          {/* FARM SELECT */}
          <select
            name="farmId"
            value={form.farmId}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="">Select Farm</option>
            {farms.map((f) => (
              <option key={f._id} value={f._id}>
                {f.farmName}
              </option>
            ))}
          </select>

          {/* CROP NAME */}
          <input
            name="cropName"
            placeholder="Crop name"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* VARIETY */}
          <input
            name="variety"
            placeholder="Variety"
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* SEASON */}
          <select
            name="season"
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="kharif">Kharif</option>
            <option value="rabi">Rabi</option>
            <option value="summer">Summer</option>
          </select>

          {/* DATE */}
          <input
            type="date"
            name="sowingDate"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* DURATION */}
          <input
            type="number"
            name="expectedDurationDays"
            placeholder="Duration (days)"
            onChange={handleChange}
            required
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          {/* YIELD */}
          <input
            type="number"
            name="expectedYield"
            placeholder="Expected yield (kg)"
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

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
              Add Crop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCropModal;
