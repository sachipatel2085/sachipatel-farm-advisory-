import { useState } from "react";
import api from "../api/axios";

export default function AddPaymentModal({ isOpen, shop, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");

  if (!isOpen || !shop) return null;

  const handleSubmit = async () => {
    try {
      await api.post("/finance/payment", {
        shop: shop._id,
        amount: Number(amount),
        method: "cash",
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Payment failed");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        {/* TITLE */}
        <h2 className="text-lg font-semibold">💸 Pay to {shop.name}</h2>

        {/* INPUT */}
        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        {/* ACTIONS */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm"
          >
            Pay
          </button>
        </div>
      </div>
    </div>
  );
}
