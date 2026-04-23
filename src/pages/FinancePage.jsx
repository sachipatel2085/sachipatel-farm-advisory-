import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
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
    const res3 = await api.get("/finance/shops");

    setSummary(res1.data);
    setTransactions(res2.data.slice(0, 5));
    setShops(res3.data);
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 text-slate-200">
      {/* ===== SUMMARY ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Income" value={`₹${summary.income || 0}`} color="green" />
        <Card title="Expense" value={`₹${summary.expense || 0}`} color="red" />
        <Card title="Profit" value={`₹${summary.profit || 0}`} color="blue" />
      </div>

      {/* ===== TRANSACTIONS ===== */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Latest Transactions</h2>

          <button
            onClick={() => navigate("/finance/details")}
            className="text-sm text-green-400 hover:underline"
          >
            See More →
          </button>
        </div>

        <div className="space-y-2">
          {transactions.map((t) => (
            <div
              key={t._id}
              className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10"
            >
              <div>
                <p className="font-medium">{t.title}</p>
                <p className="text-xs text-gray-400">{t.cropName}</p>
              </div>

              <p
                className={`font-semibold ${
                  t.type === "income" ? "text-green-400" : "text-red-400"
                }`}
              >
                ₹ {t.amount}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ===== SHOP BALANCE ===== */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4 flex-wrap gap-2">
          <h2 className="text-lg font-semibold">🏪 Shop Balance (Udhar)</h2>

          <button
            onClick={() => setShowShopModal(true)}
            className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm"
          >
            + Add Shop
          </button>
        </div>

        {shops.length === 0 ? (
          <p className="text-gray-400">No shop data yet</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {shops.map((s) => (
              <div
                key={s.shop._id}
                onClick={() => navigate(`/finance/shop/${s.shop._id}`)}
                className="bg-white/5 border border-white/10 rounded-xl p-4 hover:border-green-500 transition cursor-pointer"
              >
                <h3 className="font-semibold">{s.shop.name}</h3>

                <p className="text-sm text-gray-400 mt-2">
                  Udhar: ₹{s.totalUdhar}
                </p>
                <p className="text-sm text-gray-400">Paid: ₹{s.totalPaid}</p>

                <p className="mt-2 font-semibold text-red-400">
                  Remaining: ₹{s.remaining}
                </p>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedShop(s.shop);
                    setShowPaymentModal(true);
                  }}
                  className="mt-3 w-full bg-blue-500 hover:bg-blue-600 py-2 rounded-lg text-sm"
                >
                  + Pay
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODALS */}
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

/* CARD */
const Card = ({ title, value, color }) => {
  const colorMap = {
    green: "text-green-400 border-green-500/20 bg-green-500/10",
    red: "text-red-400 border-red-500/20 bg-red-500/10",
    blue: "text-blue-400 border-blue-500/20 bg-blue-500/10",
  };

  return (
    <div className={`p-4 rounded-xl border ${colorMap[color]} bg-white/5`}>
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className="text-lg font-semibold mt-1">{value}</h2>
    </div>
  );
};
