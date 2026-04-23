import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Leaf,
  Sprout,
  IndianRupee,
  Brain,
  Menu,
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
    if (isMobile) setMobileOpen(!mobileOpen);
    else setCollapsed(!collapsed);
  };

  return (
    <>
      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full z-50
          bg-slate-900 text-white border-r border-white/10
          transition-all duration-300
          ${collapsed ? "w-16" : "w-64"}
          ${isMobile ? (mobileOpen ? "translate-x-0" : "-translate-x-full") : ""}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10">
          <button onClick={toggle}>
            <Menu size={20} />
          </button>

          {!collapsed && (
            <span className="text-lg font-semibold">SmartFarm</span>
          )}
        </div>

        {/* Nav */}
        <nav className="mt-4 space-y-1 px-2">
          <NavItem
            to="/dashboard"
            icon={<LayoutDashboard size={18} />}
            label="Dashboard"
            active={location.pathname === "/dashboard"}
            collapsed={collapsed}
          />

          <NavItem
            to="/farms"
            icon={<Leaf size={18} />}
            label="Farms"
            active={location.pathname === "/farms"}
            collapsed={collapsed}
          />

          <NavItem
            to="/crops"
            icon={<Sprout size={18} />}
            label="Crops"
            active={location.pathname === "/crops"}
            collapsed={collapsed}
          />

          <NavItem
            to="/finance"
            icon={<IndianRupee size={18} />}
            label="Finance"
            active={location.pathname === "/finance"}
            collapsed={collapsed}
          />

          <NavItem
            to="/advisory"
            icon={<Brain size={18} />}
            label="Advisory"
            active={location.pathname === "/advisory"}
            collapsed={collapsed}
          />
        </nav>
      </div>
    </>
  );
}

/* Nav Item */
const NavItem = ({ to, icon, label, active, collapsed }) => (
  <Link
    to={to}
    className={`
      flex items-center gap-3 px-3 py-2 rounded-lg transition-all
      ${active ? "bg-green-500 text-white" : "text-gray-300 hover:bg-white/10"}
    `}
  >
    <span className="flex-shrink-0">{icon}</span>

    {!collapsed && <span className="text-sm">{label}</span>}
  </Link>
);
