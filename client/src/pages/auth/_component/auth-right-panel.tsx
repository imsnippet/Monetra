import { MonetraEmblem } from "@/components/logo/monetra-logo";

const stats = [
  { value: "Real-time", label: "FX Rates" },
  { value: "AI-Assisted", label: "Voice & Receipts" },
  { value: "Private", label: "By Design" },
];

interface AuthRightPanelProps {
  badge: string;
  title: string;
  subtitle: string;
}

const AuthRightPanel = ({ badge, title, subtitle }: AuthRightPanelProps) => {
  return (
    <div className="hidden lg:flex flex-col justify-between bg-[var(--secondary-dark-color)] text-white p-12 relative overflow-hidden">
      {/* Subtle grid texture */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(159,255,89,1) 1px, transparent 1px), linear-gradient(90deg, rgba(159,255,89,1) 1px, transparent 1px)",
          backgroundSize: "52px 52px",
        }}
      />

      {/* Top: Logo */}
      <div className="relative flex items-center gap-3">
        <MonetraEmblem size={36} />
        <div className="flex flex-col leading-none">
          <span className="font-bold text-xl tracking-tight text-white font-display">
            Monetra
          </span>
          <span className="text-[10px] tracking-wider text-white/50 uppercase font-medium">
            Your Money. Smarter.
          </span>
        </div>
      </div>

      {/* Center: Content */}
      <div className="relative space-y-7 max-w-xs">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-[11px] font-bold tracking-widest uppercase">
          <span
            className="w-1.5 h-1.5 rounded-full shrink-0"
            style={{ backgroundColor: "var(--brand-green-light)" }}
          />
          {badge}
        </div>

        <h2 className="text-2xl font-black leading-[1.15] tracking-tight">
          {title}
        </h2>

        <p className="text-white/50 leading-relaxed text-[14px]">
          {subtitle}
        </p>

        {/* Feature badges */}
        <div className="flex flex-wrap gap-2.5 pt-1">
          {stats.map((s) => (
            <div
              key={s.label}
              className="px-3.5 py-2 rounded-xl border border-white/10 bg-white/[0.04]"
            >
              <p className="text-[12px] font-bold text-white leading-none">{s.value}</p>
              <p className="text-[10px] text-white/40 mt-1 leading-none">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <p className="relative text-white/30 text-xs">© {new Date().getFullYear()} Monetra. All rights reserved.</p>
    </div>
  );
};

export default AuthRightPanel;
