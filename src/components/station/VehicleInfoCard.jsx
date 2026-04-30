import React from "react";
import getTierLabel from "../../utils/tierLabel";

const VehicleInfoCard = ({ vehicle, voucher }) => {
  if (!vehicle || !voucher) return null;

  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-xl border border-slate-100 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 text-white">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Vehicle Plate</p>
            <h2 className="text-3xl font-black tracking-tight">{vehicle.plate}</h2>
          </div>
          <div className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full border border-white/30">
            <span className="text-xs font-bold uppercase tracking-widest">{getTierLabel(vehicle.vehicleType).tier}</span>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Owner Name</p>
            <p className="text-slate-800 font-bold">{vehicle.owner}</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">Vehicle Type</p>
            <p className="text-slate-800 font-bold">{getTierLabel(vehicle.vehicleType).label}</p>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex items-center justify-between">
          <div>
            <p className="text-emerald-600 text-[10px] font-bold uppercase tracking-widest mb-1">Allocated Fuel</p>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-emerald-700">{voucher.fuelLiters}</span>
              <span className="text-emerald-600 font-bold">Liters</span>
            </div>
          </div>
          <div className="h-12 w-12 bg-emerald-100 rounded-full flex items-center justify-center">
            <svg className="w-6 h-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        
        <div className="flex items-center gap-3 px-2">
          <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></div>
          <p className="text-slate-400 text-xs font-medium italic">Verified voucher for current cycle</p>
        </div>
      </div>
    </div>
  );
};

export default VehicleInfoCard;
