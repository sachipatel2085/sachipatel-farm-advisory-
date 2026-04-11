import { useEffect, useState } from "react";
import "../styles/home.css";
import { Link, useNavigate } from "react-router-dom";
import { Leaf, BarChart3, IndianRupee, Brain } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/dashboard");
    } else {
      setChecking(false);
    }
  }, [navigate]);

  if (checking) return null; // 🔥 prevents flicker

  return (
    <div className="home dark">
      {/* HERO */}
      <section className="hero">
        <div className="hero-content">
          <h1>🌾 Smart Farm Advisory</h1>
          <p>Grow smarter. Track crops. Maximize your profit.</p>

          <div className="hero-actions">
            <Link to="/register" className="primary">
              Get Started
            </Link>
            <Link to="/login" className="secondary">
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="feature-grid">
        <Feature
          icon={<Leaf />}
          title="Farm Management"
          desc="Manage farms easily"
        />
        <Feature
          icon={<BarChart3 />}
          title="Crop Tracking"
          desc="Track growth smartly"
        />
        <Feature
          icon={<IndianRupee />}
          title="Profit Control"
          desc="Track income & cost"
        />
        <Feature
          icon={<Brain />}
          title="AI Advisory"
          desc="Smart farming guidance"
        />
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>Start Smart Farming Today</h2>
        <Link to="/register">Create Free Account</Link>
      </section>
    </div>
  );
}

const Feature = ({ icon, title, desc }) => (
  <div className="feature-card">
    <div className="icon">{icon}</div>
    <h3>{title}</h3>
    <p>{desc}</p>
  </div>
);
