"use client";

import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";

export function GreetingHero() {
  const { user } = useAuth();
  const { t } = useT();

  const hour = new Date().getHours();
  const greeting =
    hour < 12
      ? t("dashboard.greetingMorning")
      : hour < 18
        ? t("dashboard.greetingAfternoon")
        : t("dashboard.greetingEvening");

  const displayName = user?.email?.split("@")[0] || "";

  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="rounded-xl bg-gradient-to-r from-primary-light via-transparent to-transparent px-6 py-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {greeting}, {displayName}
          </h1>
          <p className="mt-1 text-sm text-muted-fg">
            {t("dashboard.greetingSubtitle")}
          </p>
        </div>
        <span className="hidden text-sm text-muted-fg md:block">{today}</span>
      </div>
    </div>
  );
}
