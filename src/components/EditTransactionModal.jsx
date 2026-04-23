import React, { useState, useEffect } from "react";
import api from "../api/axios";

const EditTransactionModal = ({ cropId, transaction, onClose, onSuccess }) => {
  const [form, setForm] = useState(null);

  useEffect(() => {
    if (transaction) setForm({ ...transaction });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <h3 className="text-lg font-semibold">
          Edit {form.type === "income" ? "Income" : "Expense"}
        </h3>

        <div className="space-y-3">
          {form.type === "income" ? (
            <>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Income name"
                className="input"
              />

              <input
                type="date"
                name="date"
                value={form.date?.split("T")[0]}
                onChange={handleChange}
                className="input"
              />

              <input
                type="number"
                name="quantity"
                value={form.quantity || ""}
                placeholder="Yield (kg)"
                onChange={handleChange}
                className="input"
              />

              <input
                type="number"
                name="price"
                value={form.price || ""}
                placeholder="Price per kg"
                onChange={handleChange}
                className="input"
              />

              <p className="text-green-400 text-sm">Total: ₹ {form.amount}</p>
            </>
          ) : (
            <>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                className="input"
              >
                <option value="seed">Seed</option>
                <option value="fertilizer">Fertilizer</option>
                <option value="labor">Labor</option>
                <option value="irrigation">Irrigation</option>
                <option value="pesticide">Pesticide</option>
                <option value="other">Other</option>
              </select>

              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Expense name"
                className="input"
              />

              <input
                type="number"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                className="input"
              />

              <input
                type="date"
                name="date"
                value={form.date?.split("T")[0]}
                onChange={handleChange}
                className="input"
              />
            </>
          )}
        </div>

        {/* ACTIONS */}
        <div className="flex justify-between pt-2">
          <button
            onClick={remove}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm"
          >
            Delete
          </button>

          <div className="flex gap-2">
            <button onClick={onClose} className="btn-secondary">
              Cancel
            </button>

            <button onClick={update} className="btn-primary">
              Update
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;
