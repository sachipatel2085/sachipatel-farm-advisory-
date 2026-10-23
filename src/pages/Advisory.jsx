import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import advisoryService from "../services/advisoryService";
import AdvisoryCard from "../components/advisory/AdvisoryCard";
import Breadcrumb from "../components/Breadcrumb";
import {
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Sprout,
  RefreshCw,
  Filter,
  Search,
  ChevronRight,
  ShieldCheck,
  Layers,
  ArrowUpRight,
  Leaf,
} from "lucide-react";

export default function Advisory() {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState({
    stats: {
      totalCrops: 0,
      totalAdvisories: 0,
      urgentAlerts: 0,
      pendingActions: 0,
      goodPractices: 0,
    },
    crops: [],
  });
  const [error, setError] = useState(null);

  // Filters
  const [selectedCropId, setSelectedCropId] = useState("all");
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grouped"); // "grouped" | "stream"

  const fetchAdvisories = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await advisoryService.getAllAdvisories();
      setData(res || { stats: {}, crops: [] });
    } catch (err) {
      console.error("Failed to load user advisories:", err);
      setError(
        err.response?.data?.message || "Failed to load agricultural advisories."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisories();
  }, []);

  const stats = data?.stats || {};
  const crops = data?.crops || [];

  // Extract all categories across all crops
  const allCategories = Array.from(
    new Set(
      crops.flatMap((c) =>
        (c.advisories || []).map((a) => (a.category || "general").toLowerCase())
      )
    )
  );

  // Filter logic
  const filteredCrops = crops
    .filter((crop) => {
      if (selectedCropId !== "all" && crop.cropId !== selectedCropId) {
        return false;
      }
      return true;
    })
    .map((crop) => {
      const matchingAdvisories = (crop.advisories || []).filter((adv) => {
        if (selectedPriority !== "all" && adv.priority !== selectedPriority) {
          return false;
        }
        if (
          selectedCategory !== "all" &&
          (adv.category || "").toLowerCase() !== selectedCategory
        ) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchMsg = (adv.message || "").toLowerCase().includes(q);
          const matchTitle = (adv.title || "").toLowerCase().includes(q);
          const matchAction = (adv.recommendedAction || "").toLowerCase().includes(q);
          if (!matchMsg && !matchTitle && !matchAction) return false;
        }
        return true;
      });

      return {
        ...crop,
        filteredAdvisories: matchingAdvisories,
      };
    })
    .filter((crop) => crop.filteredAdvisories.length > 0 || (selectedPriority === "all" && selectedCategory === "all" && !searchQuery.trim()));

  // Flattened stream for "stream" view
  const allStreamAdvisories = crops.flatMap((c) =>
    (c.advisories || []).map((adv) => ({
      ...adv,
      cropId: c.cropId,
      cropName: c.cropName,
      farmName: c.farmName,
    }))
  ).filter((adv) => {
    if (selectedCropId !== "all" && adv.cropId !== selectedCropId) return false;
    if (selectedPriority !== "all" && adv.priority !== selectedPriority) return false;
    if (selectedCategory !== "all" && (adv.category || "").toLowerCase() !== selectedCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchMsg = (adv.message || "").toLowerCase().includes(q);
      const matchTitle = (adv.title || "").toLowerCase().includes(q);
      const matchCrop = (adv.cropName || "").toLowerCase().includes(q);
      if (!matchMsg && !matchTitle && !matchCrop) return false;
    }
    return true;
  });

  // Sort stream: red first, then yellow, then green
  const priorityOrder = { red: 1, yellow: 2, green: 3 };
  allStreamAdvisories.sort(
    (a, b) => (priorityOrder[a.priority] || 4) - (priorityOrder[b.priority] || 4)
  );

  return (
    <div className="space-y-4 sm:space-y-6 text-slate-200 w-full min-w-0">
      <Breadcrumb currentName="Farm Advisory & Care" />

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles size={20} />
            </div>
            Farm Advisory & Care
          </h1>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            Personalized crop management, real-time protection alerts, and agronomic guidance.
          </p>
        </div>

        <button
          onClick={fetchAdvisories}
          disabled={loading}
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs sm:text-sm text-gray-300 hover:text-white transition disabled:opacity-50"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh Advisory
        </button>
      </div>

      {/* ERROR BANNER */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 flex items-center gap-3">
          <AlertTriangle size={20} className="flex-shrink-0" />
          <p className="text-sm flex-1">{error}</p>
          <button
            onClick={fetchAdvisories}
            className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium"
          >
            Retry
          </button>
        </div>
      )}

      {/* STATS OVERVIEW CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span>Active Crops</span>
            <Sprout size={16} className="text-green-400" />
          </div>
          <p className="text-2xl font-bold text-white">
            {loading ? "..." : stats.totalCrops || crops.length}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Under observation</p>
        </div>

        <div className="p-4 rounded-xl border border-white/10 bg-white/5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-gray-400 text-xs mb-2">
            <span>Total Guidance</span>
            <Sparkles size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">
            {loading ? "..." : stats.totalAdvisories || 0}
          </p>
          <p className="text-[11px] text-gray-500 mt-1">Generated actions</p>
        </div>

        <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-950/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-rose-300 text-xs mb-2">
            <span>Critical Alerts</span>
            <AlertTriangle size={16} className="text-rose-400" />
          </div>
          <p className="text-2xl font-bold text-rose-400">
            {loading ? "..." : stats.urgentAlerts || 0}
          </p>
          <p className="text-[11px] text-rose-400/70 mt-1">Requires immediate attention</p>
        </div>

        <div className="p-4 rounded-xl border border-amber-500/30 bg-amber-950/20 flex flex-col justify-between">
          <div className="flex items-center justify-between text-amber-300 text-xs mb-2">
            <span>Action Needed</span>
            <Clock size={16} className="text-amber-400" />
          </div>
          <p className="text-2xl font-bold text-amber-400">
            {loading ? "..." : stats.pendingActions || 0}
          </p>
          <p className="text-[11px] text-amber-400/70 mt-1">This week's schedule</p>
        </div>

        <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-950/20 flex flex-col justify-between col-span-2 sm:col-span-1">
          <div className="flex items-center justify-between text-emerald-300 text-xs mb-2">
            <span>Good Practices</span>
            <ShieldCheck size={16} className="text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">
            {loading ? "..." : stats.goodPractices || 0}
          </p>
          <p className="text-[11px] text-emerald-400/70 mt-1">Recommended practices</p>
        </div>
      </div>

      {/* FILTER & CONTROLS TOOLBAR */}
      <div className="p-4 rounded-xl bg-white/5 border border-white/10 space-y-3">
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          {/* Search bar */}
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search recommendations, pests, sprays, nutrients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 border border-white/10 rounded-xl pl-9 pr-4 py-2 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400 hover:text-white"
              >
                Clear
              </button>
            )}
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1 bg-slate-800 border border-white/10 p-1 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setViewMode("grouped")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === "grouped"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              By Crop
            </button>
            <button
              onClick={() => setViewMode("stream")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                viewMode === "stream"
                  ? "bg-emerald-600 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              Alert Stream
            </button>
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-white/5 text-xs">
          {/* Crop Selector */}
          <select
            value={selectedCropId}
            onChange={(e) => setSelectedCropId(e.target.value)}
            className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-gray-200 focus:outline-none focus:border-emerald-500"
          >
            <option value="all">All Crops ({crops.length})</option>
            {crops.map((c) => (
              <option key={c.cropId} value={c.cropId}>
                {c.cropName} ({c.farmName})
              </option>
            ))}
          </select>

          {/* Priority Pills */}
          <button
            onClick={() => setSelectedPriority("all")}
            className={`px-3 py-1.5 rounded-lg font-medium transition ${
              selectedPriority === "all"
                ? "bg-emerald-500 text-white"
                : "bg-slate-800 text-gray-400 hover:text-white border border-white/5"
            }`}
          >
            All Priorities
          </button>
          <button
            onClick={() => setSelectedPriority("red")}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
              selectedPriority === "red"
                ? "bg-rose-500 text-white"
                : "bg-slate-800 text-rose-400 border border-rose-500/20 hover:bg-rose-500/10"
            }`}
          >
            Critical ({stats.urgentAlerts || 0})
          </button>
          <button
            onClick={() => setSelectedPriority("yellow")}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
              selectedPriority === "yellow"
                ? "bg-amber-500 text-black font-semibold"
                : "bg-slate-800 text-amber-400 border border-amber-500/20 hover:bg-amber-500/10"
            }`}
          >
            Action Needed ({stats.pendingActions || 0})
          </button>
          <button
            onClick={() => setSelectedPriority("green")}
            className={`px-3 py-1.5 rounded-lg font-medium transition flex items-center gap-1 ${
              selectedPriority === "green"
                ? "bg-emerald-600 text-white"
                : "bg-slate-800 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/10"
            }`}
          >
            Best Practices ({stats.goodPractices || 0})
          </button>

          {/* Category Dropdown */}
          {allCategories.length > 0 && (
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-lg px-3 py-1.5 text-gray-200 focus:outline-none focus:border-emerald-500 ml-auto"
            >
              <option value="all">All Categories</option>
              {allCategories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* LOADING STATE */}
      {loading && (
        <div className="space-y-4 animate-pulse">
          <div className="h-44 bg-white/5 rounded-xl border border-white/10" />
          <div className="h-44 bg-white/5 rounded-xl border border-white/10" />
        </div>
      )}

      {/* EMPTY CROPS STATE */}
      {!loading && crops.length === 0 && (
        <div className="p-12 text-center bg-white/5 rounded-2xl border border-white/10 space-y-4 max-w-lg mx-auto">
          <Sprout size={48} className="mx-auto text-emerald-400 opacity-80" />
          <h3 className="text-xl font-semibold text-white">No Active Crops Found</h3>
          <p className="text-sm text-gray-400">
            You don't have any actively growing crops registered. Plant a crop in your farm to receive live agronomic guidance, fertilization schedules, and pest warnings.
          </p>
          <Link
            to="/crops"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-sm font-medium transition shadow-lg shadow-emerald-600/20"
          >
            <Sprout size={16} /> Manage Crops
          </Link>
        </div>
      )}

      {/* VIEW: GROUPED BY CROP */}
      {!loading && crops.length > 0 && viewMode === "grouped" && (
        <div className="space-y-8">
          {filteredCrops.length === 0 ? (
            <div className="p-10 text-center bg-white/5 rounded-xl border border-white/10 space-y-2">
              <ShieldCheck size={36} className="mx-auto text-emerald-400/80 mb-2" />
              <p className="text-white font-medium">No recommendations matched your filter</p>
              <p className="text-gray-400 text-xs">
                Try resetting your search query or priority filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCropId("all");
                  setSelectedPriority("all");
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-2 text-xs text-emerald-400 hover:underline"
              >
                Reset all filters
              </button>
            </div>
          ) : (
            filteredCrops.map((crop) => (
              <div
                key={crop.cropId}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 space-y-5"
              >
                {/* Crop Header Summary */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5 flex-wrap">
                      <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Sprout size={20} className="text-emerald-400" />
                        {crop.cropName}
                        {crop.variety && (
                          <span className="text-sm font-normal text-gray-400">
                            ({crop.variety})
                          </span>
                        )}
                      </h2>
                      <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300">
                        {crop.farmName}
                      </span>
                    </div>

                    <p className="text-xs text-gray-400 flex items-center gap-2">
                      <span>Stage: <strong className="text-gray-200">{crop.growthStageLabel}</strong></span>
                      <span>•</span>
                      <span>Day {crop.cropAgeDays} of {crop.expectedDurationDays}</span>
                      <span>•</span>
                      <span>Soil: {crop.soilType}</span>
                    </p>
                  </div>

                  <Link
                    to={`/crops/${crop.cropSlug || crop.cropId}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-300 hover:text-white transition"
                  >
                    View Crop Details <ArrowUpRight size={13} />
                  </Link>
                </div>

                {/* Growth Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>Crop Development Progress</span>
                    <span className="text-emerald-400 font-medium">
                      {crop.growthProgressPercent}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden border border-white/5">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min(100, crop.growthProgressPercent || 0)}%` }}
                    />
                  </div>
                </div>

                {/* Advisories for this Crop */}
                {crop.filteredAdvisories.length === 0 ? (
                  <p className="text-xs text-gray-500 italic py-2">
                    No active advisories match the selected filters for this crop.
                  </p>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                    {crop.filteredAdvisories.map((adv, idx) => (
                      <AdvisoryCard
                        key={`${crop.cropId}-${idx}`}
                        advisory={adv}
                        cropName={crop.cropName}
                      />
                    ))}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* VIEW: STREAM VIEW */}
      {!loading && crops.length > 0 && viewMode === "stream" && (
        <div className="space-y-4">
          {allStreamAdvisories.length === 0 ? (
            <div className="p-10 text-center bg-white/5 rounded-xl border border-white/10 space-y-2">
              <ShieldCheck size={36} className="mx-auto text-emerald-400/80 mb-2" />
              <p className="text-white font-medium">No alerts matched your search or filters</p>
              <button
                onClick={() => {
                  setSelectedCropId("all");
                  setSelectedPriority("all");
                  setSelectedCategory("all");
                  setSearchQuery("");
                }}
                className="mt-2 text-xs text-emerald-400 hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {allStreamAdvisories.map((adv, idx) => (
                <div key={idx} className="relative group">
                  <AdvisoryCard
                    advisory={adv}
                    cropName={`${adv.cropName} (${adv.farmName})`}
                  />
                  <div className="absolute top-4 right-4 z-10">
                    <Link
                      to={`/crops/${adv.cropSlug || adv.cropId}`}
                      className="p-1.5 rounded-lg bg-black/40 hover:bg-black/70 text-gray-400 hover:text-white border border-white/10 transition inline-flex"
                      title="Open Crop Page"
                    >
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
