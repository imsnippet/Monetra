import { Mic, Camera, Mail } from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Log the expense.",
    description: "Speak it, snap it, or type it. All routes end at a perfectly categorized transaction.",
    visual: (
      <div className="space-y-3 mt-1">
        <div className="flex items-center gap-3 p-4 bg-surface-alt rounded-2xl border border-border">
          <Mic className="w-5 h-5 text-primary shrink-0" />
          <span className="font-bold text-sm text-foreground">Voice Input</span>
        </div>
        <div className="flex items-center gap-3 p-4 bg-surface-alt rounded-2xl border border-border">
          <Camera className="w-5 h-5 text-primary shrink-0" />
          <span className="font-bold text-sm text-foreground">Photo Upload</span>
        </div>
      </div>
    ),
  },
  {
    number: "02",
    title: "The AI organizes.",
    description: "Merchant, date, and category are read automatically. Nothing to fill, nothing to confirm.",
    visual: (
      <div className="bg-surface-alt border border-border p-6 rounded-3xl mt-1">
        <div className="flex flex-col items-center gap-4 py-2">
          <div className="w-14 h-14 bg-card rounded-2xl shadow-sm flex items-center justify-center text-3xl">
            ☕
          </div>
          <div className="text-center">
            <div className="text-muted-foreground text-xs font-bold uppercase tracking-wider">Food & Dining</div>
            <div className="font-display font-bold text-2xl text-foreground">$4.50</div>
          </div>
        </div>
      </div>
    ),
  },
  {
    number: "03",
    title: "See the full picture.",
    description: "Get monthly reports delivered to your inbox without ever logging into a dashboard.",
    visual: (
      <div className="p-5 bg-card dark:bg-zinc-900 border border-border dark:border-zinc-800 rounded-3xl text-foreground dark:text-white shadow-sm mt-1 transition-all duration-300">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 flex items-center justify-center">
              <Mail className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
              Monthly Summary
            </span>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-semibold">
            Delivered
          </span>
        </div>

        {/* Content rows showing real expense stats */}
        <div className="space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-xs text-muted-foreground">Total Spent</span>
            <span className="text-sm font-bold font-mono text-foreground dark:text-white">$1,842.50</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-border/60">
            <span className="text-xs text-muted-foreground">Top Category</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-muted text-foreground">Housing (42%)</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">Net Savings</span>
            <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400 font-mono">+$820.00</span>
          </div>
        </div>
      </div>
    ),
  },
];

const HowItWorksSection = () => {
  return (
    <section className="py-32 bg-background relative overflow-hidden" id="how-it-works">
      <div className="max-w-7xl mx-auto px-6 relative z-10">

        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-primary font-bold tracking-widest text-xs uppercase mb-4 block">
            02. THE PROCESS
          </span>
          <h2 className="font-display font-bold text-5xl text-foreground">
            Three steps.{" "}
            <em className="italic text-muted-foreground">Zero setup friction.</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 md:gap-8">
          {steps.map((step) => (
            <div key={step.number} className="relative flex flex-col">
              <div className="font-display font-black text-[9rem] text-border/40 absolute -top-16 -left-4 pointer-events-none select-none leading-none">
                {step.number}
              </div>
              <div className="relative pt-10">
                <h4 className="font-display font-bold text-2xl text-foreground mb-3">{step.title}</h4>
                <p className="text-muted-foreground leading-relaxed mb-6">{step.description}</p>
                {step.visual}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default HowItWorksSection;
