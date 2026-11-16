import React, { useEffect, useState } from "react";
import api from "../api/axios";
import AddCropModal from "../components/AddCropModal";
import { useNavigate } from "react-router-dom";
import { Sprout, CalendarDays, Timer, Wheat, Plus, SlidersHorizontal, MapPin } from "lucide-react";

const CropList = ({ farmId }) => {
  const [crops, setCrops] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [seasonFilter, setSeasonFilter] = useState("");
  const [cropFilter, setCropFilter] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const loadCrops = async () => {
    setLoading(true);

    const startTime = Date.now();

    try {
      let url = farmId ? `/crops/farm/${farmId}` : `/crops`;

      const params = new URLSearchParams();

      if (statusFilter) {
        params.append("status", statusFilter);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }

      const res = await api.get(url);
      setCrops(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      const elapsed = Date.now() - startTime;
      const minTime = 400; // 👈 smooth skeleton time

      setTimeout(
        () => {
          setLoading(false);
        },
        elapsed < minTime ? minTime - elapsed : 0,
      );
    }
  };
  useEffect(() => {
    loadCrops();
  }, [farmId, statusFilter]);

  const processedCrops = crops
    .filter(
      (c) =>
        (!seasonFilter || c.season === seasonFilter) &&
        (!cropFilter || c.cropName === cropFilter),
    )
    .sort((a, b) => {
      if (sortType === "latest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortType === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  const progress = (age, duration) =>
    Math.min(100, Math.round((age / duration) * 100));

  return (
    <div className="bg-[#131d2e] border border-white/[0.08] rounded-xl p-3.5 sm:p-5 space-y-4 sm:space-y-5 text-slate-200 shadow-md">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 sm:gap-3">
        <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-white">
          <Wheat size={18} className="text-emerald-400 shrink-0" /> My Crops
        </h2>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#1e2a3d] hover:bg-[#253754] text-gray-200 border border-white/10 rounded-lg text-xs sm:text-sm font-medium transition"
          >
            <SlidersHorizontal size={14} /> Filters
          </button>

          <button
            onClick={() => setShowAdd(true)}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs sm:text-sm font-semibold transition shadow-md shadow-emerald-600/20 active:scale-[0.99]"
          >
            <Plus size={15} /> Add Crop
          </button>
        </div>
      </div>

      {/* FILTER PANEL */}
      {showFilters && (
        <div className="bg-[#0b111e] border border-white/[0.08] p-3 sm:p-4 rounded-xl grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#131d2e] border border-white/10 text-xs sm:text-sm text-gray-200"
          >
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="harvested">Harvested</option>
            <option value="failed">Failed</option>
          </select>

          <select
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#131d2e] border border-white/10 text-xs sm:text-sm text-gray-200"
          >
            <option value="">All Seasons</option>
            {[...new Set(crops.map((c) => c.season))].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#131d2e] border border-white/10 text-xs sm:text-sm text-gray-200"
          >
            <option value="">All Crops</option>
            {[...new Set(crops.map((c) => c.cropName))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="px-3 py-2 rounded-lg bg-[#131d2e] border border-white/10 text-xs sm:text-sm text-gray-200"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      )}

      {/* GRID */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-[#0f172a] border border-white/[0.06] rounded-xl p-4 animate-pulse"
              >
                {/* TITLE */}
                <div className="h-4 w-2/3 bg-white/10 rounded mb-3"></div>

                {/* STATUS */}
                <div className="h-4 w-16 bg-white/10 rounded mb-3"></div>

                {/* FARM */}
                <div className="h-3 w-1/2 bg-white/10 rounded mb-3"></div>

                {/* PROGRESS */}
                <div className="h-2 w-full bg-white/10 rounded mb-2"></div>
                <div className="h-2 w-5/6 bg-white/10 rounded mb-4"></div>

                {/* STATS */}
                <div className="flex justify-between">
                  <div className="h-3 w-16 bg-white/10 rounded"></div>
                  <div className="h-3 w-16 bg-white/10 rounded"></div>
                </div>
              </div>
            ))
          : processedCrops.map((crop) => {
              const prog = progress(
                crop.cropAgeDays,
                crop.expectedDurationDays,
              );

              return (
                <div
                  key={crop._id}
                  onClick={() => navigate(`/crops/${crop.slug || crop._id}`)}
                  className="bg-[#0f172a] border border-white/[0.08] hover:border-emerald-500/40 rounded-xl p-4 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-medium text-white">
                      <Sprout size={16} className="text-emerald-400" />
                      {crop.cropName}
                    </div>

                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full capitalize font-medium ${
                        crop.status === "active"
                          ? "bg-emerald-500/20 text-emerald-300"
                          : crop.status === "harvested"
                            ? "bg-amber-500/20 text-amber-300"
                            : "bg-rose-500/20 text-rose-300"
                      }`}
                    >
                      {crop.status}
                    </span>
                  </div>

                  {/* FARM */}
                  <p className="text-xs text-gray-400 mt-1.5 flex items-center gap-1">
                    <MapPin size={12} className="text-emerald-400 shrink-0" />
                    <span>{crop.farmName}</span>
                  </p>

                  {/* PROGRESS */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Growth Stage</span>
                      <span className="text-emerald-400 font-medium">{prog}%</span>
                    </div>

                    <div className="w-full h-1.5 bg-slate-800 rounded-full mt-1.5 overflow-hidden">
                      <div
                        className="h-full bg-emerald-500 rounded-full"
                        style={{ width: `${prog}%` }}
                      />
                    </div>
                  </div>

                  {/* STATS */}
                  <div className="flex justify-between mt-3 pt-2.5 border-t border-white/[0.06] text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <CalendarDays size={13} className="text-gray-500" />
                      <span>{crop.cropAgeDays} days planted</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <Timer size={13} className="text-gray-500" />
                      <span>{crop.expectedDurationDays} total days</span>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>

      <AddCropModal
        isOpen={showAdd}
        onClose={() => setShowAdd(false)}
        onSuccess={loadCrops}
      />
    </div>
  );
};

export default CropList;
