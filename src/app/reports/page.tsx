"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { reports as reportsApi, zones as zonesApi } from "@/lib/api";
import type { ReportDetail, Zone } from "@/types/api";

export default function ReportViewerPage() {
  return (
    <Suspense fallback={<div className="p-8 text-gray-400">Loading...</div>}>
      <ReportContent />
    </Suspense>
  );
}

function ReportContent() {
  const { user, loading: authLoading } = useAuth();
  const searchParams = useSearchParams();
  const pair = searchParams.get("pair") || "EURUSD";

  const [report, setReport] = useState<ReportDetail | null>(null);
  const [zones, setZones] = useState<Zone[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    reportsApi
      .latest(pair)
      .then((r) => {
        setReport(r);
        return zonesApi.byReport(r.id);
      })
      .then(setZones)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [user, pair]);

  if (authLoading) return <div className="p-8 text-gray-400">Loading...</div>;
  if (!user) return null;

  return (
    <>
      <Navbar />
      <main className="max-w-5xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-2">{pair} Report</h1>

        {loading && <p className="text-gray-400">Loading report...</p>}
        {error && (
          <div className="bg-supply/10 text-supply rounded p-3 mb-4">{error}</div>
        )}

        {report && (
          <div className="space-y-6">
            {/* Header */}
            <div className="bg-dark-card border border-dark-border rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-gray-400">
                  {report.date} | {report.llm_model} | {report.generation_time_ms}ms
                </span>
                <span className="text-sm font-medium px-2 py-1 rounded bg-primary/20 text-primary">
                  {report.market_state}
                </span>
              </div>
              <p className="text-sm">{report.executive_summary}</p>
            </div>

            {/* Zones */}
            {zones.length > 0 && (
              <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                <h2 className="font-semibold mb-3">Key Zones</h2>
                <div className="space-y-2">
                  {zones.map((z) => (
                    <div
                      key={z.id}
                      className={`flex justify-between items-center px-3 py-2 rounded ${
                        z.zone_type === "demand"
                          ? "bg-demand/10 border-l-2 border-demand"
                          : "bg-supply/10 border-l-2 border-supply"
                      }`}
                    >
                      <span className="font-mono text-sm">
                        {z.zone_type.toUpperCase()}: {z.price_lower.toFixed(5)} –{" "}
                        {z.price_upper.toFixed(5)}
                      </span>
                      <span className="text-sm text-gray-400">
                        Score: {z.confluence_score}/8 | {z.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Narrative sections */}
            {report.full_narrative?.sections && (
              <div className="space-y-4">
                {Object.entries(report.full_narrative.sections).map(
                  ([key, text]) => (
                    <div
                      key={key}
                      className="bg-dark-card border border-dark-border rounded-lg p-4"
                    >
                      <h3 className="font-semibold mb-2 capitalize">
                        {key.replace(/_/g, " ")}
                      </h3>
                      <p className="text-sm text-gray-300 whitespace-pre-wrap">
                        {text}
                      </p>
                    </div>
                  )
                )}
              </div>
            )}

            {/* Chart placeholders */}
            <div className="grid grid-cols-2 gap-4">
              {report.chart_file_url && (
                <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                  <h3 className="text-sm text-gray-400 mb-2">M15 Chart</h3>
                  <div className="aspect-video bg-dark-bg rounded flex items-center justify-center text-gray-500 text-sm">
                    Chart: {report.chart_file_url}
                  </div>
                </div>
              )}
              {report.radar_file_url && (
                <div className="bg-dark-card border border-dark-border rounded-lg p-4">
                  <h3 className="text-sm text-gray-400 mb-2">Radar</h3>
                  <div className="aspect-square bg-dark-bg rounded flex items-center justify-center text-gray-500 text-sm">
                    Chart: {report.radar_file_url}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
