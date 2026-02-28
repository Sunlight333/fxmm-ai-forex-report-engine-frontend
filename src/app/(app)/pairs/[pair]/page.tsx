"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";
import { useApi } from "@/lib/hooks/use-api";
import { zones as zonesApi, subscriptions, credits as creditsApi } from "@/lib/api";
import { formatPair } from "@/lib/utils";
import type { Zone } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ZoneTable } from "@/components/report/ZoneTable";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import { Spinner } from "@/components/ui/Spinner";
import toast from "react-hot-toast";
import Link from "next/link";

export default function PairDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user, refreshUser } = useAuth();
  const { t } = useT();
  const pair = params.pair as string;

  const { data: accessData, loading: accessLoading, refetch: refetchAccess } = useApi(
    () => subscriptions.check(pair),
    [pair]
  );

  const { data: activeZones } = useApi<Zone[]>(
    () => zonesApi.active(pair).catch(() => []),
    [pair]
  );

  const [showUnlock, setShowUnlock] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlock = async () => {
    setUnlocking(true);
    try {
      await creditsApi.consume(pair);
      await refreshUser();
      await refetchAccess();
      toast.success(`${formatPair(pair)} unlocked for 5 trading days`);
      setShowUnlock(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to unlock");
    } finally {
      setUnlocking(false);
    }
  };

  const hasAccess = accessData?.has_access ?? false;

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={formatPair(pair)}
        action={
          <Button variant="secondary" size="sm" onClick={() => router.push("/pairs")}>
            {t("common.back")}
          </Button>
        }
      />

      {accessLoading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Access status */}
            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-semibold text-foreground">Subscription Status</h3>
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant={hasAccess ? "status-active" : "status-locked"}>
                      {hasAccess ? t("dashboard.pairActive") : t("dashboard.pairLocked")}
                    </Badge>
                    {hasAccess && accessData?.end_date && (
                      <span className="text-sm text-muted-fg">
                        {t("dashboard.until")} {new Date(accessData.end_date).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                </div>
                {hasAccess ? (
                  <Link href={`/reports/${pair}`}>
                    <Button variant="primary">{t("dashboard.viewReport")}</Button>
                  </Link>
                ) : (
                  <Button
                    variant="primary"
                    onClick={() => setShowUnlock(true)}
                    disabled={!user || user.credit_balance < 1}
                  >
                    {t("dashboard.unlock")} (1 credit)
                  </Button>
                )}
              </div>
            </Card>

            {/* Active zones */}
            {activeZones && activeZones.length > 0 && (
              <>
                <Card padding="compact">
                  <h3 className="mb-3 text-base font-semibold text-demand">
                    {t("report.sections.key_zones_demand")}
                  </h3>
                  <ZoneTable zones={activeZones} pair={pair} type="demand" />
                </Card>
                <Card padding="compact">
                  <h3 className="mb-3 text-base font-semibold text-supply">
                    {t("report.sections.key_zones_supply")}
                  </h3>
                  <ZoneTable zones={activeZones} pair={pair} type="supply" />
                </Card>
              </>
            )}

            {(!activeZones || activeZones.length === 0) && (
              <Card>
                <p className="text-sm text-muted-fg">{t("pairs.noActiveZones")}</p>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {hasAccess && (
              <Card>
                <h3 className="mb-3 text-base font-semibold text-foreground">Quick Links</h3>
                <div className="space-y-2">
                  <Link
                    href={`/reports/${pair}`}
                    className="block rounded-xl px-3 py-2 text-sm text-muted-fg hover:bg-dark-hover transition-colors"
                  >
                    {t("report.latestReport")}
                  </Link>
                  <Link
                    href={`/reports/${pair}/history`}
                    className="block rounded-xl px-3 py-2 text-sm text-muted-fg hover:bg-dark-hover transition-colors"
                  >
                    {t("report.viewHistory")}
                  </Link>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      <ConfirmDialog
        open={showUnlock}
        onClose={() => setShowUnlock(false)}
        onConfirm={handleUnlock}
        title={t("dashboard.unlock")}
        message={t("dashboard.unlockConfirm", { pair: formatPair(pair) })}
        confirmLabel={t("dashboard.unlock")}
        loading={unlocking}
      />
    </div>
  );
}
