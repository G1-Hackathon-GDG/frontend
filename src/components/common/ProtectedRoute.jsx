import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Still loading session — show nothing, don't redirect yet
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Not logged in
  if (!user) {
    let loginPath = "/login";
    if (location.pathname.startsWith("/admin")) loginPath = "/admin/login";
    if (location.pathname.startsWith("/station")) loginPath = "/station/login";
    return <Navigate to={loginPath} replace state={{ from: location }} />;
  }

  // Wrong role
  if (roles && !roles.includes(user.role)) {
    if (user.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "staff")
      return <Navigate to="/station/scanner" replace />;
    return <Navigate to="/driver/dashboard" replace />;
  }

  return children;
}
