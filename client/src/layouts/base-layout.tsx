import { Suspense } from "react";
import { Outlet } from "react-router-dom";
import PageFallback from "@/components/page-fallback";

const BaseLayout = () => {
  return (
    <div className="flex flex-col w-full h-auto">
      <div className="w-full h-full flex items-center justify-center">
        <div className="w-full mx-auto h-auto ">
          <Suspense fallback={<PageFallback />}>
            <Outlet />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default BaseLayout;