/* eslint-disable @typescript-eslint/no-unused-vars */
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Check, Info, Terminal, X, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";

type AlertVariant = "default" | "destructive" | "success" | "warning" | "info";

interface AppAlertProps {
  isError?: boolean;
  message: string;
  title?: string;
  variant?: AlertVariant;
  position?:
    | "top"
    | "top-right"
    | "top-left"
    | "bottom"
    | "bottom-right"
    | "bottom-left"
    | "center";
  autoHideDuration?: number;
  onDismiss?: () => void;
  className?: string;
  showDismissButton?: boolean;
}

const variantClasses = {
  default:
    "bg-[var(--surface-alt)] text-foreground border border-[var(--surface-border)]",
  destructive:
    "bg-destructive/10 text-destructive border border-destructive/20",
  success:
    "bg-primary/10 text-primary border border-primary/20",
  warning:
    "bg-[var(--surface-alt)] text-foreground border border-[var(--surface-border)]",
  info:
    "bg-[var(--brand-purple-tint)] text-foreground border border-[var(--surface-border)]",
};

const iconMap = {
  default: <Terminal className="h-4 w-4" />,
  destructive: <AlertTriangle className="h-4 w-4" />,
  success: <Check className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
  info: <Info className="h-4 w-4" />,
};

export const AppAlert = ({
  isError = false,
  title = "Notice",
  message,
  variant = "destructive",
  autoHideDuration = 5000,
  onDismiss,
  className,
  showDismissButton = true,
}: AppAlertProps) => {
  const [_, setShowError] = useState(isError);

  useEffect(() => {
    if (isError) {
      setShowError(true);
      if (autoHideDuration > 0) {
        const timer = setTimeout(() => {
          setShowError(false);
          onDismiss?.();
        }, autoHideDuration);
        return () => clearTimeout(timer);
      }
    }
  }, [isError, autoHideDuration, onDismiss]);

  const handleDismiss = () => {
    setShowError(false);
    onDismiss?.();
  };

  return (
    <div className={cn("max-w-[calc(100%-2rem)] w-full", className)}>
      <Alert
        className={cn(
          "relative flex items-start gap-4 pr-12",
          variantClasses[variant]
        )}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            {iconMap[variant]}
            <AlertTitle>{title}</AlertTitle>
          </div>
          <AlertDescription className="text-sm">{message}</AlertDescription>
        </div>
        {showDismissButton && (
          <button
            onClick={handleDismiss}
            className="absolute right-3 top-3 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </button>
        )}
      </Alert>
    </div>
  );
};
