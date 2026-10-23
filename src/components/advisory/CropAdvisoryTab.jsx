import React, { useEffect, useState } from "react";
import advisoryService from "../../services/advisoryService";
import AdvisoryCard from "./AdvisoryCard";
import {
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Droplets,
  Leaf,
  Bug,
  ShieldCheck,
  Clock,
  Layers,
  Filter,
} from "lucide-react";

export default function CropAdvisoryTab({ cropId, crop }) {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [selectedPriority, setSelectedPriority] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");

  const fetchAdvisory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await advisoryService.getAdvisoryByCrop(cropId);
      setData(res);
    } catch (err) {
      console.error("Failed to load crop advisory:", err);
      setError(
        err.response?.data?.message || "Failed to load personalized advisory."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cropId) {
      fetchAdvisory();
    }
  }, [cropId]);

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-28 bg-white/5 rounded-xl border border-white/10" />
        <div className="h-12 bg-white/5 rounded-xl border border-white/10" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-44 bg-white/5 rounded-xl border border-white/10" />
          <div className="h-44 bg-white/5 rounded-xl border border-white/10" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 rounded-xl bg-rose-500/10 border border-rose-500/20 text-center text-rose-300 space-y-3">
        <AlertTriangle className="mx-auto text-rose-400" size={32} />
        <p className="font-semibold text-base">Advisory Unavailable</p>
        <p className="text-sm opacity-90">{error}</p>
        <button
          onClick={fetchAdvisory}
          className="mt-2 inline-flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-sm font-medium transition"
        >
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }

  // Crop does not have any advisory rules configured by Admin or Moderator
  if (data && data.isAvailable === false) {
    return (
      <div className="space-y-6">
        <div className="p-8 sm:p-10 rounded-2xl bg-amber-500/10 border border-amber-500/25 text-center space-y-3 max-w-xl mx-auto">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto">
            <AlertTriangle size={24} />
          </div>
          <h3 className="text-lg font-bold text-white">
            Advisory is not available for {data.cropName}
          </h3>
          <p className="text-xs text-amber-200/90 leading-relaxed max-w-md mx-auto">
            {data.statusMessage ||
              `Live agronomic advisories have not been configured for ${data.cropName} by agricultural moderators or administrators yet.`}
          </p>
          <div className="pt-2 flex justify-center gap-3 text-xs">
            <button
              onClick={fetchAdvisory}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition"
            >
              <RefreshCw size={13} /> Check Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  const advisories = data?.advisories || [];

  const urgentCount = advisories.filter((a) => a.priority === "red").length;
  const actionCount = advisories.filter((a) => a.priority === "yellow").length;
  const goodCount = advisories.filter((a) => a.priority === "green").length;

  const filteredAdvisories = advisories.filter((adv) => {
    if (selectedPriority !== "all" && adv.priority !== selectedPriority) {
      return false;
    }
    if (selectedCategory !== "all" && (adv.category || "").toLowerCase() !== selectedCategory) {
      return false;
    }
    return true;
  });

  const categories = Array.from(
    new Set(advisories.map((a) => (a.category || "general").toLowerCase()))
  );

  return (
    <div className="space-y-6">
      {/* STAGE & CARE INTELLIGENCE BANNER */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/20 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                Agronomy Care Guidance
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-normal">
                  Live Insights
                </span>
              </h3>
              <p className="text-xs text-gray-400">
                Tailored for {data?.cropName} at {data?.growthStageLabel || "Current Stage"}
              </p>
            </div>
          </div>

          <button
            onClick={fetchAdvisory}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-xs text-gray-300 hover:text-white border border-white/10 transition"
            title="Refresh Recommendations"
          >
            <RefreshCw size={13} />
            Refresh
          </button>
        </div>

        {/* Growth Progress Indicator */}
        <div className="space-y-1.5">
          <div className="flex justify-between text-xs text-gray-300">
            <span className="font-medium text-emerald-400">
              {data?.growthStageLabel}
            </span>
            <span>
              Day {data?.cropAgeDays || 0} of {data?.expectedDurationDays || 120} ({data?.growthProgressPercent || 0}%)
            </span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden border border-white/5">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, data?.growthProgressPercent || 0)}%` }}
            />
          </div>
        </div>

        {/* Status Indicators & Metadata Pills */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1 text-xs">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-300">
            <Layers size={14} className="text-amber-400" />
            <span>Soil: <strong className="text-white font-medium">{data?.soilType || "General Loam"}</strong></span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              data?.recentActivitySummary?.recentSpray
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-amber-500/10 border-amber-500/30 text-amber-300"
            }`}
          >
            <Bug size={14} />
            <span>
              {data?.recentActivitySummary?.recentSpray
                ? "Pest Spray Applied (Last 7 Days)"
                : "No Spray Recorded Recently"}
            </span>
          </div>

          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border ${
              data?.recentActivitySummary?.recentFertilizer
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
                : "bg-amber-500/10 border-amber-500/30 text-amber-300"
            }`}
          >
            <Leaf size={14} />
            <span>
              {data?.recentActivitySummary?.recentFertilizer
                ? "Fertilizer Applied (Last 7 Days)"
                : "No Fertilizer Recorded Recently"}
            </span>
          </div>
        </div>
      </div>

      {/* QUICK FILTER BAR */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white/5 border border-white/10 p-3 rounded-xl">
        {/* Priority Tabs */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <button
            onClick={() => setSelectedPriority("all")}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
              selectedPriority === "all"
                ? "bg-emerald-500 text-white"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            }`}
          >
            All ({advisories.length})
          </button>
          {urgentCount > 0 && (
            <button
              onClick={() => setSelectedPriority("red")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                selectedPriority === "red"
                  ? "bg-rose-500 text-white"
                  : "text-rose-400 hover:bg-rose-500/10"
              }`}
            >
              Urgent ({urgentCount})
            </button>
          )}
          {actionCount > 0 && (
            <button
              onClick={() => setSelectedPriority("yellow")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                selectedPriority === "yellow"
                  ? "bg-amber-500 text-black font-semibold"
                  : "text-amber-400 hover:bg-amber-500/10"
              }`}
            >
              Action Needed ({actionCount})
            </button>
          )}
          {goodCount > 0 && (
            <button
              onClick={() => setSelectedPriority("green")}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition flex items-center gap-1 ${
                selectedPriority === "green"
                  ? "bg-emerald-600 text-white"
                  : "text-emerald-400 hover:bg-emerald-500/10"
              }`}
            >
              Best Practices ({goodCount})
            </button>
          )}
        </div>

        {/* Category Dropdown/Selector */}
        {categories.length > 1 && (
          <div className="flex items-center gap-2 text-xs">
            <Filter size={14} className="text-gray-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-800 border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-gray-200 focus:outline-none focus:border-emerald-500"
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* ADVISORY CARDS GRID */}
      {filteredAdvisories.length === 0 ? (
        <div className="p-8 text-center bg-white/5 rounded-xl border border-white/10 space-y-2">
          <ShieldCheck size={36} className="mx-auto text-emerald-400/80 mb-2" />
          <p className="text-white font-medium text-base">
            {data?.statusMessage || "No advisory matches the selected filter"}
          </p>
          <p className="text-gray-400 text-xs">
            {data?.statusMessage
              ? "New alerts will appear here automatically when this crop enters its next growth window."
              : "Try switching your priority or category filters to view other recommendations."}
          </p>
          {!data?.statusMessage && (
            <button
              onClick={() => {
                setSelectedPriority("all");
                setSelectedCategory("all");
              }}
              className="mt-3 text-xs text-emerald-400 hover:underline inline-block"
            >
              Reset Filters
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredAdvisories.map((adv, idx) => (
            <AdvisoryCard
              key={`${adv.category}-${idx}`}
              advisory={adv}
              cropName={data?.cropName}
            />
          ))}
        </div>
      )}
    </div>
  );
}
