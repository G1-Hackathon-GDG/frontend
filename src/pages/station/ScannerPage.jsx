import { useState } from "react";
import { voucherApi } from "../../api/voucherApi";
import QRScanner from "../../components/station/QRScanner";
import VehicleInfoCard from "../../components/station/VehicleInfoCard";
import FuelGauge from "../../components/station/FuelGauge";
import { useAuth } from "../../context/AuthContext";

export default function ScannerPage() {
  const { user } = useAuth();
  const [scanned, setScanned] = useState(null); // { voucher, vehicle }
  const [scanError, setScanError] = useState("");
  const [redeeming, setRedeeming] = useState(false);
  const [redeemResult, setRedeemResult] = useState(null); // "success" | "error"
  const [redeemMsg, setRedeemMsg] = useState("");
  const [station, setStation] = useState(null);

  const handleScan = async (token) => {
    setScanError("");
    setScanned(null);
    setRedeemResult(null);
    try {
      const { data } = await voucherApi.verify(token);
      setScanned(data);
      if (data.voucher?.stationId) {
        // fetch station info for fuel gauge
        const { data: sd } = await import("../../api/stationApi").then((m) =>
          m.stationApi.getById(
            data.voucher.stationId?._id || data.voucher.stationId,
          ),
        );
        setStation(sd);
      }
    } catch (err) {
      setScanError(
        err.response?.data?.message || "Invalid or unreadable QR code.",
      );
    }
  };

  const handleRedeem = async () => {
    if (!scanned?.voucher?.qrToken) return;
    setRedeeming(true);
    try {
      await voucherApi.redeem(scanned.voucher.qrToken);
      setRedeemResult("success");
      setRedeemMsg("Fuel voucher redeemed successfully! ✅");
      setStation((s) =>
        s
          ? {
              ...s,
              currentFuelLiters:
                s.currentFuelLiters - scanned.voucher.fuelLiters,
            }
          : s,
      );
    } catch (err) {
      setRedeemResult("error");
      setRedeemMsg(err.response?.data?.message || "Redemption failed.");
    } finally {
      setRedeeming(false);
    }
  };

  const reset = () => {
    setScanned(null);
    setScanError("");
    setRedeemResult(null);
    setRedeemMsg("");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">QR Scanner</h1>
          <p className="text-gray-500 mt-1">Station: {user?.name}</p>
        </div>

        {/* Fuel gauge */}
        {station && (
          <div className="mb-5">
            <FuelGauge
              current={station.currentFuelLiters}
              capacity={station.dailyCapacity}
              label={station.name}
            />
          </div>
        )}

        {/* Scanner */}
        {!redeemResult && (
          <div className="mb-5">
            <QRScanner onScan={handleScan} onError={setScanError} />
            {scanError && (
              <div className="mt-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                {scanError}
              </div>
            )}
          </div>
        )}

        {/* Vehicle info after scan */}
        {scanned && !redeemResult && (
          <div className="space-y-4">
            <VehicleInfoCard
              vehicle={scanned.vehicle}
              voucher={scanned.voucher}
            />
            <div className="flex gap-3">
              <button
                onClick={reset}
                className="flex-1 py-3 rounded-xl border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleRedeem}
                disabled={redeeming}
                className="flex-[2] py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {redeeming && (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                )}
                {redeeming ? "Confirming..." : "✅ Confirm Redemption"}
              </button>
            </div>
          </div>
        )}

        {/* Result */}
        {redeemResult && (
          <div
            className={`rounded-2xl p-8 text-center ${redeemResult === "success" ? "bg-green-50 border border-green-200" : "bg-red-50 border border-red-200"}`}
          >
            <p className="text-5xl mb-4">
              {redeemResult === "success" ? "✅" : "❌"}
            </p>
            <p
              className={`text-lg font-bold mb-2 ${redeemResult === "success" ? "text-green-800" : "text-red-800"}`}
            >
              {redeemMsg}
            </p>
            {redeemResult === "success" && scanned?.voucher && (
              <p className="text-green-600 text-sm">
                {scanned.voucher.fuelLiters}L dispensed for{" "}
                {scanned.voucher.plateNumber}
              </p>
            )}
            <button
              onClick={reset}
              className="mt-6 px-6 py-2.5 bg-blue-900 text-white rounded-xl font-semibold hover:bg-blue-800 transition"
            >
              Scan Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
