"use client";

import { useT } from "@/i18n/provider";
import { PageHeader } from "@/components/layout/PageHeader";
import { GenerationTrigger } from "@/components/admin/GenerationTrigger";
import { GenerationLogs } from "@/components/admin/GenerationLogs";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function AdminGenerationPage() {
  const { t } = useT();

  return (
    <div className="animate-fade-in">
      <PageHeader
        title={t("admin.generation")}
        action={
          <Link href="/admin">
            <Button variant="secondary" size="sm">{t("common.back")}</Button>
          </Link>
        }
      />

      <div className="space-y-6">
        <GenerationTrigger />
        <GenerationLogs />
      </div>
    </div>
  );
}
