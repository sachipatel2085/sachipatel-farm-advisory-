import "../styles/topbar.css";
import { Bell, User, LogOut, LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <h2>Dashboard</h2>
      </div>

      <div className="topbar-right">
        <Bell className="icon" />

        <div className="profile">
          <User size={18} />
          <span>{token ? "Admin" : "Guest"}</span>
        </div>

        {/* 🔥 AUTH BUTTONS */}
        {token ? (
          <button className="logout-btn" onClick={handleLogout}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        ) : (
          <>
            <button className="login-btn" onClick={() => navigate("/login")}>
              <LogIn size={16} />
              <span>Login</span>
            </button>

            <button
              className="signup-btn"
              onClick={() => navigate("/register")}
            >
              <UserPlus size={16} />
              <span>Sign Up</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
