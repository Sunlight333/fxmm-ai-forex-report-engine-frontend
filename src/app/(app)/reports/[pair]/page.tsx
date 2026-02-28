"use client";

import { useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";
import { useApi } from "@/lib/hooks/use-api";
import { reports, zones as zonesApi } from "@/lib/api";
import type { ReportDetail, Zone } from "@/types/api";
import { formatPair } from "@/lib/utils";
import { ReportHeader } from "@/components/report/ReportHeader";
import { ReportChartGrid } from "@/components/report/ReportChartGrid";
import { ReportSection } from "@/components/report/ReportSection";
import { SectionNavigation } from "@/components/report/SectionNavigation";
import { ZoneTable } from "@/components/report/ZoneTable";
import { ReportSkeleton } from "@/components/report/ReportSkeleton";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

const SECTION_ORDER = [
  "market_state",
  "executive_summary",
  "continuity_update",
  "upcoming_events",
  "current_session",
  "multi_timeframe_structure",
  "key_zones_demand",
  "key_zones_supply",
  "annotated_chart",
  "market_positioning",
  "risk_context",
  "structural_invalidation",
  "contextual_recommendation",
];

export default function ReportPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const { t } = useT();
  const pair = params.pair as string;

  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState<string | null>(null);

  const { data: report, loading, error, refetch } = useApi<ReportDetail>(
    () => reports.latest(pair),
    [pair]
  );

  const { data: zoneData } = useApi<Zone[]>(
    () => report ? zonesApi.byReport(report.id) : Promise.resolve([]),
    [report?.id]
  );

  const handleGenerate = useCallback(async () => {
    setGenerating(true);
    setGenError(null);
    try {
      await reports.generate(pair);
      await refetch();
    } catch (err) {
      setGenError(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setGenerating(false);
    }
  }, [pair, refetch]);

  const isStale = report && report.date !== new Date().toISOString().slice(0, 10);
  const hasNoCharts = report && !report.chart_file_url && !report.radar_file_url;

  if (loading || generating) {
    return (
      <>
        {generating && (
          <Card className="mx-auto mb-4 max-w-md text-center">
            <p className="text-sm text-brand-cyan">{t("report.generating")}</p>
          </Card>
        )}
        <ReportSkeleton />
      </>
    );
  }

  if (error) {
    if (error.includes("403") || error.includes("access") || error.includes("subscription")) {
      return (
        <Card className="mx-auto mt-12 max-w-md text-center">
          <h2 className="mb-2 text-lg font-semibold text-foreground">{formatPair(pair)}</h2>
          <p className="mb-4 text-sm text-muted-fg">{t("report.accessDenied")}</p>
          <Link href="/credits">
            <Button variant="primary">{t("report.unlockNow")}</Button>
          </Link>
        </Card>
      );
    }

    if (error.includes("404") || error.includes("No report") || error.includes("not found")) {
      return (
        <Card className="mx-auto mt-12 max-w-md text-center">
          <h2 className="mb-2 text-lg font-semibold text-foreground">{formatPair(pair)}</h2>
          <p className="mb-4 text-sm text-muted-fg">{t("report.noReport")}</p>
          {genError && (
            <p className="mb-4 text-sm text-red-400">{genError}</p>
          )}
          <Button variant="primary" onClick={handleGenerate}>
            {t("report.generateNow")}
          </Button>
        </Card>
      );
    }

    return <ErrorAlert message={error} onRetry={refetch} />;
  }

  if (!report) return null;

  const sections = report.full_narrative?.sections || {};
  const availableSections = SECTION_ORDER.filter((k) => sections[k]);

  return (
    <div className="animate-fade-in">
      {(isStale || hasNoCharts) && (
        <Card className="mb-4 flex items-center justify-between">
          <p className="text-sm text-muted-fg">
            {isStale
              ? t("report.staleReport")
              : t("report.missingCharts")}
          </p>
          {genError && <p className="text-sm text-red-400">{genError}</p>}
          <Button variant="primary" size="sm" onClick={handleGenerate}>
            {t("report.generateNow")}
          </Button>
        </Card>
      )}
      <ReportHeader report={report} />

      {/* Charts */}
      <div className="mb-6">
        <ReportChartGrid report={report} />
      </div>

      {/* Zones */}
      {zoneData && zoneData.length > 0 && (
        <div className="mb-6 grid gap-4 grid-cols-1 lg:grid-cols-2">
          <Card padding="compact">
            <h3 className="mb-3 text-base font-semibold text-demand">
              {t("report.sections.key_zones_demand")}
            </h3>
            <ZoneTable zones={zoneData} pair={pair} type="demand" />
          </Card>
          <Card padding="compact">
            <h3 className="mb-3 text-base font-semibold text-supply">
              {t("report.sections.key_zones_supply")}
            </h3>
            <ZoneTable zones={zoneData} pair={pair} type="supply" />
          </Card>
        </div>
      )}

      {/* Narrative sections with sticky nav */}
      <div className="flex gap-6">
        {/* Sidebar nav (desktop only) */}
        <aside className="hidden w-48 shrink-0 lg:block">
          <div className="sticky top-20">
            <SectionNavigation availableSections={availableSections} />
          </div>
        </aside>

        {/* Sections */}
        <div className="min-w-0 flex-1 space-y-4">
          {availableSections.map((key) => (
            <ReportSection key={key} sectionKey={key} content={sections[key]} />
          ))}
        </div>
      </div>
    </div>
  );
}
