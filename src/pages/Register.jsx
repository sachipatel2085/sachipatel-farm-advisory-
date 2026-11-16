import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";
import { Sprout } from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    language: "english",
    village: "",
    district: "",
    state: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();

    await API.post("/auth/register", {
      name: form.name,
      phone: form.phone,
      email: form.email,
      password: form.password,
      language: form.language,
      location: {
        village: form.village,
        district: form.district,
        state: form.state,
      },
    });

    alert("Registered successfully! Now login.");
    navigate("/login");
  };

  return (
    <div className="min-h-[calc(100dvh-5rem)] py-8 flex items-center justify-center bg-[#0b111e] text-slate-200 px-3 sm:px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-[#131d2e] border border-white/[0.08] rounded-2xl p-6 sm:p-8 space-y-4 shadow-xl"
      >
        <div className="text-center space-y-1.5 mb-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 mb-1">
            <Sprout size={24} />
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Create Farmer Account</h2>
          <p className="text-xs text-gray-400">
            Join to manage your crops, scan plant diseases &amp; see APMC prices
          </p>
        </div>

        {/* NAME */}
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1">Full Name</label>
          <Input
            name="name"
            placeholder="e.g. Ramesh Patel"
            onChange={handleChange}
            required
          />
        </div>

        {/* PHONE */}
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1">Phone Number</label>
          <Input
            name="phone"
            placeholder="e.g. 9876543210"
            onChange={handleChange}
            required
          />
        </div>

        {/* EMAIL */}
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1">Email (Optional)</label>
          <Input
            name="email"
            placeholder="email@example.com"
            onChange={handleChange}
          />
        </div>

        {/* PASSWORD */}
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1">Password</label>
          <Input
            type="password"
            name="password"
            placeholder="Create a password"
            onChange={handleChange}
            required
          />
        </div>

        {/* LANGUAGE */}
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1">Preferred Language</label>
          <select
            name="language"
            onChange={handleChange}
            className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b111e] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500 transition"
          >
            <option value="english">English</option>
            <option value="hindi">Hindi (हिंदी)</option>
            <option value="gujarati">Gujarati (ગુજરાતી)</option>
          </select>
        </div>

        {/* LOCATION GRID */}
        <div>
          <label className="text-xs font-medium text-gray-300 block mb-1">Farm Location</label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <Input name="village" placeholder="Village" onChange={handleChange} />
            <Input
              name="district"
              placeholder="District"
              onChange={handleChange}
            />
            <Input name="state" placeholder="State" onChange={handleChange} />
          </div>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-emerald-600 hover:bg-emerald-500 py-2.5 rounded-xl font-semibold text-white text-sm transition shadow-md shadow-emerald-600/20 active:scale-[0.99] mt-2"
        >
          Register Account
        </button>

        {/* FOOTER */}
        <p className="text-center text-xs text-gray-400 pt-2">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-emerald-400 font-semibold cursor-pointer hover:underline"
          >
            Sign in
          </span>
        </p>
      </form>
    </div>
  );
}

/* REUSABLE INPUT */
const Input = ({ type = "text", ...props }) => (
  <input
    type={type}
    {...props}
    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0b111e] border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-emerald-500 transition"
  />
);
