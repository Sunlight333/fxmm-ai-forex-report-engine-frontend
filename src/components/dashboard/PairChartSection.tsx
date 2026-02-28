"use client";

import { useState, useEffect, useCallback } from "react";
import { reports } from "@/lib/api";
import { formatPair, cn } from "@/lib/utils";
import type { ReportDetail } from "@/types/api";
import { ChartImage } from "@/components/report/ChartImage";
import { SkeletonChart } from "@/components/ui/Skeleton";

const CHART_TABS = [
  { key: "candlestick", label: "Candlestick", field: "chart_file_url" },
  { key: "radar", label: "Radar", field: "radar_file_url" },
  { key: "sentiment", label: "Sentiment", field: "sentiment_file_url" },
  { key: "dxy_vix", label: "DXY / VIX", field: "risk_overlay_file_url" },
] as const;

type ChartField = (typeof CHART_TABS)[number]["field"];

interface PairChartSectionProps {
  subscribedPairs: string[];
  loading?: boolean;
}

export function PairChartSection({ subscribedPairs, loading: subsLoading }: PairChartSectionProps) {
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ChartField>("chart_file_url");
  const [reportCache, setReportCache] = useState<Record<string, ReportDetail>>({});
  const [fetchingPair, setFetchingPair] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (subscribedPairs.length > 0 && !selectedPair) {
      setSelectedPair(subscribedPairs[0]);
    }
  }, [subscribedPairs, selectedPair]);

  const fetchReport = useCallback(async (pair: string) => {
    if (reportCache[pair]) return;
    setFetchingPair(pair);
    setError(null);
    try {
      const data = await reports.latest(pair);
      setReportCache((prev) => ({ ...prev, [pair]: data }));
    } catch {
      setError("No report available");
    } finally {
      setFetchingPair(null);
    }
  }, [reportCache]);

  useEffect(() => {
    if (selectedPair) fetchReport(selectedPair);
  }, [selectedPair, fetchReport]);

  if (subsLoading) {
    return (
      <div className="rounded-xl border border-dark-border bg-dark-card shadow-card">
        <div className="border-b border-dark-border px-5 py-3.5">
          <h3 className="text-sm font-semibold text-foreground">Report Charts</h3>
        </div>
        <div className="p-4"><SkeletonChart /></div>
      </div>
    );
  }

  if (subscribedPairs.length === 0) {
    return (
      <div className="rounded-xl border border-dark-border bg-dark-card shadow-card">
        <div className="border-b border-dark-border px-5 py-3.5">
          <h3 className="text-sm font-semibold text-foreground">Report Charts</h3>
        </div>
        <p className="px-4 py-8 text-center text-xs text-subtle">
          Unlock a pair to view its analysis charts
        </p>
      </div>
    );
  }

  const report = selectedPair ? reportCache[selectedPair] : null;
  const isLoading = fetchingPair === selectedPair;
  const activeTabInfo = CHART_TABS.find((t) => t.field === activeTab)!;

  return (
    <div className="rounded-xl border border-dark-border bg-dark-card shadow-card">
      {/* Header with pair pills inline */}
      <div className="flex flex-wrap items-center gap-2 border-b border-dark-border px-5 py-3.5">
        <h3 className="mr-2 text-sm font-semibold text-foreground">Report Charts</h3>
        {subscribedPairs.map((pair) => (
          <button
            key={pair}
            onClick={() => {
              setSelectedPair(pair);
              setActiveTab("chart_file_url");
            }}
            className={cn(
              "rounded-lg px-2.5 py-1 text-[11px] font-semibold transition-colors",
              selectedPair === pair
                ? "bg-primary text-white"
                : "bg-dark-surface text-muted-fg hover:bg-dark-hover hover:text-foreground"
            )}
          >
            {formatPair(pair)}
          </button>
        ))}
        {report && (
          <span className="ml-auto text-[10px] text-subtle">{report.date}</span>
        )}
      </div>

      {/* Chart type tabs — pill style */}
      <div className="flex gap-1 border-b border-dark-border px-5 py-2">
        {CHART_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.field)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium transition-colors",
              activeTab === tab.field
                ? "bg-primary-light text-primary"
                : "text-muted-fg hover:bg-dark-hover hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart display */}
      <div className="p-4">
        {isLoading ? (
          <SkeletonChart />
        ) : error && !report ? (
          <div className="flex aspect-video items-center justify-center rounded-xl border border-dark-border bg-dark-surface">
            <p className="text-sm text-muted-fg">{error}</p>
          </div>
        ) : report ? (
          <ChartImage
            key={`${report.pair}-${activeTab}`}
            path={report[activeTab]}
            title={`${activeTabInfo.label} \u2014 ${formatPair(report.pair)}`}
            alt={`${activeTabInfo.label} chart for ${formatPair(report.pair)}, ${report.date}`}
          />
        ) : (
          <SkeletonChart />
        )}
      </div>
    </div>
  );
}
