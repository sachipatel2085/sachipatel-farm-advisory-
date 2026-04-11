import React from "react";
import "../styles/EditFarmModal.css"; // reuse modal styles

const ConfirmDeleteModal = ({ title, message, onCancel, onConfirm }) => {
  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{title || "Confirm Delete"}</h2>

        <p style={{ textAlign: "center", marginBottom: "20px", color: "#555" }}>
          {message || "Are you sure you want to delete this item?"}
        </p>

        <div className="modal-buttons">
          <button className="cancel" onClick={onCancel}>
            Cancel
          </button>
          <button
            className="save"
            onClick={onConfirm}
            style={{ background: "#e74c3c" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
