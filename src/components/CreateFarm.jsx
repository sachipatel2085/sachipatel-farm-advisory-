import React, { useEffect, useState } from "react";
import api from "../api/axios";
import MapPicker from "./MapPicker";
import { reverseGeocode } from "../utils/reverseGeocode";
import "../styles/EditFarmModal.css";

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

  /* Reverse geocode when location changes */
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

  /* Handle photo select */
  const handlePhotoSelect = (e) => {
    const files = Array.from(e.target.files);
    setPhotos(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const createFarm = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1️⃣ Create farm first
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

      // 2️⃣ Upload photos if selected
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
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>Add New Farm</h2>

        <div className="modal-content">
          <form onSubmit={createFarm}>
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

            {/* Photo Upload */}
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoSelect}
            />

            <div className="photo-preview">
              {preview.map((img, i) => (
                <img key={i} src={img} alt="preview" />
              ))}
            </div>

            <div className="modal-buttons">
              <button type="submit" className="save" disabled={loading}>
                {loading ? "Saving..." : "Create Farm"}
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

export default CreateFarmModal;
