import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Tractor, Leaf, IndianRupee, LineChart } from "lucide-react";
import "../styles/dashboard.css";

export default function Dashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>🌾 Farm Dashboard</h1>
        <p>Welcome back! Here's your farm overview</p>
      </div>

      <div className="dashboard-grid">
        <Card title="Total Farms" value="3" icon={<Tractor />} />
        <Card title="Active Crops" value="12" icon={<Leaf />} />
        <Card title="Revenue" value="₹2.4L" icon={<IndianRupee />} />
        <Card title="Analytics" value="Growth" icon={<LineChart />} />
      </div>

      <div className="dashboard-section">
        <h2>Insights</h2>
        <div className="placeholder">Charts coming soon...</div>
      </div>
    </div>
  );
}

const Card = ({ title, value, icon }) => (
  <div className="dash-card">
    <div className="card-top">
      <div className="icon">{icon}</div>
      <p>{title}</p>
    </div>
    <h2>{value}</h2>
  </div>
);
