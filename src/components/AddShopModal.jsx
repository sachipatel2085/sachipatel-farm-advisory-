import { useEffect, useState } from "react";
import api from "../api/axios";
import { X, Store, Phone, MapPin, IndianRupee } from "lucide-react";

export default function AddShopModal({ isOpen, onClose, onSuccess }) {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    address: "",
    openingBalance: "",
  });

  /* ===== PREVENT BACKGROUND SCROLL ===== */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-[#0f172a] w-full max-w-md rounded-xl border border-white/10 shadow-xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Store size={18} /> Add Shop
          </h2>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* NAME */}
          <div className="relative">
            <Store size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              name="name"
              placeholder="Shop Name"
              value={form.name}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* PHONE */}
          <div className="relative">
            <Phone size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:ring-2 focus:ring-green-500 outline-none"
            />
          </div>

          {/* ADDRESS */}
          <div className="relative">
            <MapPin size={16} className="absolute left-3 top-3 text-gray-400" />
            <input
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
            />
          </div>

          {/* OPENING BALANCE */}
          <div className="relative">
            <IndianRupee
              size={16}
              className="absolute left-3 top-3 text-gray-400"
            />
            <input
              type="number"
              name="openingBalance"
              placeholder="Opening Udhar (₹)"
              value={form.openingBalance}
              onChange={handleChange}
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
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm flex items-center gap-2"
          >
            <Store size={14} /> Add Shop
          </button>
        </div>
      </div>
    </div>
  );
}
