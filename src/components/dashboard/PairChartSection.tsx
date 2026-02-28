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
      <div className="rounded-lg border border-dark-border bg-dark-card">
        <div className="border-b border-dark-border px-4 py-3">
          <h3 className="text-sm font-semibold text-white">Report Charts</h3>
        </div>
        <div className="p-4"><SkeletonChart /></div>
      </div>
    );
  }

  if (subscribedPairs.length === 0) {
    return (
      <div className="rounded-lg border border-dark-border bg-dark-card">
        <div className="border-b border-dark-border px-4 py-3">
          <h3 className="text-sm font-semibold text-white">Report Charts</h3>
        </div>
        <p className="px-4 py-8 text-center text-xs text-gray-600">
          Unlock a pair to view its analysis charts
        </p>
      </div>
    );
  }

  const report = selectedPair ? reportCache[selectedPair] : null;
  const isLoading = fetchingPair === selectedPair;
  const activeTabInfo = CHART_TABS.find((t) => t.field === activeTab)!;

  return (
    <div className="rounded-lg border border-dark-border bg-dark-card">
      {/* Header with pair pills inline */}
      <div className="flex flex-wrap items-center gap-2 border-b border-dark-border px-4 py-3">
        <h3 className="mr-2 text-sm font-semibold text-white">Report Charts</h3>
        {subscribedPairs.map((pair) => (
          <button
            key={pair}
            onClick={() => {
              setSelectedPair(pair);
              setActiveTab("chart_file_url");
            }}
            className={cn(
              "rounded-md px-2 py-0.5 text-[11px] font-semibold transition-colors",
              selectedPair === pair
                ? "bg-primary text-white"
                : "bg-dark-surface text-gray-500 hover:bg-dark-hover hover:text-gray-300"
            )}
          >
            {formatPair(pair)}
          </button>
        ))}
        {report && (
          <span className="ml-auto text-[10px] text-gray-600">{report.date}</span>
        )}
      </div>

      {/* Chart type tabs */}
      <div className="flex border-b border-dark-border">
        {CHART_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.field)}
            className={cn(
              "px-4 py-2 text-xs font-medium transition-colors",
              activeTab === tab.field
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-300"
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
          <div className="flex aspect-video items-center justify-center rounded-lg border border-dark-border bg-dark-surface">
            <p className="text-sm text-gray-500">{error}</p>
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
