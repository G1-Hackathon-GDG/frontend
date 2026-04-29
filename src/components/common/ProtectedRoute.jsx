import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    const loginPath =
      roles?.includes("admin") || roles?.includes("staff")
        ? "/admin/login"
        : "/login";
    return <Navigate to={loginPath} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    if (user.role === "admin")
      return <Navigate to="/admin/dashboard" replace />;
    if (user.role === "staff")
      return <Navigate to="/station/scanner" replace />;
    return <Navigate to="/driver/dashboard" replace />;
  }

  return children;
}
