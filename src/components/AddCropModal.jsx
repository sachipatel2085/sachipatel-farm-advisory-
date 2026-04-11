import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/modal.css";

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
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>Add Crop</h2>

        <form className="modal-form" onSubmit={submitCrop}>
          <select
            name="farmId"
            value={form.farmId}
            onChange={handleChange}
            required
          >
            <option value="">Select Farm</option>
            {farms.map((f) => (
              <option key={f._id} value={f._id}>
                {f.farmName}
              </option>
            ))}
          </select>

          <input
            name="cropName"
            placeholder="Crop name"
            onChange={handleChange}
            required
          />

          <input name="variety" placeholder="Variety" onChange={handleChange} />

          <select name="season" onChange={handleChange}>
            <option value="kharif">Kharif</option>
            <option value="rabi">Rabi</option>
            <option value="summer">Summer</option>
          </select>

          <input
            type="date"
            name="sowingDate"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="expectedDurationDays"
            placeholder="Duration (days)"
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="expectedYield"
            placeholder="Expected yield (kg)"
            onChange={handleChange}
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn-cancel">
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Add Crop
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddCropModal;
