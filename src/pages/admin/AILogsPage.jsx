import { useState, useEffect } from "react";
import { aiApi } from "../../api/aiApi";

const ALERT_BADGE = {
  normal: "bg-green-100 text-green-700",
  warning: "bg-yellow-100 text-yellow-700",
  critical: "bg-red-100 text-red-700",
};

export default function AILogsPage() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await aiApi.getLogs({ page, limit: 10 });
        setLogs(data.logs || []);
        setTotal(data.total || 0);
      } catch {
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page]);

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">
            AI Allocation Logs
          </h1>
          <p className="text-gray-500 mt-1">
            {total} total allocation decisions
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : logs.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <p className="text-5xl mb-4">📊</p>
            <p className="text-gray-500">
              No allocation logs yet. Run your first AI allocation.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log._id}
                className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden"
              >
                <div
                  className="p-5 flex items-center gap-4 cursor-pointer hover:bg-gray-50 transition"
                  onClick={() =>
                    setExpanded(expanded === log._id ? null : log._id)
                  }
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-lg shrink-0">
                    🤖
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-gray-900">
                        Cycle #{log.cycleId?.cycleNumber || "—"}
                      </p>
                      <span
                        className={`text-xs font-bold px-2 py-0.5 rounded-full ${ALERT_BADGE[log.alertLevel] || ALERT_BADGE.normal}`}
                      >
                        {log.alertLevel}
                      </span>
                    </div>
                    <p className="text-gray-400 text-xs">
                      {new Date(log.createdAt).toLocaleString()} ·{" "}
                      {log.vouchersGenerated} vouchers generated
                    </p>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {expanded === log._id ? "▲" : "▼"}
                  </span>
                </div>

                {expanded === log._id && log.aiDecision && (
                  <div className="border-t border-gray-100 p-5 bg-gray-50">
                    {log.aiDecision.recommendation && (
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {log.aiDecision.recommendation}
                      </p>
                    )}
                    {log.aiDecision.canServe && (
                      <div className="grid grid-cols-4 gap-2 mb-4">
                        {[1, 2, 3, 4].map((t) => {
                          const colors = {
                            1: "bg-red-50 text-red-800",
                            2: "bg-orange-50 text-orange-800",
                            3: "bg-yellow-50 text-yellow-800",
                            4: "bg-green-50 text-green-800",
                          };
                          return (
                            <div
                              key={t}
                              className={`rounded-xl p-2 text-center ${colors[t]}`}
                            >
                              <p className="text-xs font-bold">Tier {t}</p>
                              <p className="text-lg font-black">
                                {log.aiDecision.canServe[`tier${t}`] ?? 0}
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                    <details className="text-xs">
                      <summary className="cursor-pointer text-gray-400 hover:text-gray-600 font-medium">
                        View full Gemini JSON
                      </summary>
                      <pre className="mt-2 p-3 bg-gray-900 text-green-400 rounded-xl overflow-x-auto text-[11px] leading-relaxed">
                        {JSON.stringify(log.aiDecision, null, 2)}
                      </pre>
                    </details>
                  </div>
                )}
              </div>
            ))}
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
    </div>
  );
}
