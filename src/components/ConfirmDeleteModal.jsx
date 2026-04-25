import React, { useEffect } from "react";
import { X, AlertTriangle, Trash2 } from "lucide-react";

const ConfirmDeleteModal = ({ title, message, onCancel, onConfirm }) => {
  /* ===== PREVENT BACKGROUND SCROLL ===== */
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "auto");
  }, []);

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-[#0f172a] w-full max-w-sm rounded-xl border border-white/10 shadow-xl flex flex-col">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-red-400">
            <AlertTriangle size={18} /> {title || "Confirm Delete"}
          </h2>

          <button onClick={onCancel} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 text-center">
          <p className="text-sm text-gray-400">
            {message || "Are you sure you want to delete this item?"}
          </p>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-sm flex items-center gap-2"
          >
            <Trash2 size={14} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
