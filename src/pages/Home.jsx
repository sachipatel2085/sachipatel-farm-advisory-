import { useEffect, useState } from "react";
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

  if (checking) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-slate-200 font-sans">
      {/* HERO */}
      <section className="text-center px-4 pt-24 pb-16">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold">
            🌾 Smart Farm Advisory
          </h1>

          <p className="mt-3 opacity-70 text-sm sm:text-base">
            Grow smarter. Track crops. Maximize your profit.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="px-5 py-3 rounded-full bg-green-500 text-white font-semibold hover:bg-green-600 transition"
            >
              Get Started
            </Link>

            <Link
              to="/login"
              className="px-5 py-3 rounded-full border border-green-500 text-green-500 hover:bg-green-500 hover:text-white transition"
            >
              Login
            </Link>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid gap-5 px-5 sm:px-8 md:px-12 pb-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
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
      <section className="text-center py-12 px-4">
        <h2 className="text-xl sm:text-2xl font-semibold">
          Start Smart Farming Today
        </h2>

        <Link
          to="/register"
          className="inline-block mt-5 bg-green-500 text-white px-6 py-3 rounded-full hover:bg-green-600 transition"
        >
          Create Free Account
        </Link>
      </section>
    </div>
  );
}

/* Feature Card */
const Feature = ({ icon, title, desc }) => (
  <div className="bg-white/5 border border-white/10 p-6 rounded-xl text-center transition hover:-translate-y-1 hover:border-green-500">
    <div className="mb-2 text-green-500 flex justify-center">
      <div className="w-6 h-6">{icon}</div>
    </div>

    <h3 className="text-lg font-medium">{title}</h3>
    <p className="text-sm opacity-70 mt-1">{desc}</p>
  </div>
);
