import { useState } from "react";
import { Menu, Sun, Moon, Plus, LayoutDashboard, ArrowLeftRight, BarChart2, Settings, X } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { cn } from "@/lib/utils";
import Logo from "../logo/logo";
import { Button } from "../ui/button";
import { Sheet, SheetContent } from "../ui/sheet";
import { UserNav } from "./user-nav";
import LogoutDialog from "./logout-dialog";
import { useTypedSelector } from "@/app/hook";
import { useTheme } from "@/context/theme-provider";
import useAddTransactionDrawer from "@/hooks/use-add-transaction-drawer";

const routes = [
  { href: PROTECTED_ROUTES.OVERVIEW, label: "Overview", Icon: LayoutDashboard },
  { href: PROTECTED_ROUTES.TRANSACTIONS, label: "Transactions", Icon: ArrowLeftRight },
  { href: PROTECTED_ROUTES.REPORTS, label: "Reports", Icon: BarChart2 },
  { href: PROTECTED_ROUTES.SETTINGS, label: "Settings", Icon: Settings },
];

const Navbar = () => {
  const { pathname } = useLocation();
  const { user } = useTypedSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();
  const { onOpenDrawer } = useAddTransactionDrawer();

  const [isOpen, setIsOpen] = useState(false);
  const [isLogoutDialogOpen, setIsLogoutDialogOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-background/90 backdrop-blur-lg border-b border-border/50 transition-all duration-200">
        <div className="w-full flex h-14 max-w-[var(--max-width)] items-center mx-auto px-4 sm:px-6">
          <div className="w-full flex items-center justify-between">

            {/* Left: hamburger + logo */}
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="inline-flex md:hidden text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl"
                onClick={() => setIsOpen(true)}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" />
              </Button>
              <div className="text-foreground [&_span]:text-foreground [&_img]:opacity-95">
                <Logo />
              </div>
            </div>

            {/* Center: desktop nav */}
            <nav className="hidden md:flex items-center gap-0.5">
              {routes.map((route) => (
                <Button
                  key={route.href}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "font-medium text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-150 text-[13.5px] px-4 py-1.5 rounded-full",
                    pathname === route.href && "text-primary bg-primary/8 font-semibold hover:bg-primary/10 hover:text-primary"
                  )}
                  asChild
                >
                  <NavLink to={route.href}>{route.label}</NavLink>
                </Button>
              ))}
            </nav>

            {/* Right: actions */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-9 w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/60"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>

              <div className="h-4 w-px bg-border/60" />

              <UserNav
                userName={user?.name || ""}
                profilePicture={user?.profilePicture || ""}
                onLogout={() => setIsLogoutDialogOpen(true)}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Mobile slide-over drawer */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetContent side="left" className="bg-background border-r border-border w-72 p-0 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-border/60">
            <Logo />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(false)}
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Nav links */}
          <nav className="flex flex-col gap-1 px-3 pt-3 flex-1">
            {routes.map((route) => {
              const Icon = route.Icon;
              return (
                <Button
                  key={route.href}
                  size="sm"
                  variant="ghost"
                  className={cn(
                    "w-full justify-start gap-3 font-medium text-muted-foreground hover:text-foreground hover:bg-muted/60 rounded-xl px-3 py-2.5 h-auto text-sm transition-all duration-150",
                    pathname === route.href && "bg-primary/8 text-primary font-semibold hover:bg-primary/10 hover:text-primary"
                  )}
                  asChild
                >
                  <NavLink to={route.href} onClick={() => setIsOpen(false)}>
                    <Icon className="h-4 w-4 shrink-0" />
                    {route.label}
                  </NavLink>
                </Button>
              );
            })}
          </nav>

          {/* Bottom: Add expense CTA */}
          <div className="px-3 pb-5 pt-3 border-t border-border/60">
            <Button
              className="w-full gap-2 rounded-xl font-semibold text-sm h-10 bg-primary text-primary-foreground hover:brightness-110 shadow-sm"
              onClick={() => { onOpenDrawer("manual"); setIsOpen(false); }}
            >
              <Plus className="h-4 w-4" />
              Add Expense
            </Button>
          </div>
        </SheetContent>
      </Sheet>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        setIsOpen={setIsLogoutDialogOpen}
      />
    </>
  );
};

export default Navbar;
