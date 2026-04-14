import { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles/modal.css";

const HarvestModal = ({ isOpen, crop, onClose, onSuccess }) => {
  const [qty, setQty] = useState("");
  const [price, setPrice] = useState("");

  if (!isOpen || !crop) return null;

  const total = qty && price ? qty * price : 0;

  const handleSubmit = async () => {
    try {
      await api.post(`/crops/${crop._id}/harvest-batch`, {
        quantity: qty,
        price,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h2>🌾 Add Harvest Batch</h2>

        <p>
          Total Harvest so far: <strong>{crop.actualYield || 0} kg</strong>
        </p>

        <div className="modal-form">
          <div>
            <label>Quantity (kg)</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
            />
          </div>

          <div>
            <label>Price per kg (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>

          <div>
            <label>Total</label>
            <input value={`₹ ${total}`} disabled />
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-primary" onClick={handleSubmit}>
            Add Batch
          </button>
        </div>
      </div>
    </div>
  );
};

export default HarvestModal;
