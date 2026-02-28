"use client";

import { useState } from "react";
import { useT } from "@/i18n/provider";
import { formatPair, cn } from "@/lib/utils";
import type { ReportDetail } from "@/types/api";
import { ChartImage } from "./ChartImage";

const CHART_ITEMS = [
  { key: "chart_file_url", i18nKey: "candlestick", icon: "M7 12l3-3 3 3 4-4" },
  { key: "radar_file_url", i18nKey: "radar", icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" },
  { key: "sentiment_file_url", i18nKey: "sentiment", icon: "M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" },
  { key: "risk_overlay_file_url", i18nKey: "dxy_vix", icon: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" },
] as const;

type ChartKey = (typeof CHART_ITEMS)[number]["key"];

interface ReportChartGridProps {
  report: ReportDetail;
}

export function ReportChartGrid({ report }: ReportChartGridProps) {
  const { t } = useT();
  const pair = formatPair(report.pair);
  const date = report.date;
  const [activeChart, setActiveChart] = useState<ChartKey>("chart_file_url");

  const activeItem = CHART_ITEMS.find((c) => c.key === activeChart)!;

  return (
    <div className="overflow-hidden rounded-lg border border-dark-border bg-dark-card">
      {/* Tab bar */}
      <div className="flex border-b border-dark-border">
        {CHART_ITEMS.map((item) => {
          const hasChart = !!report[item.key];
          return (
            <button
              key={item.key}
              onClick={() => setActiveChart(item.key)}
              disabled={!hasChart}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 px-3 py-3 text-xs font-medium transition-colors",
                activeChart === item.key
                  ? "border-b-2 border-primary bg-primary-light text-primary"
                  : hasChart
                    ? "text-gray-500 hover:text-gray-300 hover:bg-dark-surface/30"
                    : "cursor-not-allowed text-gray-700"
              )}
            >
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
              </svg>
              <span className="hidden sm:inline">{t(`report.charts.${item.i18nKey}`)}</span>
            </button>
          );
        })}
      </div>

      {/* Active chart */}
      <div className="p-4">
        <ChartImage
          key={activeChart}
          path={report[activeChart]}
          title={`${t(`report.charts.${activeItem.i18nKey}`)} \u2014 ${pair} (${date})`}
          alt={`${t(`report.charts.${activeItem.i18nKey}`)} for ${pair}, ${date}`}
        />
      </div>
    </div>
  );
}
