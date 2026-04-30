import React from "react";

const AlertBanner = ({ message, isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed top-0 left-0 w-full z-[100] animate-slide-down">
      <div className="bg-red-600 text-white px-6 py-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Warning Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 flex-shrink-0"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>

          <div>
            <p className="font-bold text-lg leading-tight">Voucher Cancelled</p>
            <p className="text-sm opacity-90">{message}</p>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={onClose}
          className="p-2 hover:bg-red-700 rounded-full transition-colors focus:outline-none"
          aria-label="Dismiss alert"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;
