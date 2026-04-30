import React from "react";
import QRCode from "react-qr-code";
import { getTierBadgeStyle } from "../../utils/tierLabel";
import { formatDate } from "../../utils/formatDate";
import StatusTracker from "./StatusTracker";

/**
 * Task 3: VoucherCard Component
 * Displays allocation details and a scannable QR code for station verification.
 */

const VoucherCard = ({ voucher }) => {
  // Destructure with safe fallbacks
  const {
    stationName = "Unknown Station",
    validDate = "N/A",
    timeSlot = "N/A",
    fuelLiters = 0,
    qrToken = "",
    tierLevel = "Tier 4",
    status = "pending",
  } = voucher || {};

  const qrUrl =
    qrToken && typeof window !== "undefined"
      ? `${window.location.origin}/station/verify/${qrToken}`
      : qrToken;
  const terminalStatus = ["redeemed", "cancelled", "expired"].includes(
    String(status).toLowerCase(),
  );
  const terminalLabel =
    status === "redeemed"
      ? "Redeemed"
      : status === "cancelled"
        ? "Cancelled"
        : "Expired";

  return (
    <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden max-w-sm w-full mx-auto transition-all hover:shadow-md">
      {/* Header: Station Name & Tier Badge */}
      <div className="bg-gray-50 border-b border-gray-200 px-6 py-4 flex justify-between items-start gap-4">
        <h3 className="font-bold text-gray-900 text-lg leading-tight">
          {stationName}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border uppercase tracking-wide whitespace-nowrap ${getTierBadgeStyle(tierLevel)}`}
        >
          {tierLevel}
        </span>
      </div>

      {/* Body: Details & QR Code */}
      <div className="p-6 flex flex-col items-center">
        {/* Allocation Details Grid */}
        <div className="w-full grid grid-cols-2 gap-3 mb-6 text-sm">
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-gray-500 text-[11px] uppercase tracking-wider mb-1 font-semibold">
              Valid Date
            </p>
            <p className="font-medium text-gray-800">{formatDate(validDate)}</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
            <p className="text-gray-500 text-[11px] uppercase tracking-wider mb-1 font-semibold">
              Time Slot
            </p>
            <p className="font-medium text-gray-800">{timeSlot}</p>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 col-span-2 flex justify-between items-center">
            <p className="text-blue-800 text-xs uppercase font-bold tracking-wider">
              Allocated Fuel
            </p>
            <p className="font-black text-blue-700 text-2xl">
              {fuelLiters}{" "}
              <span className="text-base font-bold text-blue-500">L</span>
            </p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 col-span-2">
            <p className="text-gray-500 text-[11px] uppercase tracking-wider mb-1 font-semibold">
              Status
            </p>
            <p className="font-medium text-gray-800 capitalize">{status}</p>
          </div>
        </div>

        {/* Scannable QR Code Section */}
        <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
          {qrToken ? (
            <>
              <div className="relative w-[200px] h-[200px] bg-white p-2 rounded-lg shadow-sm">
                <QRCode
                  value={qrUrl}
                  size={200}
                  bgColor="#ffffff"
                  fgColor="#000000"
                  level="Q"
                  style={{
                    height: "auto",
                    maxWidth: "100%",
                    width: "100%",
                    opacity: terminalStatus ? 0.18 : 1,
                  }}
                />
                {terminalStatus && (
                  <div className="absolute inset-2 flex items-center justify-center rounded-md bg-white/75">
                    <div
                      className={`rounded-full px-4 py-2 text-sm font-black uppercase tracking-wider ${
                        status === "redeemed"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {terminalLabel}
                    </div>
                  </div>
                )}
              </div>
              <p className="mt-3 text-[10px] font-mono text-gray-400 break-all text-center max-w-[200px]">
                {qrToken}
              </p>
            </>
          ) : (
            <div className="w-[200px] h-[200px] flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-400 text-sm font-medium">
                QR Unavailable
              </p>
            </div>
          )}
        </div>

        <div className="w-full mt-6">
          <StatusTracker voucher={voucher} />
        </div>

        <p className="mt-5 text-center text-xs text-gray-500 max-w-[250px]">
          Present this QR code to the station staff within your designated time
          slot.
        </p>
      </div>
    </div>
  );
};

export default VoucherCard;
