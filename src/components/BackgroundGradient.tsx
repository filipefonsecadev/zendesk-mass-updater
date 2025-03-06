
import React from "react";

const BackgroundGradient: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      <div 
        className="absolute top-[-10%] right-[-20%] h-[500px] w-[800px] rounded-full opacity-20 blur-[100px]"
        style={{ background: "linear-gradient(180deg, rgba(8, 151, 233, 0.5) 0%, rgba(42, 173, 247, 0.5) 100%)" }}
      />
      <div 
        className="absolute bottom-[-5%] left-[-10%] h-[300px] w-[600px] rounded-full opacity-10 blur-[100px]"
        style={{ background: "linear-gradient(180deg, rgba(8, 151, 233, 0.3) 0%, rgba(42, 173, 247, 0.3) 100%)" }}
      />
    </div>
  );
};

export default BackgroundGradient;
