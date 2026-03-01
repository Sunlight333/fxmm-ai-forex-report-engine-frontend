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
    } catch { /* Non-critical */ }
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
    <div className="mb-6 overflow-hidden rounded-xl border border-dark-border bg-dark-card shadow-card">
      {/* Top bar */}
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              {formatPair(report.pair)}
            </h1>
            {report.market_state && (
              <Badge variant="info">{report.market_state}</Badge>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-fg">
            {format(new Date(report.date + "T12:00:00"), "EEEE, MMMM d, yyyy")}
          </p>

          {/* Metadata pills */}
          <div className="mt-3 flex flex-wrap items-center gap-2">
            {report.created_at && (
              <span className="inline-flex items-center gap-1 rounded-full bg-dark-surface px-2.5 py-0.5 text-[11px] text-muted-fg">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" /></svg>
                <span>{t("report.generatedAt")}</span>
                <span className="font-mono">{format(new Date(report.created_at), "HH:mm")}</span>
              </span>
            )}
            {report.language && (
              <span className="inline-flex items-center gap-1 rounded-full bg-dark-surface px-2.5 py-0.5 text-[11px] text-muted-fg">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" /></svg>
                <span className="uppercase">{report.language}</span>
              </span>
            )}
            {report.llm_model && (
              <span className="inline-flex items-center gap-1 rounded-full bg-dark-surface px-2.5 py-0.5 text-[11px] text-muted-fg">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <span className="font-mono">{report.llm_model}</span>
              </span>
            )}
            {report.llm_tokens_used != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-dark-surface px-2.5 py-0.5 text-[11px] text-muted-fg">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                <span className="font-mono">{report.llm_tokens_used.toLocaleString()}</span>
              </span>
            )}
            {report.generation_time_ms != null && (
              <span className="inline-flex items-center gap-1 rounded-full bg-dark-surface px-2.5 py-0.5 text-[11px] text-muted-fg">
                <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                <span className="font-mono">{(report.generation_time_ms / 1000).toFixed(1)}s</span>
              </span>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 gap-2">
          <Link href={`/reports/${report.pair}/history`}>
            <Button variant="secondary" size="sm">
              <svg className="mr-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
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
                  <svg className="mr-1 h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
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
              <span className="text-[10px] font-medium uppercase tracking-wider text-subtle">Live</span>
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
            </div>
            <span className="font-mono text-lg font-bold text-foreground">
              {liveQuote.price.toFixed(decimals)}
            </span>
            <span
              className={cn(
                "font-mono text-sm font-semibold",
                isPositive ? "text-demand" : "text-supply"
              )}
            >
              {isPositive ? "+" : ""}{liveQuote.percent_change.toFixed(2)}%
            </span>
            <div className="flex gap-4 text-xs text-muted-fg">
              <span>H <span className="font-mono text-muted-fg">{liveQuote.high.toFixed(decimals)}</span></span>
              <span>L <span className="font-mono text-muted-fg">{liveQuote.low.toFixed(decimals)}</span></span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
