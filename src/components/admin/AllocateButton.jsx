import { useState } from "react";
import { aiApi } from "../../api/aiApi";

export default function AllocateButton({ onResult }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const run = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await aiApi.allocate();
      onResult?.(data);
    } catch (err) {
      setError(err.response?.data?.message || "Allocation failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={run}
        disabled={loading}
        className="w-full py-4 bg-blue-900 text-white rounded-2xl font-bold text-lg hover:bg-blue-800 transition disabled:opacity-50 flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Running AI Allocation... (this may take a few seconds)
          </>
        ) : (
          "🤖 Run AI Allocation"
        )}
      </button>
      {error && (
        <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
