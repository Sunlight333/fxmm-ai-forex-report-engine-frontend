"use client";

import { useState } from "react";
import { useT } from "@/i18n/provider";
import { formatPrice, cn } from "@/lib/utils";
import type { Zone } from "@/types/api";
import { Badge } from "@/components/ui/Badge";
import { ProgressBar } from "@/components/ui/ProgressBar";

interface ZoneTableProps {
  zones: Zone[];
  pair: string;
  type: "supply" | "demand";
}

const statusVariants: Record<string, "status-active" | "success" | "danger" | "warning" | "default"> = {
  active: "status-active",
  tested_held: "success",
  tested_broken: "danger",
  swept: "warning",
  invalidated: "default",
};

const FACTOR_KEYS = [
  "structural_swing_h1_plus",
  "session_level_alignment",
  "liquidity_cluster",
  "volume_concentration",
  "fresh_untested",
  "multi_tf_visibility",
] as const;

export function ZoneTable({ zones, pair, type }: ZoneTableProps) {
  const { t } = useT();
  const [expandedZone, setExpandedZone] = useState<string | null>(null);

  const filtered = zones
    .filter((z) => z.zone_type === type)
    .sort((a, b) => b.confluence_score - a.confluence_score);

  if (filtered.length === 0) return null;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-dark-border">
            <th className="px-3 py-2 text-left text-xs font-medium uppercase text-muted-fg">
              {t("zones.priceRange")}
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase text-muted-fg">
              {t("zones.confluence")}
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase text-muted-fg">
              {t("zones.status")}
            </th>
            <th className="px-3 py-2 text-left text-xs font-medium uppercase text-muted-fg">
              {t("zones.tests")}
            </th>
            <th className="w-8 px-1 py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-border">
          {filtered.map((zone) => {
            const hasFactors = zone.detection_factors && Object.keys(zone.detection_factors).length > 0;
            const isExpanded = expandedZone === zone.id;

            return (
              <tr key={zone.id} className="group">
                {/* Main row */}
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-8 w-1 rounded-full",
                        type === "demand" ? "bg-demand" : "bg-supply"
                      )}
                    />
                    <span className="font-mono text-foreground">
                      {formatPrice(zone.price_lower, pair)} – {formatPrice(zone.price_upper, pair)}
                    </span>
                  </div>
                </td>
                <td className="px-3 py-2 w-40">
                  <ProgressBar
                    value={zone.confluence_score}
                    max={8}
                    showLabel
                    colorClass={type === "demand" ? "bg-demand" : "bg-supply"}
                  />
                </td>
                <td className="px-3 py-2">
                  <Badge variant={statusVariants[zone.status] || "default"}>
                    {t(`zones.${zone.status}` as `zones.${string}`) || zone.status}
                  </Badge>
                </td>
                <td className="px-3 py-2 text-center font-mono text-muted-fg">
                  {zone.test_count}
                </td>
                <td className="px-1 py-2">
                  {hasFactors && (
                    <button
                      onClick={() => setExpandedZone(isExpanded ? null : zone.id)}
                      className="rounded-md p-1 text-subtle transition-colors hover:bg-dark-hover hover:text-foreground"
                      title={t("zones.factors")}
                    >
                      <svg
                        className={cn("h-4 w-4 transition-transform", isExpanded && "rotate-180")}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.5}
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                      </svg>
                    </button>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Expanded detection factors panel — rendered outside table for clean layout */}
      {filtered.map((zone) => {
        const isExpanded = expandedZone === zone.id;
        const factors = zone.detection_factors;
        if (!isExpanded || !factors || Object.keys(factors).length === 0) return null;

        return (
          <div
            key={`factors-${zone.id}`}
            className="border-t border-dark-border bg-dark-surface/50 px-4 py-3"
          >
            <p className="mb-2 text-[10px] font-semibold uppercase tracking-widest text-subtle">
              {t("zones.factors")}
            </p>
            <div className="flex flex-wrap gap-2">
              {FACTOR_KEYS.map((key) => {
                const active = factors[key] === true;
                return (
                  <span
                    key={key}
                    className={cn(
                      "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium transition-colors",
                      active
                        ? type === "demand"
                          ? "bg-demand/15 text-demand"
                          : "bg-supply/15 text-supply"
                        : "bg-dark-hover text-subtle"
                    )}
                  >
                    {active ? (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                      </svg>
                    ) : (
                      <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    )}
                    {t(`zones.${key}` as `zones.${string}`) || key}
                  </span>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
