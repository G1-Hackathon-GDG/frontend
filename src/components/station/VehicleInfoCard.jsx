import {
  getTierBadgeStyle,
  getTierLabel,
  getVehicleTypeLabel,
} from "../../utils/tierLabel";

export default function VehicleInfoCard({ vehicle, voucher }) {
  if (!vehicle || !voucher) return null;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="bg-blue-900 text-white px-6 py-4">
        <p className="text-blue-300 text-xs uppercase tracking-wider font-semibold mb-1">
          Vehicle Information
        </p>
        <h3 className="text-xl font-bold">{vehicle.plateNumber}</h3>
        <p className="text-blue-200 text-sm">{vehicle.ownerName}</p>
      </div>
      <div className="p-5 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
            Vehicle Type
          </p>
          <p className="font-semibold text-gray-800">
            {getVehicleTypeLabel(vehicle.vehicleType)}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
            Priority Tier
          </p>
          <span
            className={`text-xs font-bold px-2.5 py-1 rounded-full border ${getTierBadgeStyle(vehicle.tierLevel)}`}
          >
            {getTierLabel(vehicle.tierLevel)}
          </span>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
            Time Slot
          </p>
          <p className="font-semibold text-gray-800">{voucher.timeSlot}</p>
        </div>
        <div>
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
            Fuel Allocated
          </p>
          <p className="font-bold text-blue-900 text-xl">
            {voucher.fuelLiters}L
          </p>
        </div>
        <div className="col-span-2">
          <p className="text-xs text-gray-400 uppercase tracking-wider font-semibold mb-1">
            Station
          </p>
          <p className="font-semibold text-gray-800">{voucher.stationName}</p>
        </div>
      </div>
    </div>
  );
}
