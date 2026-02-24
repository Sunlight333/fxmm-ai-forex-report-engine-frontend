"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useT } from "@/i18n/provider";
import { useApi } from "@/lib/hooks/use-api";
import { admin } from "@/lib/api";
import { formatPair } from "@/lib/utils";
import type { GenerationLog } from "@/types/api";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Input } from "@/components/ui/Input";
import { Table } from "@/components/ui/Table";

const statusVariant: Record<string, "success" | "danger" | "warning"> = {
  success: "success",
  failure: "danger",
  partial: "warning",
};

export function GenerationLogs() {
  const { t } = useT();
  const [dateFilter, setDateFilter] = useState("");

  const { data: logs, loading } = useApi<GenerationLog[]>(
    () => admin.generationLogs(dateFilter || undefined),
    [dateFilter]
  );

  const columns = [
    {
      key: "pair",
      header: t("credits.pair"),
      render: (log: GenerationLog) => (
        <span className="font-mono text-white">{formatPair(log.pair)}</span>
      ),
    },
    {
      key: "date",
      header: t("admin.runDate"),
      render: (log: GenerationLog) => (
        <span className="text-gray-400">{log.run_date}</span>
      ),
    },
    {
      key: "status",
      header: t("admin.status"),
      render: (log: GenerationLog) => (
        <Badge variant={statusVariant[log.status] || "default"}>
          {t(`admin.${log.status}`)}
        </Badge>
      ),
    },
    {
      key: "duration",
      header: t("admin.duration"),
      render: (log: GenerationLog) => (
        <span className="font-mono text-gray-400">
          {log.duration_ms ? `${(log.duration_ms / 1000).toFixed(1)}s` : "—"}
        </span>
      ),
    },
    {
      key: "created",
      header: "Created",
      render: (log: GenerationLog) => (
        <span className="text-gray-500 text-xs">
          {format(new Date(log.created_at), "MMM d, HH:mm")}
        </span>
      ),
    },
  ];

  return (
    <Card padding="none">
      <CardHeader title={t("admin.generationLogs")} className="px-6 pt-6">
        <Input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-auto"
        />
      </CardHeader>

      <Table
        columns={columns}
        data={logs || []}
        keyExtractor={(log) => log.id}
        loading={loading}
        emptyMessage="No generation logs found"
      />
    </Card>
  );
}
