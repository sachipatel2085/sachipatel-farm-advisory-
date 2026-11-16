import { useState } from "react";
import API from "../api/axios.js";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";
import { Sprout } from "lucide-react";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await API.post("/auth/login", { phone, password });
    login(res.data.token, res.data);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-[calc(100dvh-5rem)] py-8 flex items-center justify-center bg-[#0b111e] text-slate-200 px-3 sm:px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-[#131d2e] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-5 shadow-xl"
      >
        <div className="text-center space-y-1.5">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-1">
            <Sprout size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Farmer Sign In</h2>
          <p className="text-xs text-gray-400">
            Access crop advisory, live mandi rates & farm logs
          </p>
        </div>

        {/* PHONE */}
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1">Phone Number</label>
          <input
            type="text"
            placeholder="e.g. 9876543210"
            onChange={(e) => setPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b111e] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1">Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b111e] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500 transition"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 py-2.5 rounded-xl text-white font-semibold text-sm transition shadow-md shadow-emerald-600/20 active:scale-[0.99]"
        >
          Sign In to Farm
        </button>

        <div className="my-3 flex items-center gap-3">
          <div className="h-px flex-1 bg-white/10" />
          <span className="text-xs text-gray-400 uppercase tracking-wider">OR</span>
          <div className="h-px flex-1 bg-white/10" />
        </div>

        <GoogleLoginButton />

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 pt-1">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-emerald-400 font-semibold cursor-pointer hover:underline"
          >
            Create Farmer Account
          </span>
        </p>
      </form>
    </div>
  );
}
