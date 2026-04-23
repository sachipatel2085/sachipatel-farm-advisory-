import { useState, useEffect } from "react";
import api from "../api/axios";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        {/* TITLE */}
        <h2 className="text-lg font-semibold">✏️ Edit History</h2>

        {/* FORM */}
        <div className="space-y-3">
          {/* TITLE */}
          <div>
            <label className="text-sm text-gray-400">Title</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="text-sm text-gray-400">Type</label>
            <select
              name="type"
              value={form.type}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:ring-2 focus:ring-green-500"
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
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
            />
          </div>

          {/* NOTE */}
          <div>
            <label className="text-sm text-gray-400">Note</label>
            <input
              name="note"
              value={form.note}
              onChange={handleChange}
              className="w-full mt-1 px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between pt-2">
          {/* DELETE */}
          <button
            onClick={handleDelete}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-sm"
          >
            Delete
          </button>

          {/* RIGHT ACTIONS */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
            >
              Cancel
            </button>

            <button
              onClick={handleUpdate}
              className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm"
            >
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCropHistoryModal;
