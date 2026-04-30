import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosInstance from "../../api/axiosInstance";
import { useAuth } from "../../context/AuthContext";

// Must match backend Vehicle model enum exactly
const VEHICLE_TYPES = [
  { value: "fuel_tanker", label: "🚛 Fuel Tanker", tier: 1 },
  { value: "manufacturing", label: "🏭 Manufacturing", tier: 1 },
  { value: "government_project", label: "🏛️ Government Project", tier: 1 },
  { value: "essential_goods", label: "📦 Essential Goods", tier: 2 },
  { value: "agricultural_tractor", label: "🚜 Agricultural Tractor", tier: 2 },
  {
    value: "urban_public_transport",
    label: "🚌 Urban Public Transport",
    tier: 3,
  },
  {
    value: "diesel_public_transport",
    label: "🚍 Diesel Public Transport",
    tier: 3,
  },
  { value: "private", label: "🚗 Private Vehicle", tier: 4 },
];

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    plateNumber: "",
    vehicleType: "private",
  });
  const [error, setError] = useState("");
  const [fraudFlags, setFraudFlags] = useState([]);
  const [loading, setLoading] = useState(false);

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const nextStep = (e) => {
    e.preventDefault();
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    setError("");
    setStep(2);
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setFraudFlags([]);
    setLoading(true);
    try {
      await register({
        name: form.name,
        email: form.email,
        password: form.password,
      });

      // Step 2: register vehicle
      const { data: vehicleData } = await axiosInstance.post("/vehicles", {
        phone: form.phone,
        plateNumber: form.plateNumber, // must be plateNumber not plate
        vehicleType: form.vehicleType,
      });

      if (vehicleData.fraudResult?.triggeredRules?.length) {
        setFraudFlags(vehicleData.fraudResult.triggeredRules);
      }

      navigate("/driver/dashboard");
    } catch (err) {
      const fraud = err.response?.data?.fraudResult;
      if (fraud?.triggeredRules?.length) setFraudFlags(fraud.triggeredRules);
      setError(
        err.response?.data?.message || "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const selected = VEHICLE_TYPES.find((t) => t.value === form.vehicleType);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-8">
      <div className="w-full max-w-lg bg-white shadow-xl rounded-2xl p-8 border-t-4 border-blue-900">
        <div className="text-center mb-6">
          <div className="text-3xl mb-2">⛽</div>
          <h2 className="text-2xl font-bold text-blue-900">
            Create your FuelPass
          </h2>
          <p className="text-gray-500 text-sm mt-1">Step {step} of 2</p>
        </div>

        {/* Progress bar */}
        <div className="flex gap-2 mb-6">
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 1 ? "bg-blue-900" : "bg-gray-200"}`}
          />
          <div
            className={`h-1.5 flex-1 rounded-full transition-colors ${step >= 2 ? "bg-blue-900" : "bg-gray-200"}`}
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4 text-sm">
            {error}
          </div>
        )}

        {fraudFlags.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 px-4 py-3 rounded-lg mb-4">
            <p className="text-yellow-800 font-semibold text-sm mb-1">
              ⚠️ Fraud flags detected
            </p>
            {fraudFlags.map((r, i) => (
              <p key={i} className="text-yellow-700 text-xs">
                • {r.code}: {r.message}
              </p>
            ))}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={nextStep} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Full name
              </label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                name="name"
                placeholder="Abebe Girma"
                value={form.name}
                onChange={handle}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handle}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Password
              </label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                name="password"
                type="password"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={handle}
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition"
            >
              Continue →
            </button>
          </form>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Phone number
              </label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                name="phone"
                placeholder="+251911000000"
                value={form.phone}
                onChange={handle}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                License plate
              </label>
              <input
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
                name="plateNumber"
                placeholder="AA-12345"
                value={form.plateNumber}
                onChange={handle}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Vehicle type
              </label>
              <select
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-900 bg-white"
                name="vehicleType"
                value={form.vehicleType}
                onChange={handle}
              >
                {VEHICLE_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label} — Priority Tier {t.tier}
                  </option>
                ))}
              </select>
            </div>
            {selected && (
              <div className="bg-blue-50 border border-blue-100 rounded-lg px-4 py-3 text-sm text-blue-800">
                <span className="font-semibold">
                  Government Priority Tier {selected.tier}
                </span>{" "}
                — {selected.label}
              </div>
            )}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex-1 py-3 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 font-semibold transition"
              >
                ← Back
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] bg-blue-900 text-white py-3 rounded-lg font-semibold hover:bg-blue-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {loading ? "Registering..." : "Complete Registration →"}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-gray-500 mt-5">
          Already registered?{" "}
          <Link
            to="/login"
            className="text-blue-900 font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
