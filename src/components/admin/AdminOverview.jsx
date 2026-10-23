import React from "react";
import {
  Users,
  Tractor,
  Sprout,
  ShieldCheck,
  Activity,
  Sliders,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import AdminKpiCard from "./AdminKpiCard";
import RoleBadge from "./RoleBadge";

export default function AdminOverview({
  overview = {},
  loading = false,
  onNavigateToUsers,
  onSelectUserToEdit,
}) {
  const kpis = overview?.kpis || {};
  const monthlyTrends = overview?.monthlyTrends || [];
  const recentUsers = overview?.recentUsers || [];

  return (
    <div className="space-y-6">
      {/* TOP 4 KEY PERFORMANCE INDICATORS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        <AdminKpiCard
          title="Registered Farmers"
          value={loading ? "..." : kpis.totalUsers || 0}
          subtext={`${kpis.farmersCount || 0} active, ${kpis.newUsersWeek || 0} this week`}
          icon={<Users size={20} />}
          accent="emerald"
        />

        <AdminKpiCard
          title="Managed Acreage"
          value={loading ? "..." : `${kpis.totalAcreage || 0} Acres`}
          subtext={`Across ${kpis.totalFarms || 0} registered farm plots`}
          icon={<Tractor size={20} />}
          accent="teal"
        />

        <AdminKpiCard
          title="Growing Batches"
          value={loading ? "..." : kpis.activeCropsCount || 0}
          subtext={`${kpis.harvestedCropsCount || 0} harvested batches`}
          icon={<Sprout size={20} />}
          accent="amber"
        />

        <AdminKpiCard
          title="Discussions Solved"
          value={
            loading
              ? "..."
              : kpis.totalDiscussions > 0
              ? `${Math.round((kpis.solvedDiscussions / kpis.totalDiscussions) * 100)}%`
              : "100%"
          }
          subtext={`${kpis.solvedDiscussions || 0} of ${kpis.totalDiscussions || 0} inquiries`}
          icon={<ShieldCheck size={20} />}
          accent="purple"
        />
      </div>

      {/* CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* MONTHLY REGISTRATIONS CHART */}
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <h3 className="text-base font-semibold text-white flex items-center gap-2">
                <Activity size={18} className="text-emerald-400" />
                Farmer Platform Growth Trend
              </h3>
              <p className="text-xs text-gray-400">Monthly new user accounts over past 6 months</p>
            </div>
            <span className="text-xs px-2.5 py-1 rounded-full bg-white/10 text-slate-300 font-mono">
              Active Growth
            </span>
          </div>

          <div className="h-[240px] w-full pt-2">
            {loading ? (
              <div className="h-full flex items-center justify-center text-xs text-slate-400 animate-pulse">
                Loading growth telemetry...
              </div>
            ) : monthlyTrends.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={monthlyTrends}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="userGrowth" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                  <XAxis dataKey="label" stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} />
                  <YAxis stroke="#64748b" tick={{ fill: "#94a3b8", fontSize: 11 }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#0f172a",
                      borderColor: "#334155",
                      borderRadius: "12px",
                      fontSize: "12px",
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="users"
                    name="New Signups"
                    stroke="#10b981"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#userGrowth)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-xs text-slate-400">
                No historical registrations yet.
              </div>
            )}
          </div>
        </div>

        {/* PLATFORM ROLES BREAKDOWN */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2 mb-1">
              <Sliders size={18} className="text-emerald-400" />
              Ecosystem Governance
            </h3>
            <p className="text-xs text-gray-400">User roles & privileges breakdown</p>
          </div>

          <div className="space-y-3 flex-1 flex flex-col justify-center">
            <RoleProgressBar
              label="Registered Farmers"
              count={kpis.farmersCount || 0}
              total={kpis.totalUsers || 1}
              color="bg-emerald-500"
            />
            <RoleProgressBar
              label="Agronomy Experts"
              count={kpis.expertsCount || 0}
              total={kpis.totalUsers || 1}
              color="bg-purple-500"
            />
            <RoleProgressBar
              label="Field Moderators"
              count={kpis.moderatorsCount || 0}
              total={kpis.totalUsers || 1}
              color="bg-amber-500"
            />
            <RoleProgressBar
              label="System Admins"
              count={kpis.adminsCount || 0}
              total={kpis.totalUsers || 1}
              color="bg-rose-500"
            />
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
            <span>Rules Engine Rules:</span>
            <span className="font-semibold text-white">{kpis.totalAdvisories || 0} Active</span>
          </div>
        </div>
      </div>

      {/* RECENT USERS TABLE */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div>
            <h3 className="text-base font-semibold text-white flex items-center gap-2">
              <Users size={18} className="text-emerald-400" />
              Recently Joined Farmers
            </h3>
            <p className="text-xs text-gray-400">Latest accounts registered on the advisory platform</p>
          </div>
          {onNavigateToUsers && (
            <button
              onClick={onNavigateToUsers}
              className="text-xs text-emerald-400 hover:underline flex items-center gap-1 font-medium"
            >
              View All Users ({kpis.totalUsers || 0}) →
            </button>
          )}
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-white/10 text-gray-400">
                <th className="pb-3 font-medium">Farmer</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium">Location</th>
                <th className="pb-3 font-medium">Farms / Crops</th>
                <th className="pb-3 font-medium">Role</th>
                <th className="pb-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-6 text-center text-gray-400">
                    No recent farmer signups recorded yet.
                  </td>
                </tr>
              ) : (
                recentUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-white/[0.02] transition">
                    <td className="py-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-bold text-xs uppercase shrink-0">
                          {u.name?.charAt(0) || "U"}
                        </div>
                        <div>
                          <p className="font-medium text-white">{u.name}</p>
                          <p className="text-[10px] text-gray-400">
                            {new Date(u.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-slate-300">
                      <p>{u.phone || u.email || "—"}</p>
                    </td>
                    <td className="py-3 text-gray-400">
                      {u.location?.district || u.location?.village || "India"}
                    </td>
                    <td className="py-3">
                      <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                        🏡 {u.farmCount} | 🌾 {u.cropCount}
                      </span>
                    </td>
                    <td className="py-3">
                      <RoleBadge role={u.role} />
                    </td>
                    <td className="py-3 text-right">
                      {onSelectUserToEdit && (
                        <button
                          onClick={() => onSelectUserToEdit(u)}
                          className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-gray-300 hover:text-white transition font-medium"
                        >
                          Change Role
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ROLE PROGRESS BAR HELPER */
function RoleProgressBar({ label, count, total, color = "bg-emerald-500" }) {
  const pct = Math.min(100, Math.round((count / total) * 100));

  return (
    <div className="space-y-1 text-xs">
      <div className="flex justify-between text-gray-300">
        <span>{label}</span>
        <span className="font-semibold text-white">
          {count} ({pct}%)
        </span>
      </div>
      <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
        <div
          className={`h-full ${color} rounded-full transition-all duration-500`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
