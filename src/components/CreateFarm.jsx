import React, { useEffect, useState } from "react";
import api from "../api/axios";
import MapPicker from "./MapPicker";
import { reverseGeocode } from "../utils/reverseGeocode";
import { X, MapPin, Leaf, Ruler, Droplets, Layers, Sprout } from "lucide-react";

const SOIL_TYPES = [
  "Loam",
  "Sandy Loam",
  "Clay",
  "Clay Loam",
  "Black Cotton Soil",
  "Red Soil",
  "Alluvial Soil",
  "Sandy Soil",
  "Silt",
];

const IRRIGATION_TYPES = [
  "Drip Irrigation",
  "Sprinkler",
  "Borewell / Tubewell",
  "Canal",
  "Rainfed",
  "Flood / Furrow",
  "Well",
];

const CreateFarmModal = ({ onClose, onCreated }) => {
  const [farmName, setFarmName] = useState("");
  const [totalArea, setTotalArea] = useState("");
  const [soilType, setSoilType] = useState("");
  const [irrigationType, setIrrigationType] = useState("");

  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");

  const [position, setPosition] = useState(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!position) return;

    const fetchAddress = async () => {
      const addr = await reverseGeocode(position.lat, position.lng);
      setVillage(addr.village);
      setDistrict(addr.district);
      setState(addr.state);
    };

    fetchAddress();
  }, [position]);

  const createFarm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/farms", {
        farmName,
        totalArea,
        soilType,
        irrigationType,
        location: {
          village,
          district,
          state,
          latitude: position?.lat,
          longitude: position?.lng,
        },
      });

      onCreated();
      onClose();
    } catch (err) {
      alert("Failed to create farm: " + (err.response?.data?.message || err.message));
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-[#131d2e] w-full max-w-lg rounded-2xl border border-white/[0.08] shadow-2xl max-h-[90vh] flex flex-col text-slate-200">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-white">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              <Sprout size={18} />
            </div>
            Add New Farm Land
          </h2>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          <form id="create-farm-form" onSubmit={createFarm} className="space-y-4">
            {/* FARM NAME */}
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">Farm Name</label>
              <div className="relative">
                <Leaf size={16} className="absolute left-3 top-3 text-emerald-400" />
                <input
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="e.g. Green Valley Farm, North Acre"
                  required
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0b111e] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* AREA & SOIL TYPE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* AREA */}
              <div>
                <label className="text-xs font-medium text-gray-300 block mb-1">Total Area (Acres)</label>
                <div className="relative">
                  <Ruler
                    size={16}
                    className="absolute left-3 top-3 text-emerald-400"
                  />
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={totalArea}
                    onChange={(e) => setTotalArea(e.target.value)}
                    placeholder="e.g. 5.5"
                    required
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0b111e] border border-white/10 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                  />
                </div>
              </div>

              {/* SOIL TYPE */}
              <div>
                <label className="text-xs font-medium text-gray-300 block mb-1">Soil Type</label>
                <div className="relative">
                  <Layers
                    size={16}
                    className="absolute left-3 top-3 text-emerald-400 pointer-events-none"
                  />
                  <select
                    value={soilType}
                    onChange={(e) => setSoilType(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0b111e] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="">Select Soil Type</option>
                    {SOIL_TYPES.map((soil) => (
                      <option key={soil} value={soil}>
                        {soil}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* IRRIGATION */}
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">Irrigation Method</label>
              <div className="relative">
                <Droplets
                  size={16}
                  className="absolute left-3 top-3 text-sky-400 pointer-events-none"
                />
                <select
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-[#0b111e] border border-white/10 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                >
                  <option value="">Select Irrigation Method</option>
                  {IRRIGATION_TYPES.map((irr) => (
                    <option key={irr} value={irr}>
                      {irr}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* LOCATION (VILLAGE, DISTRICT, STATE) */}
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">Location Details</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Village / Town"
                  className="px-3 py-2.5 rounded-xl bg-[#0b111e] border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                />

                <input
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  placeholder="District"
                  className="px-3 py-2.5 rounded-xl bg-[#0b111e] border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                />

                <input
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="px-3 py-2.5 rounded-xl bg-[#0b111e] border border-white/10 text-xs sm:text-sm text-white placeholder-gray-500 focus:outline-none focus:border-emerald-500 transition"
                />
              </div>
            </div>

            {/* MAP */}
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">Pin on Map (Optional)</label>
              <div className="rounded-xl overflow-hidden border border-white/10">
                <MapPicker position={position} setPosition={setPosition} />
              </div>

              {position && (
                <p className="text-[11px] text-center text-gray-400 flex items-center justify-center gap-1 mt-1.5">
                  <MapPin size={12} className="text-emerald-400" />
                  <span>GPS: {position.lat.toFixed(5)}, {position.lng.toFixed(5)}</span>
                </p>
              )}
            </div>
          </form>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-white/[0.08] flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white text-xs sm:text-sm font-medium transition"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="create-farm-form"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition shadow-md shadow-emerald-600/20 active:scale-[0.99] flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Saving Farm..." : "Save Farm"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateFarmModal;
