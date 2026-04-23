import { useState } from "react";
import api from "../api/axios";

const AddCropHistoryModal = ({ isOpen, crop, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    note: "",
    type: "general",
    date: new Date().toISOString().split("T")[0],
  });

  if (!isOpen || !crop) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/crop-history", {
        cropId: crop._id,
        ...form,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add history");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        {/* TITLE */}
        <h2 className="text-lg font-semibold">📝 Add Crop History</h2>

        <p className="text-sm text-gray-400">
          Crop: <span className="font-medium text-white">{crop.cropName}</span>
        </p>

        {/* FORM */}
        <div className="space-y-3">
          {/* TITLE */}
          <div>
            <label className="text-sm text-gray-400">Title</label>
            <input
              name="title"
              placeholder="e.g. Irrigation done"
              value={form.title}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="text-sm text-gray-400">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="general">General</option>
              <option value="activity">Activity</option>
              <option value="harvest">Harvest</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* DATE */}
          <div>
            <label className="text-sm text-gray-400">Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* NOTE */}
          <div>
            <label className="text-sm text-gray-400">Note</label>
            <input
              name="note"
              placeholder="Optional note"
              value={form.note}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCropHistoryModal;
