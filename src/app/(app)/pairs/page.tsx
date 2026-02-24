"use client";

import { useRouter } from "next/navigation";
import { useT } from "@/i18n/provider";
import { useSubscriptionAccess } from "@/lib/hooks/use-subscription-access";
import { formatPair } from "@/lib/utils";
import { MAJOR_PAIRS, CROSS_PAIRS } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function PairsPage() {
  const { t } = useT();
  const router = useRouter();
  const { accessMap, loading } = useSubscriptionAccess();

  const renderPairList = (pairs: readonly string[], title: string) => (
    <div className="mb-8">
      <h2 className="mb-4 text-lg font-semibold text-white">{title}</h2>
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {pairs.map((pair) => {
          const access = accessMap[pair];
          const hasAccess = access?.hasAccess ?? false;

          return (
            <Card
              key={pair}
              padding="compact"
              className="cursor-pointer transition-colors hover:border-dark-hover"
            >
              <button
                className="w-full text-left"
                onClick={() => router.push(`/pairs/${pair}`)}
              >
                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold font-mono text-white">
                    {formatPair(pair)}
                  </span>
                  <Badge variant={hasAccess ? "status-active" : "status-locked"}>
                    {hasAccess ? t("dashboard.pairActive") : t("dashboard.pairLocked")}
                  </Badge>
                </div>
                {hasAccess && access?.endDate && (
                  <p className="mt-1 text-xs text-gray-500">
                    {t("dashboard.until")} {new Date(access.endDate).toLocaleDateString()}
                  </p>
                )}
                <div className="mt-3">
                  <Button
                    variant={hasAccess ? "primary" : "secondary"}
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (hasAccess) {
                        router.push(`/reports/${pair}`);
                      } else {
                        router.push(`/pairs/${pair}`);
                      }
                    }}
                  >
                    {hasAccess ? t("pairs.viewReport") : t("pairs.unlock")}
                  </Button>
                </div>
              </button>
            </Card>
          );
        })}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-fade-in">
        <PageHeader title={t("pairs.title")} />
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 11 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      <PageHeader title={t("pairs.title")} />
      {renderPairList(MAJOR_PAIRS, t("pairs.majors"))}
      {renderPairList(CROSS_PAIRS, t("pairs.crosses"))}
    </div>
  );
}
