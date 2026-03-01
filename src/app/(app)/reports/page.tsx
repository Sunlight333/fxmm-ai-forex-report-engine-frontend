"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { reports } from "@/lib/api";
import { useT } from "@/i18n/provider";
import { formatPair, truncate } from "@/lib/utils";
import type { ReportSummary } from "@/types/api";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";

type SortField = "name" | "date" | "type";
type SortDir = "asc" | "desc";

export default function ReportsIndexPage() {
  const { t } = useT();
  const [items, setItems] = useState<ReportSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  /* ── Sort & filter state ── */
  const [sortField, setSortField] = useState<SortField>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [filterPair, setFilterPair] = useState("");
  const [filterType, setFilterType] = useState("");

  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    reports
      .byDate(today)
      .then((data) => setItems(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load reports"))
      .finally(() => setLoading(false));
  }, []);

  /* ── Derive unique market state values for the type filter ── */
  const marketStateOptions = useMemo(() => {
    const states = new Set<string>();
    items.forEach((r) => {
      if (r.market_state) states.add(r.market_state);
    });
    return Array.from(states).sort();
  }, [items]);

  /* ── Filter + sort ── */
  const filtered = useMemo(() => {
    let result = [...items];

    // Text filter on pair name
    if (filterPair.trim()) {
      const q = filterPair.trim().toLowerCase();
      result = result.filter((r) => r.pair.toLowerCase().includes(q) || formatPair(r.pair).toLowerCase().includes(q));
    }

    // Type filter on market_state
    if (filterType) {
      result = result.filter((r) => r.market_state === filterType);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "name":
          cmp = a.pair.localeCompare(b.pair);
          break;
        case "date":
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
          break;
        case "type":
          cmp = (a.market_state || "").localeCompare(b.market_state || "");
          break;
      }
      return sortDir === "asc" ? cmp : -cmp;
    });

    return result;
  }, [items, filterPair, filterType, sortField, sortDir]);

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

      {/* ── Sort & Filter Toolbar ── */}
      {!loading && !error && items.length > 0 && (
        <div className="mb-4 flex flex-wrap items-center gap-3">
          {/* Pair search */}
          <div className="relative flex-1 min-w-[160px] max-w-[260px]">
            <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            <input
              type="text"
              value={filterPair}
              onChange={(e) => setFilterPair(e.target.value)}
              placeholder={t("reportList.filterPair")}
              className="w-full rounded-xl border border-dark-border bg-dark-surface py-2 pl-9 pr-3 text-sm text-foreground shadow-card placeholder:text-subtle focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Type filter */}
          {marketStateOptions.length > 0 && (
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-xl border border-dark-border bg-dark-surface px-3 py-2 text-sm text-foreground shadow-card focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">{t("reportList.allTypes")}</option>
              {marketStateOptions.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Sort field */}
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-subtle sm:inline">{t("reportList.sortBy")}</span>
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="rounded-xl border border-dark-border bg-dark-surface px-3 py-2 text-sm text-foreground shadow-card focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="name">{t("reportList.sortName")}</option>
              <option value="date">{t("reportList.sortDate")}</option>
              <option value="type">{t("reportList.sortType")}</option>
            </select>
          </div>

          {/* Sort direction toggle */}
          <button
            onClick={() => setSortDir((d) => (d === "asc" ? "desc" : "asc"))}
            className="flex items-center gap-1.5 rounded-xl border border-dark-border bg-dark-surface px-3 py-2 text-sm text-foreground shadow-card transition-colors hover:bg-dark-hover focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30"
            title={sortDir === "asc" ? t("reportList.ascending") : t("reportList.descending")}
          >
            <svg
              className={`h-4 w-4 transition-transform ${sortDir === "desc" ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4.5h14.25M3 9h9.75M3 13.5h5.25m8.25 3V3.75m0 0L13.5 6.75m3-3 3 3" />
            </svg>
            <span className="hidden text-xs sm:inline">
              {sortDir === "asc" ? t("reportList.ascending") : t("reportList.descending")}
            </span>
          </button>
        </div>
      )}

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
      ) : filtered.length === 0 ? (
        <div className="rounded-xl border border-dark-border bg-dark-card shadow-card p-8 text-center">
          <svg className="mx-auto h-10 w-10 text-subtle" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
          </svg>
          <p className="mt-3 text-sm text-muted-fg">{t("reportList.noResults")}</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((r) => (
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
