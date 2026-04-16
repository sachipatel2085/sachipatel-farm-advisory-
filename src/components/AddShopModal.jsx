import { useState } from "react";
import api from "../api/axios";
import "../styles/modal.css";

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

      onSuccess(); // reload shops
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to add shop");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Add Shop</h2>

        <input
          name="name"
          placeholder="Shop Name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          name="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
        />

        <input
          name="address"
          placeholder="Address"
          value={form.address}
          onChange={handleChange}
        />

        <input
          name="openingBalance"
          placeholder="Opening Udhar (₹)"
          type="number"
          value={form.openingBalance}
          onChange={handleChange}
        />

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>

          <button className="btn btn-primary" onClick={handleSubmit}>
            Add Shop
          </button>
        </div>
      </div>
    </div>
  );
}
