import { useState, useEffect } from "react";
import api from "../api/axios";

export default function EditLedgerModal({ item, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (item) setAmount(item.amount);
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-lg font-semibold">✏️ Edit Entry</h3>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
        />

        <div className="flex justify-end gap-2 pt-2">
          <button onClick={onClose} className="btn-secondary">
            Cancel
          </button>

          <button onClick={handleUpdate} className="btn-primary">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
