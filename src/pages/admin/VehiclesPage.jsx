import { useState, useEffect } from "react";
import { vehicleApi } from "../../api/vehicleApi";
import {
  getTierBadgeStyle,
  getVehicleTypeLabel,
} from "../../utils/tierLabel";

export default function VehiclesPage() {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [flagModal, setFlagModal] = useState(null); // vehicle to flag
  const [flagReason, setFlagReason] = useState("");

  const load = async () => {
    try {
      const { data } = await vehicleApi.getAll();
      setVehicles(data.vehicles || []);
    } catch (err) {
      console.error("Failed to load vehicles", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const verify = async (id) => {
    await vehicleApi.verify(id);
    load();
  };

  const flag = async () => {
    if (!flagModal) return;
    await vehicleApi.flag(flagModal._id, flagReason);
    setFlagModal(null);
    setFlagReason("");
    load();
  };

  const unflag = async (id) => {
    await vehicleApi.unflag(id);
    load();
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Vehicles</h1>
          <p className="text-gray-500 mt-1">{vehicles.length} registered</p>
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
                  {["Plate", "Owner", "Type", "Tier", "Status", "Actions"].map(
                    (h) => (
                      <th
                        key={h}
                        className="text-left px-4 py-3 text-xs font-bold text-gray-500 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vehicles.map((v) => (
                  <tr key={v._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono font-semibold text-gray-900">
                      {v.plateNumber}
                    </td>
                    <td className="px-4 py-3 text-gray-700">{v.ownerName}</td>
                    <td className="px-4 py-3 text-gray-500">
                      {getVehicleTypeLabel(v.vehicleType)}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded-full border ${getTierBadgeStyle(v.tierLevel)}`}
                      >
                        Tier {v.tierLevel}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {v.isVerified ? (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-semibold">
                            Verified
                          </span>
                        ) : (
                          <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full font-semibold">
                            Pending
                          </span>
                        )}
                        {v.flagged && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-semibold">
                            Flagged
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5">
                        {!v.isVerified && (
                          <button
                            onClick={() => verify(v._id)}
                            className="text-xs px-2.5 py-1 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                          >
                            Verify
                          </button>
                        )}
                        {!v.flagged ? (
                          <button
                            onClick={() => {
                              setFlagModal(v);
                              setFlagReason("");
                            }}
                            className="text-xs px-2.5 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition font-semibold"
                          >
                            Flag
                          </button>
                        ) : (
                          <button
                            onClick={() => unflag(v._id)}
                            className="text-xs px-2.5 py-1 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition font-semibold"
                          >
                            Unflag
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Flag modal */}
      {flagModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-sm">
            <h3 className="font-bold text-gray-900 mb-1">Flag Vehicle</h3>
            <p className="text-gray-500 text-sm mb-4">
              {flagModal.plateNumber} — {flagModal.ownerName}
            </p>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              rows={3}
              placeholder="Reason for flagging..."
              value={flagReason}
              onChange={(e) => setFlagReason(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setFlagModal(null)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 text-gray-600 font-semibold hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={flag}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
              >
                Flag Vehicle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
