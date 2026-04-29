import React from "react";

/**
 * Task 3: StatusTracker Component
 * Visual step indicator: Pending (grey) → Active (blue) → Redeemed (green) / Cancelled (red)
 */
const StatusTracker = ({ voucher }) => {
  // Safe destructuring with fallbacks
  const { status = "pending", validDate } = voucher || {};

  // 1. Derive active status based on voucher status and current date
  const getDerivedStatus = () => {
    // Terminal states take priority
    if (status.toLowerCase() === "cancelled") return "cancelled";
    if (status.toLowerCase() === "redeemed") return "redeemed";

    // Date logic for Active vs Pending
    if (validDate) {
      const today = new Date().toDateString();
      const voucherDate = new Date(validDate).toDateString();

      // If the voucher is pending but the valid date is today, it's Active
      if (today === voucherDate) return "active";
    }

    return "pending"; // Default fallback (e.g., date is in the future)
  };

  const currentStatus = getDerivedStatus();

  // 2. Define visual states for each step
  // Step 2 is filled if active, redeemed, or cancelled
  const isActive = ["active", "redeemed", "cancelled"].includes(currentStatus);
  // Step 3 is filled only if redeemed or cancelled
  const isFinished = ["redeemed", "cancelled"].includes(currentStatus);

  return (
    <div className="w-full py-4">
      <div className="flex items-center justify-between w-full relative">
        {/* Step 1: Pending */}
        <div className="flex flex-col items-center relative z-10">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-white bg-gray-500 shadow-sm transition-colors duration-300">
            1
          </div>
          <span className="text-xs font-semibold mt-2 text-gray-600">
            Pending
          </span>
        </div>

        {/* Connecting Line 1 */}
        <div
          className={`flex-auto border-t-4 transition-colors duration-300 mx-2 ${isActive ? "border-blue-500" : "border-gray-200"}`}
        ></div>

        {/* Step 2: Active */}
        <div className="flex flex-col items-center relative z-10">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm transition-colors duration-300 ${isActive ? "bg-blue-500" : "bg-gray-200 text-gray-400"}`}
          >
            {isActive ? "2" : ""}
          </div>
          <span
            className={`text-xs font-semibold mt-2 ${isActive ? "text-blue-600" : "text-gray-400"}`}
          >
            Active
          </span>
        </div>

        {/* Connecting Line 2 */}
        <div
          className={`flex-auto border-t-4 transition-colors duration-300 mx-2 ${
            currentStatus === "redeemed"
              ? "border-green-500"
              : currentStatus === "cancelled"
                ? "border-red-500"
                : "border-gray-200"
          }`}
        ></div>

        {/* Step 3: Redeemed / Cancelled (Terminal Step) */}
        <div className="flex flex-col items-center relative z-10">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm transition-colors duration-300 ${
              currentStatus === "redeemed"
                ? "bg-green-500"
                : currentStatus === "cancelled"
                  ? "bg-red-500"
                  : "bg-gray-200 text-gray-400"
            }`}
          >
            {currentStatus === "redeemed" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M5 13l4 4L19 7"
                ></path>
              </svg>
            )}
            {currentStatus === "cancelled" && (
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="3"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            )}
            {!isFinished && "3"}
          </div>
          <span
            className={`text-xs font-semibold mt-2 ${
              currentStatus === "redeemed"
                ? "text-green-600"
                : currentStatus === "cancelled"
                  ? "text-red-600"
                  : "text-gray-400"
            }`}
          >
            {currentStatus === "cancelled" ? "Cancelled" : "Redeemed"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default StatusTracker;
