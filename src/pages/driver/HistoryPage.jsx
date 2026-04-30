import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

const STATUS_STYLE = {
  pending: "bg-blue-100 text-blue-700",
  redeemed: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-100 text-red-700",
};

export default function HistoryPage() {
  const [data, setData] = useState({ vouchers: [], total: 0 });
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosInstance.get(
          `/vouchers/history?page=${page}&limit=10`,
        );
        setData(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load history.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page]);

  const totalPages = Math.ceil((data.total || 0) / 10);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Voucher History</h1>
          <p className="text-gray-500 mt-1">
            {data.total} voucher{data.total !== 1 ? "s" : ""} across all cycles
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center text-red-500">
            <p className="text-3xl mb-2">⚠️</p>
            <p>{error}</p>
          </div>
        ) : data.vouchers.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-gray-500">No vouchers yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {data.vouchers.map((v) => (
              <div
                key={v._id}
                className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4 hover:shadow-md transition-shadow"
              >
                <div className="w-11 h-11 rounded-xl bg-blue-900 flex items-center justify-center text-white text-xl shrink-0">
                  ⛽
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {v.stationName}
                  </p>
                  <p className="text-gray-400 text-sm">
                    {new Date(v.validDate).toLocaleDateString()} · {v.timeSlot}
                  </p>
                  <p className="text-gray-300 text-xs mt-0.5">
                    Cycle #{v.cycleId?.cycleNumber}
                    {v.redeemedAt &&
                      ` · Redeemed ${new Date(v.redeemedAt).toLocaleString()}`}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-blue-900 text-xl leading-tight">
                    {v.fuelLiters}L
                  </p>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full mt-1 inline-block ${STATUS_STYLE[v.status] || "bg-gray-100 text-gray-500"}`}
                  >
                    {v.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 transition disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 transition disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
