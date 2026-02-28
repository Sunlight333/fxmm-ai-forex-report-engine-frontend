"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

interface ErrorAlertProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorAlert({ message, onRetry, className }: ErrorAlertProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-supply/30 bg-supply-light p-4",
        className
      )}
      role="alert"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm text-supply">{message}</p>
        {onRetry && (
          <Button variant="ghost" size="sm" onClick={onRetry}>
            Retry
          </Button>
        )}
      </div>
    </div>
  );
}
