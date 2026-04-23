import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import EditLedgerModal from "../components/EditLedgerModal";
import { Store, MapPin, Phone } from "lucide-react";

export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [shop, setShop] = useState(null);
  const [ledger, setLedger] = useState([]);
  const [summary, setSummary] = useState({});
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
      loadData();
    } catch {
      alert("Delete failed");
    }
  };

  if (!shop) return <div className="p-6 text-gray-400">Loading...</div>;

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
        <h2 className="flex items-center gap-2 text-lg font-semibold">
          <Store size={20} /> {shop.name}
        </h2>

        <p className="flex items-center gap-2 text-sm text-gray-400 mt-2">
          <MapPin size={16} /> {shop.address || "—"}
        </p>

        <p className="flex items-center gap-2 text-sm text-gray-400">
          <Phone size={16} /> {shop.phone || "—"}
        </p>
      </div>

      {/* SUMMARY */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card title="Udhar" value={`₹${summary.totalUdhar || 0}`} color="red" />
        <Card title="Paid" value={`₹${summary.totalPaid || 0}`} color="green" />
        <Card
          title="Balance"
          value={`₹${summary.remaining || 0}`}
          color="blue"
        />
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
          {ledger.map((l, i) => (
            <div
              key={i}
              className="grid sm:grid-cols-6 gap-2 items-center bg-white/5 p-3 rounded-lg hover:bg-white/10"
            >
              <span className="text-xs text-gray-400">
                {new Date(l.date).toLocaleDateString()}
              </span>

              <span>{l.note}</span>

              <span className="text-red-400">
                {l.type === "debit" ? `₹${l.amount}` : "-"}
              </span>

              <span className="text-green-400">
                {l.type === "credit" ? `₹${l.amount}` : "-"}
              </span>

              <span
                className={`font-semibold ${
                  l.balance >= 0 ? "text-red-400" : "text-green-400"
                }`}
              >
                {l.balance >= 0 ? `-₹${l.balance}` : `+₹${Math.abs(l.balance)}`}
              </span>

              {/* ACTIONS */}
              <div className="flex gap-2">
                <button
                  onClick={() => setEditItem(l)}
                  className="px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 rounded"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(l)}
                  className="px-2 py-1 text-xs bg-red-500 hover:bg-red-600 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
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
