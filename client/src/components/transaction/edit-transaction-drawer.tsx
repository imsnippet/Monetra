import { Suspense, lazy } from "react";
import { Loader } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import useEditTransactionDrawer from "@/hooks/use-edit-transaction-drawer";

// The transaction form (with the voice recorder + receipt scanner) is heavy and
// only needed once a drawer is opened, so it's code-split out of the app shell.
const TransactionForm = lazy(() => import("./transaction-form"));

const FormFallback = () => (
  <div className="flex items-center justify-center py-16">
    <Loader className="h-5 w-5 animate-spin text-muted-foreground" />
  </div>
);

const EditTransactionDrawer = () => {
  const { open, transactionId, onCloseDrawer } = useEditTransactionDrawer();
  return (
    <Drawer open={open} onOpenChange={onCloseDrawer} direction="right">
      <DrawerContent className="max-w-md h-full flex flex-col">
        <DrawerHeader className="flex-shrink-0">
          <DrawerTitle className="text-xl font-semibold">
            Edit Transaction
          </DrawerTitle>
          <DrawerDescription>
            Edit a transaction to track your finances
          </DrawerDescription>
        </DrawerHeader>
        <div className="flex-1 overflow-y-auto">
          {open && (
            <Suspense fallback={<FormFallback />}>
              <TransactionForm
                isEdit
                transactionId={transactionId}
                onCloseDrawer={onCloseDrawer}
              />
            </Suspense>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default EditTransactionDrawer;
