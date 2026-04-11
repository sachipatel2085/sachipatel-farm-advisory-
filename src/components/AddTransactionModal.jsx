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
  const [mode, setMode] = useState(editingTxn?.type || null);

  useEffect(() => {
    if (isOpen) {
      setMode(null);
      setForm({
        title: "",
        quantity: "",
        price: "",
        amount: "",
        category: "seed",
        note: "",
        date: new Date().toISOString().split("T")[0],
      });
    }
  }, [isOpen]);

  const [form, setForm] = useState(
    editingTxn || {
      title: "",
      quantity: "",
      price: "",
      amount: "",
      category: "seed",
    },
  );

  if (!crop) return null;

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };

    // Auto calculate income
    if (mode === "income") {
      const qty = Number(updated.quantity || 0);
      const price = Number(updated.price || 0);
      updated.amount = qty * price;
    }

    setForm(updated);
  };

  const deleteTxn = async () => {
    await api.delete(`/crops/${crop._id}/transaction/${editingTxn._id}`);
    onSuccess();
    onClose();
  };
  const submit = async () => {
    if (editingTxn) {
      await api.put(`/crops/${crop._id}/transaction/${editingTxn._id}`, {
        ...form,
        type: mode,
      });
      setMode(null);
    } else {
      await api.post(`/crops/${crop._id}/transaction`, {
        ...form,
        type: mode,
      });
      setMode(null);
    }

    onSuccess();
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        {/* STEP 1 — SELECT TYPE */}
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
          </div>
        )}

        {/* STEP 2 — SHOW FORM */}
        {mode && (
          <>
            <h3>{mode === "income" ? "Add Income" : "Add Expense"}</h3>

            <input name="title" placeholder="Title" onChange={handleChange} />

            {mode === "income" && (
              <>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity (kg)"
                  onChange={handleChange}
                />

                <input
                  type="number"
                  name="price"
                  placeholder="Price per kg"
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
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />
                <input
                  type="number"
                  name="amount"
                  placeholder="Amount"
                  onChange={handleChange}
                />

                <select name="category" onChange={handleChange}>
                  <option value="seed">Seed</option>
                  <option value="fertilizer">Fertilizer</option>
                  <option value="labor">Labor</option>
                  <option value="irrigation">Irrigation</option>
                  <option value="pesticide">Pesticide</option>
                  <option value="other">Other</option>
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
