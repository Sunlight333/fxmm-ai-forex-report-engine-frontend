"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { useTheme } from "@/lib/theme-context";
import { useT } from "@/i18n/provider";
import { user as userApi } from "@/lib/api";
import { formatPair } from "@/lib/utils";
import { FX_PAIRS } from "@/types/api";
import { Tabs } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Spinner } from "@/components/ui/Spinner";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const { t } = useT();
  const { user, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();
  const [language, setLanguage] = useState(user?.language || "en");
  const [selectedPairs, setSelectedPairs] = useState<string[]>(user?.selected_pairs || []);
  const [saving, setSaving] = useState(false);

  if (!user) {
    return (
      <div className="flex justify-center py-12">
        <Spinner size="lg" />
      </div>
    );
  }

  const togglePair = (pair: string) => {
    setSelectedPairs((prev) =>
      prev.includes(pair) ? prev.filter((p) => p !== pair) : [...prev, pair]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userApi.update({ language, selected_pairs: selectedPairs });
      await refreshUser();
      toast.success(t("settings.saved"));
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const profileTab = (
    <div className="rounded-xl border border-dark-border bg-dark-card shadow-card p-5">
      <div className="space-y-5">
        <div>
          <label className="text-xs font-medium uppercase tracking-wider text-muted-fg">{t("settings.email")}</label>
          <p className="mt-1 text-sm text-foreground">{user.email}</p>
        </div>
        <div className="border-t border-dark-border pt-5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-fg">{t("dashboard.tier")}</label>
          <div className="mt-1">
            <Badge variant={user.tier === "professional" ? "tier-professional" : "tier-retail"}>
              {user.tier}
            </Badge>
          </div>
        </div>
        <div className="border-t border-dark-border pt-5">
          <label className="text-xs font-medium uppercase tracking-wider text-muted-fg">{t("settings.memberSince")}</label>
          <p className="mt-1 text-sm text-foreground">
            {format(new Date(user.created_at), "MMMM d, yyyy")}
          </p>
        </div>
      </div>
    </div>
  );

  const preferencesTab = (
    <div className="rounded-xl border border-dark-border bg-dark-card shadow-card p-5">
      <div className="space-y-6">
        <Select
          label={t("settings.language")}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          options={[
            { value: "en", label: t("settings.english") },
            { value: "es", label: t("settings.spanish") },
          ]}
        />

        <div className="border-t border-dark-border pt-5">
          <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-fg">
            {t("settings.theme")}
          </label>
          <div className="flex gap-2">
            {(["light", "dark", "system"] as const).map((opt) => (
              <button
                key={opt}
                onClick={() => setTheme(opt)}
                className={`flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                  theme === opt
                    ? "border-primary bg-primary-light text-primary"
                    : "border-dark-border bg-dark-card text-muted-fg hover:border-primary/40"
                }`}
              >
                {opt === "light" && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
                  </svg>
                )}
                {opt === "dark" && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
                  </svg>
                )}
                {opt === "system" && (
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 12V5.25" />
                  </svg>
                )}
                {t(`settings.theme${opt.charAt(0).toUpperCase() + opt.slice(1)}`)}
              </button>
            ))}
          </div>
        </div>

        <div className="border-t border-dark-border pt-5">
          <label className="mb-3 block text-xs font-medium uppercase tracking-wider text-muted-fg">
            {t("settings.preferredPairs")}
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {FX_PAIRS.map((pair) => (
              <Checkbox
                key={pair}
                label={formatPair(pair)}
                checked={selectedPairs.includes(pair)}
                onChange={() => togglePair(pair)}
              />
            ))}
          </div>
        </div>

        <Button variant="primary" onClick={handleSave} loading={saving}>
          {t("common.save")}
        </Button>
      </div>
    </div>
  );

  const notificationsTab = (
    <div className="rounded-xl border border-dark-border bg-dark-card shadow-card p-5">
      <p className="text-sm text-muted-fg">{t("settings.notificationSettings")}</p>
    </div>
  );

  return (
    <div className="animate-fade-in">
      <Tabs
        items={[
          { label: t("settings.profile"), content: profileTab },
          { label: t("settings.preferences"), content: preferencesTab },
          { label: t("settings.notifications"), content: notificationsTab },
        ]}
      />
    </div>
  );
}
