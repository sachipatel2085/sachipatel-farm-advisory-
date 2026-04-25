import { useState, useEffect } from "react";
import api from "../api/axios";
import { X, FileText, Calendar, Tag, Trash2, Pencil } from "lucide-react";

const EditCropHistoryModal = ({ history, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    note: "",
    type: "general",
    date: "",
  });

  useEffect(() => {
    if (history) {
      setForm({
        title: history.title || "",
        note: history.note || "",
        type: history.type || "general",
        date: history.date
          ? new Date(history.date).toISOString().split("T")[0]
          : "",
      });
    }
  }, [history]);

  if (!history) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
    try {
      await api.put(`/crop-history/${history._id}`, form);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Delete this history?")) return;

    try {
      await api.delete(`/crop-history/${history._id}`);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-[#0f172a] w-full max-w-md rounded-xl border border-white/10 shadow-xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Pencil size={18} /> Edit History
          </h2>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* TITLE */}
          <div className="relative">
            <FileText
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Title"
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
              value={form.note}
              onChange={handleChange}
              placeholder="Note..."
              rows={3}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-white/10 flex justify-between items-center">
          {/* DELETE */}
          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm"
          >
            <Trash2 size={14} /> Delete
          </button>

          {/* RIGHT */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm"
            >
              <Pencil size={14} /> Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCropHistoryModal;
