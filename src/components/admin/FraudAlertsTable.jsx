import { useState, useEffect } from "react";
import { vehicleApi } from "../../api/vehicleApi";
import { getVehicleTypeLabel, getTierBadgeStyle } from "../../utils/tierLabel";

export default function FraudAlertsTable() {
  const [flagged, setFlagged] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      const { data } = await vehicleApi.getAll();
      setFlagged((data.vehicles || []).filter((v) => v.flagged));
    } catch {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const unflag = async (id) => {
    await vehicleApi.unflag(id);
    load();
  };

  if (loading)
    return (
      <div className="flex justify-center py-8">
        <div className="w-8 h-8 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
      </div>
    );

  if (flagged.length === 0)
    return (
      <div className="text-center py-8">
        <p className="text-3xl mb-2">✅</p>
        <p className="text-gray-500 text-sm">No flagged vehicles</p>
      </div>
    );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 border-b border-gray-200">
          <tr>
            {["Plate", "Owner", "Type", "Tier", "Flag Reason", "Action"].map(
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
          {flagged.map((v) => (
            <tr key={v._id} className="hover:bg-red-50">
              <td className="px-4 py-3 font-mono font-semibold text-gray-900">
                {v.plateNumber}
              </td>
              <td className="px-4 py-3 text-gray-700">{v.ownerName}</td>
              <td className="px-4 py-3 text-gray-500 text-xs">
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
                <span className="text-xs bg-red-100 text-red-700 px-2.5 py-1 rounded-full font-semibold">
                  {v.flagReason || "Flagged by admin"}
                </span>
              </td>
              <td className="px-4 py-3">
                <button
                  onClick={() => unflag(v._id)}
                  className="text-xs px-2.5 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition font-semibold"
                >
                  Unflag
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
