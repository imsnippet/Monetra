import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, Heart, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface SupportModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const TRC20_ADDRESS = "TAneq9f7QbigXjqANj6UxUrW83hm1vGCSV";

export const SupportModal = ({ isOpen, onOpenChange }: SupportModalProps) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(TRC20_ADDRESS);
      setCopied(true);
      toast.success("USDT (TRC20) address copied!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Failed to copy address");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl p-6 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
        <DialogHeader className="text-left space-y-3">
          <div className="flex items-center gap-3">
            <span className="text-3xl leading-none select-none" role="img" aria-label="coffee">
              ☕
            </span>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-zinc-300 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
              Secure Transfer
            </div>
          </div>

          <DialogTitle className="text-lg sm:text-xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Support Independent Development
          </DialogTitle>

          <DialogDescription className="text-sm text-zinc-600 dark:text-zinc-400 leading-normal">
            If Monetra helps you manage your finances, support independent development. Contributions help keep the project open and actively maintained.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <div className="p-3.5 rounded-xl bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-zinc-500 dark:text-zinc-400 font-medium">
                Network: <span className="font-semibold text-zinc-900 dark:text-zinc-200">USDT (TRC20)</span>
              </span>
              <span className="text-[11px] text-zinc-500 dark:text-zinc-400">
                Tron Blockchain
              </span>
            </div>

            <div
              onClick={handleCopy}
              className="flex items-center justify-between gap-2 p-2.5 bg-white dark:bg-zinc-900 rounded-lg border border-zinc-300 dark:border-zinc-700/80 hover:border-zinc-400 dark:hover:border-zinc-600 transition-colors cursor-pointer"
              title="Click to copy address"
            >
              <span className="font-mono text-xs sm:text-[13px] font-medium text-zinc-800 dark:text-zinc-200 truncate select-all">
                {TRC20_ADDRESS}
              </span>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className={`h-7 px-2.5 text-xs font-medium shrink-0 transition-colors ${
                  copied
                    ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900 border-transparent"
                    : "border-zinc-300 dark:border-zinc-700"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCopy();
                }}
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="w-3 h-3 mr-1" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            <p className="text-[11px] text-zinc-500 dark:text-zinc-500">
              Please send only USDT via the TRC-20 network to this address.
            </p>
          </div>

          <div className="flex items-center justify-between pt-1 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1">
              Crafted with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> by imsnippet
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onOpenChange(false)}
              className="h-8 px-3 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
