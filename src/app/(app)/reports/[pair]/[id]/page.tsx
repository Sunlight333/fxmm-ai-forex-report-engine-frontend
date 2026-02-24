"use client";

import { useParams } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";
import { useApi } from "@/lib/hooks/use-api";
import { reports, zones as zonesApi } from "@/lib/api";
import type { ReportDetail, Zone } from "@/types/api";
import { ReportHeader } from "@/components/report/ReportHeader";
import { ReportChartGrid } from "@/components/report/ReportChartGrid";
import { ReportSection } from "@/components/report/ReportSection";
import { SectionNavigation } from "@/components/report/SectionNavigation";
import { ZoneTable } from "@/components/report/ZoneTable";
import { ReportSkeleton } from "@/components/report/ReportSkeleton";
import { ErrorAlert } from "@/components/feedback/ErrorAlert";
import { Card } from "@/components/ui/Card";

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

export default function ReportByIdPage() {
  const params = useParams();
  const { user } = useAuth();
  const { t } = useT();
  const pair = params.pair as string;
  const id = params.id as string;

  const { data: report, loading, error, refetch } = useApi<ReportDetail>(
    () => reports.byId(id),
    [id]
  );

  const { data: zoneData } = useApi<Zone[]>(
    () => report ? zonesApi.byReport(report.id) : Promise.resolve([]),
    [report?.id]
  );

  if (loading) return <ReportSkeleton />;
  if (error) return <ErrorAlert message={error} onRetry={refetch} />;
  if (!report) return null;

  const sections = report.full_narrative?.sections || {};
  const availableSections = SECTION_ORDER.filter((k) => sections[k]);

  return (
    <div className="animate-fade-in">
      <ReportHeader report={report} />

      <div className="mb-6">
        <ReportChartGrid report={report} />
      </div>

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

      <div className="flex gap-6">
        <aside className="hidden w-48 shrink-0 lg:block">
          <div className="sticky top-20">
            <SectionNavigation availableSections={availableSections} />
          </div>
        </aside>
        <div className="min-w-0 flex-1 space-y-4">
          {availableSections.map((key) => (
            <ReportSection key={key} sectionKey={key} content={sections[key]} />
          ))}
        </div>
      </div>
    </div>
  );
}
