import { DateRangeSelect, DateRangeType } from "@/components/date-range-select";
import AddTransactionDrawer from "@/components/transaction/add-transaction-drawer";

interface Props {
  title: string;
  subtitle: string;
  dateRange?: DateRangeType;
  setDateRange?: (range: DateRangeType) => void;
}

const DashboardHeader = ({ title, subtitle, dateRange, setDateRange }: Props) => {
  return (
    <div className="flex flex-col lg:flex-row items-start justify-between gap-4">
      <div className="space-y-0.5">
        <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">{subtitle}</p>
      </div>
      <div className="flex flex-row items-center gap-2 w-full lg:w-auto">
        <DateRangeSelect
          dateRange={dateRange || null}
          setDateRange={(range) => setDateRange?.(range)}
        />
        <AddTransactionDrawer />
      </div>
    </div>
  );
};

export default DashboardHeader;
