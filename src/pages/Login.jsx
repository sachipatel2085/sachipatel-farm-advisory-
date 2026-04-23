import { useState } from "react";
import API from "../api/axios.js";
import { useAuth } from "../context/Authcontext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const res = await API.post("/auth/login", { phone, password });
    login(res.data.token);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-slate-200 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-md bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 space-y-5 shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-center">Login</h2>

        {/* PHONE */}
        <div>
          <label className="text-sm text-gray-400">Phone</label>
          <input
            type="text"
            placeholder="Enter phone number"
            onChange={(e) => setPhone(e.target.value)}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-sm text-gray-400">Password</label>
          <input
            type="password"
            placeholder="Enter password"
            onChange={(e) => setPassword(e.target.value)}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 py-2 rounded-lg font-medium transition"
        >
          Login
        </button>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-400">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-green-400 cursor-pointer hover:underline"
          >
            Sign up
          </span>
        </p>
      </form>
    </div>
  );
}
