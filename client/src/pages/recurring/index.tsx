import React, { useState, useRef } from "react";
import {
  CalendarClock,
  Plus,
  Clock,
  Play,
  Pause,
  Calendar,
  CreditCard,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Sliders,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatCurrency } from "@/lib/utils";
import { useTypedSelector } from "@/app/hook";
import { toast } from "sonner";
import { SmoothTextSlider } from "@/components/ui/smooth-text-slider";

export interface RecurringPayment {
  id: string;
  name: string;
  amount: number;
  currency: string;
  frequency: "MONTHLY" | "WEEKLY" | "YEARLY" | "QUARTERLY";
  category: string;
  nextDate: string;
  accountName: string;
  status: "ACTIVE" | "PAUSED";
  reminderDays: number;
  notes?: string;
}

const INITIAL_RECURRING: RecurringPayment[] = [
  {
    id: "rec-1",
    name: "Cloud Server & Hosting",
    amount: 45.0,
    currency: "USD",
    frequency: "MONTHLY",
    category: "Utilities",
    nextDate: "2026-11-01",
    accountName: "Travel Credit Card",
    status: "ACTIVE",
    reminderDays: 3,
    notes: "Production API cluster and database automated backup snapshots hosted on high-availability cloud infrastructure.",
  },
  {
    id: "rec-2",
    name: "Fiber Internet Subscription",
    amount: 60.0,
    currency: "USD",
    frequency: "MONTHLY",
    category: "Utilities",
    nextDate: "2026-10-28",
    accountName: "Primary Checking",
    status: "ACTIVE",
    reminderDays: 2,
    notes: "High-speed 1Gbps symmetrical optical fiber internet with unlimited data transfer, static IP, and Wi-Fi 6 gateway lease.",
  },
  {
    id: "rec-3",
    name: "Software Tools & AI Pro",
    amount: 30.0,
    currency: "USD",
    frequency: "MONTHLY",
    category: "Productivity",
    nextDate: "2026-11-10",
    accountName: "Travel Credit Card",
    status: "ACTIVE",
    reminderDays: 1,
    notes: "Monthly enterprise AI copilot subscription and productivity team workspace with priority inference quotas.",
  },
  {
    id: "rec-4",
    name: "Gym & Wellness Pass",
    amount: 55.0,
    currency: "USD",
    frequency: "MONTHLY",
    category: "Healthcare",
    nextDate: "2026-11-05",
    accountName: "Primary Checking",
    status: "PAUSED",
    reminderDays: 3,
    notes: "All-access tier fitness membership including recovery spa, heated lap pool, and personal training locker facilities.",
  },
];

export const RecurringPage: React.FC = () => {
  const [items, setItems] = useState<RecurringPayment[]>(() => {
    const saved = localStorage.getItem("monetra_recurring_payments");
    return saved ? JSON.parse(saved) : INITIAL_RECURRING;
  });

  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const [filterTab, setFilterTab] = useState<"ALL" | "ACTIVE" | "PAUSED">("ALL");
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [isAddOpen, setIsAddOpen] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  // Form states
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [frequency, setFrequency] = useState<RecurringPayment["frequency"]>("MONTHLY");
  const [category, setCategory] = useState("Utilities");
  const [nextDate, setNextDate] = useState("");
  const [accountName, setAccountName] = useState("Primary Checking");
  const [notes, setNotes] = useState("");

  const user = useTypedSelector((state) => state.auth.user);
  const baseCurrency = (user as any)?.currency || "USD";

  const saveItems = (newItems: RecurringPayment[]) => {
    setItems(newItems);
    localStorage.setItem("monetra_recurring_payments", JSON.stringify(newItems));
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

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!name || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast.error("Please enter a valid title and amount.");
      return;
    }

    const newItem: RecurringPayment = {
      id: `rec-${Date.now()}`,
      name,
      amount: parsedAmount,
      currency: baseCurrency,
      frequency,
      category,
      nextDate: nextDate || "2026-11-01",
      accountName,
      status: "ACTIVE",
      reminderDays: 3,
      notes: notes || undefined,
    };

    saveItems([newItem, ...items]);
    toast.success(`Recurring bill "${name}" registered!`);
    setIsAddOpen(false);
    setName("");
    setAmount("");
    setNextDate("");
    setNotes("");
  };

  const toggleStatus = (id: string) => {
    const updated = items.map((item) => {
      if (item.id === id) {
        const nextStatus = item.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
        toast.info(`"${item.name}" is now ${nextStatus.toLowerCase()}`);
        return { ...item, status: nextStatus as "ACTIVE" | "PAUSED" };
      }
      return item;
    });
    saveItems(updated);
  };

  const activeBills = items.filter((i) => i.status === "ACTIVE");
  const pausedBills = items.filter((i) => i.status === "PAUSED");

  const totalMonthlyCommitment = activeBills.reduce((acc, i) => {
    if (i.frequency === "MONTHLY") return acc + i.amount;
    if (i.frequency === "YEARLY") return acc + i.amount / 12;
    if (i.frequency === "WEEKLY") return acc + i.amount * 4.33;
    if (i.frequency === "QUARTERLY") return acc + i.amount / 3;
    return acc + i.amount;
  }, 0);

  const annualProjectedCommitment = totalMonthlyCommitment * 12;

  // Filtered items based on tab
  const displayedItems = items.filter((i) => {
    if (filterTab === "ACTIVE") return i.status === "ACTIVE";
    if (filterTab === "PAUSED") return i.status === "PAUSED";
    return true;
  });

  // Sort upcoming
  const sortedUpcoming = [...items]
    .filter((i) => i.status === "ACTIVE")
    .sort((a, b) => new Date(a.nextDate).getTime() - new Date(b.nextDate).getTime());

  const soonestDue = sortedUpcoming[0];

  return (
    <PageLayout
      title="Recurring & Subscriptions"
      subtitle="Monitor recurring commitments, subscriptions, and predictable cash flow dues"
      addMarginTop
      rightAction={
        <Button
          size="sm"
          onClick={() => setIsAddOpen(true)}
          className="rounded-lg shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-9 text-xs sm:text-sm px-4 transition-transform active:scale-95"
        >
          <Plus className="w-4 h-4 mr-1.5" /> Add Recurring Bill
        </Button>
      }
    >
      <div className="space-y-6">
        {/* Aggregate Overview: 4 balanced elevated metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <Card className="border border-border/70 bg-card rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Monthly Commitment
            </span>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mt-1">
              {formatCurrency(totalMonthlyCommitment, baseCurrency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Normalized monthly run rate
            </p>
          </Card>

          <Card className="border border-border/70 bg-card rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Active Subscriptions
            </span>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-primary dark:text-[#9fff59] mt-1">
              {activeBills.length} Active
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {pausedBills.length} currently paused
            </p>
          </Card>

          <Card className="border border-border/70 bg-card rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Annual Projected Cost
            </span>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mt-1">
              {formatCurrency(annualProjectedCommitment, baseCurrency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Estimated 12-month drain
            </p>
          </Card>

          <Card className="border border-border/70 bg-card rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Next Upcoming Due
            </span>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mt-1">
              <SmoothTextSlider
                text={soonestDue ? soonestDue.name : "None Pending"}
                as="span"
                className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground"
                maxWidthClass="w-full max-w-full"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 inline text-primary dark:text-[#9fff59]" />
              {soonestDue ? `Due on ${soonestDue.nextDate}` : "All clear"}
            </p>
          </Card>
        </div>

        {/* Filter Bar & Subscriptions Section with Slider Controls */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">Subscriptions & Scheduled Dues</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {viewMode === "slider"
                  ? "Slide horizontally through commitments and smooth text viewers"
                  : "Grid overview of all active and paused recurring bills"}
              </p>
            </div>

            {/* Controls: Slider Arrows, View Switcher & Status Filter */}
            <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
              {viewMode === "slider" && displayedItems.length > 0 && (
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
                  title="Card Slider View"
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

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-1 p-1 bg-muted/60 rounded-xl border border-border/60">
                {(["ALL", "ACTIVE", "PAUSED"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setFilterTab(tab)}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-lg transition-all ${
                      filterTab === tab
                        ? "bg-card text-foreground shadow-xs"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {tab === "ALL" && `All (${items.length})`}
                    {tab === "ACTIVE" && `Active (${activeBills.length})`}
                    {tab === "PAUSED" && `Paused (${pausedBills.length})`}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {displayedItems.length === 0 ? (
            <Card className="border border-dashed border-border/80 bg-muted/20 rounded-2xl p-10 text-center">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3">
                <CalendarClock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">No recurring items in this view</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                Try switching the filter tab or add a new scheduled obligation.
              </p>
            </Card>
          ) : viewMode === "slider" ? (
            /* ── Interactive Horizontal Card Slider with Smooth Fade Ends ── */
            <div className="relative group">
              {/* Smooth Left & Right Fade Masks for Smooth Ends */}
              <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-4 bg-gradient-to-r from-background to-transparent z-10 opacity-70" />
              <div className="pointer-events-none absolute right-0 top-0 bottom-4 w-6 bg-gradient-to-l from-background to-transparent z-10 opacity-70" />

              <div
                ref={sliderRef}
                className="flex gap-5 overflow-x-auto pb-4 pt-1 snap-x snap-mandatory scroll-smooth custom-scrollbar px-1"
                style={{ scrollbarGutter: "stable" }}
              >
                {displayedItems.map((item) => {
                  const isActive = item.status === "ACTIVE";
                  const isNoteExpanded = !!expandedNotes[item.id];

                  return (
                    <Card
                      key={item.id}
                      className="w-[310px] sm:w-[350px] shrink-0 snap-start border border-border/70 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm"
                    >
                      <CardHeader className="p-5 pb-3">
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 max-w-[210px] sm:max-w-[230px]">
                            <div className="flex items-center gap-1.5">
                              <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0.5 rounded-md">
                                {item.category}
                              </Badge>
                              <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                                {item.frequency}
                              </span>
                            </div>

                            {/* Smooth Text Slider for Fiber Internet Subscription and other long titles */}
                            <div className="pt-1">
                              <SmoothTextSlider
                                text={item.name}
                                as="h3"
                                className="text-base font-bold text-foreground tracking-tight leading-snug"
                                maxWidthClass="max-w-[195px] sm:max-w-[220px]"
                              />
                            </div>

                            <div className="text-xs text-muted-foreground flex items-center gap-1 max-w-[200px]">
                              <CreditCard className="w-3 h-3 text-muted-foreground shrink-0" />
                              <SmoothTextSlider
                                text={`Charged: ${item.accountName}`}
                                as="span"
                                className="text-xs text-muted-foreground"
                                maxWidthClass="max-w-[170px]"
                              />
                            </div>
                          </div>

                          <div className="text-right shrink-0">
                            <div className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                              {formatCurrency(item.amount, item.currency)}
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {item.frequency === "MONTHLY" ? "/mo" : item.frequency === "YEARLY" ? "/yr" : "/cycle"}
                            </span>
                          </div>
                        </div>

                        {/* Optional Long Note with Smooth Expander Slider */}
                        {item.notes && (
                          <div className="pt-2 border-t border-border/30 mt-2">
                            <p
                              className={`text-xs text-muted-foreground/85 transition-all duration-200 leading-relaxed ${
                                isNoteExpanded ? "line-clamp-none" : "line-clamp-2"
                              }`}
                            >
                              {item.notes}
                            </p>
                            {item.notes.length > 60 && (
                              <button
                                type="button"
                                onClick={() => toggleNoteExpansion(item.id)}
                                className="text-[11px] text-primary dark:text-[#9fff59] font-semibold flex items-center gap-0.5 mt-0.5 hover:underline"
                              >
                                {isNoteExpanded ? (
                                  <>Less <ChevronUp className="w-3 h-3" /></>
                                ) : (
                                  <>Read details <ChevronDown className="w-3 h-3" /></>
                                )}
                              </button>
                            )}
                          </div>
                        )}
                      </CardHeader>

                      <CardContent className="p-5 pt-1 space-y-3">
                        <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/40 text-xs">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <Clock className="w-3.5 h-3.5 text-primary dark:text-[#9fff59]" />
                            <span className="text-xs">Next Due: <strong className="text-foreground">{item.nextDate}</strong></span>
                          </div>
                          <Badge
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                              isActive
                                ? "bg-emerald-500/15 text-emerald-600 dark:text-[#9fff59] border border-emerald-500/30"
                                : "bg-muted text-muted-foreground border-border"
                            }`}
                          >
                            {isActive ? "Active" : "Paused"}
                          </Badge>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[11px] text-muted-foreground">
                            Reminder: {item.reminderDays}d prior
                          </span>
                          <Button
                            size="sm"
                            variant={isActive ? "outline" : "secondary"}
                            onClick={() => toggleStatus(item.id)}
                            className="rounded-xl text-xs font-semibold h-8 px-3 transition-transform active:scale-95"
                          >
                            {isActive ? (
                              <>
                                <Pause className="w-3.5 h-3.5 mr-1 text-amber-500" /> Pause Bill
                              </>
                            ) : (
                              <>
                                <Play className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Activate
                              </>
                            )}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          ) : (
            /* ── Responsive Multi-column Grid View ── */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedItems.map((item) => {
                const isActive = item.status === "ACTIVE";
                const isNoteExpanded = !!expandedNotes[item.id];

                return (
                  <Card
                    key={item.id}
                    className="border border-border/70 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm"
                  >
                    <CardHeader className="p-5 pb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 max-w-[210px] sm:max-w-[230px]">
                          <div className="flex items-center gap-1.5">
                            <Badge variant="secondary" className="text-[10px] font-semibold px-2 py-0.5 rounded-md">
                              {item.category}
                            </Badge>
                            <span className="text-[10px] text-muted-foreground font-semibold uppercase tracking-wider">
                              {item.frequency}
                            </span>
                          </div>

                          {/* Smooth Text Slider for Fiber Internet Subscription and other long titles */}
                          <div className="pt-1">
                            <SmoothTextSlider
                              text={item.name}
                              as="h3"
                              className="text-base font-bold text-foreground tracking-tight leading-snug"
                              maxWidthClass="max-w-[195px] sm:max-w-[220px]"
                            />
                          </div>

                          <div className="text-xs text-muted-foreground flex items-center gap-1 max-w-[200px]">
                            <CreditCard className="w-3 h-3 text-muted-foreground shrink-0" />
                            <SmoothTextSlider
                              text={`Charged: ${item.accountName}`}
                              as="span"
                              className="text-xs text-muted-foreground"
                              maxWidthClass="max-w-[170px]"
                            />
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <div className="text-lg sm:text-xl font-extrabold tracking-tight text-foreground">
                            {formatCurrency(item.amount, item.currency)}
                          </div>
                          <span className="text-[10px] text-muted-foreground">
                            {item.frequency === "MONTHLY" ? "/mo" : item.frequency === "YEARLY" ? "/yr" : "/cycle"}
                          </span>
                        </div>
                      </div>

                      {item.notes && (
                        <div className="pt-2 border-t border-border/30 mt-2">
                          <p
                            className={`text-xs text-muted-foreground/85 transition-all duration-200 leading-relaxed ${
                              isNoteExpanded ? "line-clamp-none" : "line-clamp-2"
                            }`}
                          >
                            {item.notes}
                          </p>
                          {item.notes.length > 60 && (
                            <button
                              type="button"
                              onClick={() => toggleNoteExpansion(item.id)}
                              className="text-[11px] text-primary dark:text-[#9fff59] font-semibold flex items-center gap-0.5 mt-0.5 hover:underline"
                            >
                              {isNoteExpanded ? (
                                <>Less <ChevronUp className="w-3 h-3" /></>
                              ) : (
                                <>Read details <ChevronDown className="w-3 h-3" /></>
                              )}
                            </button>
                          )}
                        </div>
                      )}
                    </CardHeader>

                    <CardContent className="p-5 pt-1 space-y-3">
                      <div className="flex items-center justify-between p-3 bg-muted/30 rounded-xl border border-border/40 text-xs">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Clock className="w-3.5 h-3.5 text-primary dark:text-[#9fff59]" />
                          <span className="text-xs">Next Due: <strong className="text-foreground">{item.nextDate}</strong></span>
                        </div>
                        <Badge
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            isActive
                              ? "bg-emerald-500/15 text-emerald-600 dark:text-[#9fff59] border border-emerald-500/30"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {isActive ? "Active" : "Paused"}
                        </Badge>
                      </div>

                      <div className="flex items-center justify-between pt-1">
                        <span className="text-[11px] text-muted-foreground">
                          Reminder: {item.reminderDays}d prior
                        </span>
                        <Button
                          size="sm"
                          variant={isActive ? "outline" : "secondary"}
                          onClick={() => toggleStatus(item.id)}
                          className="rounded-xl text-xs font-semibold h-8 px-3 transition-transform active:scale-95"
                        >
                          {isActive ? (
                            <>
                              <Pause className="w-3.5 h-3.5 mr-1 text-amber-500" /> Pause Bill
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5 mr-1 text-emerald-500" /> Activate
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Upcoming Payment Schedule with Smooth Scroll Slider */}
        <Card className="border border-border/70 bg-card rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border/60 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Upcoming 30-Day Outflow Schedule</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Anticipated subscription charges sorted by due date to safeguard checking liquidity (scrollable ledger)
              </p>
            </div>
            <Badge variant="outline" className="text-xs px-2.5 py-1 font-semibold rounded-full border-border/70">
              {sortedUpcoming.length} Scheduled
            </Badge>
          </div>

          <div className="max-h-[250px] overflow-y-auto custom-scrollbar divide-y divide-border/40">
            {sortedUpcoming.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No active upcoming recurring charges found.
              </div>
            ) : (
              sortedUpcoming.map((item) => (
                <div
                  key={`sched-${item.id}`}
                  className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary dark:text-[#9fff59] flex items-center justify-center shrink-0">
                      <Calendar className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs sm:text-sm font-bold text-foreground flex items-center gap-2">
                        <SmoothTextSlider
                          text={item.name}
                          as="span"
                          className="font-bold text-foreground"
                          maxWidthClass="max-w-[180px] sm:max-w-[260px]"
                        />
                        <Badge variant="secondary" className="text-[10px] font-semibold py-0 px-1.5 shrink-0">
                          {item.category}
                        </Badge>
                      </div>
                      <SmoothTextSlider
                        text={`Debiting ${item.accountName} • Due on ${item.nextDate}`}
                        as="p"
                        className="text-[11px] text-muted-foreground mt-0.5"
                        maxWidthClass="max-w-[220px] sm:max-w-[340px]"
                      />
                    </div>
                  </div>

                  <div className="text-left sm:text-right">
                    <div className="text-sm sm:text-base font-extrabold text-foreground">
                      {formatCurrency(item.amount, item.currency)}
                    </div>
                    <span className="text-[10px] font-bold text-emerald-600 dark:text-[#9fff59] uppercase tracking-wider">
                      Auto-Debit
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>

      {/* Modal: Add Recurring */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add Recurring Bill</DialogTitle>
            <DialogDescription className="text-xs">
              Keep track of ongoing subscriptions and automatic debits.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="rec-name" className="text-xs font-semibold">Service / Bill Name</Label>
              <Input
                id="rec-name"
                placeholder="e.g. Fiber Internet Subscription, Netflix, Gym"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="rec-amt" className="text-xs font-semibold">Amount ({baseCurrency})</Label>
                <Input
                  id="rec-amt"
                  type="number"
                  step="any"
                  placeholder="29.99"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                  className="rounded-lg text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rec-freq" className="text-xs font-semibold">Billing Frequency</Label>
                <Select value={frequency} onValueChange={(val: any) => setFrequency(val)}>
                  <SelectTrigger id="rec-freq" className="rounded-lg text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MONTHLY">Monthly</SelectItem>
                    <SelectItem value="WEEKLY">Weekly</SelectItem>
                    <SelectItem value="YEARLY">Yearly</SelectItem>
                    <SelectItem value="QUARTERLY">Quarterly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="rec-cat" className="text-xs font-semibold">Category</Label>
                <Select value={category} onValueChange={setCategory}>
                  <SelectTrigger id="rec-cat" className="rounded-lg text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Utilities">Utilities</SelectItem>
                    <SelectItem value="Productivity">Productivity</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                    <SelectItem value="Entertainment">Entertainment</SelectItem>
                    <SelectItem value="Housing">Housing</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="rec-date" className="text-xs font-semibold">Next Charge Date</Label>
                <Input
                  id="rec-date"
                  type="date"
                  value={nextDate}
                  onChange={(e) => setNextDate(e.target.value)}
                  className="rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rec-acc" className="text-xs font-semibold">Payment Account</Label>
              <Input
                id="rec-acc"
                placeholder="e.g. Primary Checking, Credit Card"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="rounded-lg text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="rec-notes" className="text-xs font-semibold">Notes / Details (Optional)</Label>
              <Input
                id="rec-notes"
                placeholder="e.g. 1Gbps plan, Wi-Fi 6 router included..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-lg text-sm"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-lg text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-xs">
                Save Bill
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default RecurringPage;
