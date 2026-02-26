"use client";

import { useState } from "react";
import { useT } from "@/i18n/provider";
import { admin } from "@/lib/api";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";

interface EditApiKeyModalProps {
  open: boolean;
  onClose: () => void;
  apiName: string;
  displayName: string;
  hasSecondary: boolean;
  onSuccess: () => void;
}

export function EditApiKeyModal({
  open,
  onClose,
  apiName,
  displayName,
  hasSecondary,
  onSuccess,
}: EditApiKeyModalProps) {
  const { t } = useT();
  const [keyValue, setKeyValue] = useState("");
  const [secondaryValue, setSecondaryValue] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    if (!keyValue.trim()) {
      setError(hasSecondary ? "Email is required" : "API key is required");
      return;
    }
    if (!password.trim()) {
      setError(t("admin.confirmPassword"));
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await admin.updateApiKey(
        apiName,
        keyValue.trim(),
        password.trim(),
        hasSecondary ? secondaryValue.trim() || undefined : undefined,
      );
      setKeyValue("");
      setSecondaryValue("");
      setPassword("");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setKeyValue("");
    setSecondaryValue("");
    setPassword("");
    setError(null);
    onClose();
  };

  return (
    <Modal open={open} onClose={handleClose} title={`${t("admin.updateKey")} — ${displayName}`}>
      <div className="space-y-4">
        <Input
          label={hasSecondary ? "Email" : "API Key"}
          type={hasSecondary ? "email" : "password"}
          value={keyValue}
          onChange={(e) => setKeyValue(e.target.value)}
          placeholder={hasSecondary ? "Enter email" : "Enter new API key"}
        />

        {hasSecondary && (
          <Input
            label="Password"
            type="password"
            value={secondaryValue}
            onChange={(e) => setSecondaryValue(e.target.value)}
            placeholder="Enter service password"
          />
        )}

        <div className="border-t border-dark-border pt-4">
          <Input
            label={t("admin.confirmPassword")}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your admin password"
            error={error || undefined}
          />
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <Button variant="secondary" size="sm" onClick={handleClose}>
            {t("common.cancel")}
          </Button>
          <Button variant="primary" size="sm" onClick={handleSubmit} loading={loading}>
            {t("admin.updateKey")}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
