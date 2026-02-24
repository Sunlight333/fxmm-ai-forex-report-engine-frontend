"use client";

import { cn } from "@/lib/utils";

type BadgeVariant =
  | "default"
  | "primary"
  | "tier-retail"
  | "tier-professional"
  | "zone-supply"
  | "zone-demand"
  | "status-active"
  | "status-expired"
  | "status-locked"
  | "success"
  | "warning"
  | "danger"
  | "info";

interface BadgeProps {
  variant?: BadgeVariant;
  className?: string;
  children: React.ReactNode;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: "bg-dark-border text-gray-300",
  primary: "bg-primary-light text-primary",
  "tier-retail": "bg-primary-light text-primary",
  "tier-professional": "bg-amber-900/30 text-amber-400",
  "zone-supply": "bg-supply-light text-supply",
  "zone-demand": "bg-demand-light text-demand",
  "status-active": "bg-green-900/30 text-green-400",
  "status-expired": "bg-gray-800/50 text-gray-400",
  "status-locked": "bg-gray-800/50 text-gray-500",
  success: "bg-green-900/30 text-green-400",
  warning: "bg-amber-900/30 text-amber-400",
  danger: "bg-red-900/30 text-red-400",
  info: "bg-blue-900/30 text-blue-400",
};

export function Badge({ variant = "default", className, children }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
