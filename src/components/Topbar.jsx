import React, { useState, useEffect, useRef } from "react";
import {
  Bell,
  User,
  LogOut,
  LogIn,
  UserPlus,
  Menu,
  Globe,
  AlertTriangle,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  ThermometerSnowflake,
  CloudRain,
  Sun,
  Wind,
  Shield,
  LayoutDashboard,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/Authcontext";
import weatherService from "../services/weatherService";

export default function Topbar({ isMobile, setMobileOpen, mobileOpen }) {
  const navigate = useNavigate();
  const { user, isAdmin, logout, token } = useAuth();
  const { language, setLanguage, t, languages } = useLanguage();

  const [alerts, setAlerts] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const notifRef = useRef(null);
  const langRef = useRef(null);
  const profileRef = useRef(null);

  // Load weather alerts
  useEffect(() => {
    if (token) {
      weatherService
        .getWeatherAlerts()
        .then((res) => {
          setAlerts(res.alerts || []);
        })
        .catch((err) => {
          console.warn("Failed to load weather alerts:", err.message);
        });
    }
  }, [token]);

  // Close popups on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (langRef.current && !langRef.current.contains(e.target)) {
        setShowLangMenu(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case "frost_risk":
        return <ThermometerSnowflake size={16} className="text-cyan-400 shrink-0" />;
      case "fungal_spread":
        return <ShieldAlert size={16} className="text-rose-400 shrink-0" />;
      case "spray_delay_rain":
        return <CloudRain size={16} className="text-amber-400 shrink-0" />;
      case "heatwave_stress":
        return <Sun size={16} className="text-orange-400 shrink-0" />;
      default:
        return <AlertTriangle size={16} className="text-yellow-400 shrink-0" />;
    }
  };

  const currentLang = languages.find((l) => l.code === language) || languages[0];

  return (
    <header className="sticky top-0 z-30 w-full flex items-center justify-between px-3 sm:px-6 py-2.5 sm:py-3 bg-slate-900/95 border-b border-white/10 backdrop-blur-md">
      {/* Left */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {isMobile && (
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-lg text-white hover:bg-white/10 active:bg-white/20 transition shrink-0"
            aria-label="Toggle menu"
          >
            <Menu size={22} />
          </button>
        )}

        <h2 className="text-sm sm:text-base md:text-xl font-semibold text-white truncate max-w-[150px] xs:max-w-[220px] sm:max-w-none">
          {t("dashboard.title", "Farm Command Center")}
        </h2>
      </div>

      {/* Right */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Language Selector Dropdown */}
        <div className="relative" ref={langRef}>
          <button
            onClick={() => setShowLangMenu(!showLangMenu)}
            className="flex items-center gap-1 sm:gap-1.5 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-xs text-gray-200 transition font-medium"
            title="Change Language"
          >
            <Globe size={14} className="text-emerald-400 shrink-0" />
            <span className="hidden sm:inline">{currentLang.nativeName}</span>
            <span className="sm:hidden uppercase text-[11px] font-semibold">{currentLang.code}</span>
            <ChevronDown size={12} className="text-gray-400 shrink-0" />
          </button>

          {showLangMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-slate-800 border border-white/10 rounded-xl shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-150">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => {
                    setLanguage(l.code);
                    setShowLangMenu(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition ${
                    language === l.code
                      ? "bg-emerald-600/20 text-emerald-300 font-semibold"
                      : "text-gray-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  <span>{l.nativeName}</span>
                  <span className="text-[10px] text-gray-400 uppercase font-mono">{l.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Weather Alerts Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 text-gray-300 hover:text-white hover:bg-white/10 rounded-xl transition"
            aria-label="View Weather Notifications"
          >
            <Bell size={18} />
            {alerts.length > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[17px] h-[17px] px-1 flex items-center justify-center rounded-full text-[10px] font-bold bg-rose-500 text-white border-2 border-slate-900 shadow">
                {alerts.length}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="fixed inset-x-3 top-14 sm:absolute sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 w-auto sm:w-96 max-w-sm sm:max-w-none bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-4 z-50 text-white space-y-3 animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between pb-2 border-b border-white/10">
                <h4 className="font-semibold text-xs sm:text-sm flex items-center gap-1.5 text-white">
                  <Sparkles size={14} className="text-amber-400" />
                  {t("weather.smartAlerts", "Smart Weather Alerts")}
                </h4>
                <span className="text-[11px] text-gray-400">
                  {alerts.length} {alerts.length === 1 ? "Alert" : "Alerts"}
                </span>
              </div>

              {alerts.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-400 space-y-1">
                  <p className="text-emerald-400 font-medium">✓ {t("weather.noAlerts", "Weather is optimal")}</p>
                  <p className="text-[11px]">No active frost, rain delay, or disease spread risks detected.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {alerts.map((alert) => {
                    const title = alert.title?.[language] || alert.title?.en || "Weather Alert";
                    const action = alert.recommendedAction?.[language] || alert.recommendedAction?.en || "";

                    return (
                      <div
                        key={alert.id}
                        className="p-3 rounded-xl bg-white/[0.04] border border-white/10 space-y-1.5 hover:bg-white/[0.07] transition"
                      >
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                          <div className="space-y-0.5 flex-1">
                            <div className="flex items-center justify-between gap-1">
                              <h5 className="text-xs font-semibold text-white leading-snug">
                                {title}
                              </h5>
                              {alert.metric && (
                                <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 font-mono">
                                  {alert.metric}
                                </span>
                              )}
                            </div>
                            {action && (
                              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed">
                                {action}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* User Profile Button with Dropdown Menu & Admin Navigation */}
        {token ? (
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-1.5 sm:gap-2 px-2 sm:px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition text-left"
              aria-label="User Profile Menu"
            >
              <div
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold border shrink-0 ${
                  isAdmin
                    ? "bg-emerald-950/80 border-emerald-500/40 text-emerald-400"
                    : "bg-slate-800 border-white/10 text-emerald-400"
                }`}
              >
                {isAdmin ? <Shield size={14} /> : <User size={14} />}
              </div>
              <div className="hidden sm:flex flex-col">
                <span className="text-xs font-semibold text-white truncate max-w-[90px]">
                  {user?.name || "Farmer"}
                </span>
                <span className="text-[10px] text-gray-400 capitalize flex items-center gap-1 font-mono">
                  {user?.role || "farmer"}
                  {isAdmin && (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </span>
              </div>
              <ChevronDown size={13} className="text-gray-400 shrink-0 hidden sm:block" />
            </button>

            {/* Profile Dropdown Menu */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-white/10 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in zoom-in-95 duration-150 space-y-2.5">
                {/* User info banner */}
                <div className="p-2.5 rounded-xl bg-white/[0.04] border border-white/5 space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center font-bold text-sm">
                      {user?.name ? user.name[0].toUpperCase() : "U"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-white truncate">
                        {user?.name || "Farmer"}
                      </p>
                      <p className="text-[11px] text-gray-400 truncate">
                        {user?.phone || user?.email || "Account Active"}
                      </p>
                    </div>
                  </div>
                  <div className="pt-1.5 border-t border-white/5 flex items-center justify-between text-[11px]">
                    <span className="text-gray-400">Current Role:</span>
                    <span className="font-semibold uppercase tracking-wider text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      {user?.role || "farmer"}
                    </span>
                  </div>
                </div>

                {/* Navigation Actions */}
                <div className="space-y-1">
                  {/* SEPARATE ADMIN DASHBOARD NAVIGATION BUTTON */}
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/admin");
                    }}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 transition group"
                  >
                    <span className="flex items-center gap-2">
                      <Shield size={15} className="text-emerald-400 group-hover:text-white" />
                      Admin Dashboard
                    </span>
                    <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/30 font-bold uppercase tracking-wider">
                      {isAdmin ? "ADMIN" : "PORTAL"}
                    </span>
                  </button>

                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      navigate("/dashboard");
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-gray-300 hover:text-white hover:bg-white/5 transition"
                  >
                    <LayoutDashboard size={15} className="text-gray-400" />
                    Farmer Dashboard
                  </button>
                </div>

                <div className="border-t border-white/10 pt-1">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      handleLogout();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-500/10 transition"
                  >
                    <LogOut size={15} />
                    Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-1 border border-emerald-500 text-emerald-400 hover:bg-emerald-500 hover:text-white px-3 py-1.5 rounded-xl text-xs font-medium transition"
            >
              <LogIn size={14} />
              <span>Login</span>
            </button>
            <button
              onClick={() => navigate("/register")}
              className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-500 text-white px-3 py-1.5 rounded-xl text-xs font-medium transition"
            >
              <UserPlus size={14} />
              <span className="hidden sm:inline">Sign Up</span>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
