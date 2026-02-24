"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { format } from "date-fns";
import { formatPair, resolveChartUrl, cn } from "@/lib/utils";
import { useT } from "@/i18n/provider";
import { quotes as quotesApi } from "@/lib/api";
import { usePdfDownload } from "@/lib/hooks/use-pdf-download";
import type { ReportDetail } from "@/types/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface ReportHeaderProps {
  report: ReportDetail;
  showPdfButton?: boolean;
}

interface LiveQuote {
  price: number;
  change: number;
  percent_change: number;
  high: number;
  low: number;
}

export function ReportHeader({ report, showPdfButton = true }: ReportHeaderProps) {
  const { t } = useT();
  const pdfUrl = resolveChartUrl(report.pdf_file_url);
  const [liveQuote, setLiveQuote] = useState<LiveQuote | null>(null);
  const { download: savePdf, downloading } = usePdfDownload();

  const fetchQuote = useCallback(async () => {
    try {
      const data = await quotesApi.snapshot();
      const q = data.quotes[report.pair];
      if (q) setLiveQuote(q);
    } catch {
      // Non-critical
    }
  }, [report.pair]);

  useEffect(() => {
    fetchQuote();
    const interval = setInterval(fetchQuote, 60_000);
    return () => clearInterval(interval);
  }, [fetchQuote]);

  const isJpy = report.pair.includes("JPY");
  const decimals = isJpy ? 3 : 5;
  const isPositive = liveQuote ? liveQuote.change >= 0 : null;

  const pdfFilename = `FXMM_${report.pair.slice(0, 3)}-${report.pair.slice(3)}_Daily_Report_${report.date}.pdf`;

  return (
    <div className="mb-8 rounded-xl border border-dark-border bg-dark-card overflow-hidden">
      {/* Top bar */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {formatPair(report.pair)}
            </h1>
            {report.market_state && (
              <Badge variant="info">{report.market_state}</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-gray-500">
            {format(new Date(report.date), "EEEE, MMMM d, yyyy")}
          </p>

          {/* Metadata */}
          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-600">
            {report.llm_model && (
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="font-mono text-gray-400">{report.llm_model}</span>
              </span>
            )}
            {report.llm_tokens_used != null && (
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                <span className="font-mono text-gray-400">{report.llm_tokens_used.toLocaleString()} tokens</span>
              </span>
            )}
            {report.generation_time_ms != null && (
              <span className="flex items-center gap-1">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="font-mono text-gray-400">{(report.generation_time_ms / 1000).toFixed(1)}s</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-2">
          <Link href={`/reports/${report.pair}/history`}>
            <Button variant="secondary" size="sm">
              <svg className="mr-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {t("report.viewHistory")}
            </Button>
          </Link>
          {showPdfButton && pdfUrl && (
            <Button
              variant="primary"
              size="sm"
              disabled={downloading}
              onClick={async () => {
                try {
                  await savePdf(pdfUrl, pdfFilename);
                  toast.success(t("report.pdfSaved"));
                } catch {
                  toast.error(t("report.pdfError"));
                }
              }}
            >
              {downloading ? (
                <>
                  <svg className="mr-1 h-3.5 w-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  {t("report.pdfDownloading")}
                </>
              ) : (
                <>
                  <svg className="mr-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                  {t("report.downloadPdf")}
                </>
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Live quote bar */}
      {liveQuote && (
        <div className="border-t border-dark-border bg-dark-surface/50 px-5 py-3">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-gray-600">Live</span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
            </div>
            <span className="font-mono text-lg font-bold text-white">
              {liveQuote.price.toFixed(decimals)}
            </span>
            <span
              className={cn(
                "font-mono text-sm font-semibold",
                isPositive ? "text-green-400" : "text-red-400"
              )}
            >
              {isPositive ? "+" : ""}{liveQuote.percent_change.toFixed(2)}%
            </span>
            <div className="flex gap-4 text-xs text-gray-500">
              <span>H <span className="font-mono text-gray-400">{liveQuote.high.toFixed(decimals)}</span></span>
              <span>L <span className="font-mono text-gray-400">{liveQuote.low.toFixed(decimals)}</span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
