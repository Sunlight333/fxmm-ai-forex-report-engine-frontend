"use client";

import Link from "next/link";
import { useT } from "@/i18n/provider";
import { useApi } from "@/lib/hooks/use-api";
import { admin } from "@/lib/api";
import type { User } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SystemHealthCard } from "@/components/admin/SystemHealthCard";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";

export default function AdminOverviewPage() {
  const { t } = useT();

  const { data: users } = useApi<User[]>(() => admin.users(), []);

  const totalUsers = users?.length || 0;
  const adminCount = users?.filter((u) => u.is_admin).length || 0;
  const proCount = users?.filter((u) => u.tier === "professional").length || 0;

  return (
    <div className="animate-fade-in">
      <PageHeader title={t("admin.title")} />

      {/* Stats */}
      <div className="mb-8 grid gap-4 grid-cols-1 sm:grid-cols-3">
        <StatsCard
          label={t("admin.totalUsers")}
          value={totalUsers}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          label="Professional Users"
          value={proCount}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
          }
        />
        <StatsCard
          label="Admin Users"
          value={adminCount}
          icon={
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          }
        />
      </div>

      {/* Quick actions */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <h3 className="mb-4 text-base font-semibold text-white">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/admin/users" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                {t("admin.userTable")}
              </Button>
            </Link>
            <Link href="/admin/generation" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                {t("admin.triggerGeneration")}
              </Button>
            </Link>
            <Link href="/admin/api-status" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                {t("admin.apiStatus")}
              </Button>
            </Link>
            <Link href="/admin/health" className="block">
              <Button variant="secondary" size="sm" className="w-full justify-start">
                {t("admin.health")}
              </Button>
            </Link>
          </div>
        </Card>

        <SystemHealthCard />
      </div>
    </div>
  );
}
