import React, { useState, useEffect } from "react";
import api from "../api/axios";
import "../styles/modal.css";

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
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>Edit {form.type === "income" ? "Income" : "Expense"}</h3>

        {form.type === "income" ? (
          <>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Income name"
            />
            <input
              type="date"
              name="date"
              value={form.date?.split("T")[0]}
              onChange={handleChange}
            />

            <input
              type="number"
              name="quantity"
              value={form.quantity || ""}
              placeholder="yield"
              onChange={handleChange}
            />
            <input
              type="number"
              name="price"
              value={form.price || ""}
              placeholder="Price per kilo"
              onChange={handleChange}
            />
            <p>
              <b>Total:</b> ₹ {form.amount}
            </p>
          </>
        ) : (
          <>
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

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Expense Name"
            />

            <input
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
            />
            <input
              type="date"
              name="date"
              value={form.date?.split("T")[0]}
              onChange={handleChange}
            />
          </>
        )}

        <div className="modal-actions">
          <button className="btn-cancel" onClick={onClose}>
            Cancel
          </button>

          <button className="btn-danger" onClick={remove}>
            Delete
          </button>

          <button className="btn-primary" onClick={update}>
            Update
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditTransactionModal;
