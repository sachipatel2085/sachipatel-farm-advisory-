import React, { useState, useEffect } from "react";
import api from "../api/axios";
import { X, Pencil, Calendar, IndianRupee, Package, Tag } from "lucide-react";

const EditTransactionModal = ({ cropId, transaction, onClose, onSuccess }) => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (transaction) setForm({ ...transaction });
  }, [transaction]);

  /* ===== PREVENT BACKGROUND SCROLL ===== */
  useEffect(() => {
    if (transaction) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [transaction]);

  if (!transaction || !form) return null;

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const update = async () => {
    await api.put(`/crops/${cropId}/transaction/${transaction._id}`, form);
    onSuccess();
    onClose();
  };

  const remove = async () => {
    await api.delete(`/crops/${cropId}/transaction/${transaction._id}`);
    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-[#0f172a] w-full max-w-md rounded-xl border border-white/10 shadow-xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="flex items-center gap-2 text-lg font-semibold">
            <Pencil size={18} />
            Edit {form.type === "income" ? "Income" : "Expense"}
          </h3>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {form.type === "income" ? (
            <>
              {/* TITLE */}
              <div className="relative">
                <Tag
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Income name"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
                />
              </div>

              {/* DATE */}
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="date"
                  name="date"
                  value={form.date?.split("T")[0]}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
                />
              </div>

              {/* QUANTITY */}
              <div className="relative">
                <Package
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity || ""}
                  placeholder="Yield (kg)"
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
                />
              </div>

              {/* PRICE */}
              <div className="relative">
                <IndianRupee
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="number"
                  name="price"
                  value={form.price || ""}
                  placeholder="Price per kg"
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
                />
              </div>

              <p className="text-green-400 text-sm">Total: ₹ {form.amount}</p>
            </>
          ) : (
            <>
              {/* CATEGORY */}
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
              >
                <option value="seed">Seed</option>
                <option value="fertilizer">Fertilizer</option>
                <option value="labor">Labor</option>
                <option value="irrigation">Irrigation</option>
                <option value="pesticide">Pesticide</option>
                <option value="other">Other</option>
              </select>

              {/* TITLE */}
              <div className="relative">
                <Tag
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  placeholder="Expense name"
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
                />
              </div>

              {/* AMOUNT */}
              <div className="relative">
                <IndianRupee
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
                />
              </div>

              {/* DATE */}
              <div className="relative">
                <Calendar
                  size={16}
                  className="absolute left-3 top-3 text-gray-400"
                />
                <input
                  type="date"
                  name="date"
                  value={form.date?.split("T")[0]}
                  onChange={handleChange}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
                />
              </div>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-white/10 flex justify-between items-center">
          <button
            onClick={remove}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm"
          >
            Delete
          </button>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
            >
              Cancel
            </button>

            <button
              onClick={update}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm flex items-center gap-2"
            >
              <Pencil size={14} /> Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;
