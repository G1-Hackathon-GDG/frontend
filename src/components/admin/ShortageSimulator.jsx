import { useState } from "react";
import { aiApi } from "../../api/aiApi";
import { useSocketContext } from "../../context/SocketContext";

export default function ShortageSimulator({ onResult }) {
  const [loading, setLoading] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setConfirm(false);
    setError("");
    setLoading(true);
    try {
      const { data } = await aiApi.simulateShortage();
      onResult?.(data);
    } catch (err) {
      setError(err.response?.data?.message || "Simulation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {!confirm ? (
        <button
          onClick={() => setConfirm(true)}
          disabled={loading}
          className="w-full py-3 bg-red-600 text-white rounded-2xl font-bold hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          ⚠️ Simulate 50% Fuel Shortage
        </button>
      ) : (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
          <p className="text-red-800 font-bold text-sm mb-1">Are you sure?</p>
          <p className="text-red-600 text-xs mb-4">
            This will reduce all station fuel by 50%, cancel Tier 4 vouchers
            (and Tier 3 if critical), and broadcast a shortage alert to all
            connected drivers.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setConfirm(false)}
              className="flex-1 py-2 rounded-xl border border-gray-300 text-gray-600 font-semibold text-sm hover:bg-gray-50 transition"
            >
              Cancel
            </button>
            <button
              onClick={run}
              disabled={loading}
              className="flex-1 py-2 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              )}
              {loading ? "Simulating..." : "Confirm Simulation"}
            </button>
          </div>
        </div>
      )}
      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
