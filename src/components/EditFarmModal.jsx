import React, { useEffect, useState } from "react";
import api from "../api/axios";
import MapPicker from "./MapPicker";
import { reverseGeocode } from "../utils/reverseGeocode";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-slate-900 border border-white/10 rounded-2xl p-6 space-y-4 shadow-xl">
        <h2 className="text-lg font-semibold">✏️ Edit Farm</h2>

        <form onSubmit={updateFarm} className="space-y-3">
          <input
            value={farmName}
            onChange={(e) => setFarmName(e.target.value)}
            placeholder="Farm Name"
            required
            className="input"
          />

          <input
            type="number"
            value={totalArea}
            onChange={(e) => setTotalArea(e.target.value)}
            placeholder="Total Area (Acres)"
            required
            className="input"
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <input
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="Village"
              className="input"
            />
            <input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="District"
              className="input"
            />
            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
              className="input"
            />
          </div>

          <div className="rounded-xl overflow-hidden border border-white/10">
            <MapPicker position={position} setPosition={setPosition} />
          </div>

          {position && (
            <p className="text-xs text-center text-gray-400">
              Lat: {position.lat.toFixed(5)} | Lng: {position.lng.toFixed(5)}
            </p>
          )}

          {/* Upload */}
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={selectPhotos}
          />

          {preview.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {preview.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  className="h-20 object-cover rounded-lg"
                />
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={uploadPhotos}
            className="w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg text-sm"
          >
            Upload Photos
          </button>

          <div className="flex justify-end gap-2 pt-2">
            <button onClick={onClose} type="button" className="btn-secondary">
              Cancel
            </button>

            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditFarmModal;
