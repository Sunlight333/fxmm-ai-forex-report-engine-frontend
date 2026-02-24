"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { quotes } from "@/lib/api";
import { formatPair, cn } from "@/lib/utils";
import { FX_PAIRS } from "@/types/api";
import { Card } from "@/components/ui/Card";

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

function formatPrice(pair: string, price: number): string {
  if (!price) return "—";
  const isJpy = pair.includes("JPY");
  return price.toFixed(isJpy ? 3 : 5);
}

function formatChange(change: number, pct: number): string {
  const sign = change >= 0 ? "+" : "";
  return `${sign}${pct.toFixed(2)}%`;
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
      // Merge with existing — backfilled pairs arrive later
      setQuoteMap((prev) => {
        const merged = { ...prev };
        for (const [k, v] of Object.entries(newQuotes)) {
          merged[k] = v;
        }
        return merged;
      });
      setUpdatedAt(data.updated_at);

      // If we got fewer than all pairs, poll again in 70s to catch backfill
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
          } catch {
            // Ignore
          }
        }, 70_000);
      }
    } catch {
      // Silently fail — quotes are non-critical
    } finally {
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
    <Card padding="compact">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-sm font-semibold text-white">Live FX Rates</h3>
        {updatedAt > 0 && (
          <span className="text-[10px] text-gray-600">
            Updated {new Date(updatedAt * 1000).toLocaleTimeString()}
          </span>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-14 animate-pulse rounded bg-dark-surface" />
          ))}
        </div>
      ) : !hasQuotes ? (
        <p className="py-4 text-center text-xs text-gray-600">
          Live quotes unavailable
        </p>
      ) : (
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
          {FX_PAIRS.map((pair) => {
            const q = quoteMap[pair];
            if (!q) return null;

            const isPositive = q.change >= 0;

            return (
              <div
                key={pair}
                className="flex flex-col rounded-lg border border-dark-border bg-dark-surface px-3 py-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-gray-400">
                    {formatPair(pair)}
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-medium",
                      isPositive ? "text-demand" : "text-supply"
                    )}
                  >
                    {formatChange(q.change, q.percent_change)}
                  </span>
                </div>
                <span className="mt-0.5 font-mono text-sm font-bold text-white">
                  {formatPrice(pair, q.price)}
                </span>
                <div className="mt-0.5 flex justify-between text-[10px] text-gray-600">
                  <span>H {formatPrice(pair, q.high)}</span>
                  <span>L {formatPrice(pair, q.low)}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
