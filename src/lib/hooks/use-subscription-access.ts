"use client";

import { useState, useEffect, useCallback } from "react";
import { subscriptions } from "@/lib/api";

interface AccessInfo {
  hasAccess: boolean;
  endDate: string | null;
}

interface UseSubscriptionAccessResult {
  accessMap: Record<string, AccessInfo>;
  loading: boolean;
  checkAccess: (pair: string) => boolean;
  refreshAccess: () => Promise<void>;
}

export function useSubscriptionAccess(): UseSubscriptionAccessResult {
  const [accessMap, setAccessMap] = useState<Record<string, AccessInfo>>({});
  const [loading, setLoading] = useState(true);

  const fetchAccess = useCallback(async () => {
    try {
      const res = await subscriptions.checkAll();
      const map: Record<string, AccessInfo> = {};
      for (const [pair, info] of Object.entries(res.pairs)) {
        map[pair] = { hasAccess: info.has_access, endDate: info.end_date };
      }
      setAccessMap(map);
    } catch {
      // Fail gracefully — all pairs show as locked
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccess();
  }, [fetchAccess]);

  const checkAccess = useCallback(
    (pair: string) => accessMap[pair]?.hasAccess ?? false,
    [accessMap]
  );

  return { accessMap, loading, checkAccess, refreshAccess: fetchAccess };
}
