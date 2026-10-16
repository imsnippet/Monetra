import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useRef } from "react";

const HeroSection = () => {
  // References for direct DOM hardware-accelerated manipulation (zero component re-renders on scroll)
  const cardRef = useRef<HTMLDivElement>(null);
  const highlightRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    // 3D physics constants
    const INITIAL_TILT = 16; // starting angle in degrees
    const SCROLL_DISTANCE = 550; // pixels of scroll to reach completely flat
    const LERP_FACTOR = 0.085; // smooth damping factor

    let currentScrollTilt = INITIAL_TILT;
    let targetScrollTilt = INITIAL_TILT;

    let currentScale = 0.94;
    let targetScale = 0.94;

    let currentMouseTiltX = 0;
    let targetMouseTiltX = 0;
    let currentMouseTiltY = 0;
    let targetMouseTiltY = 0;

    let rafId: number | null = null;
    let isRunning = true;

    const onScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || 0;
      const progress = Math.min(scrollY / SCROLL_DISTANCE, 1);
      targetScrollTilt = INITIAL_TILT * (1 - progress);
      targetScale = 0.94 + 0.06 * progress;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!sectionRef.current) return;
      const rect = sectionRef.current.getBoundingClientRect();
      // Only apply interactive tilt when near or inside the hero section
      if (e.clientY >= rect.top - 100 && e.clientY <= rect.bottom + 100) {
        const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        targetMouseTiltY = x * 6; // max 3 deg
        targetMouseTiltX = -y * 4; // max 2 deg
      } else {
        targetMouseTiltX = 0;
        targetMouseTiltY = 0;
      }
    };

    const onMouseLeave = () => {
      targetMouseTiltX = 0;
      targetMouseTiltY = 0;
    };

    // Physics render loop with Linear Interpolation (LERP)
    const animate = () => {
      if (!isRunning) return;

      currentScrollTilt += (targetScrollTilt - currentScrollTilt) * LERP_FACTOR;
      currentScale += (targetScale - currentScale) * LERP_FACTOR;
      currentMouseTiltX += (targetMouseTiltX - currentMouseTiltX) * LERP_FACTOR;
      currentMouseTiltY += (targetMouseTiltY - currentMouseTiltY) * LERP_FACTOR;

      const finalRotateX = currentScrollTilt + currentMouseTiltX;
      const finalRotateY = currentMouseTiltY;

      if (cardRef.current) {
        cardRef.current.style.transform = `rotateX(${finalRotateX.toFixed(2)}deg) rotateY(${finalRotateY.toFixed(2)}deg) scale(${currentScale.toFixed(4)})`;
      }

      if (highlightRef.current) {
        const opacity = Math.max(0, Math.min(1, finalRotateX / INITIAL_TILT));
        highlightRef.current.style.opacity = opacity.toFixed(2);
      }

      rafId = requestAnimationFrame(animate);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);

    onScroll();
    animate();

    return () => {
      isRunning = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section ref={sectionRef} className="relative pt-32 pb-24 overflow-hidden bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Centered heading block */}
        <div className="text-center mb-12 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-surface-alt px-3 py-1 rounded-full text-xs font-semibold tracking-wide text-primary mb-6">
            <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
            Personal Finance, Simplified
          </div>

          <h1 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl lg:text-8xl tracking-tight mb-6 sm:mb-8 leading-[1.1] text-foreground">
            Expense tracking that <br className="hidden sm:block" />
            <span className="text-primary italic">speaks your language.</span>
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 sm:mb-10">
            Say it, snap it, or type it. Monetra logs, categorizes, and tracks every
            transaction in any currency with total precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <Link
              to="/overview"
              className="w-full sm:w-auto bg-brand-green-light text-brand-green font-bold text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4 rounded-2xl hover:brightness-90 transition-all shadow-lg flex items-center justify-center gap-2"
            >
              Open App <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>

        {/* 3D Parallax Dashboard Screenshot */}
        <div
          style={{ perspective: "1500px", perspectiveOrigin: "50% 0%" }}
          className="w-full max-w-5xl mx-auto"
        >
          <div
            ref={cardRef}
            style={{
              transformOrigin: "50% 0%",
              transformStyle: "preserve-3d",
              willChange: "transform",
            }}
            className="relative w-full transition-shadow duration-300"
          >
            {/* Neon ambient glow behind image */}
            <div className="absolute -inset-3 sm:-inset-6 bg-brand-green-light/15 rounded-[2.5rem] blur-3xl pointer-events-none" />

            {/* Top specular highlight edge line */}
            <div
              ref={highlightRef}
              className="absolute inset-x-0 top-0 h-px rounded-full pointer-events-none z-10 transition-opacity"
              style={{
                background: "linear-gradient(to right, transparent, color-mix(in srgb, var(--brand-green-light) 60%, transparent), transparent)",
              }}
            />

            {/* Dashboard Screenshot Frame */}
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden border border-border/80 dark:border-white/10 shadow-[0_32px_80px_-16px_rgba(0,0,0,0.35),0_0_40px_-8px_color-mix(in_srgb,var(--primary)_20%,transparent)] bg-card">
              {/* Dark Mode High-Res Dashboard Image */}
              <img
                src="/dashboard-dark.png"
                alt="Monetra Smart Finance Dashboard - Dark Mode"
                className="w-full h-auto hidden dark:block select-none"
                draggable={false}
                loading="eager"
              />
              {/* Light Mode High-Res Dashboard Image */}
              <img
                src="/dashboard-light.png"
                alt="Monetra Smart Finance Dashboard - Light Mode"
                className="w-full h-auto block dark:hidden select-none"
                draggable={false}
                loading="eager"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
