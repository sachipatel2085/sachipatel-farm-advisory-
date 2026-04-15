import { useEffect, useState } from "react";
import api from "../api/axios";
import "../styles/finance.css";
import { IndianRupee, Store } from "lucide-react";

export default function FinancePage() {
  const [summary, setSummary] = useState({});
  const [shops, setShops] = useState([]);

  const loadData = async () => {
    const res1 = await api.get("/finance/summary");
    const res2 = await api.get("/finance/shops");

    setSummary(res1.data);
    setShops(res2.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="finance-page">
      {/* ===== FARM FINANCE ===== */}
      <div className="section">
        <h2>
          <IndianRupee size={18} /> Farm Finance
        </h2>

        <div className="dashboard-grid">
          <Card title="Income" value={`₹${summary.income || 0}`} />
          <Card title="Expense" value={`₹${summary.expense || 0}`} />
          <Card title="Profit" value={`₹${summary.profit || 0}`} />
        </div>
      </div>

      {/* ===== SHOP BALANCE ===== */}
      <div className="section">
        <h2>
          <Store size={18} /> Agro Shop Balance
        </h2>

        <div className="shop-grid">
          {shops.map((s) => (
            <div className="shop-card" key={s.shop._id}>
              <h3>{s.shop.name}</h3>

              <p>Udhar: ₹{s.totalUdhar}</p>
              <p>Paid: ₹{s.totalPaid}</p>

              <p className="remaining">Remaining: ₹{s.remaining}</p>
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
