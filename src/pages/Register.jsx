import { useState } from "react";
import API from "../api/axios";
import "../styles/register.css";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    language: "english",
    village: "",
    district: "",
    state: ""
  });

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async e => {
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
        state: form.state
      }
    });

    alert("Registered successfully! Now login.");
    window.location.href = "/login";
  };

  return (
    <form className="register" onSubmit={submit}>
      <h2>Create Account</h2>

      <input name="name" placeholder="Full Name" onChange={handleChange} required />
      <input name="phone" placeholder="Phone Number" onChange={handleChange} required />
      <input name="email" placeholder="Email (optional)" onChange={handleChange} />

      <input
        type="password"
        name="password"
        placeholder="Password"
        onChange={handleChange}
        required
      />

      <select name="language" onChange={handleChange}>
        <option value="english">English</option>
        <option value="hindi">Hindi</option>
        <option value="gujarati">Gujarati</option>
      </select>

      <input name="village" placeholder="Village" onChange={handleChange} />
      <input name="district" placeholder="District" onChange={handleChange} />
      <input name="state" placeholder="State" onChange={handleChange} />

      <button>Create Account</button>
    </form>
  );
}
