"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";
import { formatPair, cn } from "@/lib/utils";
import { credits } from "@/lib/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/feedback/ConfirmDialog";
import toast from "react-hot-toast";

interface PairCardProps {
  pair: string;
  hasAccess: boolean;
  endDate: string | null;
  creditBalance: number;
  onUnlock: () => void;
}

export function PairCard({ pair, hasAccess, endDate, creditBalance, onUnlock }: PairCardProps) {
  const { t } = useT();
  const router = useRouter();
  const { refreshUser } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);
  const [unlocking, setUnlocking] = useState(false);

  const handleUnlock = async () => {
    setUnlocking(true);
    try {
      await credits.consume(pair);
      await refreshUser();
      onUnlock();
      toast.success(`${formatPair(pair)} unlocked for 5 trading days`);
      setShowConfirm(false);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to unlock");
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <>
      <div
        className={cn(
          "group relative flex flex-col justify-between overflow-hidden rounded-lg border bg-dark-card p-4 transition-all hover:shadow-md",
          hasAccess
            ? "border-demand/20 hover:border-demand/30"
            : "border-dark-border hover:border-dark-hover"
        )}
      >
        {/* Active accent */}
        {hasAccess && (
          <div className="absolute inset-x-0 top-0 h-[2px] bg-demand" />
        )}

        <div>
          <div className="flex items-center justify-between">
            <span className="font-mono text-base font-bold text-white">
              {formatPair(pair)}
            </span>
            <Badge
              variant={hasAccess ? "status-active" : "status-locked"}
              className="text-[10px]"
            >
              {hasAccess ? t("dashboard.pairActive") : t("dashboard.pairLocked")}
            </Badge>
          </div>
          {hasAccess && endDate && (
            <p className="mt-1 text-[11px] text-gray-500">
              {t("dashboard.until")} {new Date(endDate).toLocaleDateString()}
            </p>
          )}
        </div>

        <div className="mt-3">
          {hasAccess ? (
            <Button
              variant="primary"
              size="sm"
              className="w-full text-xs"
              onClick={() => router.push(`/reports/${pair}`)}
            >
              {t("dashboard.viewReport")}
            </Button>
          ) : (
            <Button
              variant="secondary"
              size="sm"
              className="w-full text-xs"
              disabled={creditBalance < 1}
              onClick={() => setShowConfirm(true)}
            >
              {creditBalance < 1
                ? t("dashboard.noCredits")
                : `${t("dashboard.unlock")} (1 credit)`}
            </Button>
          )}
        </div>
      </div>

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleUnlock}
        title={t("dashboard.unlock")}
        message={t("dashboard.unlockConfirm", { pair: formatPair(pair) })}
        confirmLabel={t("dashboard.unlock")}
        confirmVariant="primary"
        loading={unlocking}
      />
    </>
  );
}
