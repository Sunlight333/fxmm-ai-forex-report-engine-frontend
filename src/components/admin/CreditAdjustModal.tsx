"use client";

import { useState } from "react";
import { useT } from "@/i18n/provider";
import { admin } from "@/lib/api";
import type { User } from "@/types/api";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

interface CreditAdjustModalProps {
  user: User;
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function CreditAdjustModal({ user, open, onClose, onSuccess }: CreditAdjustModalProps) {
  const { t } = useT();
  const [amount, setAmount] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async () => {
    const errs: Record<string, string> = {};
    const numAmount = parseInt(amount, 10);

    if (!amount || isNaN(numAmount)) errs.amount = "Enter a valid number";
    if (!reason.trim()) errs.reason = "Reason is required";

    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }

    setLoading(true);
    try {
      await admin.adjustCredits(user.id, numAmount, reason.trim());
      toast.success(`Adjusted ${numAmount} credits for ${user.email}`);
      onSuccess();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to adjust credits");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={`${t("admin.adjustCredits")} — ${user.email}`}>
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-500">
            Current balance: <span className="font-mono text-white">{user.credit_balance}</span>
          </p>
        </div>

        <Input
          label={t("admin.adjustAmount")}
          type="number"
          value={amount}
          onChange={(e) => {
            setAmount(e.target.value);
            setErrors((prev) => ({ ...prev, amount: "" }));
          }}
          placeholder="e.g. 10 or -5"
          error={errors.amount}
        />

        <Input
          label={t("admin.adjustReason")}
          value={reason}
          onChange={(e) => {
            setReason(e.target.value);
            setErrors((prev) => ({ ...prev, reason: "" }));
          }}
          placeholder="Reason for adjustment"
          error={errors.reason}
        />

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={loading}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} loading={loading}>
            {t("common.confirm")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
