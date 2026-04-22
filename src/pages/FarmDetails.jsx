import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import Breadcrumb from "../components/Breadcrumb";
import "../styles/cropDetails.css"; // same theme
import {
  Wheat,
  MapPin,
  Activity,
  History,
  Sprout,
  Calendar,
  Wallet,
  TrendingUp,
} from "lucide-react";
import CropList from "../components/CropList";

const FarmDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [farm, setFarm] = useState(null);
  const [history, setHistory] = useState([]);
  const [seasonFilter, setSeasonFilter] = useState("");
  const [cropFilter, setCropFilter] = useState("");
  const [sortType, setSortType] = useState("profitDesc");

  const loadHistory = async () => {
    const res = await api.get(`/farms/${id}/history`);
    setHistory(res.data);
  };

  const loadAnalytics = async () => {
    const res = await api.get(`/farms/${id}/analytics`);
    setAnalytics(res.data);
  };
  const loadFarm = async () => {
    const res = await api.get(`/farms/${id}`);
    setFarm(res.data);
  };

  useEffect(() => {
    loadFarm();
    loadAnalytics();
    loadHistory();
  }, [id]);
  const processedHistory = history
    .filter((h) => {
      return (
        (!seasonFilter || h.season === seasonFilter) &&
        (!cropFilter || h.cropName === cropFilter)
      );
    })
    .sort((a, b) => {
      if (sortType === "profitDesc") return b.profit - a.profit;
      if (sortType === "profitAsc") return a.profit - b.profit;
      return 0;
    });
  const topCrop =
    history.length > 0
      ? [...history].sort((a, b) => b.profit - a.profit)[0]
      : null;

  if (!farm) return <p className="loading">Loading...</p>;

  const health = Math.floor(Math.random() * 30) + 70;

  return (
    <div className="crop-details-page">
      <Breadcrumb currentName={farm.farmName} />
      <button className="back-btn" onClick={() => navigate(-1)}>
        ← Back
      </button>
      {/* HEADER */}
      <div className="crop-header">
        <div>
          <h2 className="title">
            <Wheat size={20} /> {farm.farmName}
          </h2>
          <p className="farm-name">
            <MapPin size={14} /> {farm.location?.village},{" "}
            {farm.location?.district}
          </p>
        </div>

        <span className="stage">Active</span>
      </div>
      {/* FARM HEALTH */}
      {analytics && (
        <div className="section grid-3">
          <div className="card">
            <h4>Total Crops</h4>
            <p>{analytics.totalCrops}</p>
          </div>

          <div className="card">
            <h4>Farm Health</h4>
            <p>{analytics.avgHealth}%</p>
          </div>

          <div className="card">
            <h4>Total Yield</h4>
            <p>{analytics.totalYield} kg</p>
          </div>
        </div>
      )}{" "}
      {/* BASIC INFO */}
      {analytics && (
        <div className="section grid-3">
          <div className="card income-box">
            <h4>Income</h4>
            <p>₹ {analytics.totalIncome}</p>
          </div>

          <div className="card expense-box">
            <h4>Expense</h4>
            <p>₹ {analytics.totalExpense}</p>
          </div>

          <div className="card profit-box">
            <h4>Profit</h4>
            <p>₹ {analytics.profit}</p>
          </div>
        </div>
      )}{" "}
      {analytics && (
        <div className="section card">
          <h3 className="section-title">Farm Health</h3>

          <div className="progress-wrap">
            <div
              className="progress-fill"
              style={{ width: `${analytics.avgHealth}%` }}
            />
          </div>

          <div className="progress-info">
            <span>Overall Health</span>
            <span>{analytics.avgHealth}%</span>
          </div>
        </div>
      )}{" "}
      {/* EXTRA INFO */}
      <div className="section grid-3">
        <div className="card">
          <h4>Water Usage</h4>
          <p>1200L</p>
        </div>

        <div className="card">
          <h4>Sunlight</h4>
          <p>Good</p>
        </div>

        <div className="card">
          <h4>Status</h4>
          <p>Active</p>
        </div>
      </div>
      <CropList farmId={id} />
      <div className="section card">
        <div className="section-header">
          <h3 className="section-title">📜 Farm History</h3>
        </div>

        {/* FILTERS */}
        <div className="filter-row">
          {/* Season Filter */}
          <select
            value={seasonFilter}
            onChange={(e) => setSeasonFilter(e.target.value)}
          >
            <option value="">All Seasons</option>
            {[...new Set(history.map((h) => h.season))].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>

          {/* Crop Filter */}
          <select
            value={cropFilter}
            onChange={(e) => setCropFilter(e.target.value)}
          >
            <option value="">All Crops</option>
            {[...new Set(history.map((h) => h.cropName))].map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>

          {/* Sort */}
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
          >
            <option value="profitDesc">Profit ↓</option>
            <option value="profitAsc">Profit ↑</option>
          </select>
        </div>
        <div className="timeline">
          {processedHistory.map((h) => (
            <div key={h.cropId} className="timeline-item">
              {/* HEADER */}
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>
                  <Sprout size={14} /> {h.cropName} ({h.season})
                </strong>
              </div>

              {/* DATES */}
              <p>
                <Calendar size={14} />{" "}
                {new Date(h.sowingDate).toLocaleDateString()}
              </p>

              {/* YIELD */}
              <p>
                <Wheat size={14} /> {h.production} kg
              </p>

              {/* FINANCE */}
              <p>
                <Wallet size={14} /> Income: ₹ {h.income}
              </p>

              <p>
                <Wallet size={14} /> Expense: ₹ {h.expense}
              </p>

              <p
                style={{
                  color: h.profit >= 0 ? "#22c55e" : "#ef4444",
                  fontWeight: "500",
                }}
              >
                <TrendingUp size={14} /> Profit: ₹ {h.profit}
              </p>
            </div>
          ))}
        </div>
      </div>{" "}
    </div>
  );
};

export default FarmDetails;
