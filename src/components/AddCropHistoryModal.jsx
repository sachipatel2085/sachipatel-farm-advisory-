import { useState } from "react";
import api from "../api/axios";
import { X, FileText, Calendar, Tag, PlusCircle, Sprout } from "lucide-react";

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-[#0f172a] w-full max-w-md rounded-xl border border-white/10 shadow-xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <PlusCircle size={18} /> Add Crop History
          </h2>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* CROP NAME */}
          <p className="text-sm text-gray-400 flex items-center gap-2">
            <Sprout size={14} />
            Crop:{" "}
            <span className="font-medium text-white">{crop.cropName}</span>
          </p>

          {/* TITLE */}
          <div className="relative">
            <FileText
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              name="title"
              placeholder="e.g. Irrigation done"
              value={form.title}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* TYPE */}
          <div className="relative">
            <Tag size={16} className="absolute left-3 top-3 text-gray-400" />
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:ring-2 focus:ring-green-500 outline-none"
            >
              <option value="general">General</option>
              <option value="activity">Activity</option>
              <option value="harvest">Harvest</option>
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
          </div>

          {/* DATE */}
          <div className="relative">
            <Calendar
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
            />
          </div>

          {/* NOTE */}
          <div>
            <textarea
              name="note"
              placeholder="Optional note..."
              value={form.note}
              onChange={handleChange}
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm"
          >
            <PlusCircle size={14} /> Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCropHistoryModal;
