import React from "react";
import api from "../api/axios";
import "../styles/modal.css";

const DeleteConfirmModal = ({ isOpen, crop, onClose, onSuccess }) => {
  const deleteCrop = async () => {
    try {
      await api.delete(`/crops/${crop._id}`);
      onSuccess();
      onClose();
    } catch {
      alert("Failed to delete crop");
    }
  };

  if (!isOpen || !crop) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-box">
        <h3>Delete Crop</h3>
        <p>
          Are you sure you want to delete <b>{crop.cropName}</b>?
        </p>

        <div className="modal-actions">
          <button onClick={onClose} className="btn-cancel">
            Cancel
          </button>
          <button onClick={deleteCrop} className="btn-danger">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
