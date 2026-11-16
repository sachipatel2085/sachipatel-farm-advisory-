import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/Authcontext";
import weatherService from "../services/weatherService";
import WeatherAlertBanner from "../components/weather/WeatherAlertBanner";
import WeatherWidget from "../components/weather/WeatherWidget";
import {
  Tractor,
  Leaf,
  IndianRupee,
  LineChart,
  Plus,
  TrendingUp,
  Clock,
  Camera,
  Store,
  Calendar,
  Compass,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [stats, setStats] = useState({
    farms: 0,
    crops: 0,
    revenue: 0,
    growth: 0,
  });

  const loadDashboard = async () => {
    setLoading(true);

    try {
      const [dashRes, weatherRes] = await Promise.allSettled([
        api.get("/dashboard"),
        weatherService.getWeatherAlerts(),
      ]);

      if (dashRes.status === "fulfilled" && dashRes.value?.data) {
        const d = dashRes.value.data;
        setDashboardData(d);

        setStats({
          farms: d.totals?.farms || 0,
          crops: d.totals?.crops || 0,
          revenue: d.financials?.totalIncome || 0,
          growth: d.financials?.profitMargin || 0,
        });
      }

      if (weatherRes.status === "fulfilled" && weatherRes.value) {
        setWeatherData(weatherRes.value);
      }
    } catch (err) {
      console.error("Dashboard data load error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/", { replace: true });
      return;
    }

    loadDashboard();
  }, [navigate]);

  return (
    <div className="space-y-6 text-slate-100 w-full min-w-0">
      {/* WELCOME BANNER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 sm:p-6 bg-[#131d2e] border border-white/10 rounded-2xl shadow-sm">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold border border-emerald-500/20">
            <ShieldCheck size={13} />
            Verified Farm Assistant
          </div>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-white">
            Welcome back, {user?.name || "Farmer"}
          </h1>
          <p className="text-slate-400 text-xs sm:text-sm">
            Here is your daily farm summary: active crops, weather warnings, and market prices.
          </p>
        </div>

        {/* PRIMARY CTA */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto shrink-0">
          <button
            onClick={() => navigate("/farms")}
            className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition shadow-md shadow-emerald-600/20"
          >
            <Plus size={16} /> Add New Farm
          </button>
        </div>
      </div>

      {/* WEATHER-TRIGGERED SMART ALERTS BANNER */}
      {weatherData?.alerts && weatherData.alerts.length > 0 && (
        <div>
          <WeatherAlertBanner alerts={weatherData.alerts} location={weatherData.location} />
        </div>
      )}

      {/* 4 HIGH-CLARITY STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-5">
        <Card
          title="Total Farms"
          value={loading ? "..." : `${stats.farms} Farms`}
          icon={<Tractor size={20} />}
          accent="text-emerald-400"
        />

        <Card
          title="Active Crops"
          value={loading ? "..." : `${stats.crops} Growing`}
          icon={<Leaf size={20} />}
          accent="text-teal-400"
        />

        <Card
          title="Total Earnings"
          value={loading ? "..." : `₹${stats.revenue.toLocaleString("en-IN")}`}
          icon={<IndianRupee size={20} />}
          accent="text-emerald-400"
        />

        <Card
          title="Profit Margin"
          value={loading ? "..." : `${stats.growth}%`}
          icon={<TrendingUp size={20} />}
          accent="text-sky-400"
        />
      </div>

      {/* 2 PROMINENT ACTION CARDS: PLANT DOCTOR & MANDI PRICES */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Card 1: Plant Health & Leaf Scanner */}
        <div
          onClick={() => navigate("/scanner")}
          className="bg-[#131d2e] border border-white/10 hover:border-emerald-500/50 p-5 rounded-2xl transition cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Camera size={22} />
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Instant Diagnosis
              </span>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Plant Pests & Disease Scanner
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Notice spots or pests on your crops? Take a photo of the leaf to get curative spray dosages per 15L pump and organic remedies.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-semibold mt-4">
            <span>Open Leaf Camera</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>

        {/* Card 2: Live APMC Mandi Rates */}
        <div
          onClick={() => navigate("/mandi")}
          className="bg-[#131d2e] border border-white/10 hover:border-emerald-500/50 p-5 rounded-2xl transition cursor-pointer group shadow-sm flex flex-col justify-between"
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                <Store size={22} />
              </div>
              <span className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/20">
                Daily Mandi Rates
              </span>
            </div>

            <div>
              <h2 className="text-base sm:text-lg font-bold text-white group-hover:text-emerald-300 transition-colors">
                Market Commodity Prices
              </h2>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Check current selling prices for Wheat, Cotton, Tomato, and other crops across your local mandis to find the highest bidder.
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-emerald-400 font-semibold mt-4">
            <span>View Today&apos;s Mandi Rates</span>
            <ArrowRight size={15} className="group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </div>

      {/* ANALYTICS + RECENT ACTIVITY + WEATHER */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 sm:gap-6">
        {/* LEFT: FINANCIAL CASH FLOW */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#131d2e] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-3 shadow-sm">
            <div className="flex items-center justify-between flex-wrap gap-2 pb-2 border-b border-white/5">
              <h2 className="flex items-center gap-2 text-sm sm:text-base font-bold text-white">
                <LineChart size={18} className="text-emerald-400 shrink-0" />
                Monthly Cash Flow (Income vs Expenses)
              </h2>
              <span className="text-xs text-slate-400">Past 6 Months</span>
            </div>

            <div className="h-[220px] sm:h-[260px] w-full pt-2">
              {loading ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 animate-pulse">
                  Loading financial records...
                </div>
              ) : dashboardData?.financialTrends && dashboardData.financialTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.financialTrends}
                    margin={{ top: 10, right: 10, left: -15, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                    <XAxis
                      dataKey="label"
                      stroke="#64748b"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      tickLine={false}
                      tickFormatter={(val) => `₹${val}`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#0f172a",
                        borderColor: "#334155",
                        borderRadius: "12px",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                      formatter={(val) => [`₹${val.toLocaleString("en-IN")}`]}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "8px" }} />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 text-xs text-center space-y-1">
                  <p>No transaction history recorded yet.</p>
                  <p className="text-[11px] text-slate-500">Record crop expenses or crop sales to see your live financial profit chart.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RIGHT: WEATHER & RECENT ACTIVITY */}
        <div className="space-y-4">
          {/* WEATHER WIDGET */}
          <WeatherWidget weatherData={weatherData} />

          {/* RECENT ACTIVITIES */}
          <div className="bg-[#131d2e] border border-white/10 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/5">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Clock size={16} className="text-emerald-400" />
                Recent Farm Activities
              </h3>
              <button
                onClick={() => navigate("/activities")}
                className="text-xs text-emerald-400 hover:underline font-medium"
              >
                View All →
              </button>
            </div>

            <div className="space-y-2">
              {dashboardData?.recentActivities && dashboardData.recentActivities.length > 0 ? (
                dashboardData.recentActivities.slice(0, 4).map((act, i) => (
                  <div
                    key={act._id || i}
                    className="p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="space-y-0.5 min-w-0">
                      <p className="font-semibold text-white truncate">{act.title}</p>
                      <p className="text-[11px] text-slate-400 truncate">
                        {act.cropName || "General Task"} • {new Date(act.dueDate || act.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold uppercase ${
                        act.status === "completed"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : "bg-amber-500/10 text-amber-300"
                      }`}
                    >
                      {act.status || "Pending"}
                    </span>
                  </div>
                ))
              ) : (
                <div className="py-6 flex flex-col items-center justify-center text-slate-400 text-xs text-center space-y-1">
                  <CheckCircle2 size={22} className="text-emerald-500/40 mb-1" />
                  <p className="text-white font-medium">All tasks up to date</p>
                  <p className="text-[11px] text-slate-400">Schedule field tasks in your Tasks & Calendar.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* QUICK SHORTCUT CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <QuickCard
          title="My Farms"
          subtitle="View field boundaries"
          icon={<Tractor size={18} />}
          onClick={() => navigate("/farms")}
        />
        <QuickCard
          title="Active Crops"
          subtitle="Harvest schedules"
          icon={<Leaf size={18} />}
          onClick={() => navigate("/crops")}
        />
        <QuickCard
          title="Crop Planning"
          subtitle="Rotation & seed advice"
          icon={<Compass size={18} />}
          onClick={() => navigate("/planning")}
        />
        <QuickCard
          title="Tasks & Calendar"
          subtitle="Spraying & irrigation"
          icon={<Calendar size={18} />}
          onClick={() => navigate("/activities")}
        />
      </div>
    </div>
  );
}

/* STAT CARD */
const Card = ({ title, value, icon, accent = "text-emerald-400" }) => {
  const isLoading = value === "...";

  return (
    <div className="bg-[#131d2e] border border-white/10 rounded-2xl p-4 sm:p-5 hover:border-emerald-500/30 transition-all flex flex-col justify-between shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs sm:text-sm text-slate-400 font-medium truncate">{title}</p>
        <div className={`p-2 rounded-xl bg-white/5 ${accent} shrink-0`}>
          {icon}
        </div>
      </div>

      <div className="mt-3">
        {isLoading ? (
          <div className="h-7 w-20 bg-white/10 rounded-lg animate-pulse" />
        ) : (
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight truncate">{value}</h2>
        )}
      </div>
    </div>
  );
};

/* QUICK SHORTCUT CARD */
const QuickCard = ({ title, subtitle, icon, onClick }) => (
  <div
    onClick={onClick}
    className="bg-[#131d2e] border border-white/10 rounded-2xl p-4 hover:border-emerald-500/40 hover:bg-[#18253a] transition-all cursor-pointer flex items-center justify-between group shadow-sm"
  >
    <div className="flex items-center gap-3 min-w-0">
      <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 shrink-0 group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <div className="min-w-0">
        <p className="font-semibold text-white text-xs sm:text-sm truncate">{title}</p>
        {subtitle && <p className="text-[11px] text-slate-400 truncate mt-0.5">{subtitle}</p>}
      </div>
    </div>
    <span className="text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all text-xs font-bold shrink-0">→</span>
  </div>
);
