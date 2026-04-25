import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import {
  Tractor,
  Leaf,
  IndianRupee,
  LineChart,
  Wheat,
  Plus,
  TrendingUp,
  Clock,
} from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    farms: 0,
    crops: 0,
    revenue: 0,
    growth: 0,
  });
  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [farmsRes, cropsRes, financeRes] = await Promise.all([
        api.get("/farms"),
        api.get("/crops"),
        api.get("/finance/summary"),
      ]);

      const farms = farmsRes.data;
      const crops = cropsRes.data;
      const finance = financeRes.data;

      // active crops only
      const activeCrops = crops.filter((c) => c.status === "active");

      // simple growth logic (you can improve later)
      const growth =
        finance.income > 0
          ? Math.round((finance.profit / finance.income) * 100)
          : 0;

      setStats({
        farms: farms.length,
        crops: activeCrops.length,
        revenue: finance.income || 0,
        growth,
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    loadDashboard();

    if (!token) navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen p-6 sm:p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-slate-200">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl sm:text-3xl font-semibold">
            <Wheat size={22} /> Farm Dashboard
          </h1>
          <p className="opacity-70 mt-1 text-sm">
            Welcome back! Here's your farm overview
          </p>
        </div>

        {/* QUICK ACTION */}
        <button
          onClick={() => navigate("/farms")}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm"
        >
          <Plus size={16} /> Add Farm
        </button>
      </div>

      {/* STATS */}
      <div className="grid gap-5 mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title="Total Farms"
          value={loading ? "..." : stats.farms}
          icon={<Tractor />}
        />

        <Card
          title="Active Crops"
          value={loading ? "..." : stats.crops}
          icon={<Leaf />}
        />

        <Card
          title="Revenue"
          value={loading ? "..." : `₹${stats.revenue}`}
          icon={<IndianRupee />}
        />

        <Card
          title="Growth"
          value={loading ? "..." : `${stats.growth}%`}
          icon={<TrendingUp />}
        />
      </div>
      {/* ANALYTICS + ACTIVITY */}
      <div className="grid lg:grid-cols-3 gap-6 mt-10">
        {/* LEFT SIDE (ANALYTICS) */}
        <div className="lg:col-span-2 space-y-5">
          {/* MINI ANALYTICS */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
              <LineChart size={18} /> Farm Performance
            </h2>

            {/* PROGRESS BAR */}
            <Progress label="Crop Growth" value={70} />
            <Progress label="Water Usage" value={50} />
            <Progress label="Soil Health" value={80} />
          </div>

          {/* PLACEHOLDER CHART */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 h-[220px] flex items-center justify-center opacity-60">
            Charts coming soon...
          </div>
        </div>

        {/* RIGHT SIDE (ACTIVITY) */}
        <div className="bg-white/5 border border-white/10 rounded-xl p-5">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <Clock size={18} /> Recent Activity
          </h2>

          <div className="space-y-4 text-sm">
            <ActivityItem text="Added new crop: Tomato" time="2h ago" />
            <ActivityItem text="Expense added ₹1200" time="5h ago" />
            <ActivityItem text="Harvest completed" time="1 day ago" />
          </div>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="grid sm:grid-cols-3 gap-5 mt-10">
        <QuickCard title="Manage Farms" onClick={() => navigate("/farms")} />
        <QuickCard title="View Crops" onClick={() => navigate("/crops")} />
        <QuickCard title="Finance" onClick={() => navigate("/finance")} />
      </div>
    </div>
  );
}

/* CARD */
const Card = ({ title, value, icon }) => {
  const isLoading = value === "...";

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-green-500 transition">
      {/* HEADER */}
      <div className="flex items-center gap-3">
        <div className={`text-green-400 ${isLoading ? "opacity-50" : ""}`}>
          {icon}
        </div>

        {isLoading ? (
          <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
        ) : (
          <p className="text-sm text-gray-400">{title}</p>
        )}
      </div>

      {/* VALUE */}
      {isLoading ? (
        <div className="h-6 w-16 bg-white/10 rounded animate-pulse mt-3" />
      ) : (
        <h2 className="text-2xl mt-2 text-green-400 font-semibold">{value}</h2>
      )}
    </div>
  );
};
/* PROGRESS */
const Progress = ({ label, value }) => (
  <div className="mb-4">
    <div className="flex justify-between text-xs text-gray-400">
      <span>{label}</span>
      <span>{value}%</span>
    </div>

    <div className="w-full h-2 bg-white/10 rounded-full mt-1">
      <div
        className="h-full bg-green-500 rounded-full"
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
);

/* ACTIVITY */
const ActivityItem = ({ text, time }) => (
  <div className="flex justify-between text-gray-300">
    <span>{text}</span>
    <span className="text-gray-500 text-xs">{time}</span>
  </div>
);

/* QUICK NAV */
const QuickCard = ({ title, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white/5 border border-white/10 rounded-xl p-5 cursor-pointer hover:border-green-500 transition"
  >
    <p className="font-medium">{title}</p>
    <p className="text-sm text-gray-400 mt-1">Open →</p>
  </div>
);
