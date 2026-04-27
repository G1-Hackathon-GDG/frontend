import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function HistoryPage() {
  const { token } = useAuth();
  const [history, setHistory] = useState([]);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/vouchers/history?page=${page}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setHistory(res.data);
      } catch (err) {
        console.error("Failed to fetch history:", err);
      }
    };

    if (token) fetchHistory();
  }, [page, token]);

  return (
    <div className="min-h-screen bg-gray-100 p-6 md:p-10">

      {/* Header */}
      <h2 className="text-2xl md:text-3xl font-bold text-blue-900 mb-6">
        Voucher History
      </h2>

      {/* List */}
      {history.length === 0 ? (
        <div className="bg-white p-6 rounded-xl shadow text-gray-500">
          No history found 📭
        </div>
      ) : (
        <div className="space-y-4">

          {history.map((v) => (
            <div
              key={v._id}
              className="bg-white rounded-xl shadow-md p-5 border-l-4 border-blue-900 hover:shadow-lg transition"
            >
              <p className="font-semibold text-gray-800">
                Station: {v.station}
              </p>

              <p className="text-gray-600 mt-1">
                Status:{" "}
                <span
                  className={`font-medium ${
                    v.status === "issued"
                      ? "text-green-600"
                      : v.status === "used"
                      ? "text-gray-600"
                      : "text-red-600"
                  }`}
                >
                  {v.status}
                </span>
              </p>
            </div>
          ))}

        </div>
      )}

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition"
        >
          Prev
        </button>

        <span className="px-4 py-2 font-semibold text-gray-700">
          Page {page}
        </span>

        <button
          onClick={() => setPage((p) => p + 1)}
          className="px-4 py-2 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition"
        >
          Next
        </button>
      </div>
    </div>
  );
}