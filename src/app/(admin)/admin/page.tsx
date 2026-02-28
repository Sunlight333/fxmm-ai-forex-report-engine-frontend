"use client";

import Link from "next/link";
import { useT } from "@/i18n/provider";
import { useApi } from "@/lib/hooks/use-api";
import { admin } from "@/lib/api";
import type { User } from "@/types/api";
import { StatsCard } from "@/components/dashboard/StatsCard";
import { SystemHealthCard } from "@/components/admin/SystemHealthCard";
import { cn } from "@/lib/utils";

const quickActions = [
  {
    key: "users" as const,
    href: "/admin/users",
    icon: "M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z",
    labelKey: "admin.userTable",
  },
  {
    key: "generation" as const,
    href: "/admin/generation",
    icon: "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
    labelKey: "admin.triggerGeneration",
  },
  {
    key: "apiStatus" as const,
    href: "/admin/api-status",
    icon: "M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5",
    labelKey: "admin.apiStatus",
  },
  {
    key: "health" as const,
    href: "/admin/health",
    icon: "M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z",
    labelKey: "admin.health",
  },
];

export default function AdminOverviewPage() {
  const { t } = useT();

  const { data: users } = useApi<User[]>(() => admin.users(), []);

  const totalUsers = users?.length || 0;
  const adminCount = users?.filter((u) => u.is_admin).length || 0;
  const proCount = users?.filter((u) => u.tier === "professional").length || 0;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Stats */}
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-3">
        <StatsCard
          label={t("admin.totalUsers")}
          value={totalUsers}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          }
        />
        <StatsCard
          label="Professional Users"
          value={proCount}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
            </svg>
          }
        />
        <StatsCard
          label="Admin Users"
          value={adminCount}
          icon={
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
            </svg>
          }
        />
      </div>

      {/* Quick actions + Health */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-xl border border-dark-border bg-dark-card p-5 shadow-card">
          <h3 className="mb-4 text-sm font-semibold text-foreground">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-2">
            {quickActions.map(({ key, href, icon, labelKey }) => (
              <Link
                key={key}
                href={href}
                className="flex items-center gap-3 rounded-lg border border-dark-border bg-dark-surface p-3 transition-all hover:border-primary/30 hover:bg-dark-hover"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light">
                  <svg className="h-4 w-4 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                  </svg>
                </div>
                <span className="text-xs font-medium text-foreground">{t(labelKey)}</span>
              </Link>
            ))}
          </div>
        </div>

        <SystemHealthCard />
      </div>
    </div>
  );
}
