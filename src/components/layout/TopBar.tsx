"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";

/* ────────────────────────────────────────── */
/*  Page title resolver                       */
/* ────────────────────────────────────────── */

function usePageTitle(): string {
  const pathname = usePathname();
  const { t } = useT();

  const titleMap: Record<string, string> = {
    "/dashboard": t("nav.dashboard"),
    "/pairs": t("nav.pairs"),
    "/reports": t("nav.reports"),
    "/credits": t("nav.credits"),
    "/settings": t("nav.settings"),
    "/admin": t("nav.admin"),
    "/admin/users": t("nav.users"),
    "/admin/generation": t("nav.generation"),
    "/admin/api-status": t("nav.apiStatus"),
  };

  // Exact match first
  if (titleMap[pathname]) return titleMap[pathname];

  // Check for report/pair detail pages
  if (pathname.startsWith("/reports/")) return t("nav.reports");
  if (pathname.startsWith("/pairs/")) return t("nav.pairs");

  // Fallback
  const segments = pathname.split("/").filter(Boolean);
  return segments.length > 0
    ? titleMap[`/${segments[0]}`] || segments[0].charAt(0).toUpperCase() + segments[0].slice(1)
    : t("nav.dashboard");
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
  const pageTitle = usePageTitle();

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between bg-dark-bg px-4 shadow-card lg:px-8">
      {/* Left: hamburger (mobile) + page title */}
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuToggle}
          className="rounded-lg p-1.5 text-muted-fg hover:bg-dark-hover hover:text-foreground lg:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>

        <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
      </div>

      {/* Right: credit pill */}
      {user && (
        <div className="flex items-center gap-4">
          <Link
            href="/credits"
            className="flex items-center gap-2 rounded-xl border border-dark-border bg-dark-card px-4 py-1.5 text-xs shadow-card transition-all hover:border-primary/40 hover:shadow-card-hover"
          >
            <svg className="h-3.5 w-3.5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33" />
            </svg>
            <span className="font-mono font-semibold text-foreground">{user.credit_balance}</span>
            <span className="text-muted-fg">{t("common.credits")}</span>
          </Link>
        </div>
      )}
    </header>
  );
}
