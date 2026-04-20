import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-gray-900 text-white p-4 flex justify-between">
      <h1>FuelPass</h1>

      <div className="space-x-4">
        {!user && <Link to="/login">Login</Link>}

        {user?.role === "driver" && (
          <Link to="/driver/dashboard">Dashboard</Link>
        )}

        {user?.role === "admin" && (
          <Link to="/admin/dashboard">Admin</Link>
        )}

        {user?.role === "staff" && (
          <Link to="/station/scanner">Scanner</Link>
        )}

        {user && <button onClick={logout}>Logout</button>}
      </div>
    </nav>
  );
}