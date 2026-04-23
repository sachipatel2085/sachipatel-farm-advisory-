import { useState } from "react";
import api from "../api/axios";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-semibold">🌾 Add Harvest Batch</h2>

        <p className="text-sm text-gray-400">
          Total Harvest:{" "}
          <span className="text-white font-medium">
            {crop.actualYield || 0} kg
          </span>
        </p>

        <div className="space-y-3">
          <div>
            <label className="text-sm text-gray-400">Quantity (kg)</label>
            <input
              type="number"
              value={qty}
              onChange={(e) => setQty(e.target.value)}
              className="input mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Price per kg (₹)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="input mt-1"
            />
          </div>

          <div>
            <label className="text-sm text-gray-400">Total</label>
            <input
              value={`₹ ${total}`}
              disabled
              className="input mt-1 bg-slate-700"
            />
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>

          <button onClick={handleSubmit} className="btn-primary">
            Add Batch
          </button>
        </div>
      </div>
    </div>
  );
};

export default HarvestModal;
