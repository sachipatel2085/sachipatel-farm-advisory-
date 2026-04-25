import React, { useState, useEffect } from "react";
import api from "../api/axios";

const AddTransactionModal = ({
  crop,
  editingTxn,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [mode, setMode] = useState(null);
  const [shops, setShops] = useState([]);

  const [form, setForm] = useState({
    title: "",
    quantity: "",
    price: "",
    amount: "",
    category: "seed",
    note: "",
    date: "",
    shop: "",
  });

  useEffect(() => {
    api.get("/finance/shops").then((res) => setShops(res.data));
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (editingTxn) {
      setMode(editingTxn.type);
      setForm({
        title: editingTxn.title || "",
        quantity: editingTxn.quantity || "",
        price: editingTxn.price || "",
        amount: editingTxn.amount || "",
        category: editingTxn.category || "seed",
        note: editingTxn.note || "",
        date: editingTxn.date
          ? editingTxn.date.split("T")[0]
          : new Date().toISOString().split("T")[0],
        shop: editingTxn.shop || "",
      });
    } else {
      setMode(null);
      setForm({
        title: "",
        quantity: "",
        price: "",
        amount: "",
        category: "seed",
        note: "",
        date: new Date().toISOString().split("T")[0],
        shop: "",
      });
    }
  }, [isOpen, editingTxn]);

  if (!crop || !isOpen) return null;

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };

    if (mode === "income") {
      const qty = Number(updated.quantity || 0);
      const price = Number(updated.price || 0);
      updated.amount = qty * price;
    }

    setForm(updated);
  };

  const deleteTxn = async () => {
    try {
      await api.delete(`/crops/${crop._id}/transaction/${editingTxn._id}`);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };
  const submit = async () => {
    const payload = {
      ...form,
      amount: Number(form.amount),
      quantity: Number(form.quantity),
      price: Number(form.price),
      type: mode,
    };

    if (editingTxn) {
      await api.put(
        `/crops/${crop._id}/transaction/${editingTxn._id}`,
        payload,
      );
    } else {
      await api.post(`/crops/${crop._id}/transaction`, payload);
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        {/* STEP 1 */}
        {!mode && (
          <>
            <h3 className="text-lg font-semibold text-center">
              Select Transaction Type
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode("income")}
                className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 hover:bg-green-500/20 transition"
              >
                🟢 Income
              </button>

              <button
                onClick={() => setMode("expense")}
                className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 hover:bg-red-500/20 transition"
              >
                🔴 Expense
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-full mt-2 bg-slate-700 hover:bg-slate-600 py-2 rounded-lg text-sm"
            >
              Cancel
            </button>
          </>
        )}

        {/* STEP 2 */}
        {mode && (
          <>
            <h3 className="text-lg font-semibold">
              {mode === "income" ? "Add Income" : "Add Expense"}
            </h3>

            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:ring-2 focus:ring-green-500"
            />

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
            />

            {mode === "income" && (
              <>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity (kg)"
                  value={form.quantity}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Price per kg"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
                />

                <p className="text-sm text-green-400">Total: ₹ {form.amount}</p>
              </>
            )}

            {mode === "expense" && (
              <>
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  value={form.amount}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
                />

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
                >
                  <option value="seed">Seed</option>
                  <option value="fertilizer">Fertilizer</option>
                  <option value="labor">Labor</option>
                  <option value="irrigation">Irrigation</option>
                  <option value="pesticide">Pesticide</option>
                  <option value="other">Other</option>
                </select>

                <select
                  name="shop"
                  value={form.shop || ""}
                  onChange={handleChange}
                  className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
                >
                  <option value="">Select Shop (Optional)</option>
                  {shops.map((s) => (
                    <option key={s.shop._id} value={s.shop._id}>
                      {s.shop.name}
                    </option>
                  ))}
                </select>
              </>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={onClose}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
              >
                Cancel
              </button>

              {editingTxn && (
                <button
                  onClick={deleteTxn}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm"
                >
                  Delete
                </button>
              )}

              <button
                onClick={submit}
                className="px-3 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm"
              >
                {editingTxn ? "Update" : "Save"}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AddTransactionModal;
