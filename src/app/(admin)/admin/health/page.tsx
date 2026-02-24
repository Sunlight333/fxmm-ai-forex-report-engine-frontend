"use client";

import { useT } from "@/i18n/provider";
import { PageHeader } from "@/components/layout/PageHeader";
import { SystemHealthCard } from "@/components/admin/SystemHealthCard";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function AdminHealthPage() {
  const { t } = useT();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t("admin.health")}
        action={
          <Link href="/admin">
            <Button variant="secondary" size="sm">{t("common.back")}</Button>
          </Link>
        }
      />

      <div className="max-w-md">
        <SystemHealthCard />
      </div>
    </div>
  );
}
