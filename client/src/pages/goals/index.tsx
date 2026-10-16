import React, { useState, useRef, useEffect } from "react";
import {
  Target,
  Plus,
  Calendar,
  CheckCircle2,
  Sparkles,
  Coins,
  ShieldCheck,
  PiggyBank,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Sliders,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import SmoothTextSlider from "@/components/ui/smooth-text-slider";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/lib/utils";
import { useTypedSelector } from "@/app/hook";
import { toast } from "sonner";

interface SavingsGoal {
  id: string;
  name: string;
  category: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  monthlyTarget: number;
  notes?: string;
  isArchived?: boolean;
  contributions: {
    id: string;
    date: string;
    amount: number;
    note: string;
  }[];
}

const INITIAL_GOALS: SavingsGoal[] = [];


export const GoalsPage: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>(() => {
    const saved = localStorage.getItem("monetra_savings_goals");
    return saved ? JSON.parse(saved) : INITIAL_GOALS;
  });

  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isContributeOpen, setIsContributeOpen] = useState(false);
  const [activeGoal, setActiveGoal] = useState<SavingsGoal | null>(null);

  const sliderRef = useRef<HTMLDivElement>(null);

  // Form states
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Savings");
  const [targetAmount, setTargetAmount] = useState("");
  const [currentAmount, setCurrentAmount] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [contributionAmount, setContributionAmount] = useState("");
  const [contributionNote, setContributionNote] = useState("");

  const user = useTypedSelector((state) => state.auth.user);
  const userCurrency = (user as any)?.baseCurrency || (user as any)?.currency || "USD";

  // Listen for reset events from Account Settings
  useEffect(() => {
    const handleReset = () => {
      setGoals([]);
    };
    window.addEventListener("monetra_data_reset", handleReset);
    return () => window.removeEventListener("monetra_data_reset", handleReset);
  }, []);

  const saveGoals = (newGoals: SavingsGoal[]) => {
    setGoals(newGoals);
    localStorage.setItem("monetra_savings_goals", JSON.stringify(newGoals));
  };

  const slideLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -360, behavior: "smooth" });
    }
  };

  const slideRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 360, behavior: "smooth" });
    }
  };

  const toggleNoteExpansion = (id: string) => {
    setExpandedNotes((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(targetAmount);
    const initial = parseFloat(currentAmount) || 0;

    if (!name || isNaN(target) || target <= 0) {
      toast.error("Please enter a valid goal name and target amount.");
      return;
    }

    const newGoal: SavingsGoal = {
      id: `goal-${Date.now()}`,
      name,
      category: category || "Savings",
      targetAmount: target,
      currentAmount: initial,
      targetDate: targetDate || "2026-12-31",
      monthlyTarget: Math.round(target / 12),
      contributions: initial > 0 ? [{
        id: `c-${Date.now()}`,
        date: new Date().toISOString().split("T")[0],
        amount: initial,
        note: "Initial deposit",
      }] : [],
    };

    saveGoals([newGoal, ...goals]);
    toast.success(`Goal "${name}" created successfully!`);
    setIsAddOpen(false);
    setName("");
    setTargetAmount("");
    setCurrentAmount("");
    setTargetDate("");
  };

  const handleAddContribution = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeGoal) return;

    const amount = parseFloat(contributionAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid contribution amount.");
      return;
    }

    const updated = goals.map((g) => {
      if (g.id === activeGoal.id) {
        return {
          ...g,
          currentAmount: g.currentAmount + amount,
          contributions: [
            {
              id: `c-${Date.now()}`,
              date: new Date().toISOString().split("T")[0],
              amount,
              note: contributionNote || "Savings contribution",
            },
            ...g.contributions,
          ],
        };
      }
      return g;
    });

    saveGoals(updated);
    toast.success(`Added ${formatCurrency(amount, userCurrency)} to "${activeGoal.name}"!`);
    setIsContributeOpen(false);
    setContributionAmount("");
    setContributionNote("");
  };

  const totalTarget = goals.reduce((acc, g) => acc + g.targetAmount, 0);
  const totalSaved = goals.reduce((acc, g) => acc + g.currentAmount, 0);
  const remainingToSave = Math.max(0, totalTarget - totalSaved);
  const overallProgress = totalTarget > 0 ? Math.min(100, Math.round((totalSaved / totalTarget) * 100)) : 0;
  const completedGoalsCount = goals.filter((g) => g.currentAmount >= g.targetAmount).length;

  return (
    <PageLayout
      title="Savings Goals"
      subtitle="Track dedicated funds, set milestones, and build long-term wealth"
      addMarginTop
      rightAction={
        <Button
          onClick={() => setIsAddOpen(true)}
          className="rounded-lg shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-9 text-xs sm:text-sm px-4 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Create New Goal
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Aggregate Overview: 3 clean balanced elevated metric cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5">
          <Card className="border border-border/70 bg-card shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Consolidated Saved
                </span>
                <div className="w-8 h-8 rounded-lg bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-[#9fff59] flex items-center justify-center">
                  <PiggyBank className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {formatCurrency(totalSaved, userCurrency)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Out of <span className="font-semibold text-foreground">{formatCurrency(totalTarget, userCurrency)}</span> combined target
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Overall Completion
                </span>
                <span className="text-sm font-extrabold text-primary dark:text-[#9fff59]">
                  {overallProgress}%
                </span>
              </div>
              <div className="space-y-2">
                <Progress value={overallProgress} className="h-2.5 rounded-full bg-muted" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>
                    {goals.length} target{goals.length === 1 ? "" : "s"} ({completedGoalsCount} reached)
                  </span>
                  <span className="font-medium text-foreground">
                    {overallProgress >= 100 ? "All reached! 🎉" : "Active pacing"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-border/70 bg-card shadow-sm rounded-2xl hover:shadow-md transition-shadow">
            <CardContent className="p-5 flex flex-col justify-between h-full space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Remaining to Save
                </span>
                <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary dark:text-[#9fff59] flex items-center justify-center">
                  <Coins className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  {formatCurrency(remainingToSave, userCurrency)}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Across all scheduled target milestones
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Goals Header with View Switcher & Smooth Slider Arrows */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">Active Savings Portfolios</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {viewMode === "slider"
                  ? "Slide horizontally through dedicated goals and review full activity history"
                  : "Grid overview of all financial milestone targets"}
              </p>
            </div>

            {/* Slider Controls & View Switcher */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {viewMode === "slider" && goals.length > 0 && (
                <div className="flex items-center gap-1.5 mr-1">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={slideLeft}
                    className="h-8 w-8 rounded-lg border-border/70 text-foreground hover:bg-muted active:scale-95 transition-transform"
                    title="Slide Left"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={slideRight}
                    className="h-8 w-8 rounded-lg border-border/70 text-foreground hover:bg-muted active:scale-95 transition-transform"
                    title="Slide Right"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* View Mode Toggle */}
              <div className="flex items-center p-1 bg-muted/60 rounded-xl border border-border/60">
                <button
                  type="button"
                  onClick={() => setViewMode("slider")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    viewMode === "slider"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Interactive Card Slider"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  Slider
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("grid")}
                  className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                    viewMode === "grid"
                      ? "bg-card text-foreground shadow-xs"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  title="Grid View"
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                  Grid
                </button>
              </div>

              <Badge variant="outline" className="text-xs px-2.5 py-1 font-semibold rounded-full border-border/70 hidden sm:inline-flex">
                {goals.length} Goal{goals.length === 1 ? "" : "s"}
              </Badge>
            </div>
          </div>

          {goals.length === 0 ? (
            <Card className="border border-dashed border-border/80 bg-muted/20 rounded-2xl p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">No savings goals yet</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto">
                Create your first dedicated goal to start allocating and tracking funds toward milestones.
              </p>
              <Button
                onClick={() => setIsAddOpen(true)}
                className="mt-4 rounded-lg bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1.5" /> Create Goal
              </Button>
            </Card>
          ) : viewMode === "slider" ? (
            /* ── Interactive Horizontal Card Slider ── */
            <div className="relative group">
              {/* Smooth Left & Right Fade Masks for Smooth Ends */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-4 bg-gradient-to-r from-background to-transparent z-10 opacity-70" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-6 bg-gradient-to-l from-background to-transparent z-10 opacity-70" />

              <div
                ref={sliderRef}
                className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth custom-scrollbar px-1"
                style={{ scrollbarGutter: "stable" }}
              >
                {goals.map((goal) => {
                  const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                  const isComplete = goal.currentAmount >= goal.targetAmount;
                  const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
                  const isNoteExpanded = !!expandedNotes[goal.id];

                  return (
                    <Card
                      key={goal.id}
                      className="w-[310px] sm:w-[350px] shrink-0 snap-start border border-border/70 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm"
                    >
                      <CardHeader className="p-5 pb-3">
                        <div className="flex items-center justify-between gap-2">
                          <Badge variant="secondary" className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                            {goal.category}
                          </Badge>
                          {isComplete ? (
                            <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-[#9fff59] border border-emerald-500/30 text-[11px] font-bold py-0.5 px-2">
                              <CheckCircle2 className="w-3 h-3 mr-1" /> Reached
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-[11px] font-bold text-primary dark:text-[#9fff59] border-primary/30">
                              {progress}%
                            </Badge>
                          )}
                        </div>

                        <div className="mt-2.5">
                          <SmoothTextSlider
                            text={goal.name}
                            as="h3"
                            className="text-base font-bold text-foreground tracking-tight leading-snug"
                            maxWidthClass="max-w-[210px] sm:max-w-[240px]"
                          />

                          {/* Long note with smooth toggle expander slider */}
                          {goal.notes && (
                            <div className="mt-1">
                              <CardDescription
                                className={`text-xs text-muted-foreground/90 transition-all duration-200 leading-relaxed ${
                                  isNoteExpanded ? "line-clamp-none" : "line-clamp-2"
                                }`}
                              >
                                {goal.notes}
                              </CardDescription>
                              {goal.notes.length > 70 && (
                                <button
                                  type="button"
                                  onClick={() => toggleNoteExpansion(goal.id)}
                                  className="text-[11px] text-primary dark:text-[#9fff59] font-semibold flex items-center gap-0.5 mt-0.5 hover:underline"
                                >
                                  {isNoteExpanded ? (
                                    <>Less <ChevronUp className="w-3 h-3" /></>
                                  ) : (
                                    <>Read full note <ChevronDown className="w-3 h-3" /></>
                                  )}
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="p-5 pt-0 space-y-3.5">
                        {/* Progress readout */}
                        <div className="space-y-2 bg-muted/30 p-3.5 rounded-xl border border-border/40">
                          <div className="flex justify-between items-baseline">
                            <span className="text-xs text-muted-foreground font-medium">Saved</span>
                            <div className="text-right">
                              <span className="text-lg font-extrabold text-foreground">
                                {formatCurrency(goal.currentAmount, userCurrency)}
                              </span>
                              <span className="text-xs text-muted-foreground ml-1">
                                / {formatCurrency(goal.targetAmount, userCurrency)}
                              </span>
                            </div>
                          </div>

                          <Progress value={progress} className="h-2 rounded-full bg-muted" />

                          <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-0.5">
                            <span>{isComplete ? "Target achieved" : `Remaining: ${formatCurrency(remaining, userCurrency)}`}</span>
                            <span className="flex items-center gap-1 font-medium text-foreground">
                              <Calendar className="w-3 h-3 text-muted-foreground" /> {goal.targetDate}
                            </span>
                          </div>
                        </div>

                        {/* Slideable / Scrollable Activity Box */}
                        {goal.contributions.length > 0 ? (
                          <div className="space-y-1">
                            <div className="flex justify-between items-center px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                              <span>Deposit Timeline ({goal.contributions.length})</span>
                              <span className="text-[9px] font-medium text-primary">Scroll for more</span>
                            </div>
                            <div className="max-h-[105px] overflow-y-auto custom-scrollbar space-y-1.5 p-2 bg-muted/20 rounded-xl border border-border/30">
                              {goal.contributions.map((c) => (
                                <div key={c.id} className="flex justify-between items-center text-xs py-0.5">
                                  <div className="pr-2 max-w-[170px]">
                                    <SmoothTextSlider
                                      text={c.note}
                                      as="span"
                                      className="text-foreground font-medium block text-[11px]"
                                      maxWidthClass="max-w-[150px] sm:max-w-[170px]"
                                    />
                                    <span className="text-[10px] text-muted-foreground block">{c.date}</span>
                                  </div>
                                  <span className="font-bold text-emerald-600 dark:text-[#9fff59] shrink-0 text-xs">
                                    +{formatCurrency(c.amount, userCurrency)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="px-3 py-2 text-[11px] text-muted-foreground italic text-center">
                            No deposit transactions recorded yet
                          </div>
                        )}

                        {/* Deposit Action */}
                        <Button
                          size="sm"
                          className="w-full h-9 text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm transition-transform active:scale-[0.99]"
                          onClick={() => {
                            setActiveGoal(goal);
                            setIsContributeOpen(true);
                          }}
                        >
                          <Plus className="w-3.5 h-3.5 mr-1.5" /> Deposit Funds
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── Responsive Multi-column Grid View ── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {goals.map((goal) => {
                const progress = Math.min(100, Math.round((goal.currentAmount / goal.targetAmount) * 100));
                const isComplete = goal.currentAmount >= goal.targetAmount;
                const remaining = Math.max(0, goal.targetAmount - goal.currentAmount);
                const isNoteExpanded = !!expandedNotes[goal.id];

                return (
                  <Card
                    key={goal.id}
                    className="border border-border/70 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm"
                  >
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-center justify-between gap-2">
                        <Badge variant="secondary" className="text-[11px] font-semibold px-2.5 py-0.5 rounded-md">
                          {goal.category}
                        </Badge>
                        {isComplete ? (
                          <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-[#9fff59] border border-emerald-500/30 text-[11px] font-bold py-0.5 px-2">
                            <CheckCircle2 className="w-3 h-3 mr-1" /> Reached
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-[11px] font-bold text-primary dark:text-[#9fff59] border-primary/30">
                            {progress}%
                          </Badge>
                        )}
                      </div>

                      <div className="mt-2.5">
                        <SmoothTextSlider
                          text={goal.name}
                          as="h3"
                          className="text-base font-bold text-foreground tracking-tight leading-snug"
                          maxWidthClass="max-w-[210px] sm:max-w-[240px]"
                        />
                        {goal.notes && (
                          <div className="mt-1">
                            <CardDescription
                              className={`text-xs text-muted-foreground/90 transition-all duration-200 leading-relaxed ${
                                isNoteExpanded ? "line-clamp-none" : "line-clamp-2"
                              }`}
                            >
                              {goal.notes}
                            </CardDescription>
                            {goal.notes.length > 70 && (
                              <button
                                type="button"
                                onClick={() => toggleNoteExpansion(goal.id)}
                                className="text-[11px] text-primary dark:text-[#9fff59] font-semibold flex items-center gap-0.5 mt-0.5 hover:underline"
                              >
                                {isNoteExpanded ? (
                                  <>Less <ChevronUp className="w-3 h-3" /></>
                                ) : (
                                  <>Read full note <ChevronDown className="w-3 h-3" /></>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </CardHeader>

                    <CardContent className="p-5 pt-0 space-y-3.5">
                      <div className="space-y-2 bg-muted/30 p-3.5 rounded-xl border border-border/40">
                        <div className="flex justify-between items-baseline">
                          <span className="text-xs text-muted-foreground font-medium">Saved</span>
                          <div className="text-right">
                            <span className="text-lg font-extrabold text-foreground">
                              {formatCurrency(goal.currentAmount, userCurrency)}
                            </span>
                            <span className="text-xs text-muted-foreground ml-1">
                              / {formatCurrency(goal.targetAmount, userCurrency)}
                            </span>
                          </div>
                        </div>

                        <Progress value={progress} className="h-2 rounded-full bg-muted" />

                        <div className="flex justify-between items-center text-[11px] text-muted-foreground pt-0.5">
                          <span>{isComplete ? "Target achieved" : `Remaining: ${formatCurrency(remaining, userCurrency)}`}</span>
                          <span className="flex items-center gap-1 font-medium text-foreground">
                            <Calendar className="w-3 h-3 text-muted-foreground" /> {goal.targetDate}
                          </span>
                        </div>
                      </div>

                      {goal.contributions.length > 0 ? (
                        <div className="space-y-1">
                          <div className="flex justify-between items-center px-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                            <span>Deposit Timeline ({goal.contributions.length})</span>
                            <span className="text-[9px] font-medium text-primary">Scrollable slider</span>
                          </div>
                          <div className="max-h-[105px] overflow-y-auto custom-scrollbar space-y-1.5 p-2 bg-muted/20 rounded-xl border border-border/30">
                            {goal.contributions.map((c) => (
                              <div key={c.id} className="flex justify-between items-center text-xs py-0.5">
                                <div className="pr-2 max-w-[170px]">
                                  <SmoothTextSlider
                                    text={c.note}
                                    as="span"
                                    className="text-foreground font-medium block text-[11px]"
                                    maxWidthClass="max-w-[150px] sm:max-w-[170px]"
                                  />
                                  <span className="text-[10px] text-muted-foreground block">{c.date}</span>
                                </div>
                                <span className="font-bold text-emerald-600 dark:text-[#9fff59] shrink-0 text-xs">
                                  +{formatCurrency(c.amount, userCurrency)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="px-3 py-2 text-[11px] text-muted-foreground italic text-center">
                          No deposit transactions recorded yet
                        </div>
                      )}

                      <Button
                        size="sm"
                        className="w-full h-9 text-xs rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-sm transition-transform active:scale-[0.99]"
                        onClick={() => {
                          setActiveGoal(goal);
                          setIsContributeOpen(true);
                        }}
                      >
                        <Plus className="w-3.5 h-3.5 mr-1.5" /> Deposit Funds
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Milestone Strategies & Security Card */}
        <Card className="border border-border/70 bg-gradient-to-r from-card via-card to-primary/5 rounded-2xl shadow-sm p-5 sm:p-6">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary dark:text-[#9fff59] flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm sm:text-base font-bold text-foreground">Target Velocity & Reserve Guidance</h3>
                <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                  Automated compounding recommendations based on current savings rate. Your portfolios represent dedicated liquidity outside active discretionary spending.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddOpen(true)}
                className="rounded-xl text-xs font-semibold h-9"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-primary" /> New Target
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Modal: Create Goal */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Create Savings Goal</DialogTitle>
            <DialogDescription className="text-xs">
              Set up a target amount, milestone date, and track your progress systematically.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateGoal} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="goal-name" className="text-xs font-semibold">Goal Name</Label>
              <Input
                id="goal-name"
                placeholder="e.g. Home Down Payment, Emergency Fund"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="target-amount" className="text-xs font-semibold">Target Amount ({userCurrency})</Label>
                <Input
                  id="target-amount"
                  type="number"
                  placeholder="5000"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(e.target.value)}
                  required
                  className="rounded-lg text-sm"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="initial-amount" className="text-xs font-semibold">Initial Saved</Label>
                <Input
                  id="initial-amount"
                  type="number"
                  placeholder="0"
                  value={currentAmount}
                  onChange={(e) => setCurrentAmount(e.target.value)}
                  className="rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="target-date" className="text-xs font-semibold">Target Completion Date</Label>
              <Input
                id="target-date"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="rounded-lg text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="category" className="text-xs font-semibold">Category</Label>
              <Input
                id="category"
                placeholder="Emergency, Travel, Investment..."
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="rounded-lg text-sm"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-lg text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-xs">
                Save Goal
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Add Contribution */}
      <Dialog open={isContributeOpen} onOpenChange={setIsContributeOpen}>
        <DialogContent className="sm:max-w-[400px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add Contribution</DialogTitle>
            <DialogDescription className="text-xs">
              Record a transfer or deposit toward "{activeGoal?.name}".
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddContribution} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="contribution-amount" className="text-xs font-semibold">Amount ({userCurrency})</Label>
              <Input
                id="contribution-amount"
                type="number"
                placeholder="250"
                value={contributionAmount}
                onChange={(e) => setContributionAmount(e.target.value)}
                required
                autoFocus
                className="rounded-lg text-sm"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="contribution-note" className="text-xs font-semibold">Note / Source</Label>
              <Input
                id="contribution-note"
                placeholder="e.g. Monthly transfer from checking"
                value={contributionNote}
                onChange={(e) => setContributionNote(e.target.value)}
                className="rounded-lg text-sm"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsContributeOpen(false)} className="rounded-lg text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-xs">
                Confirm Deposit
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default GoalsPage;
