// src/components/common/SpinnerStylish.jsx
import React from "react";

const Spinner = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className="relative flex items-center justify-center">
      {/* Outer Pulse Ring */}
      <div
        className={`absolute ${sizeClasses[size]} rounded-full border-blue-400 opacity-20 animate-ping`}
      ></div>

      {/*gradient*/}
      <div
        className={`
          ${sizeClasses[size]} 
          rounded-full 
          border-transparent 
          border-t-blue-600 
          border-r-blue-600 
          animate-spin
          shadow-lg
        `}
      ></div>
    </div>
  );
};

export default Spinner;
