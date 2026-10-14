import { Sun, Moon, PanelLeft, Plus, Command } from "lucide-react";
import { useTypedSelector } from "@/app/hook";
import { useTheme } from "@/context/theme-provider";
import { Button } from "../ui/button";
import { UserNav } from "./user-nav";
import Logo from "../logo/logo";
import { NotificationDropdown } from "./notification-dropdown";
import useAddTransactionDrawer from "@/hooks/use-add-transaction-drawer";
import { useShortcutsModal } from "@/context/shortcuts-modal-context";

interface HeaderBarProps {
  onLogoutClick?: () => void;
  sidebarCollapsed?: boolean;
  onSidebarToggle?: () => void;
}

export const HeaderBar = ({ onLogoutClick, sidebarCollapsed, onSidebarToggle }: HeaderBarProps) => {
  const { user } = useTypedSelector((state) => state.auth);
  const { theme, setTheme } = useTheme();
  const { onOpenDrawer } = useAddTransactionDrawer();
  const { setOpen: setShortcutsOpen } = useShortcutsModal();

  return (
    <>
      <header className="sticky top-0 z-30 flex h-14 sm:h-16 w-full items-center justify-between border-b border-border/60 bg-background/80 px-3 sm:px-6 backdrop-blur-xl transition-all duration-300">

        {/* Left Side: Mobile Brand Logo, Desktop Sidebar Toggle & Live Status */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mobile Brand Logo */}
          <div className="flex md:hidden text-foreground [&_span]:text-foreground [&_img]:opacity-95 pl-10 sm:pl-12">
            <div className="sm:hidden"><Logo compact /></div>
            <div className="hidden sm:flex"><Logo /></div>
          </div>

          {/* Desktop sidebar toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden md:inline-flex h-9 w-9 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/65 border border-transparent hover:border-border/40 transition-all duration-200"
            onClick={onSidebarToggle}
            title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>

        </div>

        {/* Center / Shortcuts Search Bar */}
        <div className="hidden md:flex items-center">
          <button
            type="button"
            onClick={() => setShortcutsOpen(true)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl border border-border/60 bg-muted/30 hover:bg-muted/60 text-xs text-muted-foreground transition-all duration-200 hover:border-border shadow-xs hover:text-foreground group"
          >
            <Command className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            <span>Quick actions & search</span>
            <kbd className="ml-1 inline-flex items-center rounded border border-border/80 bg-background px-1.5 py-0.5 text-[10px] font-mono text-muted-foreground shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Side: Quick Action Button, Theme toggles, bell, and User menu */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Quick Add Transaction Button */}
          <Button
            size="sm"
            onClick={() => onOpenDrawer("manual")}
            className="h-8 sm:h-9 px-3 sm:px-3.5 rounded-xl bg-primary text-primary-foreground hover:brightness-110 font-semibold text-xs transition-all shadow-[0_2px_10px_rgba(16,185,129,0.25)] flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Transaction</span>
          </Button>

          {/* Theme toggler */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 sm:h-9 sm:w-9 rounded-full text-muted-foreground hover:text-foreground hover:bg-muted/65 border border-transparent hover:border-border/30 transition-all duration-200"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            title="Toggle Theme"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-emerald-400" />
            ) : (
              <Moon className="h-4 w-4 text-primary" />
            )}
          </Button>

          {/* Notifications bell — hidden on xs */}
          <div className="hidden sm:block">
            <NotificationDropdown />
          </div>

          <div className="h-4 w-px bg-border/60 hidden sm:block" />

          {/* User profile dropdown */}
          <UserNav
            userName={user?.name || ""}
            profilePicture={user?.profilePicture || ""}
            onLogout={onLogoutClick || (() => { })}
          />
        </div>
      </header>
    </>
  );
};
