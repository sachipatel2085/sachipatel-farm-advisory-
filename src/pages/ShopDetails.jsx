import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import EditLedgerModal from "../components/EditLedgerModal";
import { Store, MapPin, Phone } from "lucide-react";

export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [shop, setShop] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [summary, setSummary] = useState({});
  const [editItem, setEditItem] = useState(null);

  const loadData = async () => {
    setLoading(true);
    const start = Date.now();

    try {
      const res = await api.get(`/finance/shop/${id}`);
      setShop(res.data.shop);
      setLedger(res.data.ledger);
      setSummary(res.data.summary);
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

  if (!shop && !loading) return null;

  return (
    <div className="p-4 sm:p-6 space-y-6 text-slate-200">
      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-white"
      >
        ← Back
      </button>

      {/* SHOP INFO */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        {loading ? (
          <div className="space-y-3 animate-pulse">
            <div className="h-5 w-40 bg-white/10 rounded"></div>
            <div className="h-4 w-60 bg-white/10 rounded"></div>
            <div className="h-4 w-40 bg-white/10 rounded"></div>
          </div>
        ) : (
          <>
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <Store size={20} /> {shop.name}
            </h2>

            <p className="flex items-center gap-2 text-sm text-gray-400 mt-2">
              <MapPin size={16} /> {shop.address || "—"}
            </p>

            <p className="flex items-center gap-2 text-sm text-gray-400">
              <Phone size={16} /> {shop.phone || "—"}
            </p>
          </>
        )}
      </div>

      {/* SUMMARY */}
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
              title="Udhar"
              value={`₹${summary.totalUdhar || 0}`}
              color="red"
            />
            <Card
              title="Paid"
              value={`₹${summary.totalPaid || 0}`}
              color="green"
            />
            <Card
              title="Balance"
              value={`₹${summary.remaining || 0}`}
              color="blue"
            />
          </>
        )}
      </div>

      {/* LEDGER */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-5">
        <h3 className="text-lg font-semibold mb-4">📑 Ledger</h3>

        {/* HEADER */}
        <div className="hidden sm:grid grid-cols-6 text-xs text-gray-400 mb-2 px-2">
          <span>Date</span>
          <span>Note</span>
          <span>Debit</span>
          <span>Credit</span>
          <span>Balance</span>
          <span>Action</span>
        </div>

        <div className="space-y-2">
          {loading ? (
            [...Array(6)].map((_, i) => (
              <div key={i} className="h-12 bg-white/10 rounded animate-pulse" />
            ))
          ) : ledger.length === 0 ? (
            <p className="text-center text-gray-400 py-6">
              No transactions yet
            </p>
          ) : (
            ledger.map((l, i) => (
              <div
                key={i}
                className="grid grid-cols-2 sm:grid-cols-6 gap-2 sm:gap-2 items-center bg-white/5 p-3 rounded-xl hover:bg-white/10 transition border border-white/5"
              >
                <div className="sm:block">
                  <span className="sm:hidden text-[10px] text-gray-500 block uppercase font-mono">Date</span>
                  <span className="text-xs text-gray-300">
                    {new Date(l.date).toLocaleDateString()}
                  </span>
                </div>

                <div className="col-span-2 sm:col-span-1">
                  <span className="sm:hidden text-[10px] text-gray-500 block uppercase font-mono">Note</span>
                  <span className="text-xs sm:text-sm font-medium text-white">{l.note}</span>
                </div>

                <div>
                  <span className="sm:hidden text-[10px] text-gray-500 block uppercase font-mono">Debit</span>
                  <span className="text-xs sm:text-sm text-red-400 font-semibold">
                    {l.type === "debit" ? `₹${l.amount}` : "—"}
                  </span>
                </div>

                <div>
                  <span className="sm:hidden text-[10px] text-gray-500 block uppercase font-mono">Credit</span>
                  <span className="text-xs sm:text-sm text-green-400 font-semibold">
                    {l.type === "credit" ? `₹${l.amount}` : "—"}
                  </span>
                </div>

                <div>
                  <span className="sm:hidden text-[10px] text-gray-500 block uppercase font-mono">Balance</span>
                  <span
                    className={`text-xs sm:text-sm font-semibold ${
                      l.balance >= 0 ? "text-red-400" : "text-green-400"
                    }`}
                  >
                    {l.balance >= 0
                      ? `-₹${l.balance}`
                      : `+₹${Math.abs(l.balance)}`}
                  </span>
                </div>

                <div className="flex gap-2 justify-end sm:justify-start col-span-2 sm:col-span-1 pt-1 sm:pt-0 border-t border-white/5 sm:border-t-0">
                  <button
                    onClick={() => setEditItem(l)}
                    className="px-2.5 py-1 text-xs bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border border-blue-500/30 rounded-lg transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(l)}
                    className="px-2.5 py-1 text-xs bg-red-500/20 hover:bg-red-500/30 text-red-300 border border-red-500/30 rounded-lg transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* MODAL */}
      <EditLedgerModal
        item={editItem}
        onClose={() => setEditItem(null)}
        onSuccess={loadData}
      />
    </div>
  );
}

/* CARD */
const Card = ({ title, value, color }) => {
  const colorMap = {
    red: "text-red-400 border-red-500/20 bg-red-500/10",
    green: "text-green-400 border-green-500/20 bg-green-500/10",
    blue: "text-blue-400 border-blue-500/20 bg-blue-500/10",
  };

  return (
    <div className={`p-4 rounded-xl border ${colorMap[color]} bg-white/5`}>
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className="text-lg font-semibold mt-1">{value}</h2>
    </div>
  );
};
