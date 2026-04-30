import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

export default function QRScanner({ onScan, onError }) {
  const scannerRef = useRef(null);
  const [active, setActive] = useState(false);
  const [starting, setStarting] = useState(false);

  const startScan = async () => {
    setStarting(true);
    try {
      const scanner = new Html5Qrcode("qr-reader");
      scannerRef.current = scanner;
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (decodedText) => {
          // Extract token from URL or use raw value
          const parts = decodedText.split("/verify/");
          const token = parts.length > 1 ? parts[1] : decodedText;
          onScan(token);
        },
        () => {}, // ignore per-frame errors
      );
      setActive(true);
    } catch {
      onError?.("Camera access denied or unavailable.");
    } finally {
      setStarting(false);
    }
  };

  const stopScan = async () => {
    if (scannerRef.current) {
      try {
        await scannerRef.current.stop();
      } catch (err) {
        console.error("Failed to stop QR scanner", err);
      }
      scannerRef.current = null;
    }
    setActive(false);
  };

  useEffect(
    () => () => {
      stopScan();
    },
    [],
  );

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-5">
      <p className="text-sm font-semibold text-gray-600 mb-3">QR Scanner</p>
      <div
        id="qr-reader"
        className="w-full rounded-xl overflow-hidden bg-gray-100"
        style={{ minHeight: active ? 280 : 0 }}
      />
      {!active ? (
        <button
          onClick={startScan}
          disabled={starting}
          className="mt-3 w-full bg-blue-900 text-white py-3 rounded-xl font-semibold hover:bg-blue-800 transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {starting && (
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          )}
          {starting ? "Starting camera..." : "📷 Start Scanner"}
        </button>
      ) : (
        <button
          onClick={stopScan}
          className="mt-3 w-full border border-gray-300 text-gray-600 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
        >
          Stop Scanner
        </button>
      )}
    </div>
  );
}
