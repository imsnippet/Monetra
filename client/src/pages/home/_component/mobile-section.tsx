import { Zap, CloudOff, Bell, Mic } from "lucide-react";
import { Link } from "react-router-dom";
import { MonetraEmblem } from "@/components/logo/monetra-logo";

const highlights = [
  { icon: Zap, title: "Instant Sync", detail: "Real-time dashboard updates across all your devices." },
  { icon: CloudOff, title: "Offline Mode", detail: "Queue expenses without signal; we'll sync when you're back." },
];

const MobileSection = () => {
  return (
    <section
      className="py-8 sm:py-16 bg-brand-green rounded-[2rem] sm:rounded-[3rem] mx-3 sm:mx-4 mb-16 lg:mb-32 text-white overflow-hidden relative"
      id="mobile-app"
    >
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-brand-green-light/5 to-transparent pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12 lg:gap-20">

          <div>
            <span className="text-brand-green-light font-bold tracking-widest text-xs uppercase mb-4 sm:mb-6 block">
              03. GO MOBILE
            </span>
            <h2 className="font-display font-bold text-4xl sm:text-5xl md:text-7xl leading-tight mb-6 sm:mb-8">
              Log expenses <br />
              <span className="text-brand-green-light italic">anywhere.</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg mb-8 sm:mb-12 max-w-md">
              Monetra is designed for seamless desktop and mobile access. Responsive, voice-first, and synced directly with your financial dashboard.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-8 mb-8 sm:mb-12">
              {highlights.map(({ icon: Icon, title, detail }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-brand-green-light" />
                  </div>
                  <div>
                    <div className="font-bold mb-1">{title}</div>
                    <p className="text-white/50 text-sm">{detail}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap gap-3 sm:gap-4">
              <Link
                to="/overview"
                className="bg-white text-brand-green font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl flex items-center gap-2 hover:bg-brand-green-light transition-all"
              >
                Launch Web App
              </Link>
              <Link
                to="/about"
                className="bg-white/10 border border-white/20 text-white font-bold px-6 sm:px-8 py-3 sm:py-4 rounded-2xl flex items-center gap-2 hover:bg-white/20 transition-all"
              >
                Platform Details
              </Link>
            </div>
          </div>

          <div className="flex justify-center">
            {/* Phone Container: Crisp White in Light Mode, Sleek Deep Zinc in Dark Mode */}
            <div className="w-[280px] sm:w-[320px] md:w-[350px] h-[580px] sm:h-[620px] md:h-[690px] bg-white dark:bg-zinc-950 border-[8px] border-zinc-200 dark:border-white/15 rounded-[3rem] shadow-2xl shadow-black/20 dark:shadow-black/60 overflow-hidden relative transition-all duration-500 hover:scale-[1.02]">
              {/* Dynamic Island / Notch */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 sm:w-36 h-6 bg-zinc-200 dark:bg-zinc-900 rounded-b-2xl z-20 flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300 dark:bg-zinc-800" />
              </div>

              {/* Screen Content */}
              <div className="p-5 sm:p-6 pt-10 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white h-full flex flex-col justify-between select-none">
                {/* Header */}
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-2">
                      <MonetraEmblem size={24} />
                      <span className="font-bold text-xs tracking-tight text-zinc-900 dark:text-white">Monetra</span>
                    </div>
                    {/* Notification Bell (No blinking light) */}
                    <div className="w-8 h-8 rounded-full bg-zinc-200/70 dark:bg-white/10 flex items-center justify-center">
                      <Bell className="w-3.5 h-3.5 text-zinc-700 dark:text-zinc-300" />
                    </div>
                  </div>

                  {/* Spend Card */}
                  <div className="p-4 rounded-2xl bg-white dark:bg-gradient-to-br dark:from-emerald-950/80 dark:via-zinc-900 dark:to-zinc-900 border border-zinc-200 dark:border-emerald-500/20 shadow-sm dark:shadow-none mb-5 relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
                    <div className="text-zinc-500 dark:text-zinc-400 text-[10px] uppercase font-bold tracking-widest mb-1 flex items-center justify-between">
                      <span>Total Spend This Week</span>
                      <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">-4.2%</span>
                    </div>
                    <div className="font-display font-extrabold text-3xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight flex items-baseline gap-1">
                      <span>$842.00</span>
                      <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400">USD</span>
                    </div>
                    <div className="mt-2.5 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-emerald-500 dark:bg-emerald-400 rounded-full w-[68%]" />
                      </div>
                      <span className="text-[10px] text-zinc-500 dark:text-zinc-400 font-medium">68% of budget</span>
                    </div>
                  </div>

                  {/* Recent Activity Label */}
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">Recent Transactions</span>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold cursor-pointer hover:underline">See all</span>
                  </div>

                  {/* Realistic Expenses List */}
                  <div className="space-y-2.5">
                    {[
                      {
                        title: "Whole Foods Market",
                        category: "Groceries",
                        amount: "-$64.20",
                        time: "Today, 2:45 PM",
                        icon: "🛒"
                      },
                      {
                        title: "Uber Ride",
                        category: "Transport",
                        amount: "-$24.50",
                        time: "Today, 11:20 AM",
                        icon: "🚗"
                      },
                      {
                        title: "Blue Bottle Coffee",
                        category: "Dining & Drinks",
                        amount: "-$6.80",
                        time: "Yesterday",
                        icon: "☕"
                      },
                      {
                        title: "Spotify Subscription",
                        category: "Entertainment",
                        amount: "-$10.99",
                        time: "Oct 12",
                        icon: "🎵"
                      }
                    ].map((item, i) => (
                      <div
                        key={i}
                        className="p-3 bg-white dark:bg-zinc-800/60 hover:bg-zinc-100 dark:hover:bg-zinc-800/90 rounded-2xl flex items-center justify-between border border-zinc-200/80 dark:border-white/5 shadow-xs dark:shadow-none transition-all duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-white/10 flex items-center justify-center text-sm shrink-0 shadow-inner">
                            {item.icon}
                          </div>
                          <div>
                            <div className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate max-w-[110px] sm:max-w-[130px]">
                              {item.title}
                            </div>
                            <div className="text-[10px] text-zinc-500 dark:text-zinc-400">
                              {item.category} • {item.time}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100 font-mono">
                            {item.amount}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Mic Floating Action Button */}
                <div className="relative pb-2 flex justify-center">
                  <div className="relative group cursor-pointer">
                    <div className="absolute -inset-2 bg-emerald-500/25 rounded-full blur-md animate-pulse group-hover:bg-emerald-500/40 transition-all" />
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-emerald-500 hover:bg-emerald-600 rounded-full shadow-lg shadow-emerald-500/30 flex items-center justify-center border-4 border-zinc-50 dark:border-zinc-900 group-hover:scale-105 transition-transform">
                      <Mic className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};

export default MobileSection;
