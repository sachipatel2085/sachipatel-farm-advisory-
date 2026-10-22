import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import EditCropModal from "../components/EditCropModal";
import DeleteConfirmModal from "../components/DeleteConfirmModal";
import AddTransactionModal from "../components/AddTransactionModal";
import EditTransactionModal from "../components/EditTransactionModal";
import Breadcrumb from "../components/Breadcrumb";
import {
  Sprout,
  MapPin,
  Activity,
  Wallet,
  History,
  Sparkles,
  Calendar,
} from "lucide-react";
import HarvestModal from "../components/HarvestModal";
import AddCropHistoryModal from "../components/AddCropHistoryModal";
import EditCropHistoryModal from "../components/EditCropHistoryModal";
import CropAdvisoryTab from "../components/advisory/CropAdvisoryTab";
import CropActivitiesTab from "../components/activity/CropActivitiesTab";
import weatherService from "../services/weatherService";
import WeatherAlertBanner from "../components/weather/WeatherAlertBanner";

const CropDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [crop, setCrop] = useState(null);
  const [history, setHistory] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [activeTab, setActiveTab] = useState("overview"); // "overview" | "advisory" | "activities"

  const [editCrop, setEditCrop] = useState(null);
  const [deleteCrop, setDeleteCrop] = useState(null);
  const [showExpense, setShowExpense] = useState(null);
  const [editTxn, setEditTxn] = useState(null);
  const [selectedTxn, setSelectedTxn] = useState(null);
  const [harvestCropState, setHarvestCropState] = useState(null);
  const [showHistoryModal, setShowHistoryModal] = useState(null);
  const [selectedHistory, setSelectedHistory] = useState(null);

  const loadAll = async () => {
    setLoading(true);
    const start = Date.now();

    try {
      const [cropRes, historyRes, weatherRes] = await Promise.allSettled([
        api.get(`/crops/${id}`),
        api.get(`/crop-history/${id}`),
        weatherService.getWeatherAlerts(),
      ]);

      if (cropRes.status === "fulfilled") {
        setCrop(cropRes.value.data);
      }
      if (historyRes.status === "fulfilled") {
        setHistory(historyRes.value.data);
      }
      if (weatherRes.status === "fulfilled") {
        setWeatherData(weatherRes.value);
      }
    } catch (err) {
      console.error(err);
    } finally {
      const elapsed = Date.now() - start;
      const minTime = 600;

      setTimeout(
        () => {
          setLoading(false);
        },
        elapsed < minTime ? minTime - elapsed : 0,
      );
    }
  };

  useEffect(() => {
    loadAll();
  }, [id]);

  if (!crop) return null;

  const progress = Math.min(
    100,
    Math.round((crop.cropAgeDays / crop.expectedDurationDays) * 100),
  );

  const income = (crop.transactions || [])
    .filter((t) => t.type === "income")
    .reduce((s, t) => s + Number(t.amount), 0);

  const expense = (crop.transactions || [])
    .filter((t) => t.type === "expense")
    .reduce((s, t) => s + Number(t.amount), 0);

  const profit = income - expense;

  const relevantAlerts = (weatherData?.alerts || []).filter((alert) => {
    if (!crop) return false;
    if (alert.severity === "high") return true;
    const cName = (crop.cropName || "").toLowerCase();
    return (alert.affectedCrops || []).some((c) =>
      cName.includes(c.toLowerCase()) || c.toLowerCase().includes(cName)
    );
  });

  return (
    <div className="p-4 sm:p-6 space-y-6 text-slate-200">
      <Breadcrumb currentName={crop.cropName} />

      <button
        onClick={() => navigate(-1)}
        className="text-sm text-gray-400 hover:text-white"
      >
        ← Back
      </button>

      {/* HEADER */}
      <div className="flex justify-between items-center flex-wrap gap-3">
        <div>
          {loading ? (
            <>
              <div className="h-5 w-40 bg-white/10 rounded animate-pulse mb-2" />
              <div className="h-4 w-24 bg-white/10 rounded animate-pulse" />
            </>
          ) : (
            <>
              <h2 className="flex items-center gap-2 text-xl font-semibold">
                <Sprout size={20} /> {crop.cropName}
              </h2>
              <p className="flex items-center gap-1 text-sm text-gray-400">
                <MapPin size={14} /> {crop.farmName}
              </p>
            </>
          )}
        </div>

        {!loading && (
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-sm bg-green-500/20 text-green-400 capitalize">
              {crop.growthStage || "Vegetative"}
            </span>
          </div>
        )}
      </div>

      {/* SMART WEATHER ALERTS RELEVANT TO THIS CROP */}
      {relevantAlerts.length > 0 && (
        <WeatherAlertBanner alerts={relevantAlerts} location={weatherData?.location} />
      )}

      {/* TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 flex-wrap">
        <button
          onClick={() => setActiveTab("overview")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "overview"
              ? "bg-green-500 text-white"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Activity size={16} /> Overview & Ledger
        </button>

        <button
          onClick={() => setActiveTab("activities")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "activities"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Calendar
            size={16}
            className={
              activeTab === "activities" ? "text-white" : "text-emerald-400"
            }
          />
          Activities & Tasks
        </button>

        <button
          onClick={() => setActiveTab("advisory")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
            activeTab === "advisory"
              ? "bg-emerald-600 text-white shadow-lg shadow-emerald-500/20"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Sparkles
            size={16}
            className={
              activeTab === "advisory" ? "text-white" : "text-emerald-400"
            }
          />
          Advisory & Care
          <span className="ml-1 text-[11px] px-1.5 py-0.2 rounded-full bg-emerald-400/20 text-emerald-300">
            Agronomy AI
          </span>
        </button>
      </div>

      {/* TAB CONTENT: ACTIVITIES & TASKS */}
      {activeTab === "activities" && (
        <CropActivitiesTab cropId={id} crop={crop} />
      )}

      {/* TAB CONTENT: ADVISORY & CARE */}
      {activeTab === "advisory" && (
        <CropAdvisoryTab cropId={id} crop={crop} />
      )}

      {/* TAB CONTENT: OVERVIEW & LEDGER */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* PROGRESS */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <h3 className="flex items-center gap-2 mb-3 font-medium">
              <Activity size={18} /> Crop Progress
            </h3>

            {loading ? (
              <div className="h-3 w-full bg-white/10 rounded animate-pulse" />
            ) : (
              <>
                <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-400 mt-2">
                  <span>Age: {crop.cropAgeDays} days</span>
                  <span>
                    Remaining:{" "}
                    {Math.max(0, crop.expectedDurationDays - crop.cropAgeDays)} days
                  </span>
                </div>
              </>
            )}
          </div>

          {/* FINANCE */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <p className="text-xs text-gray-400 mb-1">Total Income</p>
              {loading ? (
                <div className="h-5 w-20 bg-white/10 rounded animate-pulse" />
              ) : (
                <p className="text-green-400 font-semibold text-lg">
                  ₹ {income.toLocaleString("en-IN")}
                </p>
              )}
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <p className="text-xs text-gray-400 mb-1">Total Expenses</p>
              {loading ? (
                <div className="h-5 w-20 bg-white/10 rounded animate-pulse" />
              ) : (
                <p className="text-red-400 font-semibold text-lg">
                  ₹ {expense.toLocaleString("en-IN")}
                </p>
              )}
            </div>
            <div className="p-4 rounded-xl border border-white/10 bg-white/5">
              <p className="text-xs text-gray-400 mb-1">Net Balance</p>
              {loading ? (
                <div className="h-5 w-20 bg-white/10 rounded animate-pulse" />
              ) : (
                <p
                  className={`font-semibold text-lg ${
                    profit >= 0 ? "text-emerald-400" : "text-rose-400"
                  }`}
                >
                  ₹ {profit.toLocaleString("en-IN")}
                </p>
              )}
            </div>
          </div>

          {/* TRANSACTIONS */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="flex items-center gap-2 font-medium">
                <Wallet size={18} /> Transactions
              </h3>

              {!loading && (
                <button
                  onClick={() => setShowExpense(crop)}
                  className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-sm text-white font-medium"
                >
                  + Add
                </button>
              )}
            </div>

            <div className="space-y-2">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-12 bg-white/10 rounded animate-pulse"
                  />
                ))
              ) : (crop.transactions || []).length === 0 ? (
                <p className="text-sm text-gray-400 py-3 text-center">
                  No transactions recorded yet.
                </p>
              ) : (
                crop.transactions.map((t) => (
                  <div
                    key={t._id}
                    onClick={() => setSelectedTxn(t)}
                    className="flex justify-between items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition"
                  >
                    <div>
                      <p className="font-medium text-white">{t.title}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(t.date).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="text-right">
                      <p
                        className={
                          t.type === "income"
                            ? "text-green-400 font-medium"
                            : "text-red-400 font-medium"
                        }
                      >
                        {t.type === "income" ? "+" : "-"} ₹ {t.amount}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* HISTORY */}
          <div className="bg-white/5 border border-white/10 p-5 rounded-xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="flex items-center gap-2 font-medium">
                <History size={18} /> Crop History & Logs
              </h3>

              {!loading && (
                <button
                  onClick={() => setShowHistoryModal(crop)}
                  className="bg-green-500 hover:bg-green-600 px-3 py-1 rounded-lg text-sm text-white font-medium"
                >
                  + Add History
                </button>
              )}
            </div>

            <div className="space-y-3">
              {loading ? (
                [...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="h-14 bg-white/10 rounded animate-pulse"
                  />
                ))
              ) : history.length === 0 ? (
                <p className="text-sm text-gray-400 py-3 text-center">
                  No field logs recorded yet.
                </p>
              ) : (
                history.map((h) => (
                  <div
                    key={h._id}
                    onClick={() => setSelectedHistory(h)}
                    className="p-3 rounded-lg bg-white/5 hover:bg-white/10 cursor-pointer transition"
                  >
                    <p className="font-medium text-white">{h.title}</p>
                    {h.date && (
                      <p className="text-xs text-gray-400 mt-0.5">
                        {new Date(h.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ACTIONS */}
          {!loading && (
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setEditCrop(crop)}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg text-sm text-white flex items-center gap-2 font-medium transition"
              >
                Edit Crop
              </button>
              <button
                onClick={() => setDeleteCrop(crop)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-sm text-white flex items-center gap-2 font-medium transition"
              >
                Delete Crop
              </button>
            </div>
          )}
        </div>
      )}

      {/* MODALS */}
      <EditCropModal
        isOpen={!!editCrop}
        crop={editCrop}
        onClose={() => setEditCrop(null)}
        onSuccess={loadAll}
      />

      <DeleteConfirmModal
        isOpen={!!deleteCrop}
        crop={deleteCrop}
        onClose={() => setDeleteCrop(null)}
        onSuccess={() => navigate("/crops")}
      />

      <AddTransactionModal
        crop={showExpense}
        isOpen={!!showExpense}
        onClose={() => setShowExpense(null)}
        onSuccess={loadAll}
      />

      <EditTransactionModal
        cropId={id}
        transaction={selectedTxn}
        onClose={() => setSelectedTxn(null)}
        onSuccess={loadAll}
      />

      <HarvestModal
        isOpen={!!harvestCropState}
        crop={harvestCropState}
        onClose={() => setHarvestCropState(null)}
        onSuccess={loadAll}
      />

      <AddCropHistoryModal
        isOpen={!!showHistoryModal}
        crop={showHistoryModal}
        onClose={() => setShowHistoryModal(null)}
        onSuccess={loadAll}
      />

      <EditCropHistoryModal
        history={selectedHistory}
        onClose={() => setSelectedHistory(null)}
        onSuccess={loadAll}
      />
    </div>
  );
};

export default CropDetails;
