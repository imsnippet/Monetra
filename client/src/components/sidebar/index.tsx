import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowUpDown,
  BarChart3,
  Settings,
  LogOut,
  Mic,
  Sparkles,
  Wallet,
  Target,
  Landmark,
  CalendarClock,
  Info,
  X,
  Menu,
} from "lucide-react";
import { PROTECTED_ROUTES, PUBLIC_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import LogoutDialog from "../navbar/logout-dialog";
import useAddTransactionDrawer from "@/hooks/use-add-transaction-drawer";
import { MonetraEmblem } from "../logo/monetra-logo";

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
  collapsed?: boolean;
}

const Sidebar = ({ className, onLinkClick, collapsed = false }: SidebarProps) => {
  const { pathname } = useLocation();
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { onOpenDrawer } = useAddTransactionDrawer();

  const mainRoutes = [
    { href: PROTECTED_ROUTES.OVERVIEW, label: "Overview", Icon: LayoutDashboard },
    { href: PROTECTED_ROUTES.TRANSACTIONS, label: "Transactions", Icon: ArrowUpDown },
    { href: PROTECTED_ROUTES.BUDGET, label: "Budget", Icon: Wallet },
    { href: PROTECTED_ROUTES.GOALS, label: "Goals", Icon: Target },
    { href: PROTECTED_ROUTES.ACCOUNTS, label: "Accounts", Icon: Landmark },
    { href: PROTECTED_ROUTES.RECURRING, label: "Recurring", Icon: CalendarClock },
    { href: PROTECTED_ROUTES.REPORTS, label: "Reports", Icon: BarChart3 },
    { href: PROTECTED_ROUTES.SETTINGS, label: "Settings", Icon: Settings },
  ];

  const handleLinkClick = () => {
    setIsMobileOpen(false);
    onLinkClick?.();
  };

  const SidebarContent = ({ forceExpand = false }: { forceExpand?: boolean }) => {
    const isCollapsed = forceExpand ? false : collapsed;
    return (
      <>
        <div className="flex flex-col flex-1 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-6">
            {/* Monetra Logo */}
            <div className={cn("transition-all duration-300", isCollapsed ? "flex justify-center" : "px-3")}>
              {isCollapsed ? (
                <NavLink to={PROTECTED_ROUTES.OVERVIEW} title="Monetra" onClick={handleLinkClick}>
                  <MonetraEmblem size={30} />
                </NavLink>
              ) : (
                <NavLink to={PROTECTED_ROUTES.OVERVIEW} className="flex items-center gap-2.5 group" onClick={handleLinkClick}>
                  <MonetraEmblem size={32} />
                  <div className="flex flex-col leading-none">
                    <span className="font-bold text-[18px] tracking-tight text-foreground font-display">
                      Monetra
                    </span>
                    <span className="text-[10px] tracking-wider text-muted-foreground uppercase font-medium">
                      Smart Finance
                    </span>
                  </div>
                </NavLink>
              )}
            </div>

            {/* Navigation Links */}
            <nav className="flex flex-col gap-1">
              {mainRoutes.map((route) => {
                const Icon = route.Icon;
                const isActive = pathname === route.href || pathname.startsWith(route.href + "/");
                return (
                  <Button
                    key={route.href}
                    size="sm"
                    variant="ghost"
                    className={cn(
                      "w-full font-semibold text-[13px] rounded-full border border-transparent transition-all duration-200 group",
                      isCollapsed ? "justify-center px-0 py-2.5" : "justify-start gap-3 px-3.5 py-2",
                      isActive
                        ? "text-primary bg-primary/10 border-primary/20 dark:text-[#9fff59] dark:bg-[#9fff59]/10 dark:border-[#9fff59]/20 shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                    asChild
                  >
                    <NavLink to={route.href} onClick={handleLinkClick} title={isCollapsed ? route.label : undefined}>
                      <Icon
                        className={cn(
                          "h-[16px] w-[16px] shrink-0 transition-transform duration-200 group-hover:scale-110",
                          isActive
                            ? "text-primary dark:text-[#9fff59]"
                            : "text-muted-foreground group-hover:text-foreground"
                        )}
                      />
                      {!isCollapsed && <span>{route.label}</span>}
                    </NavLink>
                  </Button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Bottom section */}
        <div className="flex flex-col gap-3 mt-auto pt-3 border-t border-border/40">
          {/* Monetra AI Voice Card — hidden when collapsed */}
          {!isCollapsed && (
            <div className="relative overflow-hidden p-3.5 rounded-2xl border border-border/60 bg-muted/30 backdrop-blur-md shadow-sm group">
              <div className="flex items-start gap-2.5 z-10 relative">
                <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary dark:text-[#9fff59] flex items-center justify-center">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-foreground">
                    Monetra AI Voice
                  </p>
                  <p className="text-[10px] text-muted-foreground mt-0.5 leading-relaxed">
                    Say it naturally, we log it accurately.
                  </p>
                </div>
              </div>
              <div className="mt-2.5 flex items-center justify-between bg-card border border-border/50 p-1.5 rounded-xl">
                <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider pl-1.5">
                  TAP TO SPEAK
                </span>
                <div
                  className="h-6 w-6 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground dark:bg-[#9fff59] dark:text-zinc-950 flex items-center justify-center shadow-sm cursor-pointer transition-transform hover:scale-105"
                  onClick={() => onOpenDrawer("voice")}
                  title="Record voice transaction"
                >
                  <Mic className="h-3 w-3" />
                </div>
              </div>
            </div>
          )}

          {/* Mic icon when collapsed */}
          {isCollapsed && (
            <div className="flex justify-center">
              <div
                className="h-8 w-8 rounded-full bg-primary text-primary-foreground dark:bg-[#9fff59] dark:text-zinc-950 flex items-center justify-center shadow-md cursor-pointer hover:scale-105 transition-all"
                onClick={() => onOpenDrawer("voice")}
                title="Monetra Voice Input"
              >
                <Mic className="h-4 w-4" />
              </div>
            </div>
          )}

          {/* About link */}
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "w-full font-medium text-[12px] text-muted-foreground hover:text-foreground rounded-full",
              isCollapsed ? "justify-center px-0 py-2" : "justify-start gap-2.5 px-3 py-1.5"
            )}
            asChild
          >
            <NavLink to={PUBLIC_ROUTES.ABOUT} onClick={handleLinkClick} title={isCollapsed ? "About Monetra" : undefined}>
              <Info className="h-3.5 w-3.5 text-muted-foreground" />
              {!isCollapsed && <span>About Monetra</span>}
            </NavLink>
          </Button>

          {/* Logout */}
          <Button
            size="sm"
            variant="ghost"
            className={cn(
              "w-full font-semibold text-[13px] text-rose-600 hover:text-rose-700 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/20 rounded-full transition-colors",
              isCollapsed ? "justify-center px-0 py-2" : "justify-start gap-2.5 px-3 py-1.5"
            )}
            onClick={() => setIsLogoutDialogOpen(true)}
          >
            <LogOut className="h-[15px] w-[15px] shrink-0 text-rose-500" />
            {!isCollapsed && <span>Log Out</span>}
          </Button>
        </div>
      </>
    );
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden md:flex flex-col h-screen fixed left-0 top-0 bg-card/80 border-r border-border/60 py-5 z-40 backdrop-blur-xl transition-all duration-300 justify-between overflow-hidden",
          collapsed ? "w-16 px-2" : "w-60 px-3.5",
          className
        )}
      >
        <SidebarContent />
      </aside>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsMobileOpen(true)}
        aria-label="Open navigation menu"
        className="fixed top-3 left-3 z-50 md:hidden p-2 rounded-xl bg-card/90 backdrop-blur-xl border border-border shadow-sm"
      >
        <Menu className="h-5 w-5 text-foreground" />
      </button>

      {/* Mobile Sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-50 md:hidden transition-all duration-300",
          isMobileOpen ? "visible" : "invisible delay-300"
        )}
      >
        <div
          className={cn(
            "absolute inset-0 bg-black/50 backdrop-blur-xs transition-opacity duration-300",
            isMobileOpen ? "opacity-100" : "opacity-0"
          )}
          onClick={() => setIsMobileOpen(false)}
        />

        <aside
          className={cn(
            "absolute left-0 top-0 h-screen bg-card border-r border-border py-6 backdrop-blur-2xl transition-transform duration-300 flex flex-col justify-between overflow-y-auto w-64 px-4 shadow-2xl",
            isMobileOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <button
            onClick={() => setIsMobileOpen(false)}
            className="absolute top-5 right-4 p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors z-50"
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </button>

          <SidebarContent forceExpand={true} />
        </aside>
      </div>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
      />
    </>
  );
};

export default Sidebar;
