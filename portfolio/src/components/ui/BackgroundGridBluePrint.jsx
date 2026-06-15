import React from "react";

const BackgroundGridBluePrint = () => {
  return (
    <div className="absolute inset-0 z-0 opacity-[0.3] dark:opacity-[0.5] pointer-events-none">
      <svg width="100%" height="100%">
        <defs>
          <pattern
            id="grid"
            width="60"
            height="60"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M 60 0 L 0 0 0 60"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
      </svg>
    </div>
  );
};

export default BackgroundGridBluePrint;
