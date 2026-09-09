import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";
import { TrendingUp, Calendar, AlertCircle } from "lucide-react";
import mandiService from "../../services/mandiService";

export default function PriceTrendChart({ initialCrop = "Wheat", initialMarket = "", commodities = [] }) {
  const [crop, setCrop] = useState(initialCrop);
  const [market, setMarket] = useState(initialMarket);
  const [days, setDays] = useState(14);
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState([]);
  const [stats, setStats] = useState({ min: 0, max: 0, current: 0, change: 0 });

  useEffect(() => {
    if (initialCrop) setCrop(initialCrop);
    if (initialMarket) setMarket(initialMarket);
  }, [initialCrop, initialMarket]);

  useEffect(() => {
    let isMounted = true;

    async function loadTrends() {
      if (!crop) return;
      setLoading(true);
      try {
        const data = await mandiService.getTrends(crop, market, days);
        if (isMounted) {
          const list = data.trends || [];
          setTrendData(list);

          if (list.length > 0) {
            const allModal = list.map((t) => t.modalPrice);
            const min = Math.min(...allModal);
            const max = Math.max(...allModal);
            const current = list[list.length - 1].modalPrice;
            const initial = list[0].modalPrice;
            setStats({
              min,
              max,
              current,
              change: current - initial,
            });
          }
        }
      } catch (err) {
        console.error("Failed to load trends:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadTrends();

    return () => {
      isMounted = false;
    };
  }, [crop, market, days]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl text-xs space-y-1">
          <div className="font-semibold text-slate-200 border-b border-slate-700 pb-1">
            {data.label} ({data.date})
          </div>
          <div className="text-emerald-400 font-bold text-sm">
            Modal Rate: ₹{data.modalPrice?.toLocaleString("en-IN")} / Qtl
          </div>
          <div className="text-slate-400">
            Min: ₹{data.minPrice?.toLocaleString("en-IN")} | Max: ₹{data.maxPrice?.toLocaleString("en-IN")}
          </div>
          {data.activeMarkets && (
            <div className="text-slate-500 text-[10px]">
              Active mandis sampled: {data.activeMarkets}
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-slate-800/90 border border-slate-700/80 rounded-xl p-5 shadow-lg space-y-5">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <TrendingUp className="text-emerald-400" size={22} />
            Mandi Price Trends & Volatility
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Historical prevailing auction rates (₹/Quintal) over time
          </p>
        </div>

        {/* Filters & Range Switcher */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Commodity selector */}
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
            className="px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-emerald-500"
          >
            {commodities.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>

          {/* Time range buttons */}
          <div className="flex items-center bg-slate-900 border border-slate-700 rounded-lg p-0.5 text-xs font-semibold">
            {[7, 14, 30].map((d) => (
              <button
                key={d}
                onClick={() => setDays(d)}
                className={`px-3 py-1 rounded-md transition-colors ${
                  days === d
                    ? "bg-emerald-500 text-slate-950 shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {d}D
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Metric summary pills */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-3">
          <div className="text-[11px] text-slate-400">Current Rate</div>
          <div className="text-lg font-bold text-emerald-400 mt-0.5">
            ₹{stats.current?.toLocaleString("en-IN") || 0}
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-3">
          <div className="text-[11px] text-slate-400">Period Low</div>
          <div className="text-lg font-bold text-slate-300 mt-0.5">
            ₹{stats.min?.toLocaleString("en-IN") || 0}
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-3">
          <div className="text-[11px] text-slate-400">Period High</div>
          <div className="text-lg font-bold text-slate-300 mt-0.5">
            ₹{stats.max?.toLocaleString("en-IN") || 0}
          </div>
        </div>

        <div className="bg-slate-900/70 border border-slate-700/50 rounded-lg p-3">
          <div className="text-[11px] text-slate-400">Net {days}-Day Shift</div>
          <div
            className={`text-lg font-bold mt-0.5 ${
              stats.change > 0
                ? "text-emerald-400"
                : stats.change < 0
                ? "text-rose-400"
                : "text-slate-300"
            }`}
          >
            {stats.change > 0 ? `+₹${stats.change}` : stats.change < 0 ? `-₹${Math.abs(stats.change)}` : "₹0"}
          </div>
        </div>
      </div>

      {/* Chart container */}
      <div className="h-72 w-full pt-2">
        {loading ? (
          <div className="h-full flex items-center justify-center text-sm text-slate-400">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
              <span>Loading trend records...</span>
            </div>
          </div>
        ) : trendData.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-slate-400 text-sm">
            <AlertCircle size={28} className="text-slate-500 mb-1" />
            <p>No price records available for {crop} over this period.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="modalRateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="maxRateGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#38bdf8" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.4} />
              <XAxis
                dataKey="label"
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickLine={false}
              />
              <YAxis
                stroke="#64748b"
                tick={{ fill: "#94a3b8", fontSize: 11 }}
                tickFormatter={(val) => `₹${val}`}
                domain={["auto", "auto"]}
                tickLine={false}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                height={32}
                wrapperStyle={{ fontSize: "12px", paddingBottom: "8px" }}
              />
              <Area
                type="monotone"
                dataKey="maxPrice"
                name="Max Rate"
                stroke="#38bdf8"
                strokeWidth={1.5}
                strokeDasharray="4 4"
                fillOpacity={1}
                fill="url(#maxRateGrad)"
              />
              <Area
                type="monotone"
                dataKey="modalPrice"
                name="Modal (Prevailing) Rate"
                stroke="#10b981"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#modalRateGrad)"
              />
              <Area
                type="monotone"
                dataKey="minPrice"
                name="Min Rate"
                stroke="#64748b"
                strokeWidth={1}
                fillOpacity={0}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
