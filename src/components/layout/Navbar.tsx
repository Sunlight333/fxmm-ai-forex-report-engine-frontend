"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

const navLinks = [
  { key: "dashboard", href: "/dashboard" },
  { key: "pairs", href: "/pairs" },
  { key: "credits", href: "/credits" },
  { key: "settings", href: "/settings" },
] as const;

export function Navbar() {
  const { user, logout } = useAuth();
  const { t } = useT();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-0 z-40 border-b border-dark-border bg-dark-surface/95 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2">
          <span className="text-lg font-bold text-white">FXMM</span>
          <span className="hidden text-xs text-gray-500 sm:inline">AI Forex Reports</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? "bg-dark-hover text-white"
                  : "text-gray-400 hover:text-white hover:bg-dark-hover"
              )}
            >
              {t(`nav.${key}`)}
            </Link>
          ))}
          {user?.is_admin && (
            <Link
              href="/admin"
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-dark-hover text-white"
                  : "text-gray-400 hover:text-white hover:bg-dark-hover"
              )}
            >
              {t("nav.admin")}
            </Link>
          )}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          {user && (
            <>
              <Link
                href="/credits"
                className="hidden items-center gap-1.5 text-sm text-gray-400 hover:text-white sm:flex"
              >
                <span className="font-mono font-medium text-white">
                  {user.credit_balance}
                </span>
                {t("common.credits")}
              </Link>
              <Badge variant={user.tier === "professional" ? "tier-professional" : "tier-retail"}>
                {user.tier}
              </Badge>
              <Button variant="ghost" size="sm" onClick={handleLogout} className="hidden md:flex">
                {t("nav.logout")}
              </Button>
            </>
          )}

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-dark-hover hover:text-white md:hidden"
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <nav className="border-t border-dark-border bg-dark-surface px-4 py-2 md:hidden animate-slide-up">
          {navLinks.map(({ key, href }) => (
            <Link
              key={key}
              href={href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith(href)
                  ? "bg-dark-hover text-white"
                  : "text-gray-400 hover:text-white"
              )}
            >
              {t(`nav.${key}`)}
            </Link>
          ))}
          {user?.is_admin && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                pathname.startsWith("/admin")
                  ? "bg-dark-hover text-white"
                  : "text-gray-400 hover:text-white"
              )}
            >
              {t("nav.admin")}
            </Link>
          )}
          {user && (
            <div className="mt-2 flex items-center justify-between border-t border-dark-border pt-2">
              <span className="text-sm text-gray-400">
                <span className="font-mono font-medium text-white">{user.credit_balance}</span> {t("common.credits")}
              </span>
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                {t("nav.logout")}
              </Button>
            </div>
          )}
        </nav>
      )}
    </header>
  );
}
