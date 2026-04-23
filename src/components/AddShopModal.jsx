import { useState } from "react";
import api from "../api/axios";

export default function AddShopModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    openingBalance: "",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await api.post("/finance/shop", {
        ...form,
        openingBalance: Number(form.openingBalance || 0),
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add shop");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        {/* TITLE */}
        <h2 className="text-lg font-semibold">🏪 Add Shop</h2>

        {/* FORM */}
        <div className="space-y-3">
          <input
            name="name"
            placeholder="Shop Name"
            value={form.name}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            name="phone"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          />

          <input
            type="number"
            name="openingBalance"
            placeholder="Opening Udhar (₹)"
            value={form.openingBalance}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

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
            Add Shop
          </button>
        </div>
      </div>
    </div>
  );
}
