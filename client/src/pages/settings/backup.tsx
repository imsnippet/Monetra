import React, { useState, useRef } from "react";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  useLazyGetAllTransactionsQuery,
  useBulkImportTransactionMutation,
} from "@/features/transaction/transactionAPI";
import { apiClient } from "@/app/api-client";
import { useAppDispatch } from "@/app/hook";
import { toast } from "sonner";
import {
  Download,
  Upload,
  Database,
  FileCheck2,
  ShieldCheck,
  Loader2,
  HardDrive,
} from "lucide-react";


const BackupPage: React.FC = () => {
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [triggerGetTransactions] = useLazyGetAllTransactionsQuery();
  const [bulkImportTransaction] = useBulkImportTransactionMutation();
  const dispatch = useAppDispatch();

  // Load savings goals count from localStorage for status display
  const localGoals = (() => {
    try {
      return JSON.parse(localStorage.getItem("monetra_savings_goals") || "[]");
    } catch {
      return [];
    }
  })();

  const handleExportData = async () => {
    try {
      setIsExporting(true);
      const res = await triggerGetTransactions({ pageNumber: 1, pageSize: 10000 }).unwrap();
      const transactions = res.transactions || [];
      const savingsGoals = (() => {
        try {
          return JSON.parse(localStorage.getItem("monetra_savings_goals") || "[]");
        } catch {
          return [];
        }
      })();

      const exportPayload = {
        version: 1,
        system: "Monetra Financial Platform",
        exportedAt: new Date().toISOString(),
        totalTransactions: transactions.length,
        totalSavingsGoals: savingsGoals.length,
        transactions,
        savingsGoals,
      };

      const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
        JSON.stringify(exportPayload, null, 2)
      )}`;
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", jsonString);
      downloadAnchor.setAttribute(
        "download",
        `monetra-financial-backup-${new Date().toISOString().split("T")[0]}.json`
      );
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      toast.success("Snapshot created and exported successfully!");
    } catch (err) {
      console.error("Export error:", err);
      toast.error("Failed to generate data export");
    } finally {
      setIsExporting(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsImporting(true);
      const fileText = await file.text();
      const parsed = JSON.parse(fileText);

      // Restore savings goals if present
      let goalsRestored = 0;
      if (Array.isArray(parsed.savingsGoals)) {
        localStorage.setItem(
          "monetra_savings_goals",
          JSON.stringify(parsed.savingsGoals)
        );
        goalsRestored = parsed.savingsGoals.length;
      }

      // Restore transactions if present
      const txs = Array.isArray(parsed.transactions)
        ? parsed.transactions
        : Array.isArray(parsed)
        ? parsed
        : [];

      if (txs.length > 0) {
        const mappedTxs = txs.map((t: any) => ({
          title: t.title || "Restored Transaction",
          type: t.type === "INCOME" ? "INCOME" : "EXPENSE",
          amount: Number(t.amount) || 0,
          description: t.description || "",
          category: t.category || "General",
          date: t.date ? new Date(t.date).toISOString() : new Date().toISOString(),
          isRecurring: Boolean(t.isRecurring),
          paymentMethod: t.paymentMethod || "CASH",
        }));

        await bulkImportTransaction({ transactions: mappedTxs }).unwrap();
      }

      dispatch(apiClient.util.resetApiState());
      toast.success(
        `Backup restored: ${txs.length} transaction(s) and ${goalsRestored} goal(s) synced.`
      );
    } catch (err) {
      console.error("Import error:", err);
      toast.error("Invalid or corrupted backup JSON file");
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">Data & Backup</h3>
        <p className="text-sm text-muted-foreground">
          Safely preserve, export, or restore your complete financial workspace records.
        </p>
      </div>

      <Separator />

      {/* Snapshot Health / Metric Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="border border-border/70 bg-card rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <Database className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Workspace Status</p>
                <p className="text-sm font-bold text-foreground">Active & Synchronized</p>
              </div>
            </div>
            <Badge variant="outline" className="text-[11px] font-semibold text-emerald-600 dark:text-[#9fff59] border-emerald-500/30">
              Healthy
            </Badge>
          </CardContent>
        </Card>

        <Card className="border border-border/70 bg-card rounded-2xl shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                <HardDrive className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground font-medium">Dedicated Portfolios</p>
                <p className="text-sm font-bold text-foreground">
                  {localGoals.length} Savings Goal{localGoals.length === 1 ? "" : "s"}
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="text-[11px] font-semibold">
              Client Encrypted
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Export & Import Cards */}
      <div className="space-y-4 pt-1">
        {/* Export Card */}
        <Card className="border border-border/70 bg-card hover:border-primary/40 transition-colors rounded-2xl shadow-xs">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Download className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Export All Workspace Records</h4>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-md leading-relaxed">
                  Download a complete, unencrypted JSON backup file containing all your expenses, transactions, categories, budgets, and savings goals.
                </p>
              </div>
            </div>

            <Button
              onClick={handleExportData}
              disabled={isExporting}
              className="rounded-xl h-9 text-xs font-semibold px-4 shrink-0 bg-primary hover:bg-primary/90 text-primary-foreground gap-1.5"
            >
              {isExporting ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <FileCheck2 className="w-3.5 h-3.5" />
              )}
              {isExporting ? "Generating..." : "Export Snapshot (JSON)"}
            </Button>
          </CardContent>
        </Card>

        {/* Import Card */}
        <Card className="border border-border/70 bg-card hover:border-primary/40 transition-colors rounded-2xl shadow-xs">
          <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-foreground">Restore from Backup Snapshot</h4>
                <p className="text-xs text-muted-foreground mt-0.5 max-w-md leading-relaxed">
                  Upload a previously exported JSON backup file to seamlessly repopulate your financial transactions and dedicated savings goals.
                </p>
              </div>
            </div>

            <div>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={isImporting}
                className="rounded-xl h-9 text-xs font-semibold px-4 shrink-0 gap-1.5"
              >
                {isImporting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                {isImporting ? "Importing..." : "Choose File (.json)"}
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept=".json,application/json"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Security & Reliability Note */}
      <Card className="border border-border/60 bg-muted/30 rounded-2xl p-4">
        <div className="flex items-start gap-3">
          <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
          <div className="space-y-0.5 text-xs text-muted-foreground leading-relaxed">
            <p className="font-semibold text-foreground flex items-center gap-1.5">
              Zero Vendor Lock-in & Complete Privacy
            </p>
            <p>
              Your exported data is formatted in standard JSON and can be imported into any compatible analytical platform or spreadsheet processor at any time.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default BackupPage;
