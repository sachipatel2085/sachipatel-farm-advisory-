import { useState } from "react";
import api from "../api/axios";
import "../styles/modal.css";

export default function AddPaymentModal({ isOpen, shop, onClose, onSuccess }) {
  const [amount, setAmount] = useState("");

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
    <div className="modal-overlay">
      <div className="modal">
        <h2>Pay to {shop.name}</h2>

        <input
          type="number"
          placeholder="Amount (₹)"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="btn btn-primary" onClick={handleSubmit}>
            Pay
          </button>
        </div>
      </div>
    </div>
  );
}
