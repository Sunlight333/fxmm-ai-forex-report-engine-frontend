"use client";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/Card";

interface StatsCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  badge?: React.ReactNode;
  className?: string;
}

export function StatsCard({ label, value, icon, badge, className }: StatsCardProps) {
  return (
    <Card padding="compact" className={cn("flex items-start gap-4", className)}>
      {icon && (
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary-light text-primary">
          {icon}
        </div>
      )}
      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <div className="mt-1 flex items-center gap-2">
          <span className="text-2xl font-bold text-white">{value}</span>
          {badge}
        </div>
      </div>
    </Card>
  );
}
