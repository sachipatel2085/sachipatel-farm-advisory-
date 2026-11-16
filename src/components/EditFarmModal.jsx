import React, { useEffect, useState } from "react";
import api from "../api/axios";
import MapPicker from "./MapPicker";
import { reverseGeocode } from "../utils/reverseGeocode";
import { X, Leaf, Ruler, MapPin, ImagePlus, Upload, Layers, Droplets } from "lucide-react";

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

const EditFarmModal = ({ farm, onClose, onUpdated }) => {
  const [farmName, setFarmName] = useState(farm.farmName || "");
  const [totalArea, setTotalArea] = useState(farm.totalArea || "");
  const [soilType, setSoilType] = useState(farm.soilType || "");
  const [irrigationType, setIrrigationType] = useState(farm.irrigationType || "");
  const [village, setVillage] = useState(farm.location?.village || "");
  const [district, setDistrict] = useState(farm.location?.district || "");
  const [state, setState] = useState(farm.location?.state || "");

  const [photos, setPhotos] = useState([]);
  const [preview, setPreview] = useState([]);

  const [position, setPosition] = useState(
    farm.location?.latitude
      ? { lat: farm.location.latitude, lng: farm.location.longitude }
      : null,
  );

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

  const updateFarm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/farms/${farm._id}`, {
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

      onUpdated();
      onClose();
    } catch (err) {
      alert("Failed to update farm: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  const selectPhotos = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    setPreview(files.map((f) => URL.createObjectURL(f)));
  };

  const uploadPhotos = async () => {
    const formData = new FormData();
    photos.forEach((p) => formData.append("photos", p));

    await api.post(`/farms/${farm._id}/photos`, formData);
    onUpdated();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-[#131d2e] w-full max-w-lg rounded-2xl border border-white/[0.08] shadow-2xl max-h-[90vh] flex flex-col text-slate-200">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/[0.08] flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-base sm:text-lg font-bold text-white">
            <Leaf size={18} className="text-emerald-400" /> Edit Farm
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
          <form id="edit-farm-form" onSubmit={updateFarm} className="space-y-4">
            {/* FARM NAME */}
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">Farm Name</label>
              <div className="relative">
                <Leaf size={16} className="absolute left-3 top-3 text-emerald-400" />
                <input
                  value={farmName}
                  onChange={(e) => setFarmName(e.target.value)}
                  placeholder="Farm Name"
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
                    placeholder="Total Area (Acres)"
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

            {/* IRRIGATION METHOD */}
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

            {/* LOCATION */}
            <div>
              <label className="text-xs font-medium text-gray-300 block mb-1">Location Details</label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <input
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  placeholder="Village"
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
              <label className="text-xs font-medium text-gray-300 block mb-1">Pin on Map</label>
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

            {/* PHOTO */}
            <div>
              <label className="flex items-center gap-2 text-xs font-medium text-gray-300 mb-1">
                <ImagePlus size={14} className="text-emerald-400" /> Add More Photos
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={selectPhotos}
                className="text-xs text-gray-400 file:mr-2.5 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-xs file:bg-[#1e2a3d] file:text-gray-300 hover:file:bg-[#253754]"
              />
            </div>

            {/* PREVIEW */}
            {preview.length > 0 && (
              <div className="grid grid-cols-3 gap-2">
                {preview.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="preview"
                    className="w-full h-20 object-cover rounded-xl border border-white/10"
                  />
                ))}
              </div>
            )}

            {/* UPLOAD BUTTON */}
            {photos.length > 0 && (
              <button
                type="button"
                onClick={uploadPhotos}
                className="w-full flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-600 py-2 rounded-xl text-xs sm:text-sm font-medium transition"
              >
                <Upload size={14} /> Upload Photos
              </button>
            )}
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
            form="edit-farm-form"
            disabled={loading}
            className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs sm:text-sm font-semibold transition shadow-md shadow-emerald-600/20 active:scale-[0.99] flex items-center gap-2 disabled:opacity-50"
          >
            {loading ? "Saving Changes..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFarmModal;
