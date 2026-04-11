import React, { useEffect, useState } from "react";
import api from "../api/axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Breadcrumb from "../components/Breadcrumb";
import "../styles/FarmDashboard.css";
import CropList from "../components/CropList";

const COLORS = ["#27ae60", "#2ecc71", "#3498db", "#f39c12", "#9b59b6"];

const FarmDashboard = () => {
  const [farms, setFarms] = useState([]);

  const loadFarms = async () => {
    const res = await api.get("/farms");
    setFarms(res.data);
  };
  useEffect(() => {
    loadFarms();
  }, []);

  /* ===== MOCK ANALYTICS (replace with DB later) ===== */

  const cropsData = farms.map((f) => ({
    name: f.farmName,
    crops: Math.floor(Math.random() * 6) + 1,
  }));

  const yieldData = [
    { month: "Jan", yield: 120 },
    { month: "Feb", yield: 150 },
    { month: "Mar", yield: 190 },
    { month: "Apr", yield: 220 },
    { month: "May", yield: 260 },
  ];

  const weatherProduction = [
    { name: "Sunny", value: 60 },
    { name: "Rainy", value: 30 },
    { name: "Cloudy", value: 10 },
  ];

  const irrigationUsage = farms.map((f) => ({
    name: f.farmName,
    water: Math.floor(Math.random() * 300) + 100,
  }));

  const healthScore = farms.map((f) => ({
    name: f.farmName,
    health: Math.floor(Math.random() * 40) + 60,
  }));

  return (
    <div className="dashboard-container">
      <Breadcrumb currentName={farms.farmName} />

      <h1>Farm Analytics Dashboard</h1>

      <div className="charts-grid">
        {/* 🌱 Crops per farm */}
        <div className="chart-card">
          <h3>Crops Per Farm</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={cropsData}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="crops" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 📈 Yield over time */}
        <div className="chart-card">
          <h3>Yield Over Time</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={yieldData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Line dataKey="yield" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 🌦 Weather vs production */}
        <div className="chart-card">
          <h3>Weather Impact</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={weatherProduction}
                dataKey="value"
                label
                outerRadius={100}
              >
                {weatherProduction.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* 💧 Irrigation usage */}
        <div className="chart-card">
          <h3>Irrigation Usage</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={irrigationUsage}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="water" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* 🛰 Farm health score */}
        <div className="chart-card">
          <h3>Farm Health Score</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={healthScore}>
              <XAxis dataKey="name" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="health" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <CropList />
    </div>
  );
};

export default FarmDashboard;
