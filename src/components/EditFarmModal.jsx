import React, { useEffect, useState } from "react";
import api from "../api/axios";
import MapPicker from "./MapPicker";
import { reverseGeocode } from "../utils/reverseGeocode";
import { X, Leaf, Ruler, MapPin, ImagePlus, Upload } from "lucide-react";

const EditFarmModal = ({ farm, onClose, onUpdated }) => {
  const [farmName, setFarmName] = useState(farm.farmName);
  const [totalArea, setTotalArea] = useState(farm.totalArea);
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
      alert("Failed to update farm");
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
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-3">
      <div className="bg-[#0f172a] w-full max-w-lg rounded-xl border border-white/10 shadow-xl max-h-[90vh] flex flex-col">
        {/* HEADER */}
        <div className="px-5 py-4 border-b border-white/10 flex justify-between items-center">
          <h2 className="flex items-center gap-2 text-lg font-semibold">
            <Leaf size={18} /> Edit Farm
          </h2>

          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={18} />
          </button>
        </div>

        {/* BODY */}
        <div className="p-5 overflow-y-auto flex-1">
          <form onSubmit={updateFarm} className="space-y-4">
            {/* FARM NAME */}
            <div className="relative">
              <Leaf size={16} className="absolute left-3 top-3 text-gray-400" />
              <input
                value={farmName}
                onChange={(e) => setFarmName(e.target.value)}
                placeholder="Farm Name"
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* AREA */}
            <div className="relative">
              <Ruler
                size={16}
                className="absolute left-3 top-3 text-gray-400"
              />
              <input
                type="number"
                value={totalArea}
                onChange={(e) => setTotalArea(e.target.value)}
                placeholder="Total Area (Acres)"
                required
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-800 border border-white/10 outline-none"
              />
            </div>

            {/* LOCATION */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                value={village}
                onChange={(e) => setVillage(e.target.value)}
                placeholder="Village"
                className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
              />
              <input
                value={district}
                onChange={(e) => setDistrict(e.target.value)}
                placeholder="District"
                className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
              />
              <input
                value={state}
                onChange={(e) => setState(e.target.value)}
                placeholder="State"
                className="px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
              />
            </div>

            {/* MAP */}
            <div className="rounded-xl overflow-hidden border border-white/10">
              <MapPicker position={position} setPosition={setPosition} />
            </div>

            {position && (
              <p className="text-xs text-center text-gray-400 flex items-center justify-center gap-1">
                <MapPin size={12} />
                {position.lat.toFixed(5)}, {position.lng.toFixed(5)}
              </p>
            )}

            {/* PHOTO */}
            <div>
              <label className="flex items-center gap-2 text-sm text-gray-400 mb-1">
                <ImagePlus size={14} /> Add More Photos
              </label>

              <input
                type="file"
                multiple
                accept="image/*"
                onChange={selectPhotos}
                className="text-sm text-gray-400"
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
                    className="w-full h-20 object-cover rounded-lg border border-white/10"
                  />
                ))}
              </div>
            )}

            {/* UPLOAD BUTTON */}
            {photos.length > 0 && (
              <button
                type="button"
                onClick={uploadPhotos}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 py-2 rounded-lg text-sm"
              >
                <Upload size={14} /> Upload Photos
              </button>
            )}
          </form>
        </div>

        {/* FOOTER */}
        <div className="px-5 py-4 border-t border-white/10 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
          >
            Cancel
          </button>

          <button
            onClick={updateFarm}
            disabled={loading}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm flex items-center gap-2"
          >
            {loading ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditFarmModal;
