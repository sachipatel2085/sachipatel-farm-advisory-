import React, { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import { MapPin, Wheat } from "lucide-react";
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
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-5">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Wheat size={18} /> Farms
        </h2>

        <div className="flex gap-2">
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
            + Add Farm
          </button>
        </div>
      </div>

      {/* FILTERS */}
      {showFilters && (
        <div className="grid sm:grid-cols-3 gap-3 bg-white/5 border border-white/10 p-4 rounded-xl">
          <select
            value={areaFilter}
            onChange={(e) => setAreaFilter(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-white/10 rounded-lg"
          >
            <option value="">All Area</option>
            <option value="small">Below 5 Acres</option>
            <option value="medium">5 - 15 Acres</option>
            <option value="large">Above 15 Acres</option>
          </select>

          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="px-3 py-2 bg-slate-800 border border-white/10 rounded-lg"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
            <option value="area">Area (High → Low)</option>
          </select>
        </div>
      )}

      {/* GRID */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-5 animate-pulse"
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
                onClick={() => navigate(`/farms/${farm._id}`)}
                className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-green-500 transition cursor-pointer"
              >
                {/* TOP */}
                <div className="flex justify-between items-center">
                  <h2 className="text-lg font-semibold">{farm.farmName}</h2>

                  <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                    {farm.totalArea} Acres
                  </span>
                </div>

                {/* LOCATION */}
                <p className="text-sm text-gray-400 mt-2">
                  📍 {farm.location?.village}, {farm.location?.district}
                </p>

                {/* STATS */}
                <div className="flex justify-between mt-4 text-sm">
                  <div>
                    <p className="text-gray-400">Crops</p>
                    <p className="font-semibold">{farm.cropCount || "--"}</p>
                  </div>

                  <div>
                    <p className="text-gray-400">Status</p>
                    <p className="text-green-400 font-semibold">Active</p>
                  </div>
                </div>

                {/* EXTRA DETAILS */}
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-400 text-xs">Soil</p>
                    <p className="font-medium">{farm.soilType || "N/A"}</p>
                  </div>

                  <div>
                    <p className="text-gray-400 text-xs">Irrigation</p>
                    <p className="font-medium">
                      {farm.irrigationType || "N/A"}
                    </p>
                  </div>
                </div>

                {/* FOOTER */}
                <div className="mt-4 text-xs text-gray-500">
                  Created: {new Date(farm.createdAt).toLocaleDateString()}
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
