
import React from "react";
import AnimatedLogo from "./AnimatedLogo";

const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-4 sm:px-6 flex items-center justify-center">
      <div className="flex items-center space-x-4 animate-fade-in">
        <AnimatedLogo />
        <div>
          <div className="badge badge-outline text-xs mb-1 animate-slide-down">Zendesk Tool</div>
          <h1 className="text-2xl font-semibold tracking-tight animate-slide-up">
            Organization Updater
          </h1>
        </div>
      </div>
    </header>
  );
};

export default Header;
