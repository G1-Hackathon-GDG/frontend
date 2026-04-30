import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";

const NAV_LINKS = {
  driver: [
    { to: "/driver/dashboard", label: "Dashboard" },
    { to: "/driver/history", label: "History" },
  ],
  staff: [
    { to: "/station/scanner", label: "Scanner" },
    { to: "/station/log", label: "Today's Log" },
  ],
  admin: [
    { to: "/admin/dashboard", label: "Dashboard" },
    { to: "/admin/vehicles", label: "Vehicles" },
    { to: "/admin/stations", label: "Stations" },
    { to: "/admin/vouchers", label: "Vouchers" },
    { to: "/admin/cycles", label: "Cycles" },
    { to: "/admin/ai", label: "AI Panel" },
  ],
};

const ROLE_LABEL = { driver: "Driver", staff: "Station Staff", admin: "Admin" };

export default function Navbar() {
  const { user, logout } = useAuth();
  const { connected } = useSocketContext();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const links = NAV_LINKS[user.role] || [];

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gray-900 text-white border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center gap-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <span className="text-xl">⛽</span>
          <span className="font-bold text-blue-400 tracking-tight">
            FuelPass
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1 flex-1">
          {links.map((link) => {
            const active = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  active
                    ? "bg-blue-900 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Live indicator */}
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${connected ? "bg-green-400 animate-pulse" : "bg-gray-600"}`}
            />
            <span className="text-xs text-gray-500">
              {connected ? "Live" : "Offline"}
            </span>
          </div>

          {/* User info */}
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-white leading-tight">
              {user.name}
            </p>
            <p className="text-xs text-blue-400 uppercase tracking-wider">
              {ROLE_LABEL[user.role]}
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="text-xs px-3 py-1.5 rounded-md border border-gray-700 text-gray-400 hover:text-white hover:border-gray-500 transition-colors"
          >
            Sign out
          </button>
        </div>
      </div>
    </nav>
  );
}
