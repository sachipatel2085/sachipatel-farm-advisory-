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

  const [crop, setCrop] = useState(null);
  const [editCrop, setEditCrop] = useState(null);
  const [deleteCrop, setDeleteCrop] = useState(null);
  const [showExpense, setShowExpense] = useState(null);
  const [editTxn, setEditTxn] = useState(null);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [harvestCropState, setHarvestCropState] = useState(null);
  const [history, setHistory] = useState([]);
  const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const loadCrop = async () => {
    const res = await api.get(`/crops/${id}`);
    setCrop(res.data);
  };

  const loadHistory = async () => {
    const res = await api.get(`/crop-history/${id}`);
    setHistory(res.data);
  };

  useEffect(() => {
    loadCrop();
    loadHistory();
  }, []);

  if (!crop)
    return <div className="p-6 text-gray-400 animate-pulse">Loading...</div>;

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
          <h2 className="flex items-center gap-2 text-xl font-semibold">
            <Sprout size={20} /> {crop.cropName}
          </h2>
          <p className="flex items-center gap-1 text-sm text-gray-400">
            <MapPin size={14} /> {crop.farmName}
          </p>
        </div>

        <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400 capitalize">
          {crop.growthStage}
        </span>
      </div>

      {/* PROGRESS */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
        <h3 className="flex items-center gap-2 mb-3">
          <Activity size={18} /> Crop Progress
        </h3>

        <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all"
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
      </div>

      {/* YIELD */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <h4 className="text-sm text-gray-400">Expected Yield</h4>
          <p className="text-lg font-semibold">
            {crop.expectedYield || "—"} kg
          </p>
        </div>

        <div className="bg-white/5 p-4 rounded-xl border border-white/10">
          <h4 className="text-sm text-gray-400">Actual Yield</h4>
          <p className="text-lg font-semibold">{crop.actualYield || "—"} kg</p>
        </div>
      </div>

      {/* FINANCE */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl">
          <h4 className="text-sm text-gray-400">Income</h4>
          <p className="text-lg font-semibold text-green-400">₹ {income}</p>
        </div>

        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl">
          <h4 className="text-sm text-gray-400">Expense</h4>
          <p className="text-lg font-semibold text-red-400">₹ {expense}</p>
        </div>

        <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl">
          <h4 className="text-sm text-gray-400">Profit</h4>
          <p className="text-lg font-semibold text-blue-400">₹ {profit}</p>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="flex items-center gap-2">
            <Wallet size={18} /> Transactions
          </h3>

          <button
            onClick={() => setShowExpense(crop)}
            className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-sm"
          >
            + Add
          </button>
        </div>

        <div className="space-y-2">
          {crop.transactions.map((t) => (
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
                <span
                  className={`text-xs ${
                    t.type === "income" ? "text-green-400" : "text-red-400"
                  }`}
                >
                  {t.type}
                </span>
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

          <button
            onClick={() => setShowHistoryModal(crop)}
            className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-sm"
          >
            + Add History
          </button>
        </div>

        <div className="space-y-3">
          {history.map((h) => (
            <div
              key={h._id}
              onClick={() => setSelectedHistory(h)}
              className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer"
            >
              <p className="font-medium">{h.title}</p>
              <p className="text-sm text-gray-400">{h.note}</p>
              <p className="text-xs text-gray-500">
                {new Date(h.date).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => setEditCrop(crop)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg"
        >
          Edit
        </button>

        <button
          onClick={() => setDeleteCrop(crop)}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg"
        >
          Delete
        </button>

        <button
          onClick={() => setHarvestCropState(crop)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 rounded-lg"
        >
          Harvest
        </button>
      </div>

      {/* MODALS */}
      <EditCropModal
        isOpen={!!editCrop}
        crop={editCrop}
        onClose={() => setEditCrop(null)}
        onSuccess={loadCrop}
      />

      <DeleteConfirmModal
        isOpen={!!deleteCrop}
        crop={deleteCrop}
        onClose={() => setDeleteCrop(null)}
        onSuccess={() => navigate("/crops")}
      />

      <AddTransactionModal
        crop={showExpense}
        editingTxn={editTxn}
        isOpen={!!showExpense}
        onClose={() => {
          setShowExpense(null);
          setEditTxn(null);
        }}
        onSuccess={loadCrop}
      />

      <EditTransactionModal
        cropId={id}
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
        onSuccess={loadCrop}
      />

      <HarvestModal
        isOpen={!!harvestCropState}
        crop={harvestCropState}
        onClose={() => setHarvestCropState(null)}
        onSuccess={loadCrop}
      />

      <AddCropHistoryModal
        isOpen={!!showHistoryModal}
        crop={showHistoryModal}
        onClose={() => setShowHistoryModal(null)}
        onSuccess={loadHistory}
      />

      <EditCropHistoryModal
        history={selectedHistory}
        onClose={() => setSelectedHistory(null)}
        onSuccess={loadHistory}
      />
    </div>
  );
};

export default CropDetails;
