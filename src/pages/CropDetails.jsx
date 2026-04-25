import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import EditCropModal from "../components/EditCropModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import AddTransactionModal from "../components/AddTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import Breadcrumb from "../components/Breadcrumb";
import { Sprout, MapPin, Activity, Wallet, History } from "lucide-react";
import HarvestModal from "../components/HarvestModal";
import AddCropHistoryModal from "../components/AddCropHistoryModal";
import EditCropHistoryModal from "../components/EditCropHistoryModal";

const CropDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [crop, setCrop] = useState(null);
  const [history, setHistory] = useState([]);

  const [editCrop, setEditCrop] = useState(null);
  const [deleteCrop, setDeleteCrop] = useState(null);
  const [showExpense, setShowExpense] = useState(null);
  const [editTxn, setEditTxn] = useState(null);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [harvestCropState, setHarvestCropState] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    const start = Date.now();

    try {
      const [cropRes, historyRes] = await Promise.all([
        api.get(`/crops/${id}`),
        api.get(`/crop-history/${id}`),
      ]);

      setCrop(cropRes.data);
      setHistory(historyRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      const elapsed = Date.now() - start;
      const minTime = 600;

      setTimeout(
        () => {
          setLoading(false);
        },
        elapsed < minTime ? minTime - elapsed : 0,
      );
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  if (!crop) return null;

  const progress = Math.min(
    100,
    Math.round((crop.cropAgeDays / crop.expectedDurationDays) * 100),
  );

  const income = crop.transactions
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);

  const expense = crop.transactions
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const profit = income - expense;

  return (
    <div className="p-4 sm:p-6 space-y-6 text-slate-200">
      <Breadcrumb currentName={crop.cropName} />

      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-white"
      >
        ← Back
      </button>

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          {loading ? (
            <>
              <div className="h-5 w-40 bg-white/10 rounded animate-pulse mb-2" />
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            </>
          ) : (
            <>
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Sprout size={20} /> {crop.cropName}
              </h2>
              <p className="flex items-center gap-1 text-sm text-gray-400">
                <MapPin size={14} /> {crop.farmName}
              </p>
            </>
          )}
        </div>

        {!loading && (
          <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400 capitalize">
            {crop.growthStage}
          </span>
        )}
      </div>

      {/* PROGRESS */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
        <h3 className="flex items-center gap-2 mb-3">
          <Activity size={18} /> Crop Progress
        </h3>

        {loading ? (
          <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
        ) : (
          <>
            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="flex justify-between text-sm text-gray-400 mt-2">
              <span>Age: {crop.cropAgeDays} days</span>
              <span>
                Remaining:{" "}
                {Math.max(0, crop.expectedDurationDays - crop.cropAgeDays)} days
              </span>
            </div>
          </>
        )}
      </div>

      {/* FINANCE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="p-4 rounded-xl border border-white/10 bg-white/5"
          >
            {loading ? (
              <div className="h-5 w-20 bg-white/10 rounded animate-pulse" />
            ) : i === 1 ? (
              <p className="text-green-400">₹ {income}</p>
            ) : i === 2 ? (
              <p className="text-red-400">₹ {expense}</p>
            ) : (
              <p className="text-blue-400">₹ {profit}</p>
            )}
          </div>
        ))}
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-2">
            <Wallet size={18} /> Transactions
          </h3>

          {!loading && (
            <button
              onClick={() => setShowExpense(crop)}
              className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-sm"
            >
              + Add
            </button>
          )}
        </div>

        <div className="space-y-2">
          {loading
            ? [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-white/10 rounded animate-pulse"
                />
              ))
            : crop.transactions.map((t) => (
                <div
                  key={t._id}
                  onClick={() => setSelectedTxn(t)}
                  className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
                >
                  <div>
                    <p className="font-medium">{t.title}</p>
                    <p className="text-xs text-gray-400">
                      {new Date(t.date).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="text-right">
                    <p>₹ {t.amount}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>

      {/* HISTORY */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-2">
            <History size={18} /> Crop History
          </h3>

          {!loading && (
            <button
              onClick={() => setShowHistoryModal(crop)}
              className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-sm"
            >
              + Add History
            </button>
          )}
        </div>

        <div className="space-y-3">
          {loading
            ? [...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="h-14 bg-white/10 rounded animate-pulse"
                />
              ))
            : history.map((h) => (
                <div
                  key={h._id}
                  onClick={() => setSelectedHistory(h)}
                  className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
                >
                  <p className="font-medium">{h.title}</p>
                </div>
              ))}
        </div>
      </div>

      {/* ACTIONS */}
      {!loading && (
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => setEditCrop(crop)}
            className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm flex items-center gap-2"
          >
            Edit
          </button>
          <button
            onClick={() => setDeleteCrop(crop)}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm flex items-center gap-2"
          >
            Delete
          </button>
        </div>
      )}

      {/* MODALS (unchanged) */}
      <EditCropModal
        isOpen={!!editCrop}
        crop={editCrop}
        onClose={() => setEditCrop(null)}
        onSuccess={loadAll}
      />

      <DeleteConfirmModal
        isOpen={!!deleteCrop}
        crop={deleteCrop}
        onClose={() => setDeleteCrop(null)}
        onSuccess={() => navigate("/crops")}
      />

      <AddTransactionModal
        crop={showExpense}
        isOpen={!!showExpense}
        onClose={() => setShowExpense(null)}
        onSuccess={loadAll}
      />

      <EditTransactionModal
        cropId={id}
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
        onSuccess={loadAll}
      />

      <HarvestModal
        isOpen={!!harvestCropState}
        crop={harvestCropState}
        onClose={() => setHarvestCropState(null)}
        onSuccess={loadAll}
      />

      <AddCropHistoryModal
        isOpen={!!showHistoryModal}
        crop={showHistoryModal}
        onClose={() => setShowHistoryModal(null)}
        onSuccess={loadAll}
      />

      <EditCropHistoryModal
        history={selectedHistory}
        onClose={() => setSelectedHistory(null)}
        onSuccess={loadAll}
      />
    </div>
  );
};

export default CropDetails;
