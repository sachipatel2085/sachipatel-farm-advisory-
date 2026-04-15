import { useState } from "react";
import api from "../api/axios";
import "../styles/modal.css";

const AddCropHistoryModal = ({ isOpen, crop, onClose, onSuccess }) => {
  const [form, setForm] = useState({
    title: "",
    note: "",
    type: "general",
    date: new Date().toISOString().split("T")[0], // ✅ default today
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
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>📝 Add Crop History</h2>

        <p>
          Crop: <strong>{crop.cropName}</strong>
        </p>

        <div className="modal-form">
          {/* TITLE */}
          <div>
            <label>Title</label>
            <input
              name="title"
              placeholder="e.g. Irrigation done"
              value={form.title}
              onChange={handleChange}
            />
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
            <input
              name="note"
              placeholder="Optional note"
              value={form.note}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-primary" onClick={handleSubmit}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddCropHistoryModal;
