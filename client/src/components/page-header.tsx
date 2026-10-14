import { Fragment, ReactNode } from "react";
import { cn } from "@/lib/utils";

interface PageHeaderProps {
  title?: string;
  subtitle?: string;
  rightAction?: ReactNode;
  renderPageHeader?: ReactNode;
  className?: string;
}

const PageHeader = ({ title, subtitle, rightAction, renderPageHeader, className }: PageHeaderProps) => {
  return (
    <div className="w-full pt-5 pb-20 bg-background border-b border-border/60">
      <div className={cn("w-full max-w-[var(--max-width)] mx-auto px-4 sm:px-6", className)}>
        {renderPageHeader ? (
          <Fragment>{renderPageHeader}</Fragment>
        ) : (
          <div className="w-full flex flex-col gap-3 items-start justify-start lg:items-center lg:flex-row lg:justify-between">
            {(title || subtitle) && (
              <div className="space-y-1">
                {title && <h1 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">{title}</h1>}
                {subtitle && <p className="text-muted-foreground text-sm">{subtitle}</p>}
              </div>
            )}
            {rightAction && rightAction}
          </div>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
