"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";
import { user as userApi } from "@/lib/api";
import { formatPair } from "@/lib/utils";
import { FX_PAIRS } from "@/types/api";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
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
    <Card>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-gray-500">{t("settings.email")}</label>
          <p className="mt-1 text-white">{user.email}</p>
        </div>
        <div>
          <label className="text-sm text-gray-500">{t("dashboard.tier")}</label>
          <div className="mt-1">
            <Badge variant={user.tier === "professional" ? "tier-professional" : "tier-retail"}>
              {user.tier}
            </Badge>
          </div>
        </div>
        <div>
          <label className="text-sm text-gray-500">{t("settings.memberSince")}</label>
          <p className="mt-1 text-white">
            {format(new Date(user.created_at), "MMMM d, yyyy")}
          </p>
        </div>
      </div>
    </Card>
  );

  const preferencesTab = (
    <Card>
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

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
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
    </Card>
  );

  const notificationsTab = (
    <Card>
      <p className="text-sm text-gray-500">{t("settings.notificationSettings")}</p>
    </Card>
  );

  return (
    <div className="animate-fade-in">
      <PageHeader title={t("settings.title")} />
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
