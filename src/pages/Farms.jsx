import React, { useEffect, useState } from "react";
import api from "../api/axios";
import EditFarmModal from "../components/EditFarmModal";
import CreateFarmModal from "../components/CreateFarm";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";
import { Plus, Wheat } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-slate-200">
      <div className="p-4 sm:p-6 max-w-7xl mx-auto">
        {loading ? (
          <div className="text-gray-400 animate-pulse">Loading farms...</div>
        ) : (
          <>
            <Breadcrumb />

            {/* HEADER */}
            <div className="flex justify-between items-center flex-wrap gap-3 mt-4 mb-6">
              <h1 className="flex items-center gap-2 text-2xl sm:text-3xl font-semibold">
                <Wheat size={22} /> My Farms
              </h1>

              <button
                onClick={() => setShowCreate(true)}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm"
              >
                <Plus size={18} /> Add Farm
              </button>
            </div>

            {/* EMPTY */}
            {farms.length === 0 && (
              <p className="text-gray-400">No farms added yet</p>
            )}

            {/* GRID */}
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {farms.map((farm) => (
                <div
                  key={farm._id}
                  className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-green-500 transition"
                >
                  {/* TOP */}
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">{farm.farmName}</h2>

                    <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                      {farm.totalArea} Acres
                    </span>
                  </div>

                  {/* LOCATION */}
                  <p className="text-sm text-gray-400 mt-2">
                    📍 {farm.location?.village}, {farm.location?.district}
                  </p>

                  {/* STATS */}
                  <div className="flex justify-between mt-4 text-sm">
                    <div>
                      <p className="text-gray-400">Crops</p>
                      <p className="font-semibold">--</p>
                    </div>

                    <div>
                      <p className="text-gray-400">Status</p>
                      <p className="text-green-400 font-semibold">Active</p>
                    </div>
                  </div>

                  {/* BUTTONS */}
                  <div className="flex gap-2 mt-5 flex-wrap">
                    <button
                      onClick={() => setSelectedFarm(farm)}
                      className="flex-1 bg-blue-500 hover:bg-blue-600 px-3 py-2 rounded-lg text-sm"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => navigate(`/farms/${farm._id}`)}
                      className="flex-1 bg-slate-700 hover:bg-slate-600 px-3 py-2 rounded-lg text-sm"
                    >
                      Details
                    </button>

                    <button
                      onClick={() => setDeleteFarmId(farm._id)}
                      className="flex-1 bg-red-500 hover:bg-red-600 px-3 py-2 rounded-lg text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* MODALS */}
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
    </div>
  );
};

export default FarmPage;
