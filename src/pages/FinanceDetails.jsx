import { useEffect, useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import Breadcrumb from "../components/Breadcrumb";

export default function FinanceDetails() {
  const [loading, setLoading] = useState(true);

  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({});
  const [filter, setFilter] = useState("all");

  const navigate = useNavigate();

  const loadData = async () => {
    setLoading(true);
    const start = Date.now();

    try {
      const [res1, res2] = await Promise.all([
        api.get("/finance/transactions"),
        api.get("/finance/summary"),
      ]);

      setTransactions(res1.data);
      setSummary(res2.data);
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

  const filtered =
    filter === "all"
      ? transactions
      : transactions.filter((t) => t.type === filter);

  return (
    <div className="p-4 sm:p-6 space-y-6 text-slate-200">
      <Breadcrumb currentName="Details" parent="Finance" />

      {/* BACK */}
      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-white"
      >
        ← Back
      </button>

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

      {/* FILTER */}
      <div className="flex gap-2 flex-wrap">
        <FilterBtn active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </FilterBtn>

        <FilterBtn
          active={filter === "income"}
          onClick={() => setFilter("income")}
        >
          Income
        </FilterBtn>

        <FilterBtn
          active={filter === "expense"}
          onClick={() => setFilter("expense")}
        >
          Expense
        </FilterBtn>
      </div>

      {/* TRANSACTIONS */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4 space-y-2">
        {loading
          ? [...Array(6)].map((_, i) => (
              <div key={i} className="h-14 bg-white/10 rounded animate-pulse" />
            ))
          : filtered.map((t) => (
              <div
                key={t._id}
                className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition"
              >
                <div>
                  <p className="font-medium">{t.title}</p>
                  <p className="text-xs text-gray-400">
                    {t.cropName} • {new Date(t.date).toLocaleDateString()}
                  </p>
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
  );
}

/* SUMMARY CARD */
const Card = ({ title, value, color }) => {
  const colorMap = {
    green: "bg-green-500/10 border-green-500/20 text-green-400",
    red: "bg-red-500/10 border-red-500/20 text-red-400",
    blue: "bg-blue-500/10 border-blue-500/20 text-blue-400",
  };

  return (
    <div className={`p-4 rounded-xl border ${colorMap[color]} bg-white/5`}>
      <p className="text-sm text-gray-400">{title}</p>
      <h2 className="text-lg font-semibold mt-1">{value}</h2>
    </div>
  );
};

/* FILTER BUTTON */
const FilterBtn = ({ children, active, ...props }) => (
  <button
    {...props}
    className={`px-4 py-2 rounded-lg text-sm transition ${
      active
        ? "bg-green-500 text-white"
        : "bg-slate-700 text-gray-300 hover:bg-slate-600"
    }`}
  >
    {children}
  </button>
);
