import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles/modal.css";

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

  // 🔥 LOAD SHOPS
  useEffect(() => {
    api.get("/finance/shops").then((res) => setShops(res.data));
  }, []);

  // 🔥 HANDLE OPEN (EDIT / ADD)
  useEffect(() => {
    if (!isOpen) return;

    if (editingTxn) {
      // ✅ EDIT MODE
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
      // ✅ ADD MODE
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

  // 🔥 HANDLE CHANGE
  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };

    // auto calculate income
    if (mode === "income") {
      const qty = Number(updated.quantity || 0);
      const price = Number(updated.price || 0);
      updated.amount = qty * price;
    }

    setForm(updated);
  };

  // 🔥 DELETE
  const deleteTxn = async () => {
    await api.delete(`/crops/${crop._id}/transaction/${editingTxn._id}`);
    onSuccess();
    onClose();
  };

  // 🔥 SUBMIT
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
    <div className="modal-backdrop">
      <div className="modal-box">
        {/* STEP 1 */}
        {!mode && (
          <div className="txn-selection">
            <h3>Select Transaction Type</h3>

            <div className="txn-options">
              <div
                className="txn-card income"
                onClick={() => setMode("income")}
              >
                🟢 Add Income
              </div>

              <div
                className="txn-card expense"
                onClick={() => setMode("expense")}
              >
                🔴 Add Expense
              </div>
            </div>

            <button className="btn-cancel" onClick={onClose}>
              Cancel
            </button>
          </div>
        )}

        {/* STEP 2 */}
        {mode && (
          <>
            <h3>{mode === "income" ? "Add Income" : "Add Expense"}</h3>

            <input
              name="title"
              placeholder="Title"
              value={form.title}
              onChange={handleChange}
            />

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />

            {mode === "income" && (
              <>
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity (kg)"
                  value={form.quantity}
                  onChange={handleChange}
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Price per kg"
                  value={form.price}
                  onChange={handleChange}
                />

                <p>
                  <b>Total:</b> ₹ {form.amount}
                </p>
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
                />

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="seed">Seed</option>
                  <option value="fertilizer">Fertilizer</option>
                  <option value="labor">Labor</option>
                  <option value="irrigation">Irrigation</option>
                  <option value="pesticide">Pesticide</option>
                  <option value="other">Other</option>
                </select>

                {/* 🔥 SHOP SELECT */}
                <select
                  name="shop"
                  value={form.shop || ""}
                  onChange={handleChange}
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

            <div className="modal-actions">
              <button className="btn-cancel" onClick={onClose}>
                Cancel
              </button>

              {editingTxn && (
                <button className="btn-danger" onClick={deleteTxn}>
                  Delete
                </button>
              )}

              <button className="btn-primary" onClick={submit}>
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
