import React, { useState, useRef, useEffect, useMemo } from "react";
import {
  Landmark,
  Plus,
  ArrowRightLeft,
  Wallet,
  CreditCard,
  PiggyBank,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  Sliders,
  ChevronDown,
  ChevronUp,
  RefreshCw,
} from "lucide-react";
import PageLayout from "@/components/page-layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SmoothTextSlider from "@/components/ui/smooth-text-slider";
import {
  useGetSupportedCurrenciesQuery,
  useGetExchangeRateQuery,
} from "@/features/currency/currencyAPI";
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

export interface AccountItem {
  id: string;
  name: string;
  type: "CHECKING" | "SAVINGS" | "CREDIT" | "CASH";
  balance: number;
  currency: string;
  accountNumberMasked?: string;
  notes?: string;
  isArchived?: boolean;
}

interface AccountTransfer {
  id: string;
  date: string;
  fromAccountId: string;
  toAccountId: string;
  sourceAmount: number;
  destinationAmount: number;
  exchangeRate: number;
  note?: string;
}

const INITIAL_ACCOUNTS: AccountItem[] = [
  {
    id: "acc-1",
    name: "Primary Checking",
    type: "CHECKING",
    balance: 5420.50,
    currency: "USD",
    accountNumberMasked: "••• 4821",
    notes: "Main operational liquid account used for daily payroll income, automatic bill debits, debit transactions, and operational household cash flow.",
  },
  {
    id: "acc-2",
    name: "High-Yield Savings",
    type: "SAVINGS",
    balance: 14850.00,
    currency: "USD",
    accountNumberMasked: "••• 9102",
    notes: "Emergency fund reserve earning 4.85% APY compounding monthly. Maintained strictly for long-term reserves and large milestone down payments.",
  },
  {
    id: "acc-3",
    name: "Physical Cash & Pocket",
    type: "CASH",
    balance: 380.00,
    currency: "USD",
    notes: "Physical cash reserve kept for local farmer markets, physical tips, travel emergency currency, and offline petty cash expenses.",
  },
  {
    id: "acc-4",
    name: "Travel Credit Card",
    type: "CREDIT",
    balance: -840.25,
    currency: "USD",
    accountNumberMasked: "••• 1044",
    notes: "30-day revolving credit line with 3x reward miles on travel & restaurants. Auto-paid in full from checking each cycle.",
  },
];

const INITIAL_TRANSFERS: AccountTransfer[] = [
  {
    id: "tr-1",
    date: "2026-10-01",
    fromAccountId: "acc-1",
    toAccountId: "acc-2",
    sourceAmount: 500,
    destinationAmount: 500,
    exchangeRate: 1.0,
    note: "Automated monthly emergency fund allocation from checking to high-yield reserve",
  },
  {
    id: "tr-2",
    date: "2026-09-25",
    fromAccountId: "acc-1",
    toAccountId: "acc-3",
    sourceAmount: 150,
    destinationAmount: 150,
    exchangeRate: 1.0,
    note: "ATM cash withdrawal for weekend market and pocket spending",
  },
  {
    id: "tr-3",
    date: "2026-09-18",
    fromAccountId: "acc-1",
    toAccountId: "acc-4",
    sourceAmount: 620,
    destinationAmount: 620,
    exchangeRate: 1.0,
    note: "Full statement balance credit card payoff from operational checking",
  },
];

export const AccountsPage: React.FC = () => {
  const [accounts, setAccounts] = useState<AccountItem[]>(() => {
    const saved = localStorage.getItem("monetra_accounts");
    return saved ? JSON.parse(saved) : INITIAL_ACCOUNTS;
  });

  const [transfers, setTransfers] = useState<AccountTransfer[]>(() => {
    const saved = localStorage.getItem("monetra_transfers");
    return saved ? JSON.parse(saved) : INITIAL_TRANSFERS;
  });

  const [viewMode, setViewMode] = useState<"slider" | "grid">("slider");
  const [expandedNotes, setExpandedNotes] = useState<Record<string, boolean>>({});
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);

  const sliderRef = useRef<HTMLDivElement>(null);

  const user = useTypedSelector((state) => state.auth.user);
  const baseCurrency = (user as any)?.baseCurrency || (user as any)?.currency || "USD";

  const { data: currencyData } = useGetSupportedCurrenciesQuery();
  const { data: rateData, refetch: refetchRate } = useGetExchangeRateQuery(
    { from: "USD", to: baseCurrency },
    { skip: baseCurrency === "USD" }
  );
  const usdToBaseRate = baseCurrency === "USD" ? 1.0 : (rateData?.data?.rate ?? 1.0);

  // New Account state
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountItem["type"]>("CHECKING");
  const [initialBalance, setInitialBalance] = useState("");
  const [currency, setCurrency] = useState(baseCurrency);
  const [notes, setNotes] = useState("");

  // Transfer state
  const [fromAccountId, setFromAccountId] = useState("");
  const [toAccountId, setToAccountId] = useState("");
  const [transferAmount, setTransferAmount] = useState("");
  const [transferNote, setTransferNote] = useState("");

  const convertAmount = (amount: number, fromCurrency: string, toCurrency: string) => {
    if (!amount || isNaN(amount)) return 0;
    if (fromCurrency === toCurrency) return amount;
    if (fromCurrency === "USD" && toCurrency === baseCurrency) {
      return amount * usdToBaseRate;
    }
    if (fromCurrency === baseCurrency && toCurrency === "USD" && usdToBaseRate > 0) {
      return amount / usdToBaseRate;
    }
    return amount;
  };

  const getAccountInBase = (acc: AccountItem) => {
    return convertAmount(acc.balance, acc.currency, baseCurrency);
  };

  const currencyOptions = useMemo(() => {
    const list =
      currencyData?.currencies && currencyData.currencies.length > 0
        ? currencyData.currencies
        : [
            { code: "USD", name: "US Dollar", symbol: "$" },
            { code: "EUR", name: "Euro", symbol: "€" },
            { code: "GBP", name: "British Pound", symbol: "£" },
            { code: "INR", name: "Indian Rupee", symbol: "₹" },
            { code: "CAD", name: "Canadian Dollar", symbol: "CA$" },
            { code: "AUD", name: "Australian Dollar", symbol: "A$" },
            { code: "JPY", name: "Japanese Yen", symbol: "¥" },
            { code: "PKR", name: "Pakistani Rupee", symbol: "Rs" },
            { code: "AED", name: "UAE Dirham", symbol: "د.إ" },
          ];
    return list.map((c) => ({
      value: c.code,
      label: `${c.symbol.replace(/₨/g, "Rs")} ${c.code} - ${c.name}`,
    }));
  }, [currencyData]);

  // Listen for reset events from Account Settings
  useEffect(() => {
    const handleReset = () => {
      setAccounts([]);
      setTransfers([]);
    };
    window.addEventListener("monetra_data_reset", handleReset);
    return () => window.removeEventListener("monetra_data_reset", handleReset);
  }, []);

  // Auto-sync accounts to user baseCurrency when changed
  useEffect(() => {
    if (!baseCurrency) return;
    setAccounts((prev) => {
      const needsSync = prev.some((a) => a.currency !== baseCurrency);
      if (needsSync) {
        const synced = prev.map((a) => ({
          ...a,
          currency: baseCurrency,
          balance: Number(convertAmount(a.balance, a.currency, baseCurrency).toFixed(2)),
        }));
        localStorage.setItem("monetra_accounts", JSON.stringify(synced));
        return synced;
      }
      return prev;
    });
  }, [baseCurrency, usdToBaseRate]);

  const handleSyncAccountsToBaseCurrency = () => {
    refetchRate();
    const updated = accounts.map((acc) => ({
      ...acc,
      balance: Number(convertAmount(acc.balance, acc.currency, baseCurrency).toFixed(2)),
      currency: baseCurrency,
    }));
    saveAccounts(updated);
    toast.success(`Accounts synced to ${baseCurrency}! (Rate: 1 USD = ${usdToBaseRate} ${baseCurrency})`);
  };

  const handleSyncSingleAccount = (id: string) => {
    const updated = accounts.map((acc) => {
      if (acc.id !== id) return acc;
      return {
        ...acc,
        balance: Number(convertAmount(acc.balance, acc.currency, baseCurrency).toFixed(2)),
        currency: baseCurrency,
      };
    });
    saveAccounts(updated);
    toast.success(`Account synced to ${baseCurrency}!`);
  };

  const handleRestoreStarterAccounts = () => {
    const starter = [
      {
        id: "acc-1",
        name: "Primary Checking",
        type: "CHECKING" as const,
        balance: 5420.50,
        currency: baseCurrency,
        accountNumberMasked: "••• 4821",
        notes: "Main operational liquid account used for daily payroll income, automatic bill debits, debit transactions, and operational household cash flow.",
      },
      {
        id: "acc-2",
        name: "High-Yield Savings",
        type: "SAVINGS" as const,
        balance: 14850.00,
        currency: baseCurrency,
        accountNumberMasked: "••• 9102",
        notes: "Emergency fund reserve earning 4.85% APY compounding monthly. Maintained strictly for long-term reserves and large milestone down payments.",
      },
      {
        id: "acc-3",
        name: "Physical Cash & Pocket",
        type: "CASH" as const,
        balance: 380.00,
        currency: baseCurrency,
        notes: "Physical cash reserve kept for local farmer markets, physical tips, travel emergency currency, and offline petty cash expenses.",
      },
      {
        id: "acc-4",
        name: "Travel Credit Card",
        type: "CREDIT" as const,
        balance: -840.25,
        currency: baseCurrency,
        accountNumberMasked: "••• 1044",
        notes: "30-day revolving credit line with 3x reward miles on travel & restaurants. Auto-paid in full from checking each cycle.",
      },
    ];
    saveAccounts(starter);
    toast.success(`Starter bank accounts generated in ${baseCurrency}!`);
  };

  const saveAccounts = (newAccs: AccountItem[]) => {
    setAccounts(newAccs);
    localStorage.setItem("monetra_accounts", JSON.stringify(newAccs));
  };

  const saveTransfers = (newTransfers: AccountTransfer[]) => {
    setTransfers(newTransfers);
    localStorage.setItem("monetra_transfers", JSON.stringify(newTransfers));
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

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    const balance = parseFloat(initialBalance) || 0;
    if (!name) {
      toast.error("Account name is required.");
      return;
    }

    const newAcc: AccountItem = {
      id: `acc-${Date.now()}`,
      name,
      type,
      balance,
      currency: currency || baseCurrency,
      notes,
      accountNumberMasked: `••• ${Math.floor(1000 + Math.random() * 9000)}`,
    };

    saveAccounts([...accounts, newAcc]);
    toast.success(`Account "${name}" added!`);
    setIsAddOpen(false);
    setName("");
    setInitialBalance("");
    setNotes("");
  };

  const handleExecuteTransfer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromAccountId || !toAccountId) {
      toast.error("Please select both source and destination accounts.");
      return;
    }
    if (fromAccountId === toAccountId) {
      toast.error("Source and destination accounts must be different.");
      return;
    }
    const amount = parseFloat(transferAmount);
    if (isNaN(amount) || amount <= 0) {
      toast.error("Please enter a valid transfer amount.");
      return;
    }

    const fromAcc = accounts.find((a) => a.id === fromAccountId);
    const toAcc = accounts.find((a) => a.id === toAccountId);
    if (!fromAcc || !toAcc) return;

    // Financial rule: Transfers between personal accounts do NOT create external income/expenses
    const updated = accounts.map((acc) => {
      if (acc.id === fromAccountId) {
        return { ...acc, balance: acc.balance - amount };
      }
      if (acc.id === toAccountId) {
        return { ...acc, balance: acc.balance + amount };
      }
      return acc;
    });

    const newTransfer: AccountTransfer = {
      id: `tr-${Date.now()}`,
      date: new Date().toISOString().split("T")[0],
      fromAccountId,
      toAccountId,
      sourceAmount: amount,
      destinationAmount: amount,
      exchangeRate: 1.0,
      note: transferNote || "Account transfer",
    };

    saveAccounts(updated);
    saveTransfers([newTransfer, ...transfers]);
    toast.success(`Transferred ${formatCurrency(amount, fromAcc.currency)} from ${fromAcc.name} to ${toAcc.name}`);
    setIsTransferOpen(false);
    setTransferAmount("");
    setTransferNote("");
  };

  const netLiquidWorth = accounts.reduce((acc, a) => acc + getAccountInBase(a), 0);

  const getAccountIcon = (t: AccountItem["type"]) => {
    switch (t) {
      case "CHECKING":
        return <Landmark className="w-5 h-5 text-primary" />;
      case "SAVINGS":
        return <PiggyBank className="w-5 h-5 text-emerald-600 dark:text-[#9fff59]" />;
      case "CREDIT":
        return <CreditCard className="w-5 h-5 text-rose-500" />;
      case "CASH":
        return <Wallet className="w-5 h-5 text-amber-500" />;
    }
  };

  const checkingTotal = accounts.filter((a) => a.type === "CHECKING").reduce((s, a) => s + getAccountInBase(a), 0);
  const savingsTotal = accounts.filter((a) => a.type === "SAVINGS").reduce((s, a) => s + getAccountInBase(a), 0);
  const creditTotal = accounts.filter((a) => a.type === "CREDIT").reduce((s, a) => s + getAccountInBase(a), 0);
  const cashTotal = accounts.filter((a) => a.type === "CASH").reduce((s, a) => s + getAccountInBase(a), 0);

  return (
    <PageLayout
      title="Account Management"
      subtitle="Track checking, savings, credit cards, and cash balances with internal transfers"
      addMarginTop
      rightAction={
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSyncAccountsToBaseCurrency}
            className="rounded-lg shadow-sm font-semibold h-9 text-xs sm:text-sm px-3 border-border/70 text-foreground hover:bg-muted gap-1.5"
            title={`Sync and convert bank account balances to ${baseCurrency}`}
          >
            <RefreshCw className="w-3.5 h-3.5 text-primary" />
            <span className="hidden sm:inline">Sync</span> {baseCurrency}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsTransferOpen(true)}
            className="rounded-lg shadow-sm font-semibold h-9 text-xs sm:text-sm px-3"
          >
            <ArrowRightLeft className="w-3.5 h-3.5 mr-1.5" /> Transfer Funds
          </Button>
          <Button
            size="sm"
            onClick={() => setIsAddOpen(true)}
            className="rounded-lg shadow-sm bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-9 text-xs sm:text-sm px-4"
          >
            <Plus className="w-4 h-4 mr-1.5" /> Add Account
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Net Balance Overview: 4 balanced elevated metric cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
          <Card className="border border-border/70 bg-card rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Consolidated Net Worth
            </span>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mt-1">
              {formatCurrency(netLiquidWorth, baseCurrency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 inline" /> {accounts.length} active accounts
            </p>
          </Card>

          <Card className="border border-border/70 bg-card rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Checking & Operating
            </span>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground mt-1">
              {formatCurrency(checkingTotal, baseCurrency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Plus {formatCurrency(cashTotal, baseCurrency)} in cash
            </p>
          </Card>

          <Card className="border border-border/70 bg-card rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              High-Yield Savings
            </span>
            <div className="text-xl sm:text-2xl font-extrabold tracking-tight text-emerald-600 dark:text-[#9fff59] mt-1">
              {formatCurrency(savingsTotal, baseCurrency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Milestone & emergency funds
            </p>
          </Card>

          <Card className="border border-border/70 bg-card rounded-2xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-shadow">
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground block">
              Credit Card Balance
            </span>
            <div className={`text-xl sm:text-2xl font-extrabold tracking-tight mt-1 ${creditTotal < 0 ? "text-rose-500" : "text-foreground"}`}>
              {formatCurrency(creditTotal, baseCurrency)}
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {creditTotal < 0 ? "Revolving statement balance" : "Zero credit liability"}
            </p>
          </Card>
        </div>

        {/* Accounts Header with Slider / Grid Switcher */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-foreground">Tracked Financial Accounts</h2>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {viewMode === "slider"
                  ? "Slide horizontally through personal bank accounts and review full notes"
                  : "Grid overview of all active financial repositories"}
              </p>
            </div>

            {/* Slider Controls & View Switcher */}
            <div className="flex items-center gap-2 self-start sm:self-auto">
              {viewMode === "slider" && accounts.length > 0 && (
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

              {/* View Switcher */}
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

              <Badge variant="outline" className="text-xs px-2.5 py-1 font-semibold rounded-full border-border/70 hidden sm:inline-flex">
                {accounts.length} Account{accounts.length === 1 ? "" : "s"}
              </Badge>
            </div>
          </div>

          {accounts.length === 0 ? (
            <Card className="border border-dashed border-border/70 bg-card/50 rounded-2xl p-10 text-center max-w-lg mx-auto my-6 shadow-xs">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-3.5">
                <Landmark className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-foreground">No bank accounts registered</h3>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1 max-w-sm mx-auto leading-relaxed">
                Connect your personal checking, high-yield savings, cash reserves, and credit lines to track your consolidated liquid net worth.
              </p>
              <div className="flex items-center justify-center gap-2 mt-4">
                <Button
                  onClick={() => setIsAddOpen(true)}
                  className="rounded-xl text-xs font-semibold bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5 shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" /> Add Bank Account
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRestoreStarterAccounts}
                  className="rounded-xl text-xs font-semibold border-border/70 text-foreground hover:bg-muted gap-1.5"
                >
                  Load Starter Accounts ({baseCurrency})
                </Button>
              </div>
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
                {accounts.map((acc) => {
                  const isNoteExpanded = !!expandedNotes[acc.id];

                  return (
                    <Card
                      key={acc.id}
                      className="w-[310px] sm:w-[350px] shrink-0 snap-start border border-border/70 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm"
                    >
                      <CardHeader className="flex flex-row items-start justify-between p-5 pb-3">
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-muted/60 border border-border/40 shrink-0">
                            {getAccountIcon(acc.type)}
                          </div>
                          <div>
                            <SmoothTextSlider
                              text={acc.name}
                              as="h3"
                              className="text-base font-bold text-foreground tracking-tight leading-snug"
                              maxWidthClass="max-w-[170px] sm:max-w-[210px]"
                            />
                            <CardDescription className="text-xs text-muted-foreground mt-0.5">
                              {acc.type} {acc.accountNumberMasked && `• ${acc.accountNumberMasked}`}
                            </CardDescription>
                          </div>
                        </div>
                        <Badge
                          variant={acc.currency === baseCurrency ? "secondary" : "outline"}
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                            acc.currency !== baseCurrency ? "border-amber-500/40 text-amber-500 bg-amber-500/10" : ""
                          }`}
                        >
                          {acc.currency}
                        </Badge>
                      </CardHeader>

                      <CardContent className="p-5 pt-1 space-y-3.5">
                        <div className="p-3.5 bg-muted/30 rounded-xl border border-border/40 space-y-1">
                          <div className="flex justify-between items-baseline gap-2">
                            <span className="text-xs text-muted-foreground font-medium">Available Balance</span>
                            <div className="text-right">
                              <span className={`text-xl sm:text-2xl font-extrabold tracking-tight ${acc.balance < 0 ? "text-rose-500" : "text-foreground"}`}>
                                {formatCurrency(getAccountInBase(acc), baseCurrency)}
                              </span>
                              {acc.currency !== baseCurrency && (
                                <div className="text-[10px] text-muted-foreground flex items-center justify-end gap-1.5 mt-0.5">
                                  <span>Orig: {formatCurrency(acc.balance, acc.currency)}</span>
                                  <button
                                    type="button"
                                    onClick={() => handleSyncSingleAccount(acc.id)}
                                    className="text-primary font-semibold hover:underline"
                                  >
                                    Sync to {baseCurrency}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Long note with smooth toggle expander slider */}
                          {acc.notes && (
                            <div className="pt-1.5 border-t border-border/30 mt-1">
                              <p
                                className={`text-xs text-muted-foreground/85 transition-all duration-200 leading-relaxed ${
                                  isNoteExpanded ? "line-clamp-none" : "line-clamp-2"
                                }`}
                              >
                                {acc.notes}
                              </p>
                              {acc.notes.length > 70 && (
                                <button
                                  type="button"
                                  onClick={() => toggleNoteExpansion(acc.id)}
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

                        <div className="flex items-center justify-between pt-0.5">
                          <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                            Active & Synced
                          </span>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setFromAccountId(acc.id);
                              setIsTransferOpen(true);
                            }}
                            className="text-xs text-primary hover:text-primary font-semibold h-8 px-2.5 rounded-lg hover:bg-primary/10"
                          >
                            <ArrowRightLeft className="w-3 h-3 mr-1" /> Transfer
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
              {accounts.map((acc) => {
                const isNoteExpanded = !!expandedNotes[acc.id];

                return (
                  <Card
                    key={acc.id}
                    className="border border-border/70 bg-card hover:border-primary/50 hover:shadow-lg transition-all duration-300 rounded-2xl flex flex-col justify-between overflow-hidden shadow-sm"
                  >
                    <CardHeader className="flex flex-row items-start justify-between p-5 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-muted/60 border border-border/40 shrink-0">
                          {getAccountIcon(acc.type)}
                        </div>
                        <div>
                          <SmoothTextSlider
                            text={acc.name}
                            as="h3"
                            className="text-base font-bold text-foreground tracking-tight leading-snug"
                            maxWidthClass="max-w-[170px] sm:max-w-[210px]"
                          />
                          <CardDescription className="text-xs text-muted-foreground mt-0.5">
                            {acc.type} {acc.accountNumberMasked && `• ${acc.accountNumberMasked}`}
                          </CardDescription>
                        </div>
                      </div>
                      <Badge
                        variant={acc.currency === baseCurrency ? "secondary" : "outline"}
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-md ${
                          acc.currency !== baseCurrency ? "border-amber-500/40 text-amber-500 bg-amber-500/10" : ""
                        }`}
                      >
                        {acc.currency}
                      </Badge>
                    </CardHeader>

                    <CardContent className="p-5 pt-1 space-y-3.5">
                      <div className="p-3.5 bg-muted/30 rounded-xl border border-border/40 space-y-1">
                        <div className="flex justify-between items-baseline gap-2">
                          <span className="text-xs text-muted-foreground font-medium">Available Balance</span>
                          <div className="text-right">
                            <span className={`text-xl sm:text-2xl font-extrabold tracking-tight ${acc.balance < 0 ? "text-rose-500" : "text-foreground"}`}>
                              {formatCurrency(getAccountInBase(acc), baseCurrency)}
                            </span>
                            {acc.currency !== baseCurrency && (
                              <div className="text-[10px] text-muted-foreground flex items-center justify-end gap-1.5 mt-0.5">
                                <span>Orig: {formatCurrency(acc.balance, acc.currency)}</span>
                                <button
                                  type="button"
                                  onClick={() => handleSyncSingleAccount(acc.id)}
                                  className="text-primary font-semibold hover:underline"
                                >
                                  Sync to {baseCurrency}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>

                        {acc.notes && (
                          <div className="pt-1.5 border-t border-border/30 mt-1">
                            <p
                              className={`text-xs text-muted-foreground/85 transition-all duration-200 leading-relaxed ${
                                isNoteExpanded ? "line-clamp-none" : "line-clamp-2"
                              }`}
                            >
                              {acc.notes}
                            </p>
                            {acc.notes.length > 70 && (
                              <button
                                type="button"
                                onClick={() => toggleNoteExpansion(acc.id)}
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

                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[11px] text-muted-foreground font-medium flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                          Active & Synced
                        </span>

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setFromAccountId(acc.id);
                            setIsTransferOpen(true);
                          }}
                          className="text-xs text-primary hover:text-primary font-semibold h-8 px-2.5 rounded-lg hover:bg-primary/10"
                        >
                          <ArrowRightLeft className="w-3 h-3 mr-1" /> Transfer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent Internal Transfers History Section with Scroll Slider */}
        <Card className="border border-border/70 bg-card rounded-2xl shadow-sm overflow-hidden">
          <div className="p-5 border-b border-border/60 flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-foreground">Recent Internal Transfers</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Fund relocations and rebalances between personal accounts (scrollable slider ledger)
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsTransferOpen(true)}
                className="text-xs font-semibold rounded-lg h-8"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> New Transfer
              </Button>
            </div>
          </div>

          <div className="max-h-[250px] overflow-y-auto custom-scrollbar divide-y divide-border/40">
            {transfers.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No internal account transfers recorded yet.
              </div>
            ) : (
              transfers.map((tr) => {
                const source = accounts.find((a) => a.id === tr.fromAccountId);
                const destination = accounts.find((a) => a.id === tr.toAccountId);
                return (
                  <div key={tr.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-muted/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary dark:text-[#9fff59] flex items-center justify-center shrink-0">
                        <ArrowRightLeft className="w-4 h-4" />
                      </div>
                      <div>
                        <SmoothTextSlider
                          text={`${source?.name || "Source"} → ${destination?.name || "Destination"}`}
                          as="div"
                          className="font-bold text-foreground text-xs sm:text-sm"
                          maxWidthClass="max-w-[200px] sm:max-w-[300px]"
                        />
                        <SmoothTextSlider
                          text={`${tr.note || "Transfer"} • ${tr.date}`}
                          as="p"
                          className="text-[11px] text-muted-foreground mt-0.5"
                          maxWidthClass="max-w-[200px] sm:max-w-[300px]"
                        />
                      </div>
                    </div>

                    <div className="text-left sm:text-right">
                      <div className="text-sm sm:text-base font-extrabold text-foreground">
                        {formatCurrency(tr.sourceAmount, source?.currency || baseCurrency)}
                      </div>
                      <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">
                        Rebalanced
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>

      {/* Modal: Add Account */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Add Account</DialogTitle>
            <DialogDescription className="text-xs">
              Create a tracked account for managing balances and transfers.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreateAccount} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="acc-name" className="text-xs font-semibold">Account Name</Label>
              <Input
                id="acc-name"
                placeholder="e.g. Chase Total Checking"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="rounded-lg text-sm"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="acc-type" className="text-xs font-semibold">Account Type</Label>
                <Select value={type} onValueChange={(val: any) => setType(val)}>
                  <SelectTrigger id="acc-type" className="rounded-lg text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CHECKING">Checking</SelectItem>
                    <SelectItem value="SAVINGS">Savings</SelectItem>
                    <SelectItem value="CASH">Cash</SelectItem>
                    <SelectItem value="CREDIT">Credit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="acc-balance" className="text-xs font-semibold">Starting Balance</Label>
                <Input
                  id="acc-balance"
                  type="number"
                  step="any"
                  placeholder="0.00"
                  value={initialBalance}
                  onChange={(e) => setInitialBalance(e.target.value)}
                  className="rounded-lg text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="acc-currency" className="text-xs font-semibold">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger id="acc-currency" className="rounded-lg text-xs">
                    <SelectValue placeholder="Select currency" />
                  </SelectTrigger>
                  <SelectContent className="max-h-60">
                    {currencyOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="acc-notes" className="text-xs font-semibold">Notes (Optional)</Label>
                <Input
                  id="acc-notes"
                  placeholder="Operational..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="rounded-lg text-sm"
                />
              </div>
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} className="rounded-lg text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-xs">
                Save Account
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Modal: Transfer Funds */}
      <Dialog open={isTransferOpen} onOpenChange={setIsTransferOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold">Transfer Between Accounts</DialogTitle>
            <DialogDescription className="text-xs">
              Move money between your accounts without affecting net income or expense totals.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleExecuteTransfer} className="space-y-4 pt-2">
            <div className="space-y-1.5">
              <Label htmlFor="from-account" className="text-xs font-semibold">From Account</Label>
              <Select value={fromAccountId} onValueChange={setFromAccountId}>
                <SelectTrigger id="from-account" className="rounded-lg text-xs">
                  <SelectValue placeholder="Select source account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name} ({formatCurrency(a.balance, a.currency)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="to-account" className="text-xs font-semibold">To Account</Label>
              <Select value={toAccountId} onValueChange={setToAccountId}>
                <SelectTrigger id="to-account" className="rounded-lg text-xs">
                  <SelectValue placeholder="Select destination account" />
                </SelectTrigger>
                <SelectContent>
                  {accounts.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.name} ({formatCurrency(a.balance, a.currency)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="transfer-amt" className="text-xs font-semibold">Transfer Amount</Label>
              <Input
                id="transfer-amt"
                type="number"
                placeholder="100.00"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                required
                className="rounded-lg text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="transfer-note" className="text-xs font-semibold">Transfer Memo</Label>
              <Input
                id="transfer-note"
                placeholder="e.g. Monthly savings allocation"
                value={transferNote}
                onChange={(e) => setTransferNote(e.target.value)}
                className="rounded-lg text-sm"
              />
            </div>

            <DialogFooter className="pt-2">
              <Button type="button" variant="outline" onClick={() => setIsTransferOpen(false)} className="rounded-lg text-xs">
                Cancel
              </Button>
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg text-xs">
                Execute Transfer
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </PageLayout>
  );
};

export default AccountsPage;
