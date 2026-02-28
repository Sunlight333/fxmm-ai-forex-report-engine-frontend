"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useT } from "@/i18n/provider";
import type { User } from "@/types/api";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Table } from "@/components/ui/Table";
import { CreditAdjustModal } from "./CreditAdjustModal";

interface UserTableProps {
  users: User[];
  loading?: boolean;
  onCreditAdjust: () => void;
}

export function UserTable({ users, loading, onCreditAdjust }: UserTableProps) {
  const { t } = useT();
  const [adjustUser, setAdjustUser] = useState<User | null>(null);

  const columns = [
    {
      key: "email",
      header: t("admin.email"),
      render: (u: User) => <span className="text-foreground">{u.email}</span>,
    },
    {
      key: "tier",
      header: t("admin.tier"),
      render: (u: User) => (
        <Badge variant={u.tier === "professional" ? "tier-professional" : "tier-retail"}>
          {u.tier}
        </Badge>
      ),
    },
    {
      key: "credits",
      header: t("admin.credits"),
      render: (u: User) => <span className="font-mono">{u.credit_balance}</span>,
    },
    {
      key: "admin",
      header: t("admin.isAdmin"),
      render: (u: User) =>
        u.is_admin ? <Badge variant="warning">Admin</Badge> : <span className="text-subtle">—</span>,
    },
    {
      key: "joined",
      header: t("admin.joined"),
      render: (u: User) => (
        <span className="text-subtle">
          {format(new Date(u.created_at), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      key: "actions",
      header: t("common.actions"),
      render: (u: User) => (
        <Button variant="ghost" size="sm" onClick={() => setAdjustUser(u)}>
          {t("admin.adjustCredits")}
        </Button>
      ),
    },
  ];

  return (
    <>
      <Table
        columns={columns}
        data={users}
        keyExtractor={(u) => u.id}
        loading={loading}
        emptyMessage="No users found"
      />

      {adjustUser && (
        <CreditAdjustModal
          user={adjustUser}
          open={!!adjustUser}
          onClose={() => setAdjustUser(null)}
          onSuccess={() => {
            setAdjustUser(null);
            onCreditAdjust();
          }}
        />
      )}
    </>
  );
}
