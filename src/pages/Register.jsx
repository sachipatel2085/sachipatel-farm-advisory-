import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-slate-200 px-4">
      <form
        onSubmit={submit}
        className="w-full max-w-lg bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-6 sm:p-8 space-y-4 shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-center">Create Account</h2>

        {/* NAME */}
        <Input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          required
        />

        {/* PHONE */}
        <Input
          name="phone"
          placeholder="Phone Number"
          onChange={handleChange}
          required
        />

        {/* EMAIL */}
        <Input
          name="email"
          placeholder="Email (optional)"
          onChange={handleChange}
        />

        {/* PASSWORD */}
        <Input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          required
        />

        {/* LANGUAGE */}
        <div>
          <label className="text-sm text-gray-400">Language</label>
          <select
            name="language"
            onChange={handleChange}
            className="w-full mt-1 px-4 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <option value="english">English</option>
            <option value="hindi">Hindi</option>
            <option value="gujarati">Gujarati</option>
          </select>
        </div>

        {/* LOCATION GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <Input name="village" placeholder="Village" onChange={handleChange} />
          <Input
            name="district"
            placeholder="District"
            onChange={handleChange}
          />
          <Input name="state" placeholder="State" onChange={handleChange} />
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 py-2 rounded-lg font-medium transition"
        >
          Create Account
        </button>

        {/* FOOTER */}
        <p className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-400 cursor-pointer hover:underline"
          >
            Login
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
    className="w-full px-4 py-2 rounded-lg bg-slate-800 border border-white/10 focus:outline-none focus:ring-2 focus:ring-green-500"
  />
);
