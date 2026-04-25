import React, { useEffect } from "react";
import api from "../api/axios";
import { X, AlertTriangle, Trash2 } from "lucide-react";

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

  /* ===== PREVENT BACKGROUND SCROLL ===== */
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, [isOpen]);

  if (!isOpen || !crop) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-[#0f172a] w-full max-w-sm rounded-xl border border-white/10 shadow-xl flex flex-col">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <h3 className="flex items-center gap-2 text-lg font-semibold text-red-400">
            <AlertTriangle size={18} /> Delete Crop
          </h3>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 text-center">
          <p className="text-sm text-gray-400">
            Are you sure you want to delete{" "}
            <span className="text-white font-medium">{crop.cropName}</span>?
          </p>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={deleteCrop}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-sm flex items-center gap-2"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmModal;
