import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/finance.css";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

export default function FinanceDetails() {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [filter, setFilter] = useState("all");
  const navigate = useNavigate();

  const loadData = async () => {
    const res1 = await api.get("/finance/transactions");
    const res2 = await api.get("/finance/summary");

    setTransactions(res1.data);
    setSummary(res2.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  return (
    <div className="finance-page">
      <Breadcrumb currentName="Details" parent="Finance" />
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      {/* SUMMARY */}
      <div className="dashboard-grid">
        <Card title="Income" value={`₹${summary.income}`} />
        <Card title="Expense" value={`₹${summary.expense}`} />
        <Card title="Profit" value={`₹${summary.profit}`} />
      </div>

      {/* FILTER */}
      <div className="filter-bar">
        <button
          className={`btn btn-sm ${filter === "all" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilter("all")}
        >
          All
        </button>

        <button
          className={`btn btn-sm ${filter === "income" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilter("income")}
        >
          Income
        </button>

        <button
          className={`btn btn-sm ${filter === "expense" ? "btn-primary" : "btn-secondary"}`}
          onClick={() => setFilter("expense")}
        >
          Expense
        </button>
      </div>

      {/* TRANSACTIONS */}
      <div className="txn-list">
        {filtered.map((t) => (
          <div key={t._id} className={`txn-row ${t.type}`}>
            <div>
              <strong>{t.title}</strong>
              <small>
                {t.cropName} • {new Date(t.date).toLocaleDateString()}
              </small>
            </div>

            <span>₹ {t.amount}</span>
          </div>
        ))}
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
