"use client";

import { useT } from "@/i18n/provider";
import { useApi } from "@/lib/hooks/use-api";
import { admin } from "@/lib/api";
import type { User } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { UserTable } from "@/components/admin/UserTable";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function AdminUsersPage() {
  const { t } = useT();

  const { data: users, loading, refetch } = useApi<User[]>(
    () => admin.users(),
    []
  );

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t("admin.userTable")}
        action={
          <Link href="/admin">
            <Button variant="secondary" size="sm">{t("common.back")}</Button>
          </Link>
        }
      />

      <Card padding="none">
        <UserTable
          users={users || []}
          loading={loading}
          onCreditAdjust={refetch}
        />
      </Card>
    </div>
  );
}
