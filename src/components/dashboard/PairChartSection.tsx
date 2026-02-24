"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { reports } from "@/lib/api";
import { formatPair, cn } from "@/lib/utils";
import type { ReportDetail } from "@/types/api";
import { Card } from "@/components/ui/Card";
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
  /** True while the parent is still loading subscription data */
  loading?: boolean;
}

export function PairChartSection({ subscribedPairs, loading: subsLoading }: PairChartSectionProps) {
  const [selectedPair, setSelectedPair] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<ChartField>("chart_file_url");
  const [reportCache, setReportCache] = useState<Record<string, ReportDetail>>({});
  const [fetchingPair, setFetchingPair] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Auto-select first subscribed pair once available
  useEffect(() => {
    if (subscribedPairs.length > 0 && !selectedPair) {
      setSelectedPair(subscribedPairs[0]);
    }
  }, [subscribedPairs, selectedPair]);

  const fetchReport = useCallback(async (pair: string) => {
    // Skip if already cached
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
    if (selectedPair) {
      fetchReport(selectedPair);
    }
  }, [selectedPair, fetchReport]);

  // While subscriptions are loading, show skeleton
  if (subsLoading) {
    return (
      <Card padding="compact">
        <h3 className="mb-3 text-sm font-semibold text-white">Report Charts</h3>
        <SkeletonChart />
      </Card>
    );
  }

  if (subscribedPairs.length === 0) {
    return (
      <Card padding="compact">
        <h3 className="mb-3 text-sm font-semibold text-white">Report Charts</h3>
        <p className="py-6 text-center text-xs text-gray-600">
          Unlock a pair to view its analysis charts
        </p>
      </Card>
    );
  }

  const report = selectedPair ? reportCache[selectedPair] : null;
  const isLoading = fetchingPair === selectedPair;
  const activeTabInfo = CHART_TABS.find((t) => t.field === activeTab)!;

  return (
    <Card padding="compact">
      {/* Header */}
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Report Charts</h3>
        {report && (
          <span className="text-[10px] text-gray-600">
            {report.date}
          </span>
        )}
      </div>

      {/* Pair selector pills */}
      <div className="mb-3 flex flex-wrap gap-1.5">
        {subscribedPairs.map((pair) => (
          <button
            key={pair}
            onClick={() => {
              setSelectedPair(pair);
              setActiveTab("chart_file_url");
            }}
            className={cn(
              "rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
              selectedPair === pair
                ? "bg-accent text-white"
                : "bg-dark-surface text-gray-400 hover:bg-dark-border hover:text-gray-300"
            )}
          >
            {formatPair(pair)}
          </button>
        ))}
      </div>

      {/* Chart type tabs */}
      <div className="mb-3 flex border-b border-dark-border">
        {CHART_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.field)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium transition-colors",
              activeTab === tab.field
                ? "border-b-2 border-accent text-accent"
                : "text-gray-500 hover:text-gray-300"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Chart display — skeleton while loading, keeps layout stable */}
      {isLoading ? (
        <SkeletonChart />
      ) : error && !report ? (
        <div className="flex aspect-video items-center justify-center rounded-lg border border-dark-border bg-dark-surface">
          <p className="text-sm text-gray-500">{error}</p>
        </div>
      ) : report ? (
        <ChartImage
          key={`${report.pair}-${activeTab}`}
          path={report[activeTab]}
          title={`${activeTabInfo.label} — ${formatPair(report.pair)}`}
          alt={`${activeTabInfo.label} chart for ${formatPair(report.pair)}, ${report.date}`}
        />
      ) : (
        <SkeletonChart />
      )}
    </Card>
  );
}
