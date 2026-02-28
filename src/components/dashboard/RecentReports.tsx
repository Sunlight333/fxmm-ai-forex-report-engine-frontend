"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { reports } from "@/lib/api";
import { useT } from "@/i18n/provider";
import { formatPair, cn } from "@/lib/utils";
import type { ReportSummary } from "@/types/api";
import { Badge } from "@/components/ui/Badge";

export function RecentReports() {
  const { t } = useT();
  const [items, setItems] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    reports
      .byDate(today)
      .then((data) => setItems(data.slice(0, 6)))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const stateVariant = (state: string | null): "success" | "warning" | "info" | "default" => {
    if (!state) return "default";
    const s = state.toLowerCase();
    if (s.includes("bull") || s.includes("up")) return "success";
    if (s.includes("bear") || s.includes("down")) return "danger" as "warning";
    if (s.includes("range") || s.includes("consol")) return "warning";
    return "info";
  };

  return (
    <div className="rounded-lg border border-dark-border bg-dark-card">
      <div className="flex items-center justify-between border-b border-dark-border px-4 py-3">
        <h3 className="text-sm font-semibold text-white">{t("nav.reports")}</h3>
        <span className="text-[10px] text-gray-600">
          {new Date().toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>
      </div>

      {loading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-dark-surface" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <p className="px-4 py-6 text-center text-xs text-gray-600">
          {t("common.noData")}
        </p>
      ) : (
        <div className="divide-y divide-dark-border">
          {items.map((r) => (
            <Link
              key={r.id}
              href={`/reports/${r.pair}/${r.id}`}
              className="flex items-center justify-between px-4 py-2.5 transition-colors hover:bg-dark-hover"
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold text-white">
                  {formatPair(r.pair)}
                </span>
                {r.market_state && (
                  <Badge variant={stateVariant(r.market_state)} className="text-[10px]">
                    {r.market_state}
                  </Badge>
                )}
              </div>
              <svg className="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
              </svg>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
