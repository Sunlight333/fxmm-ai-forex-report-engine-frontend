"use client";

import { useT } from "@/i18n/provider";
import { useApi } from "@/lib/hooks/use-api";
import { health } from "@/lib/api";
import type { HealthResponse } from "@/types/api";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";

export function SystemHealthCard() {
  const { t } = useT();
  const { data, loading, error } = useApi<HealthResponse>(() => health.check(), []);

  return (
    <Card>
      <CardHeader title={t("admin.health")} />

      {loading ? (
        <div className="flex justify-center py-4">
          <Spinner />
        </div>
      ) : error ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{t("admin.apiHealth")}</span>
            <Badge variant="danger">Offline</Badge>
          </div>
          <p className="text-xs text-supply">{error}</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{t("admin.apiHealth")}</span>
            <Badge variant={data?.status === "ok" ? "success" : "danger"}>
              {data?.status === "ok" ? "Online" : "Error"}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">{t("admin.dbStatus")}</span>
            <Badge variant={data?.database === "connected" ? "success" : "danger"}>
              {data?.database === "connected" ? t("admin.connected") : "Disconnected"}
            </Badge>
          </div>
        </div>
      )}
    </Card>
  );
}
