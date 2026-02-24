"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  colorClass?: string;
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 8,
  className,
  colorClass,
  showLabel = false,
}: ProgressBarProps) {
  const percentage = Math.min((value / max) * 100, 100);

  const getColorClass = () => {
    if (colorClass) return colorClass;
    if (percentage >= 75) return "bg-demand";
    if (percentage >= 50) return "bg-primary";
    if (percentage >= 25) return "bg-warning";
    return "bg-gray-500";
  };

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="h-2 flex-1 rounded-full bg-dark-border">
        <div
          className={cn("h-full rounded-full transition-all", getColorClass())}
          style={{ width: `${percentage}%` }}
          role="progressbar"
          aria-valuenow={value}
          aria-valuemin={0}
          aria-valuemax={max}
        />
      </div>
      {showLabel && (
        <span className="text-xs font-mono text-gray-400">
          {value}/{max}
        </span>
      )}
    </div>
  );
}
