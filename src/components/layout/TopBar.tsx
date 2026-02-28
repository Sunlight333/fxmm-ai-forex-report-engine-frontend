"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";

/* ────────────────────────────────────────── */
/*  Breadcrumb path resolver                  */
/* ────────────────────────────────────────── */

function useBreadcrumb(): string {
  const pathname = usePathname();
  const { t } = useT();

  const segmentMap: Record<string, string> = {
    dashboard: t("nav.dashboard"),
    pairs: t("nav.pairs"),
    reports: t("nav.reports"),
    credits: t("nav.credits"),
    settings: t("nav.settings"),
    admin: t("nav.admin"),
    users: t("nav.users"),
    generation: t("nav.generation"),
    "api-status": t("nav.apiStatus"),
  };

  const segments = pathname.split("/").filter(Boolean);
  const labels = segments.map((s) => segmentMap[s] ?? s.toUpperCase());
  return labels.join(" / ");
}

/* ────────────────────────────────────────── */
/*  TopBar component                          */
/* ────────────────────────────────────────── */

interface TopBarProps {
  onMenuToggle: () => void;
}

export function TopBar({ onMenuToggle }: TopBarProps) {
  const { user } = useAuth();
  const { t } = useT();
  const breadcrumb = useBreadcrumb();

  return (
    <header className="sticky top-0 z-20 flex h-12 items-center justify-between border-b border-dark-border bg-dark-surface/95 px-4 backdrop-blur lg:px-6">
      {/* Left: hamburger (mobile) + breadcrumb */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-dark-hover hover:text-white lg:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <span className="text-sm font-medium text-gray-400">{breadcrumb}</span>
      </div>

      {/* Right: credit pill */}
      {user && (
        <div className="flex items-center gap-4">
          <Link
            href="/credits"
            className="flex items-center gap-1.5 rounded-full border border-dark-border bg-dark-card px-3 py-1 text-xs transition-colors hover:border-primary/40"
          >
            <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
            </svg>
            <span className="font-mono font-semibold text-white">{user.credit_balance}</span>
            <span className="text-gray-500">{t("common.credits")}</span>
          </Link>
        </div>
      )}
    </header>
  );
}
