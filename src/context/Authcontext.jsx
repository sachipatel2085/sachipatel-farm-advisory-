import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../api/axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("user");
      if (!saved || saved === "undefined" || saved === "null") {
        return null;
      }
      return JSON.parse(saved);
    } catch (err) {
      console.warn("Failed to parse cached user:", err.message);
      try {
        localStorage.removeItem("user");
      } catch (_) {}
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const currentToken = localStorage.getItem("token");
    if (!currentToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      const res = await api.get("/auth/me");
      setUser(res.data);
      localStorage.setItem("user", JSON.stringify(res.data));
    } catch (err) {
      console.warn("Could not fetch user profile:", err.message);
      // If 401, clear invalid session
      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshUser();
  }, [refreshUser]);

  const login = (newToken, newUser = null) => {
    if (newToken) {
      localStorage.setItem("token", newToken);
      setToken(newToken);
    }
    if (newUser && typeof newUser === "object") {
      try {
        localStorage.setItem("user", JSON.stringify(newUser));
        setUser(newUser);
      } catch (err) {
        console.warn("Could not serialize user to localStorage:", err);
      }
    }
    // Refresh to get full profile
    refreshUser();
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setToken(null);
    setUser(null);
  };

  const isAdmin = user?.role === "admin" || user?.role === "moderator";
  const isExpert = user?.role === "expert" || isAdmin;

  return (
    <AuthContext.Provider
      value={{
        token,
        user,
        role: user?.role || "farmer",
        isAdmin,
        isExpert,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
