import React from "react";

const FuelGauge = ({ current, capacity }) => {
  const percentage = Math.min(Math.round((current / capacity) * 100), 100);
  
  let colorClass = "bg-green-500";
  if (percentage < 20) colorClass = "bg-red-500";
  else if (percentage < 50) colorClass = "bg-yellow-500";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="flex justify-between items-end mb-4">
        <div>
          <h3 className="text-slate-500 text-sm font-medium uppercase tracking-wider">Station Fuel Inventory</h3>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-3xl font-bold text-slate-800">{current.toLocaleString()}</span>
            <span className="text-slate-400 font-medium whitespace-nowrap">Liters Remaining</span>
          </div>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-slate-400 block mb-1">Capacity: {capacity.toLocaleString()}L</span>
          <span className={`text-sm font-bold ${colorClass.replace('bg-', 'text-')} px-2 py-1 bg-opacity-10 rounded-lg`}>
            {percentage}% Full
          </span>
        </div>
      </div>
      
      <div className="relative h-4 bg-slate-100 rounded-full overflow-hidden">
        <div 
          className={`absolute top-0 left-0 h-full transition-all duration-1000 ease-out rounded-full ${colorClass}`}
          style={{ width: `${percentage}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent"></div>
        </div>
      </div>
      
      <div className="mt-4 flex justify-between text-[10px] font-bold text-slate-400 uppercase tracking-tighter">
        <span>Empty</span>
        <span>25%</span>
        <span>50%</span>
        <span>75%</span>
        <span>Full</span>
      </div>
    </div>
  );
};

export default FuelGauge;
