import { useState } from "react";
import AllocateButton from "../../components/admin/AllocateButton";
import AIResultPanel from "../../components/admin/AIResultPanel";
import ShortageSimulator from "../../components/admin/ShortageSimulator";
import FraudAlertsTable from "../../components/admin/FraudAlertsTable";
import AlertBanner from "../../components/common/AlertBanner";
import { useSocketContext } from "../../context/SocketContext";
import { Link } from "react-router-dom";

export default function AIPage() {
  const [allocationResult, setAllocationResult] = useState(null);
  const [shortageResult, setShortageResult] = useState(null);
  const { shortageAlert, clearShortageAlert } = useSocketContext();

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

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">AI Panel</h1>
            <p className="text-gray-500 mt-1">
              Gemini-powered fuel allocation engine
            </p>
          </div>
          <Link
            to="/admin/ai/logs"
            className="px-4 py-2 bg-white border border-gray-300 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 transition text-sm"
          >
            📊 View Logs
          </Link>
        </div>

        {/* Allocation Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Fuel Allocation</h2>
            <p className="text-gray-500 text-sm mt-1">
              Runs the AI allocation engine across all verified vehicles and
              active stations. Issues QR vouchers to all eligible drivers in
              real time.
            </p>
          </div>
          <AllocateButton onResult={setAllocationResult} />
          <AIResultPanel result={allocationResult} />
        </div>

        {/* Shortage Simulation */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">
              Shortage Simulation
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              Reduces all station fuel by 50%, cancels Tier 4 vouchers first
              (then Tier 3 if critical), and broadcasts a live shortage alert to
              all connected drivers.
            </p>
          </div>
          <ShortageSimulator onResult={setShortageResult} />

          {shortageResult && (
            <div className="mt-4 bg-red-50 border border-red-200 rounded-2xl p-5">
              <p className="font-bold text-red-800 mb-3">
                Shortage Simulation Complete
              </p>
              <div className="grid grid-cols-3 gap-3 text-center mb-4">
                <div className="bg-white rounded-xl p-3 border border-red-100">
                  <p className="text-xs text-gray-400">Alert Level</p>
                  <p className="font-black text-red-700 uppercase">
                    {shortageResult.alertLevel}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-red-100">
                  <p className="text-xs text-gray-400">Tier 4 Cancelled</p>
                  <p className="font-black text-red-700">
                    {shortageResult.cancelled?.tier4 ?? 0}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-3 border border-red-100">
                  <p className="text-xs text-gray-400">Tier 3 Cancelled</p>
                  <p className="font-black text-red-700">
                    {shortageResult.cancelled?.tier3 ?? 0}
                  </p>
                </div>
              </div>
              {shortageResult.stationFuelAfter?.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                    Station Fuel After
                  </p>
                  <div className="space-y-1">
                    {shortageResult.stationFuelAfter.map((s, i) => (
                      <div
                        key={i}
                        className="flex justify-between text-sm bg-white px-3 py-2 rounded-lg border border-red-100"
                      >
                        <span className="text-gray-700">{s.name}</span>
                        <span className="font-bold text-red-700">
                          {s.currentFuelLiters?.toLocaleString()}L
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fraud Alerts */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Fraud Alerts</h2>
            <p className="text-gray-500 text-sm mt-1">
              Vehicles flagged by the fraud detection system — duplicate plates,
              phone abuse, or suspicious tier claims.
            </p>
          </div>
          <FraudAlertsTable />
        </div>
      </div>
    </div>
  );
}
