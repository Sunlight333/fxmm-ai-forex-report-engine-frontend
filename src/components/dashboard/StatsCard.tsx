"use client";

import { cn } from "@/lib/utils";

type ColorScheme = "blue" | "emerald" | "amber" | "rose";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  change?: { value: number; label?: string };
  colorScheme?: ColorScheme;
  className?: string;
}

const gradientClasses: Record<ColorScheme, string> = {
  blue: "from-blue-500 to-indigo-500",
  emerald: "from-emerald-500 to-emerald-600",
  amber: "from-amber-500 to-amber-600",
  rose: "from-rose-500 to-rose-600",
};

export function StatsCard({ label, value, icon, badge, change, colorScheme = "blue", className }: StatsCardProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-dark-border bg-dark-card px-5 py-4 shadow-card",
        className
      )}
    >
      {icon && (
        <div className={cn(
          "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white",
          gradientClasses[colorScheme]
        )}>
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-medium uppercase tracking-wide text-muted-fg">{label}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-xl font-bold text-foreground">{value}</span>
          {badge}
          {change && (
            <span
              className={cn(
                "text-xs font-medium",
                change.value >= 0 ? "text-demand" : "text-supply"
              )}
            >
              {change.value >= 0 ? "+" : ""}{change.value.toFixed(2)}%
              {change.label && <span className="ml-0.5 text-subtle">{change.label}</span>}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
