import { useState, useContext } from "react";
import API from "../api/axios.js";
import { useAuth } from "../context/Authcontext";
import "../styles/login.css";
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
    <form className="login" onSubmit={submit}>
      <h2>Login</h2>
      <input placeholder="Phone" onChange={(e) => setPhone(e.target.value)} />
      <input
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">Login</button>
    </form>
  );
}
