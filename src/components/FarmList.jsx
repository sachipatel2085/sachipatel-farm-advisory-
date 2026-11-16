import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { MapPin, Wheat, Plus, SlidersHorizontal, LandPlot } from "lucide-react";
import CreateFarmModal from "./CreateFarm";

const FarmList = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);

  const [areaFilter, setAreaFilter] = useState("");
  const [sortType, setSortType] = useState("latest");
  const [showFilters, setShowFilters] = useState(false);
  const [showAdd, setShowAdd] = useState(false);

  const navigate = useNavigate();

  const loadFarms = async () => {
    setLoading(true);

    const start = Date.now();

    try {
      const res = await api.get("/farms");
      setFarms(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      const delay = 400 - (Date.now() - start);
      setTimeout(() => setLoading(false), delay > 0 ? delay : 0);
    }
  };

  useEffect(() => {
    loadFarms();
  }, []);

  /* ===== FILTER + SORT ===== */
  const processedFarms = farms
    .filter((f) => {
      if (!areaFilter) return true;

      if (areaFilter === "small") return f.totalArea < 5;
      if (areaFilter === "medium") return f.totalArea >= 5 && f.totalArea <= 15;
      if (areaFilter === "large") return f.totalArea > 15;

      return true;
    })
    .sort((a, b) => {
      if (sortType === "latest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortType === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortType === "area") return b.totalArea - a.totalArea;
      return 0;
    });

  return (
    <div className="bg-[#131d2e] border border-white/[0.08] rounded-xl p-3.5 sm:p-5 space-y-4 sm:space-y-5 shadow-md">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-2.5 sm:gap-3">
        <h2 className="flex items-center gap-2 text-base sm:text-lg font-semibold text-white">
          <LandPlot size={18} className="text-emerald-400 shrink-0" /> My Farms & Land
        </h2>

        <div className="flex gap-2">
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
            <Plus size={15} /> Add Farm
          </button>
        </div>
      </div>

      {/* FILTERS */}
      {showFilters && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 bg-[#0b111e] border border-white/[0.08] p-3 sm:p-4 rounded-xl">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-3 py-2 bg-[#131d2e] border border-white/10 rounded-lg text-xs sm:text-sm text-gray-200"
          >
            <option value="">All Area Sizes</option>
            <option value="small">Below 5 Acres</option>
            <option value="medium">5 - 15 Acres</option>
            <option value="large">Above 15 Acres</option>
          </select>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="px-3 py-2 bg-[#131d2e] border border-white/10 rounded-lg text-xs sm:text-sm text-gray-200"
          >
            <option value="latest">Latest First</option>
            <option value="oldest">Oldest First</option>
            <option value="area">Area (Largest First)</option>
          </select>
        </div>
      )}

      {/* GRID */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-[#0f172a] border border-white/[0.06] rounded-xl p-5 animate-pulse"
              >
                <div className="h-5 w-2/3 bg-white/10 rounded mb-3"></div>
                <div className="h-4 w-20 bg-white/10 rounded mb-4"></div>
                <div className="h-4 w-full bg-white/10 rounded mb-2"></div>
                <div className="h-4 w-5/6 bg-white/10 rounded mb-4"></div>
                <div className="flex gap-2">
                  <div className="flex-1 h-8 bg-white/10 rounded"></div>
                  <div className="flex-1 h-8 bg-white/10 rounded"></div>
                </div>
              </div>
            ))
          : processedFarms.map((farm) => (
              <div
                key={farm._id}
                onClick={() => navigate(`/farms/${farm.slug || farm._id}`)}
                className="bg-[#0f172a] border border-white/[0.08] hover:border-emerald-500/40 rounded-xl p-5 transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md"
              >
                {/* TOP */}
                <div className="flex justify-between items-center">
                  <h2 className="text-base sm:text-lg font-semibold text-white">{farm.farmName}</h2>

                  <span className="text-xs bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 px-2.5 py-0.5 rounded-full font-medium">
                    {farm.totalArea} Acres
                  </span>
                </div>

                {/* LOCATION */}
                <p className="text-xs sm:text-sm text-gray-400 mt-2 flex items-center gap-1.5">
                  <MapPin size={13} className="text-emerald-400 shrink-0" />
                  <span>
                    {farm.location?.village ? `${farm.location.village}, ` : ""}
                    {farm.location?.district || "Location set"}
                  </span>
                </p>

                {/* STATS */}
                <div className="flex justify-between mt-4 text-xs sm:text-sm pt-3 border-t border-white/[0.06]">
                  <div>
                    <p className="text-gray-400 text-xs">Active Crops</p>
                    <p className="font-semibold text-white mt-0.5">{farm.cropCount || "--"}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Status</p>
                    <p className="text-emerald-400 font-semibold mt-0.5">Active</p>
                  </div>
                </div>

                {/* EXTRA DETAILS */}
                <div className="mt-3 grid grid-cols-2 gap-3 text-xs bg-[#0b111e] p-2.5 rounded-lg border border-white/[0.04]">
                  <div>
                    <p className="text-gray-400 text-[11px]">Soil</p>
                    <p className="font-medium text-gray-200">{farm.soilType || "Not specified"}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-[11px]">Irrigation</p>
                    <p className="font-medium text-gray-200">
                      {farm.irrigationType || "Rainfed"}
                    </p>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="mt-3 text-[11px] text-gray-500">
                  Added on: {new Date(farm.createdAt).toLocaleDateString()}
                </div>
              </div>
            ))}
      </div>

      {!loading && processedFarms.length === 0 && (
        <p className="text-gray-400">No farms found</p>
      )}
      {showAdd && (
        <CreateFarmModal
          onClose={() => setShowAdd(false)}
          onCreated={loadFarms}
        />
      )}
    </div>
  );
};

export default FarmList;
