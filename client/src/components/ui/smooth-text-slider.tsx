import React, { useRef, useState, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";

interface SmoothTextSliderProps {
  text: string;
  className?: string;
  as?: "h2" | "h3" | "h4" | "p" | "span" | "div";
  maxWidthClass?: string;
  /** Whether to automatically slide when hovered (default: true) */
  slideOnHover?: boolean;
}

export const SmoothTextSlider: React.FC<SmoothTextSliderProps> = ({
  text,
  className,
  as: Component = "span",
  maxWidthClass = "max-w-[210px] sm:max-w-[240px]",
  slideOnHover = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  const [isOverflowing, setIsOverflowing] = useState(false);
  const [distance, setDistance] = useState(0);
  const [offset, setOffset] = useState(0);
  const [isSliding, setIsSliding] = useState(false);
  const [atEnd, setAtEnd] = useState(false);

  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const measure = useCallback(() => {
    if (containerRef.current && textRef.current) {
      const contWidth = containerRef.current.clientWidth;
      const textWidth = textRef.current.scrollWidth;
      const diff = textWidth - contWidth;

      if (diff > 4) {
        setIsOverflowing(true);
        setDistance(diff);
      } else {
        setIsOverflowing(false);
        setDistance(0);
        setOffset(0);
      }
    }
  }, []);

  useEffect(() => {
    measure();
    const handleResize = () => measure();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [measure, text]);

  // Clean up any pending animation loops on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current);
      }
    };
  }, []);

  // Smooth sliding loop when hovered
  const startSlideLoop = useCallback(() => {
    if (!isOverflowing || distance <= 0) return;

    setIsSliding(true);
    setAtEnd(false);

    // Slide smoothly to the end
    setOffset(distance);

    // Dynamic duration based on distance (reading speed)
    const slideDurationMs = Math.max(1200, Math.min(3000, distance * 25));

    // When text reaches the end, hold for 1.6s so user can read the smooth end, then glide back
    if (animationTimeoutRef.current) clearTimeout(animationTimeoutRef.current);
    animationTimeoutRef.current = setTimeout(() => {
      setAtEnd(true);

      animationTimeoutRef.current = setTimeout(() => {
        // Glide smoothly back to start
        setOffset(0);
        setAtEnd(false);

        // Hold at start for 1.4s, then loop again if still hovered
        animationTimeoutRef.current = setTimeout(() => {
          if (containerRef.current?.matches(":hover")) {
            startSlideLoop();
          } else {
            setIsSliding(false);
          }
        }, 1400);
      }, 1600);
    }, slideDurationMs);
  }, [isOverflowing, distance]);

  const handleMouseEnter = () => {
    if (!slideOnHover || !isOverflowing) return;
    startSlideLoop();
  };

  const handleMouseLeave = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current);
    }
    setIsSliding(false);
    setAtEnd(false);
    setOffset(0);
  };

  // Determine current edge mask
  let maskClass = "";
  if (isOverflowing) {
    if (offset === 0) {
      maskClass = "slider-smooth-mask-right";
    } else if (atEnd) {
      maskClass = "slider-smooth-mask-left";
    } else {
      maskClass = "slider-smooth-mask-both";
    }
  }

  // Calculate transition duration
  const transitionDuration = isSliding
    ? offset === 0
      ? "0.9s"
      : `${Math.max(1.2, Math.min(3.0, distance * 0.025)).toFixed(2)}s`
    : "0.5s";

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={() => {
        if (isOverflowing) {
          if (offset === 0) {
            startSlideLoop();
          } else {
            handleMouseLeave();
          }
        }
      }}
      className={cn(
        "relative overflow-hidden whitespace-nowrap py-0.5 select-none transition-[mask-image] duration-300",
        maxWidthClass,
        maskClass,
        isOverflowing && "cursor-pointer group/smooth-text"
      )}
      title={isOverflowing ? `${text} (hover or click to slide smoothly)` : text}
    >
      <Component
        ref={textRef as any}
        style={{
          transform: `translateX(-${offset}px)`,
          transitionProperty: "transform",
          transitionDuration: transitionDuration,
          transitionTimingFunction: "cubic-bezier(0.25, 1, 0.5, 1)",
          willChange: isOverflowing ? "transform" : "auto",
        }}
        className={cn(
          "inline-block font-inherit",
          className
        )}
      >
        {text}
      </Component>
    </div>
  );
};

export default SmoothTextSlider;
