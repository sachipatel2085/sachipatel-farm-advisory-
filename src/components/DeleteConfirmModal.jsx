import React from "react";
import api from "../api/axios";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl text-center">
        {/* TITLE */}
        <h3 className="text-lg font-semibold text-red-400">Delete Crop</h3>

        {/* MESSAGE */}
        <p className="text-sm text-gray-400">
          Are you sure you want to delete{" "}
          <span className="text-white font-medium">{crop.cropName}</span>?
        </p>

        {/* ACTIONS */}
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={deleteCrop}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
