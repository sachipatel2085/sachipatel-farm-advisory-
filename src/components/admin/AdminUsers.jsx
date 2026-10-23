import React, { useState, useEffect } from "react";
import { Search, Trash2, UserCheck, X } from "lucide-react";
import adminService from "../../services/adminService";
import RoleBadge from "./RoleBadge";

export default function AdminUsers({
  selectedUserToEdit: externalSelectedUser,
  setSelectedUserToEdit: externalSetSelectedUser,
  onUserUpdated,
}) {
  const [usersData, setUsersData] = useState({ users: [], pagination: {} });
  const [usersLoading, setUsersLoading] = useState(false);
  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState("all");
  const [userPage, setUserPage] = useState(1);

  // Modal states
  const [internalSelectedUserToEdit, setInternalSelectedUserToEdit] = useState(null);
  const selectedUserToEdit = externalSelectedUser !== undefined ? externalSelectedUser : internalSelectedUserToEdit;
  const setSelectedUserToEdit = externalSetSelectedUser || setInternalSelectedUserToEdit;

  const [selectedUserToDelete, setSelectedUserToDelete] = useState(null);
  const [editRoleValue, setEditRoleValue] = useState("farmer");

  // Fetch Users
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const data = await adminService.getUsers({
        search: userSearch,
        role: userRoleFilter,
        page: userPage,
        limit: 10,
      });
      setUsersData(data || { users: [], pagination: {} });
    } catch (err) {
      console.error("Fetch users error:", err);
    } finally {
      setUsersLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userRoleFilter, userPage]);

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchUsers();
    }, 350);
    return () => clearTimeout(timer);
  }, [userSearch]);

  // Handle Update Role
  const handleUpdateRole = async () => {
    if (!selectedUserToEdit) return;
    try {
      await adminService.updateUserRole(selectedUserToEdit._id, editRoleValue);
      setSelectedUserToEdit(null);
      fetchUsers();
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      alert("Role update failed: " + (err.response?.data?.message || err.message));
    }
  };

  // Handle Delete User
  const handleDeleteUser = async () => {
    if (!selectedUserToDelete) return;
    try {
      await adminService.deleteUser(selectedUserToDelete._id);
      setSelectedUserToDelete(null);
      fetchUsers();
      if (onUserUpdated) onUserUpdated();
    } catch (err) {
      alert("Delete failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      {/* SEARCH & FILTERS TOOLBAR */}
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search user by name, phone, email, district..."
              value={userSearch}
              onChange={(e) => {
                setUserSearch(e.target.value);
                setUserPage(1);
              }}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-white/10 rounded-xl text-xs sm:text-sm text-gray-200 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Role filter buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
            {["all", "farmer", "expert", "moderator", "admin"].map((r) => (
              <button
                key={r}
                onClick={() => {
                  setUserRoleFilter(r);
                  setUserPage(1);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition capitalize shrink-0 ${
                  userRoleFilter === r
                    ? "bg-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* USERS TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h3 className="text-sm sm:text-base font-semibold text-white">
            Platform Accounts ({usersData?.pagination?.total || 0})
          </h3>
          <p className="text-xs text-gray-400">
            Page {usersData?.pagination?.page || 1} of {usersData?.pagination?.pages || 1}
          </p>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="pb-3 font-medium">User Profile</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Holdings</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {usersLoading ? (
                [...Array(6)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={6} className="py-3">
                      <div className="h-8 bg-white/5 rounded-lg" />
                    </td>
                  </tr>
                ))
              ) : usersData?.users?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-400">
                    No users match the search and filter criteria.
                  </td>
                </tr>
              ) : (
                usersData?.users?.map((u) => (
                  <tr key={u._id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {u.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-semibold text-white text-xs sm:text-sm">{u.name}</p>
                          <p className="text-[10px] text-gray-400 font-mono">
                            ID: {u._id?.substring(u._id.length - 6)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">
                      <p>{u.phone || u.email || "—"}</p>
                    </td>
                    <td className="py-3 text-gray-400">
                      {u.location?.district || u.location?.village || "—"}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        🏡 {u.farmCount} farms • 🌾 {u.cropCount} crops
                      </span>
                    </td>
                    <td className="py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => {
                            setSelectedUserToEdit(u);
                            setEditRoleValue(u.role);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-[11px] font-medium transition"
                        >
                          Edit Role
                        </button>
                        <button
                          onClick={() => setSelectedUserToDelete(u)}
                          disabled={u.role === "admin"}
                          className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-[11px] transition disabled:opacity-30"
                          title="Delete User"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {usersData?.pagination?.pages > 1 && (
          <div className="flex items-center justify-between pt-3 border-t border-white/5 text-xs text-gray-400">
            <button
              onClick={() => setUserPage((p) => Math.max(1, p - 1))}
              disabled={userPage <= 1}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 transition"
            >
              ← Previous
            </button>
            <span>
              Page {userPage} of {usersData.pagination.pages}
            </span>
            <button
              onClick={() => setUserPage((p) => Math.min(usersData.pagination.pages, p + 1))}
              disabled={userPage >= usersData.pagination.pages}
              className="px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-40 transition"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {/* CHANGE USER ROLE MODAL */}
      {selectedUserToEdit && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-[#0f172a] w-full max-w-md rounded-2xl border border-white/10 shadow-2xl p-5 sm:p-6 space-y-4">
            <div className="flex justify-between items-center pb-2 border-b border-white/10">
              <h3 className="font-semibold text-white flex items-center gap-2">
                <UserCheck size={18} className="text-emerald-400" />
                Change User Role: {selectedUserToEdit.name}
              </h3>
              <button onClick={() => setSelectedUserToEdit(null)} className="text-gray-400 hover:text-white">
                <X size={18} />
              </button>
            </div>

            <p className="text-xs text-gray-300">
              Select the new security and access tier for this account:
            </p>

            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { role: "farmer", label: "Farmer", desc: "Standard farm & crop access" },
                { role: "expert", label: "Agronomy Expert", desc: "Can post verified solutions" },
                { role: "moderator", label: "Moderator", desc: "Can moderate discussions" },
                { role: "admin", label: "System Admin", desc: "Full administrative governance" },
              ].map((opt) => (
                <div
                  key={opt.role}
                  onClick={() => setEditRoleValue(opt.role)}
                  className={`p-3 rounded-xl border cursor-pointer transition ${
                    editRoleValue === opt.role
                      ? "bg-emerald-600/20 border-emerald-500 text-white"
                      : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
                  }`}
                >
                  <p className="font-semibold">{opt.label}</p>
                  <p className="text-[10px] mt-0.5 opacity-80">{opt.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUserToEdit(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateRole}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition"
              >
                Save Role
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE USER MODAL */}
      {selectedUserToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-3">
          <div className="bg-[#0f172a] w-full max-w-sm rounded-2xl border border-rose-500/30 shadow-2xl p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-full bg-rose-500/20 text-rose-400">
                <Trash2 size={20} />
              </div>
              <div>
                <h4 className="font-semibold text-white text-sm">Delete Account?</h4>
                <p className="text-xs text-gray-400">User: {selectedUserToDelete.name}</p>
              </div>
            </div>

            <p className="text-xs text-rose-200/80 leading-relaxed">
              This action permanently deletes the user account. This cannot be undone.
            </p>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setSelectedUserToDelete(null)}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-medium text-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteUser}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold transition"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
