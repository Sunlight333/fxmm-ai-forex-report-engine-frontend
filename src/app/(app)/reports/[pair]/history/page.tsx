"use client";

import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { useT } from "@/i18n/provider";
import { useApi } from "@/lib/hooks/use-api";
import { reports } from "@/lib/api";
import { formatPair, truncate } from "@/lib/utils";
import type { ReportSummary } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Skeleton } from "@/components/ui/Skeleton";

export default function ReportHistoryPage() {
  const params = useParams();
  const router = useRouter();
  const { t } = useT();
  const pair = params.pair as string;

  const { data, loading } = useApi<ReportSummary[]>(
    () => reports.history(pair, 50),
    [pair]
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t("history.title", { pair: formatPair(pair) })}
        action={
          <Button variant="secondary" size="sm" onClick={() => router.push(`/reports/${pair}`)}>
            {t("report.latestReport")}
          </Button>
        }
      />

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-20 rounded-xl" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <EmptyState
          title={t("history.noReports")}
          action={{
            label: t("errors.goHome"),
            onClick: () => router.push("/dashboard"),
          }}
        />
      ) : (
        <div className="space-y-3">
          {data.map((report) => (
            <Card
              key={report.id}
              padding="compact"
              className="cursor-pointer transition-colors hover:border-dark-hover"
            >
              <button
                className="w-full text-left"
                onClick={() => router.push(`/reports/${pair}/${report.id}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-foreground">
                      {format(new Date(report.date + "T12:00:00"), "MMMM d, yyyy")}
                    </span>
                    {report.market_state && (
                      <Badge variant="primary">{report.market_state}</Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-fg">
                    {format(new Date(report.created_at), "HH:mm")}
                  </span>
                </div>
                {report.executive_summary && (
                  <p className="mt-2 text-sm text-muted-fg">
                    {truncate(report.executive_summary, 200)}
                  </p>
                )}
              </button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
