import React, { useEffect, useState } from "react";
import api from "../api/axios";
import MapPicker from "./MapPicker";
import { reverseGeocode } from "../utils/reverseGeocode";

const CreateFarmModal = ({ onClose, onCreated }) => {
  const [farmName, setFarmName] = useState("");
  const [totalArea, setTotalArea] = useState("");

  const [village, setVillage] = useState("");
  const [district, setDistrict] = useState("");
  const [state, setState] = useState("");

  const [position, setPosition] = useState(null);

  const [photos, setPhotos] = useState([]);
  const [preview, setPreview] = useState([]);

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

  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const createFarm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await api.post("/farms", {
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

      const farmId = res.data._id;

      if (photos.length > 0) {
        const formData = new FormData();
        photos.forEach((p) => formData.append("photos", p));

        await api.post(`/farms/${farmId}/photos`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      onCreated();
      onClose();
    } catch (err) {
      alert("Failed to create farm");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-semibold">🌾 Add New Farm</h2>

        <form onSubmit={createFarm} className="space-y-3">
          <input
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            placeholder="Farm Name"
            required
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10 focus:ring-2 focus:ring-green-500"
          />

          <input
            type="number"
            value={totalArea}
            onChange={(e) => setTotalArea(e.target.value)}
            placeholder="Total Area (Acres)"
            required
            className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-white/10"
          />

          {/* LOCATION */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
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
            <p className="text-xs text-center text-gray-400">
              Lat: {position.lat.toFixed(5)} | Lng: {position.lng.toFixed(5)}
            </p>
          )}

          {/* PHOTO UPLOAD */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handlePhotoSelect}
            className="text-sm text-gray-400"
          />

          {/* PREVIEW */}
          {preview.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {preview.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt="preview"
                  className="w-full h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          {/* ACTIONS */}
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-sm"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-sm"
            >
              {loading ? "Saving..." : "Create Farm"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateFarmModal;
