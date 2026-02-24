"use client";

import { AdminGuard } from "@/components/layout/AdminGuard";
import { AppShell } from "@/components/layout/AppShell";
import { ErrorBoundary } from "@/components/feedback/ErrorBoundary";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminGuard>
      <AppShell>
        <ErrorBoundary>{children}</ErrorBoundary>
      </AppShell>
    </AdminGuard>
  );
}
