import React from "react";

interface PageFallbackProps {
  fullScreen?: boolean;
  message?: string;
}

export const PageFallback: React.FC<PageFallbackProps> = ({ fullScreen = false }) => {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 transition-opacity duration-300 ${
        fullScreen ? "fixed inset-0 z-50 bg-background/80 backdrop-blur-md" : "min-h-[260px] w-full"
      }`}
    >
      <div className="relative flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
        <div className="absolute w-6 h-6 rounded-full bg-primary/10 blur-sm animate-pulse" />
      </div>
      <p className="text-xs font-medium text-muted-foreground/75 tracking-wider uppercase animate-pulse">
        Loading...
      </p>
    </div>
  );
};

export default PageFallback;
