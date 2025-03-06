
import React from "react";
import { Link } from "react-router-dom";
import BackgroundGradient from "@/components/BackgroundGradient";
import AnimatedLogo from "@/components/AnimatedLogo";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <BackgroundGradient />
      
      <div className="glass-panel p-8 max-w-md w-full text-center">
        <AnimatedLogo size="lg" />
        
        <h1 className="text-3xl font-semibold mt-6 mb-2 animate-fade-in">
          404
        </h1>
        
        <div className="badge badge-outline text-xs mb-4 animate-fade-in">
          Page Not Found
        </div>
        
        <p className="text-muted-foreground mb-6 animate-fade-in">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link
          to="/"
          className="btn-primary inline-flex items-center justify-center animate-fade-in"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-1.5"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
