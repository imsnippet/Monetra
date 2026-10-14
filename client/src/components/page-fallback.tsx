import React from "react";

interface PageFallbackProps {
  fullScreen?: boolean;
  message?: string;
}

export const PageFallback: React.FC<PageFallbackProps> = ({ fullScreen = false }) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "fixed inset-0 z-50 bg-background" : "min-h-[200px] w-full"
      }`}
    >
      <div className="w-8 h-8 rounded-full border-2 border-emerald-500/20 border-t-emerald-500 animate-spin" />
    </div>
  );
};

export default PageFallback;
