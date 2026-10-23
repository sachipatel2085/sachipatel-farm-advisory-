import React, { useState } from "react";
import { Lock, X } from "lucide-react";
import adminService from "../../services/adminService";

export default function ClaimAdminModal({ isOpen, onClose, onSuccess }) {
  const [claimPasskey, setClaimPasskey] = useState("");
  const [claimLoading, setClaimLoading] = useState(false);
  const [claimMsg, setClaimMsg] = useState("");

  if (!isOpen) return null;

  const handleClaimAdmin = async (e) => {
    e.preventDefault();
    if (!claimPasskey.trim()) return;

    setClaimLoading(true);
    setClaimMsg("");
    try {
      const res = await adminService.claimAdminRole(claimPasskey);
      setClaimMsg("Success: " + res.message);
      if (onSuccess) onSuccess();
      setTimeout(() => {
        onClose();
      }, 1200);
    } catch (err) {
      setClaimMsg("Error: " + (err.response?.data?.message || err.message));
    } finally {
      setClaimLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-[#0f172a] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-6 space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-white/10">
          <h3 className="font-semibold text-white flex items-center gap-2">
            <Lock size={18} className="text-amber-400" />
            Elevate to Platform Admin
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-xs text-gray-300 leading-relaxed">
          Enter the system authorization passkey to instantly upgrade this session to Administrator privileges:
        </p>

        <form onSubmit={handleClaimAdmin} className="space-y-4">
          <div>
            <label className="text-[11px] text-gray-400 block mb-1 font-medium">Admin Passkey</label>
            <input
              type="password"
              placeholder="Enter kisan-admin-2026 or admin"
              value={claimPasskey}
              onChange={(e) => setClaimPasskey(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900 border border-white/10 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-amber-400 font-mono"
            />
            <span className="text-[10px] text-gray-500 mt-1 block">
              Default test passkey: <code className="text-amber-400">kisan-admin-2026</code>
            </span>
          </div>

          {claimMsg && (
            <p
              className={`text-xs ${
                claimMsg.startsWith("Success") ? "text-emerald-400" : "text-rose-400"
              }`}
            >
              {claimMsg}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={claimLoading}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-semibold transition disabled:opacity-50"
            >
              {claimLoading ? "Authorizing..." : "Grant Admin Privileges"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
