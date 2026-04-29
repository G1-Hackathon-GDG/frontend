import { useVoucher } from "../../hooks/useVoucher";
import { useAuth } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import VoucherCard from "../../components/driver/VoucherCard";
import AlertBanner from "../../components/common/AlertBanner";

export default function DashboardPage() {
  const { user } = useAuth();
  const { vouchers, loading, error } = useVoucher();
  const { connected, lastVoucherCancelled, shortageAlert, clearShortageAlert } =
    useSocketContext();

  const activeVoucher = vouchers.find((v) =>
    ["pending", "redeemed"].includes(v.status),
  );
  const otherVouchers = vouchers.filter((v) => v !== activeVoucher).slice(0, 3);

  const statusBadge = (status) => {
    const map = {
      pending: "bg-blue-100 text-blue-700",
      redeemed: "bg-green-100 text-green-700",
      expired: "bg-gray-100 text-gray-600",
      cancelled: "bg-red-100 text-red-700",
    };
    return map[status] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Shortage alert banner */}
      {shortageAlert && shortageAlert.alertLevel !== "normal" && (
        <AlertBanner
          isOpen={true}
          message={shortageAlert.message}
          alertLevel={shortageAlert.alertLevel}
          onClose={clearShortageAlert}
        />
      )}

      {/* Cancelled notice */}
      {lastVoucherCancelled && (
        <div className="bg-red-600 text-white px-6 py-3 flex items-center gap-3">
          <span>🚫</span>
          <div>
            <span className="font-semibold">Voucher Cancelled — </span>
            <span className="text-red-100 text-sm">
              {lastVoucherCancelled.reason}
            </span>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-gray-500 text-sm">Welcome back</p>
          <h1 className="text-3xl font-bold text-gray-900">{user?.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <div
              className={`w-2 h-2 rounded-full ${connected ? "bg-green-500 animate-pulse" : "bg-gray-400"}`}
            />
            <span className="text-sm text-gray-500">
              {connected ? "Live — updates are instant" : "Connecting..."}
            </span>
          </div>
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
        ) : !activeVoucher ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <p className="text-5xl mb-4">⏳</p>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              No Active Voucher
            </h2>
            <p className="text-gray-500 max-w-sm mx-auto">
              Your fuel voucher will appear here the moment the admin runs the
              allocation. You'll be notified instantly — no refresh needed.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <VoucherCard voucher={activeVoucher} />
            <div className="space-y-4">
              <div className="bg-white rounded-2xl shadow p-5">
                <p className="text-xs uppercase font-bold text-gray-400 tracking-wider mb-3">
                  Assigned Station
                </p>
                <p className="text-lg font-bold text-gray-900">
                  {activeVoucher.stationName}
                </p>
                <p className="text-gray-500 text-sm">
                  {activeVoucher.stationId?.city || ""}
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4 pt-4 border-t border-gray-100">
                  <div>
                    <p className="text-xs text-gray-400 mb-1">TIME SLOT</p>
                    <p className="font-semibold text-gray-800">
                      {activeVoucher.timeSlot}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-400 mb-1">FUEL</p>
                    <p className="font-bold text-blue-900 text-xl">
                      {activeVoucher.fuelLiters}L
                    </p>
                  </div>
                </div>
              </div>
              <div className="bg-blue-900 text-white rounded-2xl p-5">
                <p className="text-xs uppercase tracking-wider text-blue-300 mb-2">
                  Cycle
                </p>
                <p className="font-semibold">
                  #{activeVoucher.cycleId?.cycleNumber}
                </p>
                <p className="text-blue-300 text-sm mt-1">
                  Valid:{" "}
                  {new Date(activeVoucher.validDate).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        )}

        {otherVouchers.length > 0 && (
          <div className="mt-8">
            <h2 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">
              Recent Vouchers
            </h2>
            <div className="space-y-2">
              {otherVouchers.map((v) => (
                <div
                  key={v._id}
                  className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
                >
                  <span className="text-2xl">⛽</span>
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">
                      {v.stationName}
                    </p>
                    <p className="text-gray-400 text-sm">
                      {v.timeSlot} · {v.fuelLiters}L
                    </p>
                  </div>
                  <span
                    className={`text-xs font-semibold px-3 py-1 rounded-full ${statusBadge(v.status)}`}
                  >
                    {v.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
