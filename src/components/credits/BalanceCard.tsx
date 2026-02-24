"use client";

import Link from "next/link";
import { useT } from "@/i18n/provider";
import { useAuth } from "@/lib/auth-context";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";

export function BalanceCard() {
  const { t } = useT();
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Card padding="default">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{t("credits.balance")}</p>
          <p className="mt-1 text-4xl font-bold text-white">{user.credit_balance}</p>
          <p className="mt-1 text-sm text-gray-500">
            {t("credits.creditsRemaining", { count: user.credit_balance })}
          </p>
        </div>
        <Badge variant={user.tier === "professional" ? "tier-professional" : "tier-retail"}>
          {user.tier}
        </Badge>
      </div>

      {user.credit_balance < 3 && (
        <div className="mt-4 rounded-lg border border-warning/30 bg-amber-900/10 px-3 py-2">
          <p className="text-sm text-warning">{t("credits.lowBalance")}</p>
          <Link href="/credits" className="text-xs text-primary hover:underline">
            {t("credits.purchase")}
          </Link>
        </div>
      )}

      <p className="mt-4 text-xs text-gray-500">
        {t("credits.purchaseDesc")}
      </p>
    </Card>
  );
}
