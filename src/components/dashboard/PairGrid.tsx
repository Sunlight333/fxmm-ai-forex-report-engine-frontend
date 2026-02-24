"use client";

import { FX_PAIRS } from "@/types/api";
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
  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {FX_PAIRS.map((pair) => (
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
  );
}
