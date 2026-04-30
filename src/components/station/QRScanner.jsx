import React, { useEffect, useState, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const QRScanner = ({ onScanSuccess, onScanError }) => {
  const [isScanning, setIsScanning] = useState(false);
  const [cameras, setCameras] = useState([]);
  const [selectedCamera, setSelectedCamera] = useState("");
  const scannerRef = useRef(null);

  useEffect(() => {
    scannerRef.current = new Html5Qrcode("qr-reader");
    
    Html5Qrcode.getCameras()
      .then((devices) => {
        if (devices && devices.length > 0) {
          setCameras(devices);
          setSelectedCamera(devices[0].id);
        }
      })
      .catch((err) => {
        console.warn("No cameras found.", err);
      });

    return () => {
      try {
        if (scannerRef.current) {
          scannerRef.current.stop().then(() => scannerRef.current.clear()).catch(() => {});
        }
      } catch (e) {}
    };
  }, []);

  const startScanner = () => {
    if (!scannerRef.current || isScanning || !selectedCamera) return;
    
    setIsScanning(true);
    scannerRef.current
      .start(
        selectedCamera,
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          stopScanner();
          onScanSuccess(decodedText);
        },
        (error) => {
          if (onScanError) onScanError(error);
        }
      )
      .catch((err) => {
        console.error(err);
        setIsScanning(false);
      });
  };

  const stopScanner = () => {
    try {
      if (scannerRef.current) {
        scannerRef.current.stop().then(() => {
          setIsScanning(false);
        }).catch(() => {
          setIsScanning(false);
        });
      }
    } catch (e) {
      setIsScanning(false);
    }
  };

  const handleFileUpload = async (e) => {
    if (e.target.files.length === 0) return;
    const file = e.target.files[0];
    
    if (isScanning) {
      await scannerRef.current.stop();
      setIsScanning(false);
    }
    
    try {
      const decodedText = await scannerRef.current.scanFile(file, true);
      onScanSuccess(decodedText);
    } catch (err) {
      if (onScanError) onScanError("Could not read QR code from image.");
    }
  };

  return (
    <div className="w-full max-w-md mx-auto overflow-hidden rounded-3xl bg-slate-900 shadow-2xl border-4 border-slate-800">
      
      {/* Container for the video stream */}
      <div id="qr-reader" className="w-full min-h-[250px] bg-black relative">
        {!isScanning && (
          <div className="absolute inset-0 flex items-center justify-center text-slate-500 text-sm">
            Camera is off
          </div>
        )}
      </div>

      <div className="p-6 bg-slate-800 flex flex-col gap-4">
        
        {/* Camera Selector */}
        {cameras.length > 0 && !isScanning && (
          <div className="flex flex-col gap-2">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">
              Select Camera
            </label>
            <select
              value={selectedCamera}
              onChange={(e) => setSelectedCamera(e.target.value)}
              className="bg-slate-700 text-slate-200 border-none p-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full"
            >
              {cameras.map((camera) => (
                <option key={camera.id} value={camera.id}>
                  {camera.label || `Camera ${camera.id}`}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3 mt-2">
          {!isScanning ? (
            <button
              onClick={startScanner}
              disabled={cameras.length === 0}
              className="col-span-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold py-3 px-4 rounded-xl transition"
            >
              Start Camera Scan
            </button>
          ) : (
            <button
              onClick={stopScanner}
              className="col-span-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-xl transition"
            >
              Stop Camera
            </button>
          )}
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-700"></div>
          <span className="flex-shrink-0 mx-4 text-slate-500 text-xs font-bold uppercase">Or</span>
          <div className="flex-grow border-t border-slate-700"></div>
        </div>

        {/* Custom Image Upload Button */}
        <div>
          <input
            type="file"
            id="qr-upload"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label
            htmlFor="qr-upload"
            className="block w-full text-center bg-slate-700 hover:bg-slate-600 text-slate-300 font-bold py-3 px-4 rounded-xl cursor-pointer transition border border-slate-600"
          >
            Upload QR Image
          </label>
        </div>

      </div>
    </div>
  );
};

export default QRScanner;
