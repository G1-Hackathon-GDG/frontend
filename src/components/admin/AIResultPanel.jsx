const ALERT_STYLE = {
  normal: {
    bg: "bg-green-50 border-green-200",
    text: "text-green-700",
    badge: "bg-green-100 text-green-800",
  },
  warning: {
    bg: "bg-yellow-50 border-yellow-200",
    text: "text-yellow-700",
    badge: "bg-yellow-100 text-yellow-800",
  },
  critical: {
    bg: "bg-red-50 border-red-200",
    text: "text-red-700",
    badge: "bg-red-100 text-red-800",
  },
};

export default function AIResultPanel({ result }) {
  if (!result) return null;

  const { aiDecision, summary } = result;
  if (!aiDecision) return null;

  const style = ALERT_STYLE[aiDecision.alertLevel] || ALERT_STYLE.normal;

  return (
    <div
      className={`rounded-2xl border p-6 mt-4 animate-pulse-once ${style.bg}`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-gray-900 text-lg">
          AI Allocation Result
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${style.badge}`}
        >
          {aiDecision.alertLevel}
        </span>
      </div>

      {/* Recommendation */}
      {aiDecision.recommendation && (
        <p className={`text-sm mb-5 leading-relaxed ${style.text}`}>
          {aiDecision.recommendation}
        </p>
      )}

      {/* Summary stats */}
      {summary && (
        <div className="grid grid-cols-3 gap-3 mb-5">
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Vouchers Created
            </p>
            <p className="text-2xl font-black text-blue-900 mt-1">
              {summary.vouchersCreated ?? summary.served}
            </p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Fuel Allocated
            </p>
            <p className="text-2xl font-black text-blue-900 mt-1">
              {summary.fuelAllocated?.toLocaleString()}L
            </p>
          </div>
          <div className="bg-white rounded-xl p-3 text-center border border-gray-100">
            <p className="text-xs text-gray-400 uppercase tracking-wider">
              Exhaustion Est.
            </p>
            <p className="text-2xl font-black text-blue-900 mt-1">
              {aiDecision.fuelExhaustionTime || "N/A"}
            </p>
          </div>
        </div>
      )}

      {/* Tier breakdown */}
      {aiDecision.canServe && (
        <div className="mb-5">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Vehicles Served by Tier
          </p>
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 3, 4].map((t) => {
              const tierColors = {
                1: "border-red-200 bg-red-50 text-red-800",
                2: "border-orange-200 bg-orange-50 text-orange-800",
                3: "border-yellow-200 bg-yellow-50 text-yellow-800",
                4: "border-green-200 bg-green-50 text-green-800",
              };
              return (
                <div
                  key={t}
                  className={`rounded-xl border p-3 text-center ${tierColors[t]}`}
                >
                  <p className="text-xs font-bold uppercase">Tier {t}</p>
                  <p className="text-xl font-black mt-1">
                    {aiDecision.canServe[`tier${t}`] ?? 0}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Time slot plan */}
      {aiDecision.timeSlotPlan?.length > 0 && (
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Time Slot Plan
          </p>
          <div className="space-y-2">
            {aiDecision.timeSlotPlan.map((station, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-100 p-3"
              >
                <p className="font-semibold text-gray-800 text-sm mb-2">
                  {station.stationName}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {station.slots?.map((slot, j) => (
                    <span
                      key={j}
                      className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-lg font-medium"
                    >
                      {slot.timeSlot} · {slot.vehicles?.length || 0} vehicles
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
