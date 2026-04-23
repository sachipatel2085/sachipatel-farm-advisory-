import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Breadcrumb from "../components/Breadcrumb";
import {
  Wheat,
  MapPin,
  Sprout,
  Calendar,
  Wallet,
  TrendingUp,
} from "lucide-react";
import CropList from "../components/CropList";

const FarmDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [farm, setFarm] = useState(null);
  const [history, setHistory] = useState([]);

  const [seasonFilter, setSeasonFilter] = useState("");
  const [cropFilter, setCropFilter] = useState("");
  const [sortType, setSortType] = useState("profitDesc");
  const [showHistoryFilters, setShowHistoryFilters] = useState(false);

  useEffect(() => {
    loadFarm();
    loadAnalytics();
    loadHistory();
  }, [id]);

  const loadFarm = async () => {
    const res = await api.get(`/farms/${id}`);
    setFarm(res.data);
  };

  const loadAnalytics = async () => {
    const res = await api.get(`/farms/${id}/analytics`);
    setAnalytics(res.data);
  };

  const loadHistory = async () => {
    const res = await api.get(`/farms/${id}/history`);
    setHistory(res.data);
  };

  const processedHistory = history
    .filter(
      (h) =>
        (!seasonFilter || h.season === seasonFilter) &&
        (!cropFilter || h.cropName === cropFilter),
    )
    .sort((a, b) => {
      if (sortType === "profitDesc") return b.profit - a.profit;
      if (sortType === "profitAsc") return a.profit - b.profit;
      return 0;
    });

  if (!farm)
    return <p className="text-center text-gray-400 mt-10">Loading...</p>;

  return (
    <div className="space-y-6 text-slate-200">
      <Breadcrumb currentName={farm.farmName} />
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-green-400 hover:underline"
      >
        ← Back
      </button>
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Wheat size={18} /> {farm.farmName}
          </h2>

          <p className="text-sm text-gray-400 flex items-center gap-1">
            <MapPin size={14} />
            {farm.location?.village}, {farm.location?.district}
          </p>
        </div>

        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs">
          Active
        </span>
      </div>
      {/* ANALYTICS */}
      {analytics && (
        <>
          <div className="grid sm:grid-cols-3 gap-4">
            <Stat title="Total Crops" value={analytics.totalCrops} />
            <Stat title="Farm Health" value={`${analytics.avgHealth}%`} />
            <Stat title="Total Yield" value={`${analytics.totalYield} kg`} />
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <Stat title="Income" value={`₹ ${analytics.totalIncome}`} green />
            <Stat title="Expense" value={`₹ ${analytics.totalExpense}`} red />
            <Stat title="Profit" value={`₹ ${analytics.profit}`} green />
          </div>

          {/* PROGRESS */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4">
            <div className="flex justify-between text-sm text-gray-400 mb-1">
              <span>Farm Health</span>
              <span>{analytics.avgHealth}%</span>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: `${analytics.avgHealth}%` }}
              />
            </div>
          </div>
        </>
      )}
      {/* EXTRA INFO */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Stat title="Water Usage" value="1200L" />
        <Stat title="Sunlight" value="Good" />
        <Stat title="Status" value="Active" />
      </div>
      {/* CROPS */}
      <CropList farmId={id} />
      {/* HISTORY */}
      {/* HISTORY */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-4">
        {/* HEADER */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h3 className="font-semibold">📜 Farm History</h3>

          <button
            onClick={() => setShowHistoryFilters(!showHistoryFilters)}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
          >
            ⚙️ Filters
          </button>
        </div>

        {/* FILTER PANEL (same as CropList) */}
        {showHistoryFilters && (
          <div className="bg-white/5 border border-white/10 p-4 rounded-xl grid sm:grid-cols-3 gap-3">
            {/* SEASON */}
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
            >
              <option value="">All Seasons</option>
              {[...new Set(history.map((h) => h.season))].map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>

            {/* CROP */}
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
            >
              <option value="">All Crops</option>
              {[...new Set(history.map((h) => h.cropName))].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            {/* SORT */}
            <select
              value={sortType}
              onChange={(e) => setSortType(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
            >
              <option value="profitDesc">Profit ↓</option>
              <option value="profitAsc">Profit ↑</option>
            </select>
          </div>
        )}

        {/* HISTORY GRID */}
        <div className="grid md:grid-cols-2 gap-4">
          {processedHistory.map((h) => (
            <div
              key={h.cropId}
              className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-1"
            >
              <p className="font-medium flex items-center gap-1">
                <Sprout size={14} /> {h.cropName} ({h.season})
              </p>

              <p className="text-sm text-gray-400 flex items-center gap-1">
                <Calendar size={14} />
                {new Date(h.sowingDate).toLocaleDateString()}
              </p>

              <p className="text-sm">🌾 {h.production} kg</p>

              <p className="text-sm">₹ Income: {h.income}</p>
              <p className="text-sm">₹ Expense: {h.expense}</p>

              <p
                className={`text-sm font-medium flex items-center gap-1 ${
                  h.profit >= 0 ? "text-green-400" : "text-red-400"
                }`}
              >
                <TrendingUp size={14} /> ₹ {h.profit}
              </p>
            </div>
          ))}
        </div>
      </div>{" "}
    </div>
  );
};

const Stat = ({ title, value, green, red }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
    <p className="text-sm text-gray-400">{title}</p>
    <h2
      className={`text-lg font-semibold ${
        green ? "text-green-400" : red ? "text-red-400" : ""
      }`}
    >
      {value}
    </h2>
  </div>
);

export default FarmDetails;
