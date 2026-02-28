"use client";

import { useT } from "@/i18n/provider";
import { useApi } from "@/lib/hooks/use-api";
import { credits } from "@/lib/api";
import type { CreditBalance } from "@/types/api";
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
    <div className="animate-fade-in space-y-6">
      {/* Balance card prominent at top */}
      <BalanceCard />

      {/* Purchase + Transactions */}
      <div className="grid gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <PurchaseForm onPurchase={refetch} />
        </div>

        <div className="lg:col-span-2">
          {loading ? (
            <Skeleton className="h-[300px] rounded-lg" />
          ) : (
            <TransactionList transactions={data?.transactions || []} />
          )}
        </div>
      </div>
    </div>
  );
}
