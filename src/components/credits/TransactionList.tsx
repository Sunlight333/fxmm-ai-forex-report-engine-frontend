"use client";

import { format } from "date-fns";
import { useT } from "@/i18n/provider";
import { formatPair, cn } from "@/lib/utils";
import type { CreditTransaction } from "@/types/api";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";

interface TransactionListProps {
  transactions: CreditTransaction[];
}

const typeBadgeVariant: Record<string, "success" | "danger" | "info"> = {
  purchase: "success",
  consume: "danger",
  admin_add: "info",
};

export function TransactionList({ transactions }: TransactionListProps) {
  const { t } = useT();

  return (
    <Card padding="none">
      <CardHeader title={t("credits.transactionHistory")} className="px-6 pt-6" />

      {transactions.length === 0 ? (
        <EmptyState title={t("credits.noTransactions")} className="py-8" />
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-dark-border">
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-fg">
                  {t("credits.date")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-fg">
                  {t("credits.type")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase text-muted-fg">
                  {t("credits.amount")}
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase text-muted-fg">
                  {t("credits.pair")}
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase text-muted-fg">
                  {t("credits.balanceAfter")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-dark-border">
              {transactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-dark-hover transition-colors">
                  <td className="px-6 py-3 text-muted-fg">
                    {format(new Date(tx.created_at), "MMM d, yyyy HH:mm")}
                  </td>
                  <td className="px-6 py-3">
                    <Badge variant={typeBadgeVariant[tx.type] || "default"}>
                      {t(`credits.${tx.type}_type`)}
                    </Badge>
                  </td>
                  <td className={cn(
                    "px-6 py-3 text-right font-mono font-medium",
                    tx.amount > 0 ? "text-demand" : "text-supply"
                  )}>
                    {tx.amount > 0 ? "+" : ""}{tx.amount}
                  </td>
                  <td className="px-6 py-3 font-mono text-muted-fg">
                    {tx.pair ? formatPair(tx.pair) : "—"}
                  </td>
                  <td className="px-6 py-3 text-right font-mono text-foreground">
                    {tx.balance_after}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
}
