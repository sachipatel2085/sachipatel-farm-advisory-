import { useEffect, useState } from "react";
import api from "../api/axios";
import { X, IndianRupee, Wallet } from "lucide-react";

export default function AddPaymentModal({ isOpen, shop, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");

  /* ===== PREVENT BACKGROUND SCROLL ===== */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-[#0f172a] w-full max-w-sm rounded-xl border border-white/10 shadow-xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Wallet size={18} /> Pay to {shop.name}
          </h2>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* AMOUNT INPUT */}
          <div className="relative">
            <IndianRupee
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:ring-2 focus:ring-green-500 outline-none"
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
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm flex items-center gap-2"
          >
            <IndianRupee size={14} /> Pay
          </button>
        </div>
      </div>
    </div>
  );
}
