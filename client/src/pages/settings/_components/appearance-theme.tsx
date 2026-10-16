import { useState } from "react";
import { Label } from "@/components/ui/label";
import { useTheme } from "@/context/theme-provider";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Layout, Sun, Moon, Eye, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function AppearanceTheme() {
  const { theme, setTheme } = useTheme();

  const [isCompact, setIsCompact] = useState(() => {
    return localStorage.getItem("monetra_ui_density") === "compact";
  });
  const [smoothAnimations, setSmoothAnimations] = useState(() => {
    return localStorage.getItem("monetra_smooth_animations") !== "disabled";
  });

  const handleSelectTheme = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
  };

  const handleToggleCompact = (checked: boolean) => {
    setIsCompact(checked);
    localStorage.setItem("monetra_ui_density", checked ? "compact" : "comfortable");
  };

  const handleToggleAnimations = (checked: boolean) => {
    setSmoothAnimations(checked);
    localStorage.setItem(
      "monetra_smooth_animations",
      checked ? "enabled" : "disabled"
    );
  };

  return (
    <div className="space-y-5 max-w-lg">
      {/* ── Visual Theme Mode (Compact, Sleek & Instant Apply) ── */}
      <div className="space-y-2.5">
        <div>
          <h4 className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
            <Eye className="w-3.5 h-3.5 text-primary" /> Visual Theme Mode
          </h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Select an interface tone. Settings apply instantly on click.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-0.5 max-w-md">
          {/* Light Theme Card */}
          <button
            type="button"
            onClick={() => handleSelectTheme("light")}
            className={cn(
              "group relative flex items-center gap-2.5 p-2.5 rounded-xl border transition-all duration-200 text-left bg-card cursor-pointer",
              theme === "light"
                ? "border-primary shadow-xs bg-primary/5 ring-1 ring-primary/20"
                : "border-border/70 hover:border-border hover:bg-muted/30"
            )}
          >
            <div className="w-7 h-7 rounded-lg bg-amber-500/10 text-amber-500 flex items-center justify-center shrink-0 border border-amber-500/20">
              <Sun className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Light Mode</p>
              <p className="text-[10px] text-muted-foreground">Crisp daylight theme</p>
            </div>
            {theme === "light" && (
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
            )}
          </button>

          {/* Dark Obsidian Theme Card */}
          <button
            type="button"
            onClick={() => handleSelectTheme("dark")}
            className={cn(
              "group relative flex items-center gap-2.5 p-2.5 rounded-xl border transition-all duration-200 text-left bg-card cursor-pointer",
              theme === "dark"
                ? "border-primary shadow-xs bg-primary/5 ring-1 ring-primary/20"
                : "border-border/70 hover:border-border hover:bg-muted/30"
            )}
          >
            <div className="w-7 h-7 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0 border border-indigo-500/20">
              <Moon className="w-3.5 h-3.5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-foreground">Dark Obsidian</p>
              <p className="text-[10px] text-muted-foreground">Deep contrast night view</p>
            </div>
            {theme === "dark" && (
              <CheckCircle2 className="w-3.5 h-3.5 text-primary shrink-0" />
            )}
          </button>
        </div>
      </div>

      <Separator className="opacity-60" />

      {/* ── Display Density & Motion Controls ── */}
      <div className="space-y-2.5">
        <div>
          <h4 className="text-xs font-semibold flex items-center gap-1.5 text-foreground">
            <Layout className="w-3.5 h-3.5 text-primary" /> Layout & Animation Controls
          </h4>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Fine-tune UI density and interactive fluid animations.
          </p>
        </div>

        <Card className="border border-border/70 rounded-xl shadow-xs max-w-md">
          <CardContent className="p-3 sm:p-3.5 space-y-3">
            {/* Density Toggle */}
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label htmlFor="compact-mode" className="text-xs font-medium text-foreground cursor-pointer">
                  Compact Information Density
                </Label>
                <p className="text-[10.5px] text-muted-foreground leading-snug">
                  Tighter table padding to view more records per screen.
                </p>
              </div>
              <Switch
                id="compact-mode"
                checked={isCompact}
                onCheckedChange={handleToggleCompact}
              />
            </div>

            <Separator className="opacity-40" />

            {/* Micro-Animations Toggle */}
            <div className="flex items-center justify-between gap-3">
              <div className="space-y-0.5">
                <Label htmlFor="smooth-motion" className="text-xs font-medium text-foreground cursor-pointer flex items-center gap-1.5">
                  <Sparkles className="w-3 h-3 text-primary" /> Fluid Micro-Animations
                </Label>
                <p className="text-[10.5px] text-muted-foreground leading-snug">
                  Smooth CSS transitions, text sliding, and scale responses.
                </p>
              </div>
              <Switch
                id="smooth-motion"
                checked={smoothAnimations}
                onCheckedChange={handleToggleAnimations}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}