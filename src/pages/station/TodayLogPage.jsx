import React, { useState, useEffect } from "react";
import { getStationLog, getStationById } from "../../api/stationApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { formatTime } from "../../utils/formatDate";

const TodayLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [station, setStation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.stationId) {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const [logRes, stationRes] = await Promise.all([
        getStationLog(user.stationId),
        getStationById(user.stationId)
      ]);
      setLogs(logRes.data);
      setStation(stationRes.data);
    } catch (err) {
      setError("Failed to load logs. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalToday = logs.reduce((sum, log) => sum + (log.fuelLiters || 0), 0);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate("/station/scanner")}
              className="bg-white p-3 rounded-2xl border border-slate-200 text-slate-400 hover:text-indigo-600 transition-all shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">Today's Redemptions</h1>
              <p className="text-slate-500 font-medium">{station?.name || "Loading..."} • {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="bg-indigo-600 px-6 py-4 rounded-3xl text-white shadow-xl shadow-indigo-100 flex items-center gap-6">
            <div className="border-r border-indigo-400 pr-6">
              <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-0.5">Total Liters</p>
              <p className="text-2xl font-black">{totalToday.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-indigo-100 text-[10px] font-bold uppercase tracking-widest mb-0.5">Voucher Count</p>
              <p className="text-2xl font-black">{logs.length}</p>
            </div>
          </div>
        </header>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Fetching logs...</p>
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
            <p className="text-red-600 font-bold mb-4">{error}</p>
            <button onClick={fetchLogs} className="bg-white px-6 py-2 rounded-xl shadow-sm border border-slate-200 text-xs font-bold text-slate-600">RETRY</button>
          </div>
        ) : (
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-100">
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Time</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Plate Number</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest">Vehicle Type</th>
                    <th className="px-8 py-5 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Liters</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.length > 0 ? (
                    logs.map((log, idx) => (
                      <tr key={log._id || idx} className="hover:bg-slate-50/50 transition-colors group">
                        <td className="px-8 py-5">
                          <span className="text-slate-500 font-bold text-sm bg-slate-100 px-3 py-1 rounded-lg group-hover:bg-white transition-colors">
                            {formatTime(log.redeemedAt || log.timestamp)}
                          </span>
                        </td>
                        <td className="px-8 py-5 font-black text-slate-800 tracking-tight">
                          {log.vehiclePlate || log.vehicleId?.plate || "N/A"}
                        </td>
                        <td className="px-8 py-5">
                          <span className="text-slate-500 font-medium text-sm">
                            {log.vehicleType || log.vehicleId?.vehicleType || "Commercial"}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right">
                          <span className="text-emerald-600 font-black text-lg">
                            {log.fuelLiters} <span className="text-[10px] uppercase ml-1">L</span>
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-8 py-24 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                          <svg className="w-8 h-8 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No redemptions found for today</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodayLogPage;
