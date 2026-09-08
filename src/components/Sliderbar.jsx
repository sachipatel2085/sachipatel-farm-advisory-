import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Leaf,
  Sprout,
  IndianRupee,
  Brain,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar({
  collapsed,
  setCollapsed,
  mobileOpen,
  setMobileOpen,
  isMobile,
}) {
  const location = useLocation();

  const toggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setCollapsed(!collapsed);
    }
  };

  const handleNavClick = () => {
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobile && mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen z-50
          bg-slate-900 text-white
          border-r border-white/10
          transition-transform duration-300 ease-in-out

          ${isMobile ? "w-64" : collapsed ? "w-16" : "w-64"}

          ${
            isMobile
              ? mobileOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
          }
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center border-b border-white/10 px-4">
          <button
            onClick={toggle}
            className="flex items-center justify-center
                       w-9 h-9 rounded-lg
                       hover:bg-white/10 transition-colors"
          >
            {isMobile && mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          {!collapsed || isMobile ? (
            <span className="ml-3 text-lg font-semibold whitespace-nowrap">
              SmartFarm
            </span>
          ) : null}
        </div>

        {/* Navigation */}
        <nav className="mt-4 space-y-1 px-2">
          <NavItem
            to="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={location.pathname === "/dashboard"}
            collapsed={collapsed && !isMobile}
            onClick={handleNavClick}
          />

          <NavItem
            to="/farms"
            icon={<Leaf size={18} />}
            label="Farms"
            active={location.pathname === "/farms"}
            collapsed={collapsed && !isMobile}
            onClick={handleNavClick}
          />

          <NavItem
            to="/crops"
            icon={<Sprout size={18} />}
            label="Crops"
            active={location.pathname === "/crops"}
            collapsed={collapsed && !isMobile}
            onClick={handleNavClick}
          />

          <NavItem
            to="/finance"
            icon={<IndianRupee size={18} />}
            label="Finance"
            active={location.pathname === "/finance"}
            collapsed={collapsed && !isMobile}
            onClick={handleNavClick}
          />
        </nav>
      </aside>
    </>
  );
}

/* Nav Item */
const NavItem = ({ to, icon, label, active, collapsed, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className={`
      flex items-center gap-3
      px-3 py-2.5
      rounded-lg
      transition-all duration-200

      ${active ? "bg-green-500 text-white" : "text-gray-300 hover:bg-white/10"}

      ${collapsed ? "justify-center" : ""}
    `}
  >
    <span className="flex-shrink-0">{icon}</span>

    {!collapsed && (
      <span className="text-sm font-medium whitespace-nowrap">{label}</span>
    )}
  </Link>
);
