import { useState, useLayoutEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
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
import DiseaseScanner from "./pages/DiseaseScanner";
import MandiRates from "./pages/MandiRates";
import Advisory from "./pages/Advisory";
import ActivitiesCalendar from "./pages/ActivitiesCalendar";
import CropPlanning from "./pages/CropPlanning";
import Community from "./pages/Community";
import CommunityPostDetails from "./pages/CommunityPostDetails";
import AdminDashboard from "./pages/AdminDashboard";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function AppContent() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useLayoutEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const mobile = width < 768;
      setIsMobile(mobile);
      if (width >= 768 && width < 1024) {
        setCollapsed(true);
      } else if (width >= 1024) {
        setCollapsed(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 1. SEPARATE DEDICATED ADMIN DASHBOARD (NO USER/FARMER SIDEBAR, NO USER TOPBAR)
  if (isAdminRoute) {
    return (
      <Routes>
        <Route
          path="/admin"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route path="/admin/*" element={<Navigate to="/admin" replace />} />
      </Routes>
    );
  }

  // 2. USER / FARMER APP WITH FARMER SIDEBAR & TOPBAR
  return (
    <div className="flex min-h-screen bg-slate-900 text-white overflow-x-hidden">
      {/* Farmer Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
        isMobile={isMobile}
      />

      {/* Main Container */}
      <div
        className={`
          flex-1 flex flex-col min-w-0 transition-all duration-300
          ${isMobile ? "ml-0" : collapsed ? "ml-16" : "ml-64"}
        `}
      >
        <Topbar
          isMobile={isMobile}
          setMobileOpen={setMobileOpen}
          mobileOpen={mobileOpen}
        />

        <main className="flex-1 p-3.5 sm:p-5 md:p-6 w-full max-w-7xl mx-auto min-w-0">
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
            <Route
              path="/planning"
              element={
                <PrivateRoute>
                  <CropPlanning />
                </PrivateRoute>
              }
            />
            <Route
              path="/activities"
              element={
                <PrivateRoute>
                  <ActivitiesCalendar />
                </PrivateRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <PrivateRoute>
                  <ActivitiesCalendar />
                </PrivateRoute>
              }
            />
            <Route
              path="/advisory"
              element={
                <PrivateRoute>
                  <Advisory />
                </PrivateRoute>
              }
            />
            <Route path="/finance" element={<FinancePage />} />
            <Route path="/finance/details" element={<FinanceDetails />} />
            <Route path="/finance/shop/:id" element={<ShopDetails />} />
            <Route path="/scanner" element={<DiseaseScanner />} />
            <Route path="/mandi" element={<MandiRates />} />
            <Route path="/community" element={<Community />} />
            <Route path="/community/:id" element={<CommunityPostDetails />} />
          </Routes>
        </main>
      </div>

      {mobileOpen && isMobile && (
        <div className="overlay" onClick={() => setMobileOpen(false)} />
      )}
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
