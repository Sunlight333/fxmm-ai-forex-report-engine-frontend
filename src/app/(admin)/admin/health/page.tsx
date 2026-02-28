"use client";

import { useT } from "@/i18n/provider";
import { SystemHealthCard } from "@/components/admin/SystemHealthCard";

export default function AdminHealthPage() {
  const { t } = useT();

  return (
    <div className="animate-fade-in">
      <div className="max-w-md">
        <SystemHealthCard />
      </div>
    </div>
  );
}
