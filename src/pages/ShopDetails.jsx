import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import "../styles/finance.css";

export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [summary, setSummary] = useState({});

  const loadData = async () => {
    const res = await api.get(`/finance/shop/${id}`);

    setShop(res.data.shop);
    setLedger(res.data.ledger);
    setSummary(res.data.summary);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (!shop) return <p>Loading...</p>;

  return (
    <div className="finance-page">
      {/* BACK */}
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>

      {/* SHOP INFO */}
      <div className="card">
        <h2>📒 {shop.name}</h2>
        <p>📍 {shop.address || "—"}</p>
        <p>📞 {shop.phone || "—"}</p>
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
          </div>

          {ledger.map((l, i) => (
            <div key={i} className="ledger-row">
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
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const Card = ({ title, value }) => (
  <div className="dash-card">
    <p>{title}</p>
    <h2>{value}</h2>
  </div>
);
