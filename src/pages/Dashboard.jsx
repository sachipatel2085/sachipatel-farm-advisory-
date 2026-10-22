import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useLanguage } from "../context/LanguageContext";
import weatherService from "../services/weatherService";
import WeatherAlertBanner from "../components/weather/WeatherAlertBanner";
import WeatherWidget from "../components/weather/WeatherWidget";
import {
  Tractor,
  Leaf,
  IndianRupee,
  LineChart,
  Wheat,
  Plus,
  TrendingUp,
  Clock,
  Camera,
  Store,
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

      if (dashRes.status === "fulfilled") {
        const data = dashRes.value.data;
        setDashboardData(data);

        setStats({
          farms: data.totals?.farms || 0,
          crops: data.totals?.activeCrops || 0,
          revenue: data.totals?.revenue || 0,
          growth: data.totals?.growth || 0,
        });
      } else {
        // Fallback to individual endpoints if /dashboard encounters an issue
        try {
          const [farmsRes, cropsRes, financeRes] = await Promise.all([
            api.get("/farms"),
            api.get("/crops"),
            api.get("/finance/summary"),
          ]);
          const farms = farmsRes.data || [];
          const crops = cropsRes.data || [];
          const finance = financeRes.data || {};
          const activeCrops = crops.filter((c) => c.status === "active");

          setStats({
            farms: farms.length,
            crops: activeCrops.length,
            revenue: finance.income || 0,
            growth: finance.income > 0 ? Math.round((finance.profit / finance.income) * 100) : 0,
          });
        } catch (fallbackErr) {
          console.error("Fallback load error:", fallbackErr);
        }
      }

      if (weatherRes.status === "fulfilled") {
        setWeatherData(weatherRes.value);
      }
    } catch (err) {
      console.error("Dashboard load error:", err);
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

  const activeCropsCount = stats.crops;
  const totalCropsCount = dashboardData?.totals?.crops || stats.crops || 1;
  const activeRate = Math.min(100, Math.round((activeCropsCount / totalCropsCount) * 100));

  return (
    <div className="min-h-screen p-6 sm:p-8 bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-slate-200">
      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          <h1 className="flex items-center gap-2 text-2xl sm:text-3xl font-semibold">
            <Wheat size={22} className="text-emerald-400" /> {t("dashboard.title", "Farm Command Center")}
          </h1>
          <p className="opacity-70 mt-1 text-sm">
            {t("dashboard.subtitle", "Real-time crop telemetry, financial trends & automated farm care")}
          </p>
        </div>

        {/* QUICK ACTION */}
        <button
          onClick={() => navigate("/farms")}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 px-4 py-2 rounded-lg text-sm font-semibold transition shadow-lg shadow-green-500/20"
        >
          <Plus size={16} /> {t("farms.addFarm", "Add Farm")}
        </button>
      </div>

      {/* WEATHER-TRIGGERED SMART ALERTS BANNER */}
      {weatherData?.alerts && weatherData.alerts.length > 0 && (
        <div className="mt-6">
          <WeatherAlertBanner alerts={weatherData.alerts} location={weatherData.location} />
        </div>
      )}

      {/* STATS */}
      <div className="grid gap-5 mt-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          title={t("dashboard.totalFarms", "Total Farms")}
          value={loading ? "..." : stats.farms}
          icon={<Tractor />}
        />

        <Card
          title={t("dashboard.activeCrops", "Active Crops")}
          value={loading ? "..." : stats.crops}
          icon={<Leaf />}
        />

        <Card
          title={t("dashboard.revenue", "Revenue")}
          value={loading ? "..." : `₹${stats.revenue.toLocaleString("en-IN")}`}
          icon={<IndianRupee />}
        />

        <Card
          title={t("dashboard.growth", "Profit Margin")}
          value={loading ? "..." : `${stats.growth}%`}
          icon={<TrendingUp />}
        />
      </div>

      {/* ANALYTICS + ACTIVITY + WEATHER */}
      <div className="grid lg:grid-cols-3 gap-6 mt-8">
        {/* LEFT SIDE (CHARTS & PERFORMANCE) */}
        <div className="lg:col-span-2 space-y-5">
          {/* RECHARTS CASH FLOW CHART */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                <LineChart size={18} className="text-emerald-400" />
                {t("dashboard.monthlyTrends", "Monthly Cash Flow (Income vs Expenses)")}
              </h2>
              <span className="text-xs text-slate-400">Past 6 Months</span>
            </div>

            <div className="h-[240px] w-full pt-2">
              {loading ? (
                <div className="h-full flex items-center justify-center text-xs text-slate-400 animate-pulse">
                  Loading financial trends...
                </div>
              ) : dashboardData?.financialTrends && dashboardData.financialTrends.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={dashboardData.financialTrends}
                    margin={{ top: 10, right: 10, left: -5, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.3} />
                    <XAxis
                      dataKey="label"
                      stroke="#64748b"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#64748b"
                      tick={{ fill: "#94a3b8", fontSize: 11 }}
                      tickFormatter={(val) => `₹${val}`}
                      tickLine={false}
                    />
                    <Tooltip
                      content={({ active, payload, label }) => {
                        if (active && payload && payload.length) {
                          const income = payload.find((p) => p.dataKey === "income")?.value || 0;
                          const expense = payload.find((p) => p.dataKey === "expense")?.value || 0;
                          const netProfit = income - expense;
                          return (
                            <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 text-xs shadow-2xl space-y-1">
                              <p className="font-semibold text-slate-200 border-b border-slate-700 pb-1">{label}</p>
                              <p className="text-emerald-400 font-medium">Income: ₹{income.toLocaleString("en-IN")}</p>
                              <p className="text-rose-400 font-medium">Expense: ₹{expense.toLocaleString("en-IN")}</p>
                              <p className={`font-semibold ${netProfit >= 0 ? "text-emerald-300" : "text-rose-300"}`}>
                                Net: ₹{netProfit.toLocaleString("en-IN")}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Legend wrapperStyle={{ fontSize: "12px", paddingTop: "6px" }} />
                    <Bar dataKey="income" name="Income" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="expense" name="Expense" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-xs text-slate-400">
                  No cash flow transactions recorded yet.
                </div>
              )}
            </div>
          </div>

          {/* MINI ANALYTICS */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5">
            <h2 className="flex items-center gap-2 text-base font-semibold mb-4 text-white">
              <Leaf size={18} className="text-emerald-400" /> Farm & Crop Performance
            </h2>

            <Progress label="Active Growing Crops Ratio" value={activeRate || 0} />
            <Progress label="Harvested Batches" value={dashboardData?.cropStatus?.harvested ? 100 : 0} />
            <Progress
              label="Land Area Tracked"
              value={dashboardData?.totals?.totalArea ? Math.min(100, dashboardData.totals.totalArea * 10) : 0}
            />
          </div>
        </div>

        {/* RIGHT SIDE (DYNAMIC ACTIVITY FEED + LIVE WEATHER) */}
        <div className="space-y-5 flex flex-col">
          {/* LIVE WEATHER TELEMETRY WIDGET */}
          <WeatherWidget weatherData={weatherData} loading={loading} />

          {/* DYNAMIC ACTIVITY FEED */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-5 flex flex-col flex-1">
            <h2 className="flex items-center gap-2 text-base font-semibold mb-4 text-white">
              <Clock size={18} className="text-emerald-400" /> {t("dashboard.recentActivity", "Recent Farm Activity")}
            </h2>

            <div className="space-y-4 text-sm flex-1">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="h-8 bg-white/5 rounded animate-pulse" />
                ))
              ) : dashboardData?.recentActivity && dashboardData.recentActivity.length > 0 ? (
                dashboardData.recentActivity.map((act) => (
                  <ActivityItem key={act.id} text={act.text} time={act.time} type={act.type} />
                ))
              ) : (
                <div className="h-44 flex flex-col items-center justify-center text-slate-400 text-xs text-center space-y-1">
                  <Clock size={24} className="text-slate-500 mb-1" />
                  <p>No recent activity logs yet.</p>
                  <p className="text-[11px] text-slate-500">Record a crop, harvest, or transaction to see live updates.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ACTION WIDGETS */}
      <div className="grid sm:grid-cols-2 gap-5 mt-6">
        <div
          onClick={() => navigate("/scanner")}
          className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-green-500 transition cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <Camera className="text-green-400 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-gray-400">{t("dashboard.plantDoctor", "AI Plant Doctor")}</p>
          </div>

          <h2 className="text-2xl mt-2 text-green-400 font-semibold">
            Scan Crop for Disease
          </h2>
          <p className="text-xs text-slate-400 mt-1">{t("dashboard.scanDescription", "Instant vision-based leaf disease detection & remedy")}</p>
        </div>

        <div
          onClick={() => navigate("/mandi")}
          className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-emerald-500 transition cursor-pointer group"
        >
          <div className="flex items-center gap-3">
            <Store className="text-emerald-400 group-hover:scale-110 transition-transform" />
            <p className="text-sm text-gray-400">{t("dashboard.mandiCard", "APMC Mandi Rates")}</p>
          </div>

          <div className="flex items-baseline justify-between mt-2">
            <h2 className="text-2xl text-emerald-400 font-semibold">
              Live Market Prices
            </h2>
            <span className="text-xs text-slate-400">Compare Mandis →</span>
          </div>
          <p className="text-xs text-slate-400 mt-1">{t("dashboard.mandiDescription", "Track prevailing modal prices and 14-day price trends")}</p>
        </div>
      </div>

      {/* QUICK LINKS */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-8">
        <QuickCard title={t("nav.farms", "Manage Farms")} onClick={() => navigate("/farms")} />
        <QuickCard title={t("nav.crops", "View Crops")} onClick={() => navigate("/crops")} />
        <QuickCard title={t("nav.finance", "Finance & Ledger")} onClick={() => navigate("/finance")} />
        <QuickCard title={t("nav.mandi", "Mandi Prices & Trends")} onClick={() => navigate("/mandi")} />
      </div>
    </div>
  );
}

/* STAT CARD */
const Card = ({ title, value, icon }) => {
  const isLoading = value === "...";

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-5 hover:border-green-500 transition">
      <div className="flex items-center gap-3">
        <div className={`text-green-400 ${isLoading ? "opacity-50" : ""}`}>
          {icon}
        </div>

        {isLoading ? (
          <div className="h-3 w-24 bg-white/10 rounded animate-pulse" />
        ) : (
          <p className="text-sm text-gray-400">{title}</p>
        )}
      </div>

      {isLoading ? (
        <div className="h-6 w-16 bg-white/10 rounded animate-pulse mt-3" />
      ) : (
        <h2 className="text-2xl mt-2 text-green-400 font-semibold">{value}</h2>
      )}
    </div>
  );
};

/* PROGRESS */
const Progress = ({ label, value }) => (
  <div className="mb-4">
    <div className="flex justify-between text-xs text-gray-400">
      <span>{label}</span>
      <span>{value}%</span>
    </div>

    <div className="w-full h-2 bg-white/10 rounded-full mt-1">
      <div
        className="h-full bg-green-500 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  </div>
);

/* DYNAMIC ACTIVITY ITEM */
const ActivityItem = ({ text, time, type }) => {
  const isIncome = type === "income";
  const isExpense = type === "expense";
  const isHarvest = type === "harvest";

  return (
    <div className="flex justify-between items-start gap-2 text-xs border-b border-white/5 pb-2.5 last:border-0 last:pb-0">
      <div className="flex items-start gap-2">
        <span
          className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${
            isIncome
              ? "bg-emerald-400"
              : isExpense
              ? "bg-rose-400"
              : isHarvest
              ? "bg-amber-400"
              : "bg-blue-400"
          }`}
        />
        <span className="text-slate-300 leading-relaxed">{text}</span>
      </div>
      <span className="text-slate-500 text-[11px] shrink-0 whitespace-nowrap">{time}</span>
    </div>
  );
};

/* QUICK NAV CARD */
const QuickCard = ({ title, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white/5 border border-white/10 rounded-xl p-4 cursor-pointer hover:border-green-500 transition group"
  >
    <p className="font-medium text-white group-hover:text-green-400 transition-colors">{title}</p>
    <p className="text-xs text-gray-400 mt-1">Open →</p>
  </div>
);
