import React, { useEffect, useState } from "react";
import api from "../api/axios";
import AddCropModal from "../components/AddCropModal";
import { useNavigate } from "react-router-dom";
import { Sprout, CalendarDays, Timer, Wheat } from "lucide-react";

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
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-5 text-slate-200">
      {/* HEADER */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Wheat size={18} /> Crops
        </h2>

        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg text-sm"
          >
            ⚙️ Filters
          </button>

          <button
            onClick={() => setShowAdd(true)}
            className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg text-sm"
          >
            + Add Crop
          </button>
        </div>
      </div>

      {/* FILTER PANEL (same style as history) */}
      {showFilters && (
        <div className="bg-white/5 border border-white/10 p-4 rounded-xl grid sm:grid-cols-4 gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
          >
            <option value="">All Status</option>
            <option value="active">🌱 Active</option>
            <option value="harvested">🌾 Harvested</option>
            <option value="failed">❌ Failed</option>
          </select>

          <select
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
          >
            <option value="">All Seasons</option>
            {[...new Set(crops.map((c) => c.season))].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
          >
            <option value="">All Crops</option>
            {[...new Set(crops.map((c) => c.cropName))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      )}

      {/* GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4 animate-pulse"
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
                  onClick={() => navigate(`/crops/${crop._id}`)}
                  className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-green-500 transition cursor-pointer"
                >
                  {/* HEADER */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2 font-medium">
                      <Sprout size={16} />
                      {crop.cropName}
                    </div>

                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        crop.status === "active"
                          ? "bg-green-500/20 text-green-400"
                          : crop.status === "harvested"
                            ? "bg-yellow-500/20 text-yellow-400"
                            : "bg-red-500/20 text-red-400"
                      }`}
                    >
                      {crop.status}
                    </span>
                  </div>

                  {/* FARM */}
                  <p className="text-xs text-gray-400 mt-1">
                    📍 {crop.farmName}
                  </p>

                  {/* PROGRESS */}
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Growth</span>
                      <span>{prog}%</span>
                    </div>

                    <div className="w-full h-2 bg-white/10 rounded-full mt-1">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${prog}%` }}
                      />
                    </div>
                  </div>

                  {/* STATS */}
                  <div className="flex justify-between mt-3 text-xs text-gray-400">
                    <div className="flex items-center gap-1">
                      <CalendarDays size={12} />
                      {crop.cropAgeDays} days
                    </div>

                    <div className="flex items-center gap-1">
                      <Timer size={12} />
                      {crop.expectedDurationDays} days
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
