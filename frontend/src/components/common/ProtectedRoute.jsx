import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Spinner from "../common/Spinner";

const ProtectedRoute = ({ children }) => {
  const { authUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-chat-bg">
        <Spinner size="lg" />
      </div>
    );
  }

  return authUser ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
