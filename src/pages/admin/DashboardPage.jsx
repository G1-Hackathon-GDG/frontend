import StatsCards from "../../components/admin/StatsCards";
import TierDonutChart from "../../components/admin/TierDonutChart";
import AlertBanner from "../../components/common/AlertBanner";
import { useSocketContext } from "../../context/SocketContext";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

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
    .filter(([status, count]) => status && status !== "total" && count > 0);
}

export default function AdminDashboardPage() {
  const { shortageAlert, clearShortageAlert } = useSocketContext();
  const [voucherStats, setVoucherStats] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axiosInstance.get("/vouchers/stats");
        setVoucherStats(data);
      } catch (err) {
        console.error("Failed to load voucher stats", err);
      }
    };
    fetch();
  }, []);

  const statusStats = normalizeStatusStats(voucherStats?.byStatus);
  const statusTotal =
    statusStats.reduce((sum, [, count]) => sum + count, 0) ||
    Number(voucherStats?.total || 0) ||
    1;

  return (
    <div className="min-h-screen bg-gray-100">
      {shortageAlert && shortageAlert.alertLevel !== "normal" && (
        <AlertBanner
          isOpen
          message={shortageAlert.message}
          alertLevel={shortageAlert.alertLevel}
          onClose={clearShortageAlert}
        />
      )}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-500 mt-1">Live system overview</p>
        </div>

        <div className="mb-6">
          <StatsCards />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-gray-800 mb-4">
              Voucher Distribution by Tier
            </h2>
            <TierDonutChart byTier={voucherStats?.byTier || []} />
          </div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-gray-800 mb-4">
              Voucher Status Summary
            </h2>
            {statusStats.length > 0 ? (
              <div className="space-y-3">
                {statusStats.map(
                  ([status, count]) => (
                    <div key={status} className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-24 capitalize">
                        {status}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${status === "redeemed" ? "bg-green-500" : status === "pending" ? "bg-blue-500" : status === "cancelled" ? "bg-red-500" : "bg-gray-400"}`}
                          style={{
                            width: `${Math.min((count / statusTotal) * 100, 100)}%`,
                          }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-gray-700 w-8 text-right">
                        {count}
                      </span>
                    </div>
                  ),
                )}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">No data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
