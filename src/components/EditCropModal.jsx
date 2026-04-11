import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/modal.css";

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
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Edit Crop</h2>

        <form className="modal-form" onSubmit={updateCrop}>
          <input
            name="cropName"
            value={form.cropName || ""}
            onChange={handleChange}
            required
          />

          <input
            name="variety"
            value={form.variety || ""}
            onChange={handleChange}
          />

          <select name="season" value={form.season} onChange={handleChange}>
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
          />

          <input
            type="number"
            name="expectedDurationDays"
            value={form.expectedDurationDays}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="expectedYield"
            value={form.expectedYield || ""}
            onChange={handleChange}
          />

          <select name="status" value={form.status} onChange={handleChange}>
            <option value="growing">Growing</option>
            <option value="harvested">Harvested</option>
            <option value="failed">Failed</option>
          </select>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCropModal;
