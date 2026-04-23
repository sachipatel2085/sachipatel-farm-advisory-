import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tractor, Leaf, IndianRupee, LineChart, Wheat } from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
  }, [navigate]);

  return (
    <div className="min-h-screen p-6 sm:p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-slate-200 font-sans">
      {/* HEADER */}
      <div>
        <h1 className="flex items-center gap-2 text-2xl sm:text-3xl font-semibold">
          <Wheat size={22} /> Farm Dashboard
        </h1>
        <p className="opacity-70 mt-1 text-sm sm:text-base">
          Welcome back! Here's your farm overview
        </p>
      </div>

      {/* GRID */}
      <div className="grid gap-5 mt-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card title="Total Farms" value="3" icon={<Tractor />} />
        <Card title="Active Crops" value="12" icon={<Leaf />} />
        <Card title="Revenue" value="₹2.4L" icon={<IndianRupee />} />
        <Card title="Analytics" value="Growth" icon={<LineChart />} />
      </div>

      {/* SECTION */}
      <div className="mt-10">
        <h2 className="text-lg sm:text-xl font-medium mb-4">Insights</h2>

        <div className="h-[200px] rounded-xl bg-white/5 flex items-center justify-center opacity-60 border border-white/10">
          Charts coming soon...
        </div>
      </div>
    </div>
  );
}

/* CARD */
const Card = ({ title, value, icon }) => (
  <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-xl p-5 transition hover:-translate-y-1 hover:border-green-500">
    <div className="flex items-center gap-3">
      <div className="text-green-500">{icon}</div>
      <p className="text-sm opacity-70">{title}</p>
    </div>

    <h2 className="text-2xl mt-2 text-green-500 font-semibold">{value}</h2>
  </div>
);
