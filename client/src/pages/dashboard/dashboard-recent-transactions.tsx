import { Link } from "react-router-dom";
import TransactionTable from "@/components/transaction/transaction-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { PROTECTED_ROUTES } from "@/routes/common/routePath";
import { useGetAllTransactionsQuery } from "@/features/transaction/transactionAPI";

const DashboardRecentTransactions = () => {
  const { data, isFetching } = useGetAllTransactionsQuery({
    pageSize: 10,
    pageNumber: 1,
  });

  return (
    <Card className="border border-border/70 bg-card rounded-2xl shadow-xs hover:shadow-md transition-all duration-300 overflow-hidden">
      <CardHeader className="!pb-0 px-5 pt-5">
        <CardTitle className="text-lg font-bold tracking-tight text-foreground font-display">Recent Transactions</CardTitle>
        <CardDescription className="text-xs text-muted-foreground">Showing your latest recorded financial activity</CardDescription>
        <CardAction>
          <Button
            asChild
            variant="ghost"
            size="sm"
            className="text-xs font-semibold text-primary hover:text-primary/90 hover:bg-primary/10 rounded-xl"
          >
            <Link to={PROTECTED_ROUTES.TRANSACTIONS}>View all transactions →</Link>
          </Button>
        </CardAction>
        <Separator className="mt-4 bg-border/60" />
      </CardHeader>
      <CardContent className="pt-2 px-3 sm:px-5 pb-5">
        <TransactionTable
          data={data?.transactions ?? []}
          isLoading={isFetching}
          pageSize={10}
          isShowPagination={false}
        />
      </CardContent>
    </Card>
  );
};

export default DashboardRecentTransactions;
