import React, { useEffect, useState } from "react";
import api from "../api/axios";
import MapPicker from "./MapPicker";
import { reverseGeocode } from "../utils/reverseGeocode";
import "../styles/EditFarmModal.css";

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
      ? {
          lat: farm.location.latitude,
          lng: farm.location.longitude,
        }
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
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  const selectPhotos = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);

    setPreview(files.map((file) => URL.createObjectURL(file)));
  };
  const uploadPhotos = async () => {
    const formData = new FormData();
    photos.forEach((p) => formData.append("photos", p));

    await api.post(`/farms/${farm._id}/photos`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    onUpdated();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Edit Farm</h2>

        <div className="modal-content">
          <form onSubmit={updateFarm}>
            <input
              value={farmName}
              onChange={(e) => setFarmName(e.target.value)}
              placeholder="Farm Name"
              required
            />

            <input
              type="number"
              value={totalArea}
              onChange={(e) => setTotalArea(e.target.value)}
              placeholder="Total Area (Acres)"
              required
            />

            <input
              value={village}
              onChange={(e) => setVillage(e.target.value)}
              placeholder="Village"
            />

            <input
              value={district}
              onChange={(e) => setDistrict(e.target.value)}
              placeholder="District"
            />

            <input
              value={state}
              onChange={(e) => setState(e.target.value)}
              placeholder="State"
            />

            <MapPicker position={position} setPosition={setPosition} />

            {position && (
              <p
                style={{ textAlign: "center", fontSize: "14px", color: "#555" }}
              >
                Lat: {position.lat.toFixed(5)} | Lng: {position.lng.toFixed(5)}
              </p>
            )}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={selectPhotos}
            />

            <div className="photo-preview">
              {preview.map((img, i) => (
                <img key={i} src={img} alt="" />
              ))}
            </div>

            <button type="button" onClick={uploadPhotos} className="save">
              Upload Photos
            </button>

            <div className="modal-buttons">
              <button className="save" type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button type="button" className="cancel" onClick={onClose}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditFarmModal;
