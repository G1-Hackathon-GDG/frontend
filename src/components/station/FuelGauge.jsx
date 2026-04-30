export default function FuelGauge({
  current,
  capacity,
  label = "Station Fuel",
}) {
  const pct = capacity > 0 ? Math.min((current / capacity) * 100, 100) : 0;
  const color =
    pct > 50 ? "bg-green-500" : pct > 20 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <div className="flex justify-between items-center mb-3">
        <p className="text-sm font-semibold text-gray-600">{label}</p>
        <p className="text-sm font-bold text-gray-800">
          {current?.toLocaleString()}L / {capacity?.toLocaleString()}L
        </p>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden">
        <div
          className={`h-4 rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-right text-xs text-gray-400 mt-1.5">
        {pct.toFixed(1)}% remaining
      </p>
    </div>
  );
}
