import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import PageFallback from "@/components/page-fallback";

const PublicLayout = () => {
  return (
    <div className="w-full h-auto">
      <Suspense fallback={<PageFallback />}>
        <Outlet />
      </Suspense>
    </div>
  );
};

export default PublicLayout;
