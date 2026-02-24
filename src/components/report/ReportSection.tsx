"use client";

import { useT } from "@/i18n/provider";
import { Card } from "@/components/ui/Card";
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
    <Card
      id={`section-${sectionKey}`}
      padding="default"
      className={cn("scroll-mt-20", className)}
    >
      <h3 className="mb-3 text-base font-semibold text-white">
        {title}
      </h3>
      <div className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">
        {content}
      </div>
    </Card>
  );
}
