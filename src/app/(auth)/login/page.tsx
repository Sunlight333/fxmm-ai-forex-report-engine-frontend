"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth-context";
import { useT } from "@/i18n/provider";
import { loginSchema, type LoginForm } from "@/lib/validation";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import toast from "react-hot-toast";

export default function LoginPage() {
  const { t } = useT();
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<LoginForm>({ email: "", password: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = loginSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0]?.toString();
        if (field) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      await login(form.email, form.password);
      router.push("/dashboard");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <h2 className="mb-1 text-xl font-bold text-white">{t("auth.welcomeBack")}</h2>
      <p className="mb-6 text-sm text-gray-500">{t("auth.welcomeBackDesc")}</p>

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
          autoComplete="current-password"
          value={form.password}
          onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
          error={errors.password}
        />

        <Button type="submit" variant="primary" loading={loading} className="w-full">
          {t("auth.signIn")}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        {t("auth.noAccount")}{" "}
        <Link href="/register" className="text-primary hover:underline">
          {t("auth.registerLink")}
        </Link>
      </p>
    </Card>
  );
}
