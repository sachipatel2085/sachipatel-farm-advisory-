import React from "react";

export default function RoleBadge({ role }) {
  const badgeMap = {
    admin: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    moderator: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    expert: "bg-purple-500/20 text-purple-300 border-purple-500/30",
    farmer: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  };

  const style = badgeMap[role] || badgeMap.farmer;

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border uppercase tracking-wider ${style}`}
    >
      {role || "farmer"}
    </span>
  );
}
