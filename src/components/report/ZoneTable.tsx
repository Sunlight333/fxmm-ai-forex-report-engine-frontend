"use client";

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

export function ZoneTable({ zones, pair, type }: ZoneTableProps) {
  const { t } = useT();

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
          </tr>
        </thead>
        <tbody className="divide-y divide-dark-border">
          {filtered.map((zone) => (
            <tr key={zone.id} className="hover:bg-dark-hover transition-colors">
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
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
