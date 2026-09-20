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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
    api.get("/finance/shops").then((res) => setShops(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    setError(null);
    setLoading(false);

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
    if (!window.confirm("Are you sure you want to delete this transaction?")) return;
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/crops/${crop._id}/transaction/${editingTxn._id}`);
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  const submit = async () => {
    if (!form.title || !form.title.trim()) {
      setError("Please enter a transaction title");
      return;
    }

    const numAmount = Number(form.amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      setError("Please enter a valid amount greater than 0");
      return;
    }

    const payload = {
      title: form.title.trim(),
      amount: numAmount,
      quantity: Number(form.quantity) || 0,
      price: Number(form.price) || 0,
      type: mode,
      category: form.category || (mode === "income" ? "cropSale" : "other"),
      note: form.note || "",
      date: form.date || new Date().toISOString().split("T")[0],
    };

    // Only include shop if a valid shop was actually selected
    if (mode === "expense" && form.shop && form.shop.trim() !== "") {
      payload.shop = form.shop;
    }

    setLoading(true);
    setError(null);

    try {
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
    } catch (err) {
      console.error("Transaction save failed:", err);
      setError(err.response?.data?.message || "Failed to save transaction. Please try again.");
    } finally {
      setLoading(false);
    }
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

            {error && (
              <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
                {error}
              </div>
            )}

            {/* ACTIONS */}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                disabled={loading}
                className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm disabled:opacity-50"
              >
                Cancel
              </button>

              {editingTxn && (
                <button
                  type="button"
                  onClick={deleteTxn}
                  disabled={loading}
                  className="px-3 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm disabled:opacity-50"
                >
                  {loading ? "Deleting..." : "Delete"}
                </button>
              )}

              <button
                type="button"
                onClick={submit}
                disabled={loading}
                className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm font-semibold disabled:opacity-50 flex items-center gap-1.5"
              >
                {loading ? "Saving..." : editingTxn ? "Update" : "Save"}
              </button>
            </div>

          </>
        )}
      </div>
    </div>
  );
};

export default AddTransactionModal;
