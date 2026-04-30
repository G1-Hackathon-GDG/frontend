import { useState, useEffect } from "react";
import { stationApi } from "../../api/stationApi";

export default function TodayLogPage() {
  const [events, setEvents] = useState([]);
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        // Get stations to find this staff's station
        const { data: stationsData } = await stationApi.getAll();
        const stations = stationsData.stations || [];
        // staff is assigned to one station via stationId in their user profile
        // fallback: use first active station
        const myStation = stations[0];
        if (!myStation) {
          setError("No station found.");
          return;
        }
        setStation(myStation);
        const { data: logData } = await stationApi.getLog(myStation._id);
        setEvents(logData.events || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load log.");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  const totalDispensed = events
    .filter((e) => e.eventType === "voucher_redeem")
    .reduce((sum, e) => sum + Math.abs(e.litersDelta || 0), 0);

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Today's Log</h1>
          {station && (
            <p className="text-gray-500 mt-1">
              {station.name} · {station.city}
            </p>
          )}
        </div>

        {/* Summary card */}
        {!loading && !error && (
          <div className="bg-blue-900 text-white rounded-2xl p-6 mb-6 grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-blue-300 text-xs uppercase tracking-wider">
                Total Events
              </p>
              <p className="text-3xl font-bold mt-1">{events.length}</p>
            </div>
            <div>
              <p className="text-blue-300 text-xs uppercase tracking-wider">
                Fuel Dispensed
              </p>
              <p className="text-3xl font-bold mt-1">{totalDispensed}L</p>
            </div>
            <div>
              <p className="text-blue-300 text-xs uppercase tracking-wider">
                Remaining
              </p>
              <p className="text-3xl font-bold mt-1">
                {station?.currentFuelLiters?.toLocaleString()}L
              </p>
            </div>
          </div>
        )}

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-900 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="bg-white rounded-2xl shadow p-10 text-center text-red-500">
            <p className="text-3xl mb-2">⚠️</p>
            <p>{error}</p>
          </div>
        ) : events.length === 0 ? (
          <div className="bg-white rounded-2xl shadow p-12 text-center">
            <p className="text-5xl mb-4">📋</p>
            <p className="text-gray-500">No events recorded yet today.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {events.map((e) => (
              <div
                key={e.id}
                className="bg-white rounded-xl shadow-sm p-4 flex items-center gap-4"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 ${e.eventType === "voucher_redeem" ? "bg-green-100" : e.eventType === "fuel_increment" ? "bg-blue-100" : "bg-red-100"}`}
                >
                  {e.eventType === "voucher_redeem"
                    ? "✅"
                    : e.eventType === "fuel_increment"
                      ? "⬆️"
                      : "⬇️"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-800 text-sm capitalize">
                    {e.eventType.replace(/_/g, " ")}
                  </p>
                  {e.notes && (
                    <p className="text-gray-400 text-xs truncate">{e.notes}</p>
                  )}
                  <p className="text-gray-300 text-xs">
                    {new Date(e.timestamp).toLocaleTimeString()}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p
                    className={`font-bold ${e.litersDelta > 0 ? "text-green-600" : "text-red-600"}`}
                  >
                    {e.litersDelta > 0 ? "+" : ""}
                    {e.litersDelta}L
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
