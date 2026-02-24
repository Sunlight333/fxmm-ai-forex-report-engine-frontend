"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function RegisterPage() {
  const { t } = useT();
  const { register } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    language: "en",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = "Invalid email address";
    }
    if (form.password.length < 8) {
      errs.password = "Password must be at least 8 characters";
    }
    if (form.password !== form.confirmPassword) {
      errs.confirmPassword = "Passwords do not match";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      await register(form.email, form.password);
      toast.success("Account created successfully!");
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="mb-1 text-xl font-bold text-white">{t("auth.createAccount")}</h2>
      <p className="mb-6 text-sm text-gray-500">{t("auth.createAccountDesc")}</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("auth.email")}
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
          error={errors.email}
        />

        <Input
          label={t("auth.password")}
          type="password"
          autoComplete="new-password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          error={errors.password}
        />

        <Input
          label={t("auth.confirmPassword")}
          type="password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
          error={errors.confirmPassword}
        />

        <Select
          label={t("auth.language")}
          value={form.language}
          onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))}
          options={[
            { value: "en", label: "English" },
            { value: "es", label: "Espa\u00f1ol" },
          ]}
        />

        <Button type="submit" variant="primary" loading={loading} className="w-full">
          {t("auth.signUp")}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        {t("auth.hasAccount")}{" "}
        <Link href="/login" className="text-primary hover:underline">
          {t("auth.loginLink")}
        </Link>
      </p>
    </Card>
  );
}
