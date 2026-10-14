import { useEffect, useState } from "react";
import {
  format,
  subDays,
  subMonths,
  subYears,
  startOfMonth,
  startOfYear,
  endOfDay,
} from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { ChevronDownIcon, CalendarIcon } from "lucide-react";
import type { DateRange } from "react-day-picker";

export const DateRangeEnum = {
  LAST_30_DAYS: "30days",
  LAST_MONTH: "lastMonth",
  LAST_3_MONTHS: "last3Months",
  LAST_YEAR: "lastYear",
  THIS_MONTH: "thisMonth",
  THIS_YEAR: "thisYear",
  ALL_TIME: "allTime",
  CUSTOM: "custom",
} as const;

export type DateRangeEnumType =
  (typeof DateRangeEnum)[keyof typeof DateRangeEnum];

export type DateRangeType = {
  from: Date | null;
  to: Date | null;
  value?: string;
  label: string;
} | null;

type DateRangePreset = {
  label: string;
  value: string;
  getRange: () => DateRangeType;
};

interface DateRangeSelectProps {
  dateRange: DateRangeType;
  setDateRange: (range: DateRangeType) => void;
  defaultRange?: DateRangeEnumType;
  variant?: "dark" | "light";
}

const now = new Date();
const today = endOfDay(now);

const presets: DateRangePreset[] = [
  {
    label: "Last 30 Days",
    value: DateRangeEnum.LAST_30_DAYS,
    getRange: () => ({
      from: subDays(today, 29),
      to: today,
      value: DateRangeEnum.LAST_30_DAYS,
      label: "for Past 30 Days",
    }),
  },
  {
    label: "Last Month",
    value: DateRangeEnum.LAST_MONTH,
    getRange: () => ({
      from: startOfMonth(subMonths(today, 1)),
      to: startOfMonth(today),
      value: DateRangeEnum.LAST_MONTH,
      label: "for Last Month",
    }),
  },
  {
    label: "Last 3 Months",
    value: DateRangeEnum.LAST_3_MONTHS,
    getRange: () => ({
      from: startOfMonth(subMonths(today, 3)),
      to: startOfMonth(today),
      value: DateRangeEnum.LAST_3_MONTHS,
      label: "for Past 3 Months",
    }),
  },
  {
    label: "Last Year",
    value: DateRangeEnum.LAST_YEAR,
    getRange: () => ({
      from: startOfYear(subYears(today, 1)),
      to: startOfYear(today),
      value: DateRangeEnum.LAST_YEAR,
      label: "for Past Year",
    }),
  },
  {
    label: "This Month",
    value: DateRangeEnum.THIS_MONTH,
    getRange: () => ({
      from: startOfMonth(today),
      to: today,
      value: DateRangeEnum.THIS_MONTH,
      label: "for This Month",
    }),
  },
  {
    label: "This Year",
    value: DateRangeEnum.THIS_YEAR,
    getRange: () => ({
      from: startOfYear(today),
      to: today,
      value: DateRangeEnum.THIS_YEAR,
      label: "for This Year",
    }),
  },
  {
    label: "All Time",
    value: DateRangeEnum.ALL_TIME,
    getRange: () => ({
      from: null,
      to: null,
      value: DateRangeEnum.ALL_TIME,
      label: "across All Time",
    }),
  },
];

export const DateRangeSelect = ({
  dateRange,
  setDateRange,
  defaultRange = DateRangeEnum.LAST_30_DAYS,
  variant: _variant = "dark",
}: DateRangeSelectProps) => {
  const [open, setOpen] = useState(false);
  const [showCustom, setShowCustom] = useState(false);
  const [customRange, setCustomRange] = useState<DateRange | undefined>(undefined);

  const hasFullRange = !!(customRange?.from && customRange?.to && customRange.from.getTime() !== customRange.to.getTime());

  const displayText = dateRange
    ? dateRange.value === DateRangeEnum.CUSTOM && dateRange.from
      ? `${format(dateRange.from, "MMM dd, y")} - ${
          dateRange.to ? format(dateRange.to, "MMM dd, y") : "..."
        }`
      : presets.find((p) => p.value === dateRange.value)?.label ||
        (dateRange.from
          ? `${format(dateRange.from, "MMM dd, y")} - ${
              dateRange.to ? format(dateRange.to, "MMM dd, y") : "Present"
            }`
          : "Select a duration")
    : "Select a duration";

  useEffect(() => {
    if (!dateRange) {
      const defaultPreset = presets.find((p) => p.value === defaultRange);
      if (defaultPreset) {
        setDateRange(defaultPreset.getRange());
      }
    }
  }, [dateRange, defaultRange, setDateRange]);

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) setShowCustom(false);
  };

  const handleApplyCustom = () => {
    if (!customRange?.from || !customRange?.to) return;
    setDateRange({
      from: customRange.from,
      to: customRange.to,
      value: DateRangeEnum.CUSTOM,
      label: "Custom Range",
    });
    setOpen(false);
    setShowCustom(false);
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-label={`Select date range: ${displayText}`}
          className={cn(
            "w-[195px] sm:w-[210px] h-9 px-3 flex items-center justify-between text-left font-medium cursor-pointer rounded-xl bg-card hover:bg-muted/50 border border-border text-foreground shadow-xs transition-colors",
            !dateRange && "text-muted-foreground"
          )}
        >
          <div className="flex items-center gap-2 truncate">
            <CalendarIcon className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
            <span className="truncate text-xs sm:text-sm">{displayText}</span>
          </div>
          <ChevronDownIcon className="ml-1.5 h-3.5 w-3.5 text-muted-foreground opacity-60 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[195px] sm:w-[210px] p-1.5 bg-card border border-border shadow-lg rounded-xl" align="start">
        {showCustom ? (
          <div className="p-3 space-y-3">
            <div className="px-1 space-y-0.5">
              <p className="text-sm font-medium text-foreground">Select custom range</p>
              <p className="text-xs text-muted-foreground">
                {!customRange?.from
                  ? "Click a start date"
                  : !customRange?.to || !hasFullRange
                  ? "Now click an end date"
                  : `${format(customRange.from, "MMM dd")} → ${format(customRange.to, "MMM dd, y")}`}
              </p>
            </div>
            <Calendar
              mode="range"
              selected={customRange}
              onSelect={setCustomRange}
              numberOfMonths={2}
              disabled={(date) => date > today}
            />
            <div className="flex gap-2 px-1">
              <Button
                size="sm"
                className="flex-1 h-8 text-xs font-semibold"
                disabled={!hasFullRange}
                onClick={handleApplyCustom}
              >
                Apply
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1 h-8 text-xs font-semibold"
                onClick={() => setShowCustom(false)}
              >
                Back
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid gap-0.5 py-0.5">
            {presets.map((preset) => {
              const isSelected = dateRange?.value === preset.value;
              return (
                <Button
                  key={preset.value}
                  variant="ghost"
                  className={cn(
                    "justify-start text-left text-xs font-medium h-8 px-2.5 rounded-lg transition-colors",
                    isSelected
                      ? "bg-primary/10 text-primary font-semibold hover:bg-primary/15"
                      : "text-foreground hover:bg-muted/70"
                  )}
                  onClick={() => {
                    setDateRange(preset.getRange());
                    setOpen(false);
                  }}
                >
                  {preset.label}
                </Button>
              );
            })}
            <div className="border-t border-border/50 my-1" />
            <Button
              variant="ghost"
              className={cn(
                "justify-start text-left gap-2 text-xs font-medium h-8 px-2.5 rounded-lg transition-colors",
                dateRange?.value === DateRangeEnum.CUSTOM
                  ? "bg-primary/10 text-primary font-semibold hover:bg-primary/15"
                  : "text-foreground hover:bg-muted/70"
              )}
              onClick={() => {
                setCustomRange(undefined);
                setShowCustom(true);
              }}
            >
              <CalendarIcon className="h-3.5 w-3.5" />
              Custom Range
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};
