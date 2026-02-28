"use client";

import { useRouter } from "next/navigation";
import { useT } from "@/i18n/provider";
import { useSubscriptionAccess } from "@/lib/hooks/use-subscription-access";
import { formatPair, cn } from "@/lib/utils";
import { MAJOR_PAIRS, CROSS_PAIRS } from "@/types/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

export default function PairsPage() {
  const { t } = useT();
  const router = useRouter();
  const { accessMap, loading } = useSubscriptionAccess();

  const renderPairList = (pairs: readonly string[], title: string) => (
    <div className="mb-8">
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-fg">{title}</h2>
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {pairs.map((pair) => {
          const access = accessMap[pair];
          const hasAccess = access?.hasAccess ?? false;

          return (
            <button
              key={pair}
              className={cn(
                "group relative w-full overflow-hidden rounded-xl border bg-dark-card p-4 text-left transition-all hover:shadow-md",
                hasAccess
                  ? "border-demand/20 hover:border-demand/30"
                  : "border-dark-border hover:border-dark-hover"
              )}
              onClick={() => router.push(`/pairs/${pair}`)}
            >
              {hasAccess && (
                <div className="absolute inset-x-0 top-0 h-[2px] bg-demand" />
              )}

              <div className="flex items-center justify-between">
                <span className="font-mono text-lg font-bold text-foreground">
                  {formatPair(pair)}
                </span>
                <Badge variant={hasAccess ? "status-active" : "status-locked"} className="text-[10px]">
                  {hasAccess ? t("dashboard.pairActive") : t("dashboard.pairLocked")}
                </Badge>
              </div>
              {hasAccess && access?.endDate && (
                <p className="mt-1 text-[11px] text-muted-fg">
                  {t("dashboard.until")} {new Date(access.endDate).toLocaleDateString()}
                </p>
              )}
              <div className="mt-3">
                <Button
                  variant={hasAccess ? "primary" : "secondary"}
                  size="sm"
                  className="w-full text-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(hasAccess ? `/reports/${pair}` : `/pairs/${pair}`);
                  }}
                >
                  {hasAccess ? t("pairs.viewReport") : t("pairs.unlock")}
                </Button>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="animate-fade-in space-y-6">
        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 11 }).map((_, i) => (
            <Skeleton key={i} className="h-[120px] rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {renderPairList(MAJOR_PAIRS, t("pairs.majors"))}
      {renderPairList(CROSS_PAIRS, t("pairs.crosses"))}
    </div>
  );
}
