import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/finance.css";
import EditLedgerModal from "../components/EditLedgerModal";
import { Store, MapPin, Phone } from "lucide-react";

export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [summary, setSummary] = useState({});
  const [selected, setSelected] = useState(null);
  const [editItem, setEditItem] = useState(null);

  const loadData = async () => {
    const res = await api.get(`/finance/shop/${id}`);

    setShop(res.data.shop);
    setLedger(res.data.ledger);
    setSummary(res.data.summary);
  };

  useEffect(() => {
    loadData();
  }, []);
  const handleDelete = async (item) => {
    if (!window.confirm("Delete this entry?")) return;

    try {
      if (item.model === "credit") {
        await api.delete(`/finance/credit/${item._id}`);
      } else {
        await api.delete(`/finance/payment/${item._id}`);
      }

      loadData(); // refresh
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (!shop) return <p>Loading...</p>;

  return (
    <div className="finance-page">
      {/* BACK */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* SHOP INFO */}
      <div className="card shop-info">
        <h2 className="shop-title">
          <Store size={20} /> {shop.name}
        </h2>

        <p className="shop-line">
          <MapPin size={16} /> {shop.address || "—"}
        </p>

        <p className="shop-line">
          <Phone size={16} /> {shop.phone || "—"}
        </p>
      </div>

      {/* SUMMARY */}
      <div className="dashboard-grid">
        <Card title="Udhar" value={`₹${summary.totalUdhar || 0}`} />
        <Card title="Paid" value={`₹${summary.totalPaid || 0}`} />
        <Card title="Balance" value={`₹${summary.remaining || 0}`} />
      </div>

      {/* LEDGER */}
      <div className="section">
        <h3>📑 Ledger</h3>

        <div className="ledger-table">
          <div className="ledger-header">
            <span>Date</span>
            <span>Note</span>
            <span>Debit</span>
            <span>Credit</span>
            <span>Balance</span>
            <span>Action</span>
          </div>

          {ledger.map((l, i) => (
            <div key={i} className="ledger-row" onClick={() => setSelected(l)}>
              <span>{new Date(l.date).toLocaleDateString()}</span>
              <span>{l.note}</span>

              <span className="debit">
                {l.type === "debit" ? `₹${l.amount}` : "-"}
              </span>

              <span className="credit">
                {l.type === "credit" ? `₹${l.amount}` : "-"}
              </span>

              <span
                className={`balance ${l.balance >= 0 ? "negative" : "positive"}`}
              >
                {l.balance >= 0 ? `-₹${l.balance}` : `+₹${Math.abs(l.balance)}`}
              </span>
              <div className="actions">
                <button
                  className="btn btn-sm btn-secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditItem(l);
                  }}
                >
                  Edit
                </button>

                <button
                  className="btn btn-sm btn-danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(l);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <EditLedgerModal
        item={editItem}
        onClose={() => setEditItem(null)}
        onSuccess={loadData}
      />
    </div>
  );
}

const Card = ({ title, value }) => (
  <div className="dash-card">
    <p>{title}</p>
    <h2>{value}</h2>
  </div>
);
