import React, { useState, useEffect } from "react";
import QRScanner from "../../components/station/QRScanner";
import VehicleInfoCard from "../../components/station/VehicleInfoCard";
import FuelGauge from "../../components/station/FuelGauge";
import { verifyVoucher, redeemVoucher } from "../../api/voucherApi";
import { getStationById } from "../../api/stationApi";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ScannerPage = () => {
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [stationData, setStationData] = useState(null);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.stationId) {
      fetchStationData();
    }
  }, [user]);

  const fetchStationData = async () => {
    try {
      const res = await getStationById(user.stationId);
      setStationData(res.data);
    } catch (err) {
      console.error("Failed to fetch station data", err);
    }
  };

  const handleScanSuccess = async (decodedText) => {
    if (loading || scanResult) return;
    
    setLoading(true);
    setError("");
    setSuccess("");
    
    try {
      const res = await verifyVoucher(decodedText);
      setScanResult(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired QR code.");
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async () => {
    if (!scanResult) return;
    
    setLoading(true);
    setError("");
    
    try {
      await redeemVoucher(scanResult.voucher.qrToken);
      setSuccess("Voucher redeemed successfully!");
      setScanResult(null);
      fetchStationData(); // Refresh fuel gauge
    } catch (err) {
      setError(err.response?.data?.message || "Redemption failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setScanResult(null);
    setError("");
    setSuccess("");
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Redemption Portal</h1>
            <p className="text-slate-500 text-sm font-medium">{stationData?.name || "Loading station..."}</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => navigate("/")}
              className="bg-slate-100 px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              BACK HOME
            </button>
            <button 
              onClick={() => navigate("/station/logs")}
              className="bg-white px-4 py-2 rounded-xl border border-slate-200 text-xs font-bold text-indigo-600 hover:bg-slate-50 transition-all flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              VIEW TODAY'S LOG
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Scanner and Inventory */}
          <div className="space-y-8">
            {stationData && (
              <FuelGauge 
                current={stationData.currentFuelLiters} 
                capacity={stationData.dailyCapacity} 
              />
            )}

            {!scanResult ? (
              <div className="space-y-4">
                <h2 className="text-lg font-bold text-slate-800 px-1">Scan Voucher QR</h2>
                <QRScanner onScanSuccess={handleScanSuccess} />
                {error && (
                  <div className="bg-red-50 text-red-600 p-4 rounded-2xl border border-red-100 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-bold">{error}</p>
                  </div>
                )}
                {success && (
                  <div className="bg-emerald-50 text-emerald-600 p-4 rounded-2xl border border-emerald-100 flex items-center gap-3 animate-in fade-in zoom-in duration-300">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-sm font-bold">{success}</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-slate-100 p-8 rounded-3xl border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 bg-slate-200 rounded-full flex items-center justify-center text-slate-400">
                  <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
                  </svg>
                </div>
                <p className="text-slate-500 font-bold">QR Scanned Successfully</p>
                <button 
                  onClick={handleReset}
                  className="text-indigo-600 text-xs font-black uppercase tracking-widest hover:underline"
                >
                  Cancel and Rescan
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Result and Actions */}
          <div className="lg:mt-11">
            {scanResult ? (
              <div className="space-y-6">
                <VehicleInfoCard 
                  vehicle={scanResult.vehicle} 
                  voucher={scanResult.voucher} 
                />
                <button
                  onClick={handleRedeem}
                  disabled={loading}
                  className={`w-full py-6 rounded-3xl text-white font-black text-xl tracking-tight shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3 ${loading ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200'}`}
                >
                  {loading ? (
                    <svg className="animate-spin h-6 w-6 text-white" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <>
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      CONFIRM REDEMPTION
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="h-full min-h-[400px] bg-white rounded-3xl border border-slate-100 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                  <svg className="w-12 h-12 text-slate-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Awaiting Scan</h3>
                <p className="text-slate-300 text-sm italic font-medium">Capture a driver's QR code to <br />view vehicle details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScannerPage;
