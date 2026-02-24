"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";
import { credits } from "@/lib/api";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

const PRESET_AMOUNTS = [1, 5, 10, 20];

interface PurchaseFormProps {
  onPurchase: () => void;
}

export function PurchaseForm({ onPurchase }: PurchaseFormProps) {
  const { t } = useT();
  const { refreshUser } = useAuth();
  const [amount, setAmount] = useState<number>(5);
  const [customMode, setCustomMode] = useState(false);
  const [customValue, setCustomValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handlePurchase = async () => {
    const qty = customMode ? parseInt(customValue, 10) : amount;

    if (!qty || qty < 1 || qty > 100) {
      setError("Amount must be between 1 and 100");
      return;
    }

    setLoading(true);
    setError("");
    try {
      await credits.purchase(qty);
      await refreshUser();
      toast.success(`Purchased ${qty} credits`);
      onPurchase();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Purchase failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader title={t("credits.purchase")} />
      <p className="mb-4 text-sm text-gray-500">{t("credits.purchaseDesc")}</p>

      {/* Preset buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {PRESET_AMOUNTS.map((amt) => (
          <button
            key={amt}
            onClick={() => {
              setAmount(amt);
              setCustomMode(false);
              setError("");
            }}
            className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
              !customMode && amount === amt
                ? "border-primary bg-primary-light text-primary"
                : "border-dark-border text-gray-400 hover:border-gray-500"
            }`}
          >
            {amt} {t("common.credits")}
          </button>
        ))}
        <button
          onClick={() => setCustomMode(true)}
          className={`rounded-lg border px-4 py-2 text-sm font-medium transition-colors ${
            customMode
              ? "border-primary bg-primary-light text-primary"
              : "border-dark-border text-gray-400 hover:border-gray-500"
          }`}
        >
          {t("credits.customAmount")}
        </button>
      </div>

      {customMode && (
        <div className="mb-4">
          <Input
            type="number"
            min={1}
            max={100}
            value={customValue}
            onChange={(e) => {
              setCustomValue(e.target.value);
              setError("");
            }}
            placeholder="1-100"
            error={error}
          />
        </div>
      )}

      <Button
        variant="primary"
        onClick={handlePurchase}
        loading={loading}
        className="w-full"
      >
        {t("credits.buyNow")} ({customMode ? customValue || "0" : amount} {t("common.credits")})
      </Button>
    </Card>
  );
}
