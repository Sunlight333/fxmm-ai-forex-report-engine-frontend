"use client";

import { cn } from "@/lib/utils";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  change?: { value: number; label?: string };
  className?: string;
}

export function StatsCard({ label, value, icon, badge, change, className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-lg border border-dark-border bg-dark-card px-4 py-3",
        className
      )}
    >
      {icon && (
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs text-gray-500">{label}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <span className="text-lg font-bold text-white">{value}</span>
          {badge}
          {change && (
            <span
              className={cn(
                "text-xs font-medium",
                change.value >= 0 ? "text-demand" : "text-supply"
              )}
            >
              {change.value >= 0 ? "+" : ""}{change.value.toFixed(2)}%
              {change.label && <span className="ml-0.5 text-gray-600">{change.label}</span>}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
