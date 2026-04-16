import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import "../styles/finance.css";
import AddShopModal from "../components/AddShopModal";
import AddPaymentModal from "../components/AddPaymentModal";

export default function FinancePage() {
  const [summary, setSummary] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [shops, setShops] = useState([]);
  const [showShopModal, setShowShopModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);
  const navigate = useNavigate();

  const loadData = async () => {
    const res1 = await api.get("/finance/summary");
    const res2 = await api.get("/finance/transactions");
    const res3 = await api.get("/finance/shops"); // 🔥 NEW

    setSummary(res1.data);
    setTransactions(res2.data.slice(0, 5));
    setShops(res3.data); // 🔥 NEW
  };
  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="finance-page">
      {/* ===== SUMMARY ===== */}
      <div className="dashboard-grid">
        <Card title="Income" value={`₹${summary.income || 0}`} />
        <Card title="Expense" value={`₹${summary.expense || 0}`} />
        <Card title="Profit" value={`₹${summary.profit || 0}`} />
      </div>

      {/* ===== LATEST TRANSACTIONS ===== */}
      <div className="section">
        <div className="section-header">
          <h2>Latest Transactions</h2>
          <button
            className="btn btn-secondary"
            onClick={() => navigate("/finance/details")}
          >
            See More →
          </button>
        </div>

        <div className="txn-list">
          {transactions.map((t) => (
            <div key={t._id} className={`txn-row ${t.type}`}>
              <div>
                <strong>{t.title}</strong>
                <small>{t.cropName}</small>
              </div>

              <span>₹ {t.amount}</span>
            </div>
          ))}
        </div>
      </div>
      {/* ===== SHOP BALANCE ===== */}
      <div className="section">
        <div className="section-header">
          <h2>🏪 Shop Balance (Udhar)</h2>

          <button
            className="btn btn-primary"
            onClick={() => setShowShopModal(true)}
          >
            + Add Shop
          </button>
        </div>
        <div className="shop-grid">
          {shops.length === 0 ? (
            <p className="empty">No shop data yet</p>
          ) : (
            shops.map((s) => (
              <div
                className="shop-card"
                key={s.shop._id}
                onClick={() => navigate(`/finance/shop/${s.shop._id}`)}
              >
                <h3>{s.shop.name}</h3>

                <p>Udhar: ₹{s.totalUdhar}</p>
                <p>Paid: ₹{s.totalPaid}</p>

                <p className="remaining">Remaining: ₹{s.remaining}</p>

                {/* 🔥 Add Payment Button */}
                <button
                  className="btn btn-primary btn-sm"
                  onClick={(e) => {
                    e.stopPropagation(); // prevent card click
                    setSelectedShop(s.shop);
                    setShowPaymentModal(true);
                  }}
                >
                  + Pay
                </button>
              </div>
            ))
          )}
        </div>
      </div>
      <AddShopModal
        isOpen={showShopModal}
        onClose={() => setShowShopModal(false)}
        onSuccess={loadData}
      />
      <AddPaymentModal
        isOpen={showPaymentModal}
        shop={selectedShop}
        onClose={() => setShowPaymentModal(false)}
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
