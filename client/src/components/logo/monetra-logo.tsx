import React from "react";
import { Link } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";

interface MonetraEmblemProps {
  size?: number | "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
  withGlow?: boolean;
}

const SIZE_MAP: Record<string, number> = {
  xs: 20,
  sm: 26,
  md: 34,
  lg: 42,
  xl: 56,
};

export const MonetraEmblem: React.FC<MonetraEmblemProps> = ({
  size = 34,
  className,
  withGlow = false,
}) => {
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size] || 34;

  return (
    <div
      className={cn(
        "relative inline-flex items-center justify-center flex-shrink-0 transition-transform duration-300 group-hover:scale-105",
        withGlow && "after:absolute after:inset-0 after:rounded-full after:blur-md after:bg-primary/20 after:-z-10",
        className
      )}
      style={{ width: pixelSize, height: pixelSize }}
    >
      <img
        src="/logo.png"
        alt="Monetra Logo"
        width={pixelSize}
        height={pixelSize}
        className="w-full h-full object-contain select-none drop-shadow-sm pointer-events-none"
        loading="eager"
        decoding="async"
      />
    </div>
  );
};

export interface MonetraLogoProps {
  url?: string;
  compact?: boolean;
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  subtitle?: string | boolean;
  textClassName?: string;
}

const Logo: React.FC<MonetraLogoProps> = ({
  url,
  compact = false,
  className,
  size = "md",
  subtitle = true,
  textClassName,
}) => {
  const emblemSize = SIZE_MAP[size] || 34;
  const textSizeMap = {
    xs: "text-sm",
    sm: "text-base",
    md: "text-[18px]",
    lg: "text-xl",
    xl: "text-2xl",
  };
  const textSize = textSizeMap[size] || "text-[18px]";

  const content = (
    <>
      <MonetraEmblem size={emblemSize} />
      {!compact && (
        <div className="flex flex-col leading-none">
          <span
            className={cn(
              "font-bold tracking-tight text-foreground font-display transition-colors group-hover:text-primary",
              textSize,
              textClassName
            )}
          >
            Monetra
          </span>
          {subtitle && (
            <span className="text-[9.5px] tracking-wider text-muted-foreground uppercase font-semibold mt-0.5">
              {typeof subtitle === "string" ? subtitle : "Smart Finance"}
            </span>
          )}
        </div>
      )}
    </>
  );

  if (url === "") {
    return (
      <div className={cn("group flex items-center gap-2.5 select-none", className)}>
        {content}
      </div>
    );
  }

  return (
    <Link
      to={url || PROTECTED_ROUTES.OVERVIEW}
      className={cn("group flex items-center gap-2.5 select-none focus:outline-none", className)}
      aria-label="Monetra - Return to home"
    >
      {content}
    </Link>
  );
};

export default Logo;
