"use client";

import { useT } from "@/i18n/provider";
import { useApi } from "@/lib/hooks/use-api";
import { admin } from "@/lib/api";
import type { User } from "@/types/api";
import { UserTable } from "@/components/admin/UserTable";

export default function AdminUsersPage() {
  const { t } = useT();

  const { data: users, loading, refetch } = useApi<User[]>(
    () => admin.users(),
    []
  );

  return (
    <div className="animate-fade-in">
      <div className="overflow-hidden rounded-xl border border-dark-border bg-dark-card shadow-card">
        <UserTable
          users={users || []}
          loading={loading}
          onCreditAdjust={refetch}
        />
      </div>
    </div>
  );
}
