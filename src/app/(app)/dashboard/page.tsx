"use client";

import { useMemo } from "react";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";
import { useSubscriptionAccess } from "@/lib/hooks/use-subscription-access";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { PairGrid } from "@/components/dashboard/PairGrid";
import { LiveQuotes } from "@/components/dashboard/LiveQuotes";
import { PairChartSection } from "@/components/dashboard/PairChartSection";
import { Badge } from "@/components/ui/Badge";
import { Skeleton, SkeletonCard } from "@/components/ui/Skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

export default function DashboardPage() {
  const { t } = useT();
  const { user } = useAuth();
  const { accessMap, loading: subsLoading, refreshAccess } = useSubscriptionAccess();

  const subscribedPairs = useMemo(
    () =>
      Object.entries(accessMap)
        .filter(([, a]) => a.hasAccess)
        .map(([pair]) => pair),
    [accessMap]
  );
  const activePairs = subscribedPairs.length;

  return (
    <div className="animate-fade-in">
      <PageHeader title={t("dashboard.title")} />

      {/* Stats row — shows user data immediately, subscription count loads in */}
      <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StatsCard
          label={t("dashboard.creditBalance")}
          value={user?.credit_balance ?? "—"}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          }
          badge={
            user && user.credit_balance < 3 ? (
              <Link href="/credits">
                <Badge variant="warning">{t("dashboard.buyCredits")}</Badge>
              </Link>
            ) : undefined
          }
        />
        <StatsCard
          label={t("dashboard.activePairs")}
          value={subsLoading ? "…" : `${activePairs}/11`}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
            </svg>
          }
        />
        <StatsCard
          label={t("dashboard.tier")}
          value={user ? user.tier.charAt(0).toUpperCase() + user.tier.slice(1) : "—"}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
          badge={
            user ? (
              <Badge variant={user.tier === "professional" ? "tier-professional" : "tier-retail"}>
                {user.tier}
              </Badge>
            ) : undefined
          }
        />
      </div>

      {/* Live FX Rates — loads independently */}
      <div className="mb-8">
        <LiveQuotes />
      </div>

      {/* Report Charts — loads independently */}
      <div className="mb-8">
        <PairChartSection subscribedPairs={subscribedPairs} loading={subsLoading} />
      </div>

      {/* Pair grid */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">FX Pairs</h2>
        {user && user.credit_balance === 0 && (
          <Link href="/credits">
            <Button variant="primary" size="sm">{t("dashboard.buyCredits")}</Button>
          </Link>
        )}
      </div>

      {subsLoading ? (
        <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 11 }).map((_, i) => (
            <SkeletonCard key={i} className="h-[140px]" />
          ))}
        </div>
      ) : (
        <PairGrid
          accessMap={accessMap}
          creditBalance={user?.credit_balance ?? 0}
          onUnlock={refreshAccess}
        />
      )}
    </div>
  );
}
