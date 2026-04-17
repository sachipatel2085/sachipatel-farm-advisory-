import { useState, useEffect } from "react";
import api from "../api/axios";

export default function EditLedgerModal({ item, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");

  // 🔥 update state when item changes
  useEffect(() => {
    if (item) {
      setAmount(item.amount);
    }
  }, [item]);

  if (!item) return null;

  const handleUpdate = async () => {
    try {
      if (item.model === "credit") {
        await api.put(`/finance/credit/${item._id}`, { amount });
      } else {
        await api.put(`/finance/payment/${item._id}`, { amount });
      }

      onSuccess();
      onClose();
    } catch {
      alert("Update failed");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Edit Entry</h3>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="btn btn-primary" onClick={handleUpdate}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
