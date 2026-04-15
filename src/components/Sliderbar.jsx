import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Leaf,
  Sprout,
  IndianRupee,
  Brain,
  Menu,
} from "lucide-react";
import "../styles/sidebar.css";

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
    <div
      className={`sidebar 
        ${collapsed ? "collapsed" : ""} 
        ${mobileOpen ? "mobile-open" : ""}`}
    >
      <div className="sidebar-header">
        <span className="menu" onClick={toggle}>
          <Menu size={20} />
        </span>
        {!collapsed && <span className="brand">SmartFarm</span>}
      </div>

      <NavItem
        to="/dashboard"
        icon={<LayoutDashboard size={18} />}
        label="Dashboard"
        active={location.pathname === "/dashboard"}
      />
      <NavItem
        to="/farms"
        icon={<Leaf size={18} />}
        label="Farms"
        active={location.pathname === "/farms"}
      />
      <NavItem
        to="/crops"
        icon={<Sprout size={18} />}
        label="Crops"
        active={location.pathname === "/crops"}
      />
      <NavItem
        to="/finance"
        icon={<IndianRupee size={18} />}
        label="Finance"
        active={location.pathname === "/finance"}
      />
      <NavItem
        to="/advisory"
        icon={<Brain size={18} />}
        label="Advisory"
        active={location.pathname === "/advisory"}
      />
    </div>
  );
}

const NavItem = ({ to, icon, label, active }) => (
  <Link
    to={to}
    className={`nav-item ${active ? "active" : ""}`}
    data-tooltip={label}
  >
    <span className="icon">{icon}</span>
    <span className="text">{label}</span>
  </Link>
);
