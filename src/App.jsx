import { useState, useLayoutEffect } from "react";
import "./App.css";
import { Menu, X } from "lucide-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Farms from "./pages/Farms";
import Sidebar from "./components/Sliderbar";
import CreateFarm from "./components/CreateFarm";
import FarmDashboard from "./pages/FarmDetails";
import CropDetails from "./pages/CropDetails";
import Crops from "./pages/Crops";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Topbar from "./components/Topbar";
import FinancePage from "./pages/FinancePage";
import FinanceDetails from "./pages/FinanceDetails";
import ShopDetails from "./pages/ShopDetails";

function App() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useLayoutEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const PrivateRoute = ({ children }) => {
    const token = localStorage.getItem("token");

    return token ? children : <Navigate to="/" />;
  };

  return (
    <BrowserRouter>
      {isMobile && (
        <button
          className="mobile-menu"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      )}
      <div className="app-wrapper">
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          isMobile={isMobile}
        />

        <div className="main-content">
          <Topbar /> {/* ✅ correct position */}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route path="/register" element={<Register />} />
            <Route path="/farms" element={<Farms />} />
            <Route path="/farms/new" element={<CreateFarm />} />
            <Route path="/farms/:id" element={<FarmDashboard />} />
            <Route path="/crops" element={<Crops />} />
            <Route path="/crops/:id" element={<CropDetails />} />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/finance/details" element={<FinanceDetails />} />
            <Route path="/finance/shop/:id" element={<ShopDetails />} />
          </Routes>
        </div>
      </div>{" "}
      {mobileOpen && isMobile && (
        <div className="overlay" onClick={() => setMobileOpen(false)} />
      )}
    </BrowserRouter>
  );
}

export default App;
