import { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles/modal.css";

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
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>✏️ Edit History</h2>

        <div className="modal-form">
          {/* TITLE */}
          <div>
            <label>Title</label>
            <input name="title" value={form.title} onChange={handleChange} />
          </div>

          {/* TYPE */}
          <div>
            <label>Type</label>
            <div className="select-wrapper">
              <select name="type" value={form.type} onChange={handleChange}>
                <option value="general">General</option>
                <option value="activity">Activity</option>
                <option value="harvest">Harvest</option>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>

          {/* DATE */}
          <div>
            <label>Date</label>
            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          {/* NOTE */}
          <div>
            <label>Note</label>
            <input name="note" value={form.note} onChange={handleChange} />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-danger" onClick={handleDelete}>
            Delete
          </button>

          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-primary" onClick={handleUpdate}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCropHistoryModal;
