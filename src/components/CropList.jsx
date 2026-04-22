import React, { useEffect, useState } from "react";
import api from "../api/axios";
import AddCropModal from "../components/AddCropModal";
import "../styles/cropList.css";
import { useNavigate } from "react-router-dom";
import { Sprout, CalendarDays, Timer, Wheat } from "lucide-react";

const CropList = ({ farmId }) => {
  const [crops, setCrops] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const navigate = useNavigate();

  const loadCrops = async () => {
    try {
      let url = "/crops";

      // 🔥 if farmId exists → use farm-specific API
      if (farmId) {
        url = `/crops/farm/${farmId}`;
      }

      const res = await api.get(url);
      setCrops(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadCrops();
  }, [farmId]);

  const progress = (age, duration) =>
    Math.min(100, Math.round((age / duration) * 100));

  return (
    <div className="crop-page dark">
      <div className="crop-topbar">
        <h2 className="page-title">
          <Wheat size={22} /> Crops
        </h2>

        <button className="primary-btn" onClick={() => setShowAdd(true)}>
          + Add Crop
        </button>
      </div>

      <div className="crop-grid">
        {crops.map((crop) => {
          const prog = progress(crop.cropAgeDays, crop.expectedDurationDays);

          return (
            <div
              key={crop._id}
              className="crop-card"
              onClick={() => navigate(`/crops/${crop._id}`)}
            >
              {/* HEADER */}
              <div className="crop-header">
                <div className="crop-title">
                  <Sprout size={18} />
                  <h3>{crop.cropName}</h3>
                </div>

                <span className={`stage ${crop.growthStage}`}>
                  {crop.growthStage}
                </span>
              </div>

              {/* FARM */}
              <p className="farm-name">📍 {crop.farmName}</p>

              {/* PROGRESS */}
              <div className="progress-section">
                <div className="progress-label">
                  <span>Growth</span>
                  <span>{prog}%</span>
                </div>

                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${prog}%` }}
                  />
                </div>
              </div>

              {/* STATS */}
              <div className="crop-stats">
                <div>
                  <CalendarDays size={14} />
                  <span>{crop.cropAgeDays} days</span>
                </div>

                <div>
                  <Timer size={14} />
                  <span>{crop.expectedDurationDays} days</span>
                </div>
              </div>
            </div>
          );
        })}
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
