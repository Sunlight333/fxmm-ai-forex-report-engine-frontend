"use client";

import { FX_PAIRS, MAJOR_PAIRS, CROSS_PAIRS } from "@/types/api";
import { useT } from "@/i18n/provider";
import { PairCard } from "./PairCard";

interface AccessInfo {
  hasAccess: boolean;
  endDate: string | null;
}

interface PairGridProps {
  accessMap: Record<string, AccessInfo>;
  creditBalance: number;
  onUnlock: () => void;
}

export function PairGrid({ accessMap, creditBalance, onUnlock }: PairGridProps) {
  const { t } = useT();

  return (
    <div className="space-y-6">
      {/* Majors */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {t("pairs.majors")}
        </h3>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {MAJOR_PAIRS.map((pair) => (
            <PairCard
              key={pair}
              pair={pair}
              hasAccess={accessMap[pair]?.hasAccess ?? false}
              endDate={accessMap[pair]?.endDate ?? null}
              creditBalance={creditBalance}
              onUnlock={onUnlock}
            />
          ))}
        </div>
      </div>

      {/* Crosses */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
          {t("pairs.crosses")}
        </h3>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
          {CROSS_PAIRS.map((pair) => (
            <PairCard
              key={pair}
              pair={pair}
              hasAccess={accessMap[pair]?.hasAccess ?? false}
              endDate={accessMap[pair]?.endDate ?? null}
              creditBalance={creditBalance}
              onUnlock={onUnlock}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
