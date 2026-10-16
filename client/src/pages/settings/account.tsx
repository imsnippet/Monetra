import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { AccountForm } from "./_components/account-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { useDeleteUserMutation } from "@/features/user/userAPI";
import { useResetAllTransactionsMutation } from "@/features/transaction/transactionAPI";
import { apiClient } from "@/app/api-client";
import { useAppDispatch } from "@/app/hook";
import { logout } from "@/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { PUBLIC_ROUTES } from "@/routes/common/routePath";
import { toast } from "sonner";
import { RotateCcw, AlertTriangle, Loader2, Trash2 } from "lucide-react";

const Account = () => {
  // Delete account modal state
  const [isOpen, setIsOpen] = useState(false);
  const [confirmText, setConfirmText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  // Reset workspace state
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [resetConfirmText, setResetConfirmText] = useState("");
  const [isResetting, setIsResetting] = useState(false);

  const [deleteUser] = useDeleteUserMutation();
  const [resetAllTransactions] = useResetAllTransactionsMutation();


  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // ── RESET ALL WORKSPACE EXPENSES & RECORDS ──────────────────────────────────
  const handleResetWorkspace = async () => {
    if (resetConfirmText.trim() !== "CONFIRM") {
      toast.error("Please type CONFIRM to authorize reset");
      return;
    }

    try {
      setIsResetting(true);
      await resetAllTransactions().unwrap();

      // Reset all local storage stores
      localStorage.setItem("monetra_savings_goals", JSON.stringify([]));
      localStorage.setItem("monetra_recurring_payments", JSON.stringify([]));
      localStorage.setItem("monetra_accounts", JSON.stringify([]));
      localStorage.setItem("monetra_transfers", JSON.stringify([]));

      // Dispatch event so active pages re-sync their state immediately
      window.dispatchEvent(new Event("monetra_data_reset"));
      window.dispatchEvent(new Event("storage"));

      // Reset RTK Query cache so all views instantly reflect a clean fresh workspace
      dispatch(apiClient.util.resetApiState());

      toast.success("Workspace reset: all transactions, budgets, bills, and accounts cleared.");
      setIsResetOpen(false);
      setResetConfirmText("");
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data?: { message?: string } }).data?.message === "string"
          ? (err as { data?: { message?: string } }).data?.message
          : "Failed to reset workspace";
      toast.error(message);
    } finally {
      setIsResetting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (confirmText.trim() !== "DELETE") {
      toast.error("Type DELETE to confirm");
      return;
    }

    try {
      setIsDeleting(true);
      await deleteUser({ otp: "DELETE" }).unwrap();
      dispatch(logout());
      navigate(PUBLIC_ROUTES.HOME);
      toast.success("Account deleted successfully");
    } catch (err: unknown) {
      const message =
        typeof err === "object" &&
        err !== null &&
        "data" in err &&
        typeof (err as { data?: { message?: string } }).data?.message === "string"
          ? (err as { data?: { message?: string } }).data?.message
          : "Failed to delete account";
      toast.error(message);
    } finally {
      setIsDeleting(false);
      setIsOpen(false);
      setConfirmText("");
    }
  };


  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Account Settings</h3>
        <p className="text-sm text-muted-foreground">
          Manage your personal profile, preferred currency, and system settings.
        </p>
      </div>

      <Separator />

      <AccountForm />

      <Separator />

      {/* ── THIN, SLEEK DANGER ZONE ────────────────────────────────────────── */}
      <div className="rounded-2xl border border-destructive/20 bg-card p-5 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-1 border-b border-border/50">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
              <AlertTriangle className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Danger Zone</h4>
              <p className="text-xs text-muted-foreground">
                Irreversible actions that affect your stored records and account.
              </p>
            </div>
          </div>
        </div>

        {/* Action 1: Reset Workspace Expenses */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="space-y-0.5 max-w-md">
            <p className="text-xs font-semibold text-foreground">Reset Workspace & Expenses</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Clear all recorded transactions, categories, budgets, and savings goals to start fresh.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsResetOpen(true)}
            className="rounded-xl h-8.5 text-xs font-semibold border-destructive/30 text-destructive hover:bg-destructive hover:text-destructive-foreground transition-colors shrink-0 gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Workspace
          </Button>
        </div>

        <Separator className="opacity-50" />

        {/* Action 2: Permanent Account Removal */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5 max-w-md">
            <p className="text-xs font-semibold text-foreground">Delete Account</p>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Permanently close your account and remove all personal identification records.
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsOpen(true)}
            className="rounded-xl h-8.5 text-xs font-semibold text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0 gap-1.5"
          >
            <Trash2 className="w-3.5 h-3.5" /> Delete Account
          </Button>
        </div>
      </div>

      {/* ── DIALOG: RESET WORKSPACE ────────────────────────────────────────── */}
      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent className="sm:max-w-[440px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-destructive flex items-center gap-2">
              <RotateCcw className="w-4 h-4" /> Reset Workspace
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
              This action will permanently delete all your transactions, expenses, budgets, recurring bills, and savings milestones. Your workspace will be restored to an empty, fresh state.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-2.5 py-3">
            <p className="text-xs font-medium text-foreground">
              To proceed, please type <span className="text-destructive font-mono font-bold">CONFIRM</span> below:
            </p>
            <input
              value={resetConfirmText}
              onChange={(e) => setResetConfirmText(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-destructive/50"
              placeholder="Type CONFIRM to proceed"
              autoFocus
            />
          </div>

          <DialogFooter className="gap-2 sm:gap-0 pt-1">
            <DialogClose asChild>
              <Button variant="ghost" className="rounded-xl text-xs">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleResetWorkspace}
              disabled={resetConfirmText.trim() !== "CONFIRM" || isResetting}
              className="rounded-xl text-xs font-semibold gap-1.5"
            >
              {isResetting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Resetting...
                </>
              ) : (
                "Confirm Workspace Reset"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── DIALOG: DELETE ACCOUNT ────────────────────────────────────────── */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[420px] rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-base font-bold">Delete Account</DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground pt-1">
              This action is permanent and cannot be undone. Type <strong>DELETE</strong> below to confirm.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-2 space-y-2.5">
            <input
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm font-mono placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-destructive/50"
              placeholder="Type DELETE to confirm"
              autoFocus
            />
          </div>


          <DialogFooter className="gap-2 sm:gap-0 pt-2">
            <DialogClose asChild>
              <Button variant="ghost" className="rounded-xl text-xs">
                Cancel
              </Button>
            </DialogClose>

            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="rounded-xl text-xs font-semibold"
            >
              {isDeleting ? "Deleting..." : "Permanently Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Account;
