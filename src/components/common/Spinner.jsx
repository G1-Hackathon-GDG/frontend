import React from "react";

const Spinner = ({ size = "md", color = "blue-600" }) => {
  // Define size mappings
  const sizeClasses = {
    sm: "h-5 w-5 border-2",
    md: "h-10 w-10 border-4",
    lg: "h-16 w-16 border-4",
  };

  return (
    <div className="flex justify-center items-center py-4">
      <div
        className={`
          ${sizeClasses[size] || sizeClasses.md}
          animate-spin 
          rounded-full 
          border-t-transparent 
          border-${color}
        `}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default Spinner;
