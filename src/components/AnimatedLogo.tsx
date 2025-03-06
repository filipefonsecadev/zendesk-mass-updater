
import React from "react";

interface AnimatedLogoProps {
  size?: "sm" | "md" | "lg";
}

const AnimatedLogo: React.FC<AnimatedLogoProps> = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-16 h-16",
  };

  return (
    <div className={`relative ${sizeClasses[size]} animate-pulse-slow`}>
      <div className="absolute inset-0 bg-gradient-to-br from-zen-teal to-zen-green rounded-full opacity-25 blur-md animate-pulse-slow" />
      <div className="absolute inset-0 flex items-center justify-center text-white font-semibold text-lg">
        Z
      </div>
      <svg
        className="absolute inset-0 w-full h-full animate-float"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="50"
          cy="50"
          r="45"
          stroke="url(#logo-gradient)"
          strokeWidth="3"
          strokeDasharray="283"
          strokeDashoffset="0"
        />
        <defs>
          <linearGradient
            id="logo-gradient"
            x1="0"
            y1="0"
            x2="100"
            y2="100"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#03A393" />
            <stop offset="1" stopColor="#78A300" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export default AnimatedLogo;
