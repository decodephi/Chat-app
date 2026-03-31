import { Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import { AuthProvider, useAuth } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";
import { ChatProvider } from "./context/ChatContext";

import ProtectedRoute from "./components/common/ProtectedRoute";
import LoginPage    from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import HomePage     from "./pages/HomePage";

// ── Public-only route: redirect logged-in users to home ──────
const PublicRoute = ({ children }) => {
  const { authUser, loading } = useAuth();
  if (loading) return null;
  return authUser ? <Navigate to="/" replace /> : children;
};

// ── Inner app that has access to Auth context ─────────────────
const AppRoutes = () => (
  <SocketProvider>
    <ChatProvider>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />
        {/* Catch-all */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1c2333",
            color: "#e2e8f0",
            border: "1px solid #30363d",
            borderRadius: "12px",
            fontSize: "14px",
          },
          success: { iconTheme: { primary: "#4ade80", secondary: "#1c2333" } },
          error:   { iconTheme: { primary: "#f87171", secondary: "#1c2333" } },
          duration: 3000,
        }}
      />
    </ChatProvider>
  </SocketProvider>
);

// ── Root: wrap everything in AuthProvider ────────────────────
const App = () => (
  <AuthProvider>
    <AppRoutes />
  </AuthProvider>
);

export default App;
