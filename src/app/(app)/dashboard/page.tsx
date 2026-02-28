"use client";

import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";
import { useSubscriptionAccess } from "@/lib/hooks/use-subscription-access";
import { FX_PAIRS } from "@/types/api";
import { reports } from "@/lib/api";
import { GreetingHero } from "@/components/dashboard/GreetingHero";
import { MarketOverview } from "@/components/dashboard/MarketOverview";
import { LiveQuotes } from "@/components/dashboard/LiveQuotes";
import { RecentReports } from "@/components/dashboard/RecentReports";
import { PairChartSection } from "@/components/dashboard/PairChartSection";
import { PairGrid } from "@/components/dashboard/PairGrid";
import { SkeletonCard } from "@/components/ui/Skeleton";
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

  const [reportCount, setReportCount] = useState<number | undefined>(undefined);
  useEffect(() => {
    const today = new Date().toISOString().slice(0, 10);
    reports.byDate(today).then((data) => setReportCount(data.length)).catch(() => {});
  }, []);

  return (
    <div className="animate-fade-in space-y-6">
      {/* Greeting hero */}
      <GreetingHero />

      {/* Market overview stats */}
      <MarketOverview
        activePairs={subscribedPairs.length}
        totalPairs={FX_PAIRS.length}
        subsLoading={subsLoading}
        reportCount={reportCount}
      />

      {/* Two-column layout on lg+ */}
      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left column — wider (3/5) */}
        <div className="space-y-6 lg:col-span-3">
          <LiveQuotes />
          <PairChartSection subscribedPairs={subscribedPairs} loading={subsLoading} />
        </div>

        {/* Right column (2/5) */}
        <div className="space-y-6 lg:col-span-2">
          <RecentReports />

          {/* Quick Actions */}
          <div className="rounded-xl border border-dark-border bg-dark-card p-5 shadow-card">
            <h3 className="mb-4 text-sm font-semibold text-foreground">Quick Actions</h3>
            <div className="space-y-2">
              <Link href="/pairs" className="block">
                <Button variant="primary" size="sm" className="w-full justify-start gap-2 rounded-xl">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
                  </svg>
                  {t("nav.pairs")}
                </Button>
              </Link>
              <Link href="/credits" className="block">
                <Button variant="secondary" size="sm" className="w-full justify-start gap-2 rounded-xl">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {t("dashboard.buyCredits")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Pair grid — full width below */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-muted-fg">
            FX Pairs
          </h2>
          {user && user.credit_balance === 0 && (
            <Link href="/credits">
              <Button variant="primary" size="sm">{t("dashboard.buyCredits")}</Button>
            </Link>
          )}
        </div>

        {subsLoading ? (
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
            {Array.from({ length: 11 }).map((_, i) => (
              <SkeletonCard key={i} className="h-[120px]" />
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
    </div>
  );
}
