"use client";

import { useState } from "react";
import { useT } from "@/i18n/provider";
import { admin } from "@/lib/api";
import type { ApiStatusInfo, ApiTestResult } from "@/types/api";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Spinner } from "@/components/ui/Spinner";
import { EditApiKeyModal } from "./EditApiKeyModal";

interface ApiStatusCardProps {
  api: ApiStatusInfo;
  onKeyUpdated: () => void;
}

export function ApiStatusCard({ api, onKeyUpdated }: ApiStatusCardProps) {
  const { t } = useT();
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<ApiTestResult | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await admin.testApi(api.name);
      setTestResult(result);
    } catch (err) {
      setTestResult({
        name: api.name,
        status: "offline",
        response_time_ms: null,
        error: err instanceof Error ? err.message : "Test failed",
        checked_at: new Date().toISOString(),
      });
    } finally {
      setTesting(false);
    }
  };

  const statusBadge = () => {
    if (!api.requires_key) {
      return <Badge variant="info">{t("admin.publicApi")}</Badge>;
    }
    if (api.has_key) {
      return <Badge variant="success">{t("admin.configured")}</Badge>;
    }
    return <Badge variant="danger">{t("admin.notConfigured")}</Badge>;
  };

  const testStatusBadge = () => {
    if (!testResult) return null;
    switch (testResult.status) {
      case "online":
        return <Badge variant="success">{t("admin.online")}</Badge>;
      case "offline":
        return <Badge variant="danger">{t("admin.offline")}</Badge>;
      case "no_key":
        return <Badge variant="warning">{t("admin.notConfigured")}</Badge>;
      default:
        return <Badge variant="danger">{testResult.status}</Badge>;
    }
  };

  return (
    <>
      <Card>
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="text-sm font-semibold text-foreground">{api.display_name}</h3>
            <p className="text-xs text-muted-fg mt-0.5">{api.description}</p>
          </div>
          {statusBadge()}
        </div>

        <div className="space-y-1.5 mb-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-fg">Key:</span>
            <code className="text-xs text-foreground font-mono">{api.masked_key}</code>
          </div>
          {api.has_secondary && api.masked_secondary && (
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-fg">Password:</span>
              <code className="text-xs text-foreground font-mono">{api.masked_secondary}</code>
            </div>
          )}
        </div>

        {testing && (
          <div className="flex items-center gap-2 rounded bg-dark-surface p-2 mb-3">
            <Spinner size="sm" />
            <span className="text-xs text-muted-fg">Testing connection...</span>
          </div>
        )}

        {testResult && !testing && (
          <div className="rounded bg-dark-surface p-2 mb-3">
            <div className="flex items-center gap-2">
              {testStatusBadge()}
              {testResult.response_time_ms != null && (
                <span className="text-xs text-muted-fg">
                  {testResult.response_time_ms}ms
                </span>
              )}
            </div>
            {testResult.error && (
              <p className="text-xs text-supply mt-1 break-all">{testResult.error}</p>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={handleTest} loading={testing}>
            {t("admin.testConnection")}
          </Button>
          {api.requires_key && (
            <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}>
              {t("admin.editKey")}
            </Button>
          )}
        </div>
      </Card>

      <EditApiKeyModal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        apiName={api.name}
        displayName={api.display_name}
        hasSecondary={api.has_secondary}
        onSuccess={onKeyUpdated}
      />
    </>
  );
}
