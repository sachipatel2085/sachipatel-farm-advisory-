import { Bell, User, LogOut, LogIn, UserPlus, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Topbar({ isMobile, setMobileOpen, mobileOpen }) {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <header
      className="
        sticky top-0 z-30
        w-full
        flex items-center justify-between
        px-4 sm:px-6
        py-3
        bg-slate-900
        border-b border-white/10
      "
    >
      {/* Left */}
      <div className="flex items-center gap-3">
        {/* Mobile Menu Button */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="
              flex items-center justify-center
              w-10 h-10
              rounded-lg
              text-white
              hover:bg-white/10
              active:bg-white/20
              transition
            "
            aria-label="Toggle menu"
          >
            <Menu size={24} />
          </button>
        )}

        <h2 className="text-lg sm:text-xl font-semibold text-white">
          Dashboard
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2 sm:gap-5">
        {/* Notification */}
        <button
          className="
            flex items-center justify-center
            w-9 h-9
            text-gray-300
            hover:text-white
            hover:bg-white/10
            rounded-lg
            transition
          "
        >
          <Bell size={20} />
        </button>

        {/* Profile */}
        <div className="flex items-center gap-2 text-sm text-gray-300">
          <User size={18} />

          <span className="hidden sm:inline">{token ? "Admin" : "Guest"}</span>
        </div>

        {/* Auth Buttons */}
        {token ? (
          <button
            onClick={handleLogout}
            className="
              flex items-center gap-2
              bg-red-500
              hover:bg-red-600
              px-3 py-2
              rounded-lg
              text-white
              text-sm
              transition
            "
          >
            <LogOut size={16} />

            <span className="hidden sm:inline">Logout</span>
          </button>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="
                flex items-center gap-2
                border border-green-500
                text-green-500
                hover:bg-green-500
                hover:text-white
                px-3 py-2
                rounded-lg
                text-sm
                transition
              "
            >
              <LogIn size={16} />

              <span className="hidden sm:inline">Login</span>
            </button>

            <button
              onClick={() => navigate("/register")}
              className="
                flex items-center gap-2
                bg-green-500
                hover:bg-green-600
                px-3 py-2
                rounded-lg
                text-white
                text-sm
                transition
              "
            >
              <UserPlus size={16} />

              <span className="hidden sm:inline">Sign Up</span>
            </button>
          </>
        )}
      </div>
    </header>
  );
}
