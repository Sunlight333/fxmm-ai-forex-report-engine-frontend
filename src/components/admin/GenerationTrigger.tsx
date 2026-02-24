"use client";

import { useState } from "react";
import { useT } from "@/i18n/provider";
import { admin } from "@/lib/api";
import { formatPair } from "@/lib/utils";
import { FX_PAIRS } from "@/types/api";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { Select } from "@/components/ui/Select";
import toast from "react-hot-toast";

export function GenerationTrigger() {
  const { t } = useT();
  const [selectedPairs, setSelectedPairs] = useState<string[]>([...FX_PAIRS]);
  const [language, setLanguage] = useState("en");
  const [loading, setLoading] = useState(false);

  const togglePair = (pair: string) => {
    setSelectedPairs((prev) =>
      prev.includes(pair) ? prev.filter((p) => p !== pair) : [...prev, pair]
    );
  };

  const toggleAll = () => {
    setSelectedPairs((prev) =>
      prev.length === FX_PAIRS.length ? [] : [...FX_PAIRS]
    );
  };

  const handleTrigger = async () => {
    if (selectedPairs.length === 0) {
      toast.error("Select at least one pair");
      return;
    }

    setLoading(true);
    try {
      await admin.triggerGeneration(selectedPairs, language);
      toast.success(`Generation triggered for ${selectedPairs.length} pairs`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Generation failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader title={t("admin.triggerGeneration")} />
      <p className="mb-4 text-sm text-gray-500">{t("admin.triggerDesc")}</p>

      <div className="mb-4">
        <Select
          label={t("auth.language")}
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          options={[
            { value: "en", label: "English" },
            { value: "es", label: "Spanish" },
          ]}
        />
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-sm font-medium text-gray-300">{t("admin.selectPairs")}</span>
          <button
            onClick={toggleAll}
            className="text-xs text-primary hover:underline"
          >
            {selectedPairs.length === FX_PAIRS.length ? "Deselect All" : t("admin.selectAll")}
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
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

      <Button
        variant="primary"
        onClick={handleTrigger}
        loading={loading}
        disabled={selectedPairs.length === 0}
        className="w-full"
      >
        {t("admin.triggerNow")} ({selectedPairs.length} {t("nav.pairs").toLowerCase()})
      </Button>
    </Card>
  );
}
