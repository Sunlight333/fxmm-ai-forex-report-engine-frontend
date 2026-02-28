"use client";

import { useState } from "react";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";
import { credits } from "@/lib/api";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import toast from "react-hot-toast";

const PRESET_AMOUNTS = [
  { amount: 1, label: "Starter", desc: "1 pair for 5 days" },
  { amount: 5, label: "Standard", desc: "5 pairs for 5 days" },
  { amount: 10, label: "Pro", desc: "10 pairs for 5 days" },
  { amount: 20, label: "Premium", desc: "20 uses" },
];

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
    <div className="rounded-xl border border-dark-border bg-dark-card shadow-card p-5">
      <h3 className="mb-1 text-sm font-semibold text-foreground">{t("credits.purchase")}</h3>
      <p className="mb-4 text-xs text-muted-fg">{t("credits.purchaseDesc")}</p>

      {/* Preset cards */}
      <div className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {PRESET_AMOUNTS.map(({ amount: amt, label, desc }) => (
          <button
            key={amt}
            onClick={() => {
              setAmount(amt);
              setCustomMode(false);
              setError("");
            }}
            className={cn(
              "flex flex-col items-center rounded-lg border p-3 transition-all",
              !customMode && amount === amt
                ? "border-primary bg-primary-light shadow-sm shadow-primary/10"
                : "border-dark-border hover:border-dark-border-hover"
            )}
          >
            <span className={cn(
              "text-2xl font-bold tabular-nums",
              !customMode && amount === amt ? "text-primary" : "text-foreground"
            )}>
              {amt}
            </span>
            <span className="text-[11px] font-medium text-muted-fg">{label}</span>
            <span className="text-[10px] text-subtle">{desc}</span>
          </button>
        ))}
      </div>

      {/* Custom toggle */}
      <button
        onClick={() => setCustomMode((v) => !v)}
        className={cn(
          "mb-3 rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
          customMode
            ? "border-primary bg-primary-light text-primary"
            : "border-dark-border text-muted-fg hover:text-foreground"
        )}
      >
        {t("credits.customAmount")}
      </button>

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
    </div>
  );
}
