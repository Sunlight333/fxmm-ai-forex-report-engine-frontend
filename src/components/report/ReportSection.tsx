"use client";

import { useT } from "@/i18n/provider";
import { cn } from "@/lib/utils";

interface ReportSectionProps {
  sectionKey: string;
  content: string;
  className?: string;
}

export function ReportSection({ sectionKey, content, className }: ReportSectionProps) {
  const { t } = useT();
  const title = t(`report.sections.${sectionKey}`);

  return (
    <div
      id={`section-${sectionKey}`}
      className={cn(
        "scroll-mt-16 rounded-xl border border-dark-border bg-dark-card shadow-card p-6",
        className
      )}
    >
      <h3 className="mb-3 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-fg">
        <div className="h-4 w-1 rounded-full bg-primary" />
        {title}
      </h3>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-fg">
        {content}
      </div>
    </div>
  );
}
