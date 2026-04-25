import { useState, useEffect } from "react";
import api from "../api/axios";
import { X, Pencil, IndianRupee } from "lucide-react";

export default function EditLedgerModal({ item, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    if (item) setAmount(item.amount);
  }, [item]);

  /* ===== PREVENT BACKGROUND SCROLL ===== */
  useEffect(() => {
    if (item) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-[#0f172a] w-full max-w-sm rounded-xl border border-white/10 shadow-xl flex flex-col">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Pencil size={18} /> Edit Entry
          </h3>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 space-y-4">
          {/* AMOUNT */}
          <div className="relative">
            <IndianRupee
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Enter amount"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
            />
          </div>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleUpdate}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm flex items-center gap-2"
          >
            <Pencil size={14} /> Save
          </button>
        </div>
      </div>
    </div>
  );
}
