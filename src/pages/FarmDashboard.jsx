import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Breadcrumb from "../components/Breadcrumb";
import "../styles/FarmDashboard.css";
import CropList from "../components/CropList";
import { Leaf, Droplets, Activity, Sun, Wheat } from "lucide-react";

const FarmDashboard = () => {
  const [farms, setFarms] = useState([]);

  const loadFarms = async () => {
    const res = await api.get("/farms");
    setFarms(res.data);
  };

  useEffect(() => {
    loadFarms();
  }, []);

  // mock data
  const totalFarms = farms.length;
  const totalCrops = farms.reduce(
    (sum) => sum + (Math.floor(Math.random() * 6) + 1),
    0,
  );

  return (
    <div className="dashboard-container dark">
      <Breadcrumb />

      <h1 className="page-title">
        <Wheat size={22} /> Farm Insights
      </h1>

      {/* 🔥 TOP STATS */}
      <div className="stats-grid">
        <Stat icon={<Leaf />} title="Total Farms" value={totalFarms} />
        <Stat icon={<Activity />} title="Active Crops" value={totalCrops} />
        <Stat icon={<Droplets />} title="Water Usage" value="1200L" />
        <Stat icon={<Sun />} title="Avg Health" value="82%" />
      </div>

      {/* 📋 FARM LIST */}
      <div className="section">
        <h2>Farm Overview</h2>
        <div className="farm-list">
          {farms.map((farm) => {
            const health = Math.floor(Math.random() * 40) + 60;

            return (
              <div key={farm._id} className="farm-item">
                <div>
                  <h3>{farm.farmName}</h3>
                  <p>
                    {farm.location?.village}, {farm.location?.district}
                  </p>
                </div>

                {/* HEALTH BAR */}
                <div className="health">
                  <span>{health}%</span>
                  <div className="progress">
                    <div
                      className="progress-fill"
                      style={{ width: `${health}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🌱 CROPS */}
      <div className="section">
        <h2>Crop Details</h2>
        <CropList />
      </div>
    </div>
  );
};

const Stat = ({ icon, title, value }) => (
  <div className="stat-card">
    <div className="icon">{icon}</div>
    <div>
      <p>{title}</p>
      <h2>{value}</h2>
    </div>
  </div>
);

export default FarmDashboard;
