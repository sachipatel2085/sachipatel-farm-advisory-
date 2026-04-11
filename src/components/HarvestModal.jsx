import React, { useState } from "react";
import api from "../api/axios";
import "../styles/modal.css";

const HarvestModal = ({ crop, onClose, onSuccess }) => {
  const [yieldValue, setYieldValue] = useState("");

  const submitHarvest = async () => {
    await api.post(`/crops/${crop._id}/harvest`, {
      actualYield: yieldValue,
    });
    onSuccess();
    onClose();
  };

  if (!crop) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>Harvest Crop</h3>

        <input
          type="number"
          placeholder="Actual yield (kg)"
          value={yieldValue}
          onChange={(e) => setYieldValue(e.target.value)}
        />

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn-primary" onClick={submitHarvest}>
            Save Yield
          </button>
        </div>
      </div>
    </div>
  );
};

export default HarvestModal;
