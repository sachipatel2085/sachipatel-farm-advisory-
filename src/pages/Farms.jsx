import React, { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/farms.css";
import EditFarmModal from "../components/EditFarmModal";
import CreateFarmModal from "../components/CreateFarm";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { Plus, Pencil, Trash2, BarChart3, MapPin, Wheat } from "lucide-react";

const FarmPage = () => {
  const [farms, setFarms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFarm, setSelectedFarm] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [deleteFarmId, setDeleteFarmId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadFarms();
  }, []);

  const loadFarms = async () => {
    try {
      const res = await api.get("/farms");
      setFarms(res.data);
    } catch (err) {
      console.error("Failed to load farms", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.delete(`/farms/${deleteFarmId}`);
      setFarms(farms.filter((f) => f._id !== deleteFarmId));
      setDeleteFarmId(null);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="farm-container dark">
      {loading ? (
        <div className="loading">Loading farms...</div>
      ) : (
        <>
          <Breadcrumb />

          <div className="farm-header">
            <h1 className="page-title">
              <Wheat size={22} /> My Farms
            </h1>
            <button
              className="add-farm-btn"
              onClick={() => setShowCreate(true)}
            >
              <Plus size={18} /> Add Farm
            </button>
          </div>

          {farms.length === 0 && <p className="empty">No farms added yet</p>}

          <div className="farm-grid">
            {farms.map((farm) => (
              <div key={farm._id} className="farm-card clean">
                <div className="farm-top">
                  <h2>{farm.farmName}</h2>
                  <span className="badge">{farm.totalArea} Acres</span>
                </div>

                <div className="farm-info">
                  <p>
                    📍 {farm.location?.village}, {farm.location?.district}
                  </p>
                </div>

                <div className="farm-stats">
                  <div>
                    <span>Crops</span>
                    <strong>--</strong>
                  </div>
                  <div>
                    <span>Status</span>
                    <strong className="active">Active</strong>
                  </div>
                </div>

                <div className="btn-row">
                  <button
                    className="edit"
                    onClick={() => setSelectedFarm(farm)}
                  >
                    Edit
                  </button>

                  <button
                    className="dashboard-btn"
                    onClick={() => navigate(`/farms/${farm._id}`)}
                  >
                    Details
                  </button>

                  <button
                    className="delete"
                    onClick={() => setDeleteFarmId(farm._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          {showCreate && (
            <CreateFarmModal
              onClose={() => setShowCreate(false)}
              onCreated={loadFarms}
            />
          )}

          {selectedFarm && (
            <EditFarmModal
              farm={selectedFarm}
              onClose={() => setSelectedFarm(null)}
              onUpdated={loadFarms}
            />
          )}

          {deleteFarmId && (
            <ConfirmDeleteModal
              title="Delete Farm"
              message="This farm will be permanently removed."
              onCancel={() => setDeleteFarmId(null)}
              onConfirm={confirmDelete}
            />
          )}
        </>
      )}
    </div>
  );
};

export default FarmPage;
