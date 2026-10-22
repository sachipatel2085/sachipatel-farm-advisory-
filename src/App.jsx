import { useState, useLayoutEffect } from "react";
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
import DiseaseScanner from "./pages/DiseaseScanner";
import MandiRates from "./pages/MandiRates";
import Advisory from "./pages/Advisory";
import ActivitiesCalendar from "./pages/ActivitiesCalendar";
import CropPlanning from "./pages/CropPlanning";
import Community from "./pages/Community";
import CommunityPostDetails from "./pages/CommunityPostDetails";

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
      <div className="flex min-h-screen bg-slate-900 text-white">
        {/* Sidebar */}
        <Sidebar
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          isMobile={isMobile}
        />

        {/* Main */}
        <div
          className={`
      flex-1 flex flex-col transition-all duration-300
      ${isMobile ? "ml-0" : collapsed ? "ml-16" : "ml-64"}
    `}
        >
          <Topbar
            isMobile={isMobile}
            setMobileOpen={setMobileOpen}
            mobileOpen={mobileOpen}
          />

          <div className="flex-1 p-4 sm:p-6">
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
          </div>
        </div>
      </div>{" "}
      {mobileOpen && isMobile && (
        <div className="overlay" onClick={() => setMobileOpen(false)} />
      )}
    </BrowserRouter>
  );
}

export default App;
