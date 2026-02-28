"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { reports } from "@/lib/api";
import { useT } from "@/i18n/provider";
import { formatPair, truncate } from "@/lib/utils";
import type { ReportSummary } from "@/types/api";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";

export default function ReportsIndexPage() {
  const { t } = useT();
  const [items, setItems] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    reports
      .byDate(today)
      .then((data) => setItems(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports"))
      .finally(() => setLoading(false));
  }, []);

  const stateVariant = (state: string | null): "success" | "warning" | "danger" | "info" | "default" => {
    if (!state) return "default";
    const s = state.toLowerCase();
    if (s.includes("bull") || s.includes("up")) return "success";
    if (s.includes("bear") || s.includes("down")) return "danger";
    if (s.includes("range") || s.includes("consol")) return "warning";
    return "info";
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <h1 className="text-lg font-bold text-foreground">{t("nav.reports")}</h1>
        <p className="mt-1 text-sm text-muted-fg">
          {new Date().toLocaleDateString(undefined, { weekday: "long", year: "numeric", month: "long", day: "numeric" })}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-xl border border-supply/30 bg-supply/10 p-4 text-center">
          <p className="text-sm text-supply">{error}</p>
        </div>
      ) : items.length === 0 ? (
        <div className="rounded-xl border border-dark-border bg-dark-card shadow-card p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
          <p className="mt-3 text-sm text-muted-fg">{t("common.noData")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((r) => (
            <Link
              key={r.id}
              href={`/reports/${r.pair}/${r.id}`}
              className="group rounded-xl border border-dark-border bg-dark-card shadow-card p-5 transition-colors hover:border-primary/40 hover:bg-dark-hover"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-foreground">
                  {formatPair(r.pair)}
                </span>
                {r.market_state && (
                  <Badge variant={stateVariant(r.market_state)} className="text-[10px]">
                    {r.market_state}
                  </Badge>
                )}
              </div>
              {r.executive_summary && (
                <p className="mt-2 text-xs leading-relaxed text-muted-fg">
                  {truncate(r.executive_summary, 120)}
                </p>
              )}
              <div className="mt-3 flex items-center justify-between text-[10px] text-subtle">
                <span>{new Date(r.created_at).toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}</span>
                <span className="text-primary opacity-0 transition-opacity group-hover:opacity-100">
                  View Report &rarr;
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
