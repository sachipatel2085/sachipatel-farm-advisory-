import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { Sprout, BarChart3, IndianRupee, Stethoscope, Store, ArrowRight, ShieldCheck } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setChecking(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      // JWT exp is in seconds, Date.now() is in milliseconds
      if (decoded.exp && decoded.exp * 1000 > Date.now()) {
        navigate("/dashboard", { replace: true });
      } else {
        // Token expired
        localStorage.removeItem("token");
        setChecking(false);
      }
    } catch (error) {
      // Invalid JWT
      console.error("Invalid token:", error);

      localStorage.removeItem("token");
      setChecking(false);
    }
  }, [navigate]);

  if (checking) return null;

  return (
    <div className="min-h-screen bg-[#0b111e] text-slate-200 font-sans">
      {/* HERO */}
      <section className="text-center px-4 pt-20 pb-16 max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs sm:text-sm font-medium mb-5">
          <Sprout size={16} />
          <span>Complete Agriculture Platform for Farmers</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Manage Your Farm, Crops &amp; Market Profits with Ease
        </h1>

        <p className="mt-4 text-gray-400 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed">
          From leaf disease diagnosis and verified medicine spray dosages, to live APMC mandi rates and crop income tracking.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3.5">
          <Link
            to="/register"
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition shadow-md shadow-emerald-600/20 active:scale-[0.99]"
          >
            <span>Create Farmer Account</span>
            <ArrowRight size={16} />
          </Link>

          <Link
            to="/login"
            className="px-6 py-3 rounded-xl bg-[#131d2e] hover:bg-[#1a273e] border border-white/10 text-gray-200 hover:text-white font-medium transition active:scale-[0.99]"
          >
            Sign In
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid gap-4 sm:gap-5 px-4 sm:px-8 md:px-12 max-w-6xl mx-auto pb-12 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        <Feature
          icon={<Stethoscope className="text-emerald-400" size={24} />}
          title="Plant Doctor"
          desc="Take photo of crop leaf to identify diseases and get exact spray medicine doses per 15L pump."
        />
        <Feature
          icon={<Store className="text-emerald-400" size={24} />}
          title="Live Mandi Rates"
          desc="Real-time daily prices across APMC mandis so you always sell your harvest at the best price."
        />
        <Feature
          icon={<Sprout className="text-emerald-400" size={24} />}
          title="Crop & Advisory"
          desc="Timely guidance for sowing, fertilizer applications, and irrigation schedules."
        />
        <Feature
          icon={<IndianRupee className="text-emerald-400" size={24} />}
          title="Farm Finance"
          desc="Track seed, fertilizer, and labour expenses against crop income to protect profit margins."
        />
      </section>

      {/* CTA */}
      <section className="text-center py-12 px-4 max-w-3xl mx-auto border-t border-white/[0.08]">
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Join Farmers Growing with Better Advice
        </h2>
        <p className="text-gray-400 text-xs sm:text-sm mt-2">
          Free to use. No complicated setup required.
        </p>

        <Link
          to="/register"
          className="inline-flex items-center gap-2 mt-5 bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-2.5 rounded-xl font-semibold transition shadow-md shadow-emerald-600/20"
        >
          <span>Get Started Free</span>
          <ArrowRight size={15} />
        </Link>
      </section>
    </div>
  );
}

/* Feature Card */
const Feature = ({ icon, title, desc }) => (
  <div className="bg-[#131d2e] border border-white/[0.08] hover:border-emerald-500/40 p-5 rounded-2xl text-left transition-all duration-200 shadow-sm hover:shadow-md">
    <div className="mb-3 p-2.5 rounded-xl bg-emerald-500/10 w-fit">
      {icon}
    </div>

    <h3 className="text-base font-semibold text-white">{title}</h3>
    <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">{desc}</p>
  </div>
);
