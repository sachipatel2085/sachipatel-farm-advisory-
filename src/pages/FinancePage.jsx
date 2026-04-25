import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import AddShopModal from "../components/AddShopModal";
import AddPaymentModal from "../components/AddPaymentModal";

export default function FinancePage() {
  const [loading, setLoading] = useState(true);

  const [summary, setSummary] = useState({});
  const [transactions, setTransactions] = useState([]);
  const [shops, setShops] = useState([]);

  const [showShopModal, setShowShopModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedShop, setSelectedShop] = useState(null);

  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    const start = Date.now();

    try {
      const [res1, res2, res3] = await Promise.all([
        api.get("/finance/summary"),
        api.get("/finance/transactions"),
        api.get("/finance/shops"),
      ]);

      setSummary(res1.data);
      setTransactions(res2.data.slice(0, 5));
      setShops(res3.data);
    } catch (err) {
      console.error(err);
    } finally {
      const elapsed = Date.now() - start;
      const minTime = 400;

      setTimeout(
        () => {
          setLoading(false);
        },
        elapsed < minTime ? minTime - elapsed : 0,
      );
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div className="p-4 sm:p-6 space-y-6 text-slate-200">
      {/* ===== SUMMARY ===== */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {loading ? (
          [1, 2, 3].map((i) => (
            <div
              key={i}
              className="p-4 rounded-xl border bg-white/5 space-y-2 animate-pulse"
            >
              <div className="h-3 w-20 bg-white/10 rounded"></div>
              <div className="h-5 w-24 bg-white/10 rounded"></div>
            </div>
          ))
        ) : (
          <>
            <Card
              title="Income"
              value={`₹${summary.income || 0}`}
              color="green"
            />
            <Card
              title="Expense"
              value={`₹${summary.expense || 0}`}
              color="red"
            />
            <Card
              title="Profit"
              value={`₹${summary.profit || 0}`}
              color="blue"
            />
          </>
        )}
      </div>

      {/* ===== TRANSACTIONS ===== */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Latest Transactions</h2>

          {!loading && (
            <button
              onClick={() => navigate("/finance/details")}
              className="text-sm text-green-400 hover:underline"
            >
              See More →
            </button>
          )}
        </div>

        <div className="space-y-2">
          {loading
            ? [...Array(4)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 bg-white/10 rounded animate-pulse"
                />
              ))
            : transactions.map((t) => (
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

          {!loading && (
            <button
              onClick={() => setShowShopModal(true)}
              className="bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm"
            >
              + Add Shop
            </button>
          )}
        </div>

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-3 animate-pulse"
              >
                <div className="h-4 w-24 bg-white/10 rounded"></div>
                <div className="h-3 w-20 bg-white/10 rounded"></div>
                <div className="h-3 w-20 bg-white/10 rounded"></div>
                <div className="h-4 w-24 bg-white/10 rounded"></div>
                <div className="h-8 w-full bg-white/10 rounded"></div>
              </div>
            ))}
          </div>
        ) : shops.length === 0 ? (
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
