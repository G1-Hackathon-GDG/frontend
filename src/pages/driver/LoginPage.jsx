import { useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { setToken, setUser } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { token, user } = res.data;

      setToken(token);
      setUser(user);

      if (user.role === "driver") {
        navigate("/driver/dashboard");
      } else if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "staff") {
        navigate("/station/scanner");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 border-t-4 border-blue-900">

        <h2 className="text-2xl font-bold text-center text-blue-900 mb-2">
          FuelPass Login
        </h2>

        <p className="text-center text-gray-500 mb-6">
          Driver access portal
        </p>

        {error && (
          <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="text-sm text-gray-600">Email</label>
            <input
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="text-sm text-gray-600">Password</label>
            <input
              className="w-full mt-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-blue-900 font-semibold hover:underline"
          >
            Register here
          </Link>
        </p>

        <p className="text-center text-sm text-gray-400 mt-6">
          Secure Fuel Distribution System
        </p>
      </div>
    </div>
  );
}