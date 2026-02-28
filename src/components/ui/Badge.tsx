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
  default: "bg-[var(--badge-default-bg)] text-[var(--badge-default-text)]",
  primary: "bg-primary-light text-primary",
  "tier-retail": "bg-primary-light text-primary",
  "tier-professional": "bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)]",
  "zone-supply": "bg-supply-light text-supply",
  "zone-demand": "bg-demand-light text-demand",
  "status-active": "bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]",
  "status-expired": "bg-[var(--badge-default-bg)] text-[var(--badge-default-text)]",
  "status-locked": "bg-[var(--badge-default-bg)] text-subtle",
  success: "bg-[var(--badge-success-bg)] text-[var(--badge-success-text)]",
  warning: "bg-[var(--badge-warning-bg)] text-[var(--badge-warning-text)]",
  danger: "bg-[var(--badge-danger-bg)] text-[var(--badge-danger-text)]",
  info: "bg-[var(--badge-info-bg)] text-[var(--badge-info-text)]",
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
