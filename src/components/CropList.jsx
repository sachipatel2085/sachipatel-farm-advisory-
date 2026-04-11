import React, { useEffect, useState } from "react";
import api from "../api/axios";
import AddCropModal from "../components/AddCropModal";
import "../styles/cropList.css";
import { useNavigate } from "react-router-dom";

const CropList = () => {
  const [crops, setCrops] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  const loadCrops = async () => {
    const res = await api.get("/crops");
    setCrops(res.data);
  };

  useEffect(() => {
    loadCrops();
  }, []);

  const progress = (age, duration) =>
    Math.min(100, Math.round((age / duration) * 100));

  return (
    <div className="crop-page">
      <div className="crop-topbar">
        <h2>🌾 Crops</h2>
        <button className="primary-btn" onClick={() => setShowAdd(true)}>
          + Add Crop
        </button>
      </div>

      <div className="crop-grid">
        {crops.map((crop) => (
          <div
            key={crop._id}
            className="crop-card-large"
            onClick={() => navigate(`/crops/${crop._id}`)}
          >
            <div className="crop-card-header">
              <h3>{crop.cropName}</h3>
              <span className={`stage ${crop.growthStage}`}>
                {crop.growthStage}
              </span>
            </div>

            <p className="farm-name">📍 {crop.farmName}</p>

            <div className="progress-wrap">
              <div
                className="progress-fill"
                style={{
                  width: `${progress(crop.cropAgeDays, crop.expectedDurationDays)}%`,
                }}
              />
            </div>

            <div className="crop-stats">
              <span>Age: {crop.cropAgeDays} days</span>
              <span>Duration: {crop.expectedDurationDays} days</span>
            </div>
          </div>
        ))}
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
