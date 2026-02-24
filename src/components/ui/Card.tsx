"use client";

import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: "default" | "compact" | "none";
  children: React.ReactNode;
}

interface CardHeaderProps {
  className?: string;
  title?: string;
  action?: React.ReactNode;
  children?: React.ReactNode;
}

interface CardFooterProps {
  className?: string;
  children: React.ReactNode;
}

const paddingClasses = {
  default: "p-6",
  compact: "p-4",
  none: "p-0",
};

export function Card({ className, padding = "default", children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-dark-border bg-dark-card",
        paddingClasses[padding],
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ className, title, action, children }: CardHeaderProps) {
  if (children) {
    return (
      <div className={cn("mb-4 flex items-center justify-between", className)}>
        {children}
      </div>
    );
  }

  return (
    <div className={cn("mb-4 flex items-center justify-between", className)}>
      {title && <h3 className="text-lg font-semibold text-white">{title}</h3>}
      {action && <div>{action}</div>}
    </div>
  );
}

export function CardFooter({ className, children }: CardFooterProps) {
  return (
    <div
      className={cn(
        "mt-4 border-t border-dark-border pt-4",
        className
      )}
    >
      {children}
    </div>
  );
}
