const LEVEL_STYLE = {
  critical: {
    bg: "bg-red-600",
    border: "border-red-700",
    icon: "🚨",
    title: "Critical Fuel Shortage",
  },
  warning: {
    bg: "bg-yellow-500",
    border: "border-yellow-600",
    icon: "⚠️",
    title: "Fuel Warning",
  },
};

const AlertBanner = ({ isOpen, message, alertLevel = "critical", onClose }) => {
  if (!isOpen) return null;

  const style = LEVEL_STYLE[alertLevel] || LEVEL_STYLE.critical;

  return (
    <div
      className={`${style.bg} text-white px-6 py-4 shadow-xl flex items-center justify-between sticky top-0 z-50 border-b ${style.border}`}
    >
      <div className="flex items-center gap-3">
        <span className="text-xl flex-shrink-0">{style.icon}</span>
        <div>
          <p className="font-bold leading-tight">{style.title}</p>
          {message && <p className="text-sm opacity-90 mt-0.5">{message}</p>}
        </div>
      </div>
      <button
        onClick={onClose}
        className="p-1.5 hover:bg-black/20 rounded-full transition ml-4"
        aria-label="Dismiss"
      >
        <svg
          className="h-5 w-5"
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
  );
};

export default AlertBanner;
