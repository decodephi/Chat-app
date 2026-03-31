import { createContext, useContext, useState, useEffect } from "react";
import { authService } from "../services/auth.service";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Hydrate from localStorage so page refreshes keep the user logged in
  const [authUser, setAuthUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("chatUser")) || null;
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(true);

  // On mount: verify token is still valid with the server
  useEffect(() => {
    const verifyToken = async () => {
      if (!authUser) { setLoading(false); return; }
      try {
        const { data } = await authService.getMe();
        setAuthUser((prev) => ({ ...prev, ...data.user }));
      } catch {
        // Token expired or invalid — log out
        localStorage.removeItem("chatUser");
        setAuthUser(null);
      } finally {
        setLoading(false);
      }
    };
    verifyToken();
  }, []); // eslint-disable-line

  const login = (userData) => {
    localStorage.setItem("chatUser", JSON.stringify(userData));
    setAuthUser(userData);
  };

  const logout = async () => {
    try { await authService.logout(); } catch { /* ignore */ }
    localStorage.removeItem("chatUser");
    setAuthUser(null);
  };

  return (
    <AuthContext.Provider value={{ authUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
