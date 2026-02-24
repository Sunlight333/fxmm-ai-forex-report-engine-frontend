"use client";

import { useT } from "@/i18n/provider";
import { useApi } from "@/lib/hooks/use-api";
import { credits } from "@/lib/api";
import type { CreditBalance } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { BalanceCard } from "@/components/credits/BalanceCard";
import { PurchaseForm } from "@/components/credits/PurchaseForm";
import { TransactionList } from "@/components/credits/TransactionList";
import { Skeleton } from "@/components/ui/Skeleton";

export default function CreditsPage() {
  const { t } = useT();

  const { data, loading, refetch } = useApi<CreditBalance>(
    () => credits.balance(),
    []
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title={t("credits.title")} />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <PurchaseForm onPurchase={refetch} />

          {loading ? (
            <Skeleton className="h-[300px] rounded-lg" />
          ) : (
            <TransactionList transactions={data?.transactions || []} />
          )}
        </div>

        <div>
          <BalanceCard />
        </div>
      </div>
    </div>
  );
}
