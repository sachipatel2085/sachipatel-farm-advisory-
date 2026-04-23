import React from "react";

const ConfirmDeleteModal = ({ title, message, onCancel, onConfirm }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-sm bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl text-center">
        {/* TITLE */}
        <h2 className="text-lg font-semibold text-red-400">
          {title || "Confirm Delete"}
        </h2>

        {/* MESSAGE */}
        <p className="text-sm text-gray-400">
          {message || "Are you sure you want to delete this item?"}
        </p>

        {/* ACTIONS */}
        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
