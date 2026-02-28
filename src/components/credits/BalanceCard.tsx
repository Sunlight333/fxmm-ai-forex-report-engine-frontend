"use client";

import Link from "next/link";
import { useT } from "@/i18n/provider";
import { useAuth } from "@/lib/auth-context";
import { Badge } from "@/components/ui/Badge";

export function BalanceCard() {
  const { t } = useT();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-dark-border bg-dark-card">
      <div className="bg-gradient-to-br from-primary/10 to-transparent p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-500">{t("credits.balance")}</p>
            <p className="mt-2 text-5xl font-bold tabular-nums text-white">{user.credit_balance}</p>
            <p className="mt-1 text-sm text-gray-500">
              {t("credits.creditsRemaining", { count: user.credit_balance })}
            </p>
          </div>
          <Badge variant={user.tier === "professional" ? "tier-professional" : "tier-retail"}>
            {user.tier}
          </Badge>
        </div>
      </div>

      {user.credit_balance < 3 && (
        <div className="border-t border-warning/20 bg-amber-900/10 px-5 py-3">
          <p className="text-sm font-medium text-warning">{t("credits.lowBalance")}</p>
          <Link href="/credits" className="text-xs text-primary hover:underline">
            {t("credits.purchase")}
          </Link>
        </div>
      )}

      <div className="border-t border-dark-border px-5 py-3">
        <p className="text-xs text-gray-500">{t("credits.purchaseDesc")}</p>
      </div>
    </div>
  );
}
