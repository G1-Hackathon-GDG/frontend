import StatsCards from "../../components/admin/StatsCards";
import TierDonutChart from "../../components/admin/TierDonutChart";
import AlertBanner from "../../components/common/AlertBanner";
import { useSocketContext } from "../../context/SocketContext";
import { useState, useEffect } from "react";
import axiosInstance from "../../api/axiosInstance";

export default function AdminDashboardPage() {
  const { shortageAlert, clearShortageAlert } = useSocketContext();
  const [voucherStats, setVoucherStats] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await axiosInstance.get("/vouchers/stats");
        setVoucherStats(data);
      } catch {}
    };
    fetch();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      {shortageAlert && shortageAlert.alertLevel !== "normal" && (
        <AlertBanner
          isOpen
          onMessage={shortageAlert.message}
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
            {voucherStats?.byStatus ? (
              <div className="space-y-3">
                {Object.entries(voucherStats.byStatus).map(
                  ([status, count]) => (
                    <div key={status} className="flex items-center gap-3">
                      <span className="text-sm text-gray-500 w-24 capitalize">
                        {status}
                      </span>
                      <div className="flex-1 bg-gray-100 rounded-full h-3">
                        <div
                          className={`h-3 rounded-full ${status === "redeemed" ? "bg-green-500" : status === "pending" ? "bg-blue-500" : status === "cancelled" ? "bg-red-500" : "bg-gray-400"}`}
                          style={{
                            width: `${Math.min((count / (voucherStats.byStatus.total || 1)) * 100, 100)}%`,
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
