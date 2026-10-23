import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Breadcrumb from "../components/Breadcrumb";
import EditFarmModal from "../components/EditFarmModal";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import {
  Wheat,
  MapPin,
  Sprout,
  Calendar,
  Wallet,
  TrendingUp,
  Pencil,
  Trash2,
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
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  useEffect(() => {
    loadFarm();
    loadAnalytics();
    loadHistory();
  }, [id]);

  const loadFarm = async () => {
    const res = await api.get(`/farms/${id}`).catch((err) => console.error("Load farm error:", err));
    if (!res) return;
    setFarm(res.data);
  };

  const loadAnalytics = async () => {
    const res = await api.get(`/farms/${id}/analytics`).catch((err) => console.error("Load analytics error:", err));
    if (!res) return;
    setAnalytics(res.data);
  };

  const loadHistory = async () => {
    const res = await api.get(`/farms/${id}/history`).catch((err) => console.error("Load history error:", err));
    if (!res) return;
    setHistory(res.data);
  };
  const handleDelete = async () => {
    try {
      await api.delete(`/farms/${id}`);
      navigate("/farms"); // redirect after delete
    } catch (err) {
      console.error(err);
    }
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

  if (!farm) {
    return (
      <div className="space-y-6 animate-pulse text-slate-200">
        <div className="h-6 w-40 bg-white/10 rounded"></div>

        {/* HEADER */}
        <div className="flex justify-between">
          <div className="space-y-2">
            <div className="h-5 w-48 bg-white/10 rounded"></div>
            <div className="h-4 w-32 bg-white/10 rounded"></div>
          </div>
          <div className="h-6 w-16 bg-white/10 rounded-full"></div>
        </div>

        {/* STATS */}
        <div className="grid sm:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="h-20 bg-white/10 rounded-xl border border-white/10"
            />
          ))}
        </div>

        {/* HISTORY */}
        <div className="grid md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="h-32 bg-white/10 rounded-xl border border-white/10"
            />
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-4 sm:space-y-6 text-slate-200 w-full min-w-0">
      <Breadcrumb currentName={farm.farmName} />
      <button
        onClick={() => navigate(-1)}
        className="text-xs sm:text-sm text-green-400 hover:underline"
      >
        ← Back
      </button>
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-lg sm:text-xl font-semibold">
            <Wheat size={20} className="text-emerald-400 shrink-0" /> {farm.farmName}
          </h2>

          <p className="text-xs sm:text-sm text-gray-400 flex items-center gap-1 mt-0.5">
            <MapPin size={14} className="shrink-0" />
            {farm.location?.village}, {farm.location?.district}
          </p>
        </div>

        <span className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-xs font-medium">
          Active
        </span>
      </div>
      {/* ANALYTICS */}
      {analytics && (
        <div className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Stat title="Total Crops" value={analytics.totalCrops} />
            <Stat title="Farm Health" value={`${analytics.avgHealth}%`} />
            <Stat title="Total Yield" value={`${analytics.totalYield} kg`} />
          </div>

          <div className="grid grid-cols-3 gap-2 sm:gap-4">
            <Stat title="Income" value={`₹${analytics.totalIncome}`} green />
            <Stat title="Expense" value={`₹${analytics.totalExpense}`} red />
            <Stat title="Profit" value={`₹${analytics.profit}`} green />
          </div>

          {/* PROGRESS */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 sm:p-4">
            <div className="flex justify-between text-xs sm:text-sm text-gray-400 mb-1.5">
              <span>Farm Health Index</span>
              <span className="font-semibold text-emerald-400">{analytics.avgHealth}%</span>
            </div>

            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-500"
                style={{ width: `${analytics.avgHealth}%` }}
              />
            </div>
          </div>
        </div>
      )}
      {/* EXTRA INFO */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Stat title="Water Usage" value="1200L" />
        <Stat title="Sunlight" value="Good" />
        <Stat title="Status" value="Active" />
      </div>
      {/* CROPS */}
      <CropList farmId={farm?._id || id} />
      {/* HISTORY */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-3.5 sm:p-5 space-y-4">
        {/* HEADER */}
        <div className="flex justify-between items-center flex-wrap gap-2">
          <h3 className="font-semibold text-sm sm:text-base flex items-center gap-1.5">
            <span>📜</span> Farm History
          </h3>

          <button
            onClick={() => setShowHistoryFilters(!showHistoryFilters)}
            className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded-lg text-xs sm:text-sm font-medium"
          >
            ⚙️ Filters
          </button>
        </div>

        {/* FILTER PANEL */}
        {showHistoryFilters && (
          <div className="bg-white/5 border border-white/10 p-3 sm:p-4 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {/* SEASON */}
            <select
              value={seasonFilter}
              onChange={(e) => setSeasonFilter(e.target.value)}
              className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-xs sm:text-sm text-gray-200"
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
              className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-xs sm:text-sm text-gray-200"
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
              className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10 text-xs sm:text-sm text-gray-200"
            >
              <option value="profitDesc">Profit (High → Low)</option>
              <option value="profitAsc">Profit (Low → High)</option>
            </select>
          </div>
        )}

        {/* HISTORY GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          {processedHistory.map((h) => (
            <div
              key={h.cropId}
              className="bg-white/5 border border-white/10 rounded-xl p-3.5 sm:p-4 space-y-1.5"
            >
              <div className="flex justify-between items-center">
                <p className="font-semibold text-sm sm:text-base flex items-center gap-1.5 text-white">
                  <Sprout size={16} className="text-emerald-400 shrink-0" /> {h.cropName} ({h.season})
                </p>
                <p
                  className={`text-xs sm:text-sm font-semibold flex items-center gap-1 ${
                    h.profit >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  <TrendingUp size={14} /> ₹{h.profit}
                </p>
              </div>

              <p className="text-xs text-gray-400 flex items-center gap-1">
                <Calendar size={13} />
                {new Date(h.sowingDate).toLocaleDateString()}
              </p>

              <div className="grid grid-cols-3 gap-1 pt-1 border-t border-white/5 text-xs text-slate-300">
                <div>
                  <span className="text-[10px] text-gray-400 block">Yield</span>
                  <span className="font-medium">{h.production} kg</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Income</span>
                  <span className="font-medium text-emerald-400">₹{h.income}</span>
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 block">Expense</span>
                  <span className="font-medium text-rose-400">₹{h.expense}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={() => setShowEdit(true)}
          className="flex-1 sm:flex-initial justify-center px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-xs sm:text-sm flex items-center gap-2 font-medium transition"
        >
          <Pencil size={15} /> Edit Farm
        </button>

        <button
          onClick={() => setShowDelete(true)}
          className="flex-1 sm:flex-initial justify-center px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-xs sm:text-sm flex items-center gap-2 font-medium transition"
        >
          <Trash2 size={15} /> Delete Farm
        </button>
      </div>

      {showEdit && (
        <EditFarmModal
          farm={farm}
          onClose={() => setShowEdit(false)}
          onUpdated={() => {
            loadFarm();
            setShowEdit(false);
          }}
        />
      )}
      {showDelete && (
        <ConfirmDeleteModal
          title="Delete Farm"
          message="This farm will be permanently removed."
          onCancel={() => setShowDelete(false)}
          onConfirm={handleDelete}
        />
      )}
    </div>
  );
};

const Stat = ({ title, value, green, red }) => (
  <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 sm:p-4 text-center sm:text-left flex flex-col justify-center">
    <p className="text-[11px] sm:text-xs text-gray-400 truncate">{title}</p>
    <h2
      className={`text-sm sm:text-lg font-semibold mt-0.5 truncate ${
        green ? "text-green-400" : red ? "text-red-400" : "text-white"
      }`}
    >
      {value}
    </h2>
  </div>
);

export default FarmDetails;
