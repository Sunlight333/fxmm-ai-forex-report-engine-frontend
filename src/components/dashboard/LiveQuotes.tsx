"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { quotes } from "@/lib/api";
import { formatPair, cn } from "@/lib/utils";
import { FX_PAIRS } from "@/types/api";

interface QuoteData {
  pair: string;
  price: number;
  open: number;
  high: number;
  low: number;
  previous_close: number;
  change: number;
  percent_change: number;
  timestamp: string;
}

function fmtPrice(pair: string, price: number): string {
  if (!price) return "\u2014";
  return price.toFixed(pair.includes("JPY") ? 3 : 5);
}

export function LiveQuotes() {
  const [quoteMap, setQuoteMap] = useState<Record<string, QuoteData>>({});
  const [updatedAt, setUpdatedAt] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const catchUpRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fetchQuotes = useCallback(async () => {
    try {
      const data = await quotes.snapshot();
      const newQuotes = data.quotes;
      setQuoteMap((prev) => {
        const merged = { ...prev };
        for (const [k, v] of Object.entries(newQuotes)) {
          merged[k] = v;
        }
        return merged;
      });
      setUpdatedAt(data.updated_at);

      if (Object.keys(newQuotes).length < FX_PAIRS.length && !catchUpRef.current) {
        catchUpRef.current = setTimeout(async () => {
          catchUpRef.current = null;
          try {
            const retry = await quotes.snapshot();
            setQuoteMap((prev) => {
              const merged = { ...prev };
              for (const [k, v] of Object.entries(retry.quotes)) {
                merged[k] = v;
              }
              return merged;
            });
            setUpdatedAt(retry.updated_at);
          } catch { /* ignore */ }
        }, 70_000);
      }
    } catch { /* ignore */ } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchQuotes();
    const interval = setInterval(fetchQuotes, 5 * 60 * 1000);
    return () => {
      clearInterval(interval);
      if (catchUpRef.current) clearTimeout(catchUpRef.current);
    };
  }, [fetchQuotes]);

  const hasQuotes = Object.keys(quoteMap).length > 0;

  return (
    <div className="rounded-lg border border-dark-border bg-dark-card">
      <div className="flex items-center justify-between border-b border-dark-border px-4 py-3">
        <h3 className="text-sm font-semibold text-white">Live FX Rates</h3>
        {updatedAt > 0 && (
          <span className="text-[10px] text-gray-600">
            {new Date(updatedAt * 1000).toLocaleTimeString()}
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-2 p-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-[72px] animate-pulse rounded-lg bg-dark-surface" />
          ))}
        </div>
      ) : !hasQuotes ? (
        <p className="px-4 py-8 text-center text-xs text-gray-600">
          Live quotes unavailable
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 p-3 sm:grid-cols-3 lg:grid-cols-4">
          {FX_PAIRS.map((pair) => {
            const q = quoteMap[pair];
            if (!q) return null;

            const up = q.change >= 0;
            const sign = up ? "+" : "";

            return (
              <Link
                key={pair}
                href={`/reports/${pair}`}
                className={cn(
                  "group relative flex flex-col overflow-hidden rounded-lg border bg-dark-surface px-3 py-2.5 transition-all hover:scale-[1.02] hover:shadow-lg",
                  up ? "border-demand/20 hover:border-demand/40" : "border-supply/20 hover:border-supply/40"
                )}
              >
                {/* Left accent bar */}
                <div
                  className={cn(
                    "absolute inset-y-0 left-0 w-[3px]",
                    up ? "bg-demand" : "bg-supply"
                  )}
                />

                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {formatPair(pair)}
                  </span>
                  <span
                    className={cn(
                      "flex items-center gap-0.5 text-[10px] font-semibold",
                      up ? "text-demand" : "text-supply"
                    )}
                  >
                    <svg className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                      {up ? (
                        <path fillRule="evenodd" d="M10 17a.75.75 0 01-.75-.75V5.612L5.29 9.77a.75.75 0 01-1.08-1.04l5.25-5.5a.75.75 0 011.08 0l5.25 5.5a.75.75 0 11-1.08 1.04l-3.96-4.158V16.25A.75.75 0 0110 17z" clipRule="evenodd" />
                      ) : (
                        <path fillRule="evenodd" d="M10 3a.75.75 0 01.75.75v10.638l3.96-4.158a.75.75 0 111.08 1.04l-5.25 5.5a.75.75 0 01-1.08 0l-5.25-5.5a.75.75 0 111.08-1.04l3.96 4.158V3.75A.75.75 0 0110 3z" clipRule="evenodd" />
                      )}
                    </svg>
                    {sign}{q.percent_change.toFixed(2)}%
                  </span>
                </div>

                <span className="mt-1 font-mono text-base font-bold text-white">
                  {fmtPrice(pair, q.price)}
                </span>

                <div className="mt-1 flex justify-between text-[10px] text-gray-600">
                  <span>H {fmtPrice(pair, q.high)}</span>
                  <span>L {fmtPrice(pair, q.low)}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
