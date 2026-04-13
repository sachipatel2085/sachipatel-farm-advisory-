import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import EditCropModal from "../components/EditCropModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import AddTransactionModal from "../components/AddTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import Breadcrumb from "../components/Breadcrumb";
import { Sprout, MapPin, Activity, Wallet, History } from "lucide-react";
import "../styles/cropDetails.css";

const CropDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [crop, setCrop] = useState(null);
  const [editCrop, setEditCrop] = useState(null);
  const [deleteCrop, setDeleteCrop] = useState(null);
  const [showExpense, setShowExpense] = useState(null);
  const [editTxn, setEditTxn] = useState(null);
  const [selectedTxn, setSelectedTxn] = useState(null);

  const loadCrop = async () => {
    const res = await api.get(`/crops/${id}`);
    setCrop(res.data);
  };

  useEffect(() => {
    loadCrop();
  }, []);

  if (!crop) return <p className="loading">Loading...</p>;

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
    <div className="crop-details-page">
      <Breadcrumb currentName={crop.cropName} />

      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* HEADER */}
      <div className="crop-header">
        <div>
          <h2 className="title">
            <Sprout size={20} /> {crop.cropName}
          </h2>
          <p className="farm-name">
            <MapPin size={14} /> {crop.farmName}
          </p>
        </div>

        <span className={`stage ${crop.growthStage}`}>{crop.growthStage}</span>
      </div>

      {/* PROGRESS */}
      <div className="section card">
        <h3 className="section-title">
          <Activity size={18} /> Crop Progress
        </h3>

        <div className="progress-wrap">
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="progress-info">
          <span>Age: {crop.cropAgeDays} days</span>
          <span>
            Remaining:{" "}
            {Math.max(0, crop.expectedDurationDays - crop.cropAgeDays)} days
          </span>
        </div>
      </div>

      {/* YIELD */}
      <div className="section grid-2">
        <div className="card">
          <h4>Expected Yield</h4>
          <p>{crop.expectedYield || "—"} kg</p>
        </div>

        <div className="card">
          <h4>Actual Yield</h4>
          <p>{crop.actualYield || "—"} kg</p>
        </div>
      </div>

      {/* FINANCE */}
      <div className="section grid-3">
        <div className="card income-box">
          <h4>Income</h4>
          <p>₹ {income}</p>
        </div>

        <div className="card expense-box">
          <h4>Expense</h4>
          <p>₹ {expense}</p>
        </div>

        <div className="card profit-box">
          <h4>Profit</h4>
          <p>₹ {profit}</p>
        </div>
      </div>

      {/* TRANSACTIONS */}
      <div className="section card">
        <div className="section-header">
          <h3 className="section-title">
            <Wallet size={18} /> Transactions
          </h3>

          <button
            className="add-transaction-btn"
            onClick={() => setShowExpense(crop)}
          >
            + Add
          </button>
        </div>

        <div className="txn-list">
          {crop.transactions.map((t) => (
            <div
              key={t._id}
              className={`txn-row ${t.type}`}
              onClick={() => setSelectedTxn(t)}
            >
              <div>
                <strong>{t.title}</strong>
                <small>{new Date(t.date).toLocaleDateString()}</small>
              </div>

              <span>₹ {t.amount}</span>
              <span className="tag">{t.type}</span>
            </div>
          ))}
        </div>
      </div>

      {/* HISTORY */}
      <div className="section card">
        <h3 className="section-title">
          <History size={18} /> Crop History
        </h3>

        <div className="timeline">
          {crop.history.map((h, i) => (
            <div key={i} className="timeline-item">
              <strong>{h.title}</strong>
              <p>{h.note}</p>
              <small>{new Date(h.date).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="crop-actions">
        <button onClick={() => setEditCrop(crop)}>Edit</button>
        <button className="danger" onClick={() => setDeleteCrop(crop)}>
          Delete
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
    </div>
  );
};

export default CropDetails;
