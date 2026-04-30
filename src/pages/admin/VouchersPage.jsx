import { useState, useEffect, useCallback } from "react";
import { voucherApi } from "../../api/voucherApi";

const STATUS_STYLE = {
  pending: "bg-blue-100 text-blue-700",
  redeemed: "bg-green-100 text-green-700",
  expired: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-100 text-red-700",
};

function normalizeStatusStats(byStatus) {
  if (!byStatus) return [];

  const entries = Array.isArray(byStatus)
    ? byStatus.map((item) => [
        item.status ?? item._id ?? item.name,
        item.count ?? item.total ?? item.value,
      ])
    : Object.entries(byStatus);

  return entries
    .map(([status, count]) => [status, Number(count ?? 0)])
    .filter(([status]) => status && status !== "total");
}

export default function VouchersPage() {
  const [data, setData] = useState({ vouchers: [], total: 0 });
  const [statusFilter, setStatus] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [cancelId, setCancelId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [vRes, sRes] = await Promise.all([
        voucherApi.getAll({
          page,
          limit: 15,
          status: statusFilter || undefined,
        }),
        voucherApi.getStats(),
      ]);
      setData(vRes.data);
      setStats(sRes.data);
    } catch (err) {
      console.error("Failed to load vouchers", err);
    } finally {
      setLoading(false);
    }
  }, [page, statusFilter]);

  useEffect(() => {
    load();
  }, [load]);

  const cancel = async () => {
    if (!cancelId) return;
    await voucherApi.cancel(cancelId, cancelReason);
    setCancelId(null);
    setCancelReason("");
    load();
  };

  const totalPages = Math.ceil((data.total || 0) / 15);
  const statusStats = normalizeStatusStats(stats?.byStatus);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Vouchers</h1>
          {statusStats.length > 0 && (
            <div className="flex gap-4 mt-2 text-sm">
              {statusStats.map(([s, c]) => (
                <span
                  key={s}
                  className={`px-2.5 py-1 rounded-full font-semibold ${STATUS_STYLE[s] || "bg-gray-100 text-gray-500"}`}
                >
                  {c} {s}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Filters */}
        <div className="flex gap-3 mb-4">
          {["", "pending", "redeemed", "cancelled", "expired"].map((s) => (
            <button
              key={s}
              onClick={() => {
                setStatus(s);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition ${statusFilter === s ? "bg-blue-900 text-white" : "bg-white border border-gray-300 text-gray-600 hover:bg-gray-50"}`}
            >
              {s || "All"}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  {[
                    "Plate",
                    "Station",
                    "Fuel",
                    "Valid Date",
                    "Time Slot",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(data.vouchers || []).map((v) => (
                  <tr key={v._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-semibold text-gray-900">
                      {v.plateNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{v.stationName}</td>
                    <td className="px-4 py-3 font-bold text-blue-900">
                      {v.fuelLiters}L
                    </td>
                    <td className="px-4 py-3 text-gray-500">
                      {new Date(v.validDate).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{v.timeSlot}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[v.status] || "bg-gray-100"}`}
                      >
                        {v.status}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      {["pending", "expired"].includes(v.status) && (
                        <button
                          onClick={() => {
                            setCancelId(v._id);
                            setCancelReason("");
                          }}
                          className="text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-4 mt-6">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-50 disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-500">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page >= totalPages}
              className="px-4 py-2 rounded-lg bg-blue-900 text-white hover:bg-blue-800 disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>

      {cancelId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 mb-3">Cancel Voucher</h3>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-red-400"
              rows={3}
              placeholder="Reason (optional)"
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setCancelId(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={cancel}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
