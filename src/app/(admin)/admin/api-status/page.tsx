"use client";

import { useT } from "@/i18n/provider";
import { useApi } from "@/lib/hooks/use-api";
import { admin } from "@/lib/api";
import type { ApiStatusInfo } from "@/types/api";
import { Spinner } from "@/components/ui/Spinner";
import { ApiStatusCard } from "@/components/admin/ApiStatusCard";

export default function ApiStatusPage() {
  const { t } = useT();
  const { data: apis, loading, error, refetch } = useApi<ApiStatusInfo[]>(
    () => admin.apiStatus(),
    []
  );

  return (
    <div className="animate-fade-in">
      <p className="mb-4 text-xs text-gray-500">{t("admin.apiStatusDesc")}</p>

      {loading ? (
        <div className="flex justify-center py-12">
          <Spinner size="lg" />
        </div>
      ) : error ? (
        <div className="rounded-lg border border-supply/30 bg-supply/10 p-4 text-center">
          <p className="text-sm text-supply">{error}</p>
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {apis?.map((api) => (
            <ApiStatusCard key={api.name} api={api} onKeyUpdated={refetch} />
          ))}
        </div>
      )}
    </div>
  );
}
