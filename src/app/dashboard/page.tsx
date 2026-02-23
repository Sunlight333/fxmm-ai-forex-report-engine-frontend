"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { subscriptions as subApi, credits as creditsApi } from "@/lib/api";
import { FX_PAIRS, type Subscription } from "@/types/api";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [pairAccess, setPairAccess] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (user) {
      subApi.list().then(setSubs).catch(() => {});
      // Check access for each pair
      Promise.all(
        FX_PAIRS.map(async (pair) => {
          try {
            const res = await subApi.check(pair);
            return [pair, res.has_access] as const;
          } catch {
            return [pair, false] as const;
          }
        })
      ).then((results) => {
        const map: Record<string, boolean> = {};
        results.forEach(([pair, access]) => (map[pair] = access));
        setPairAccess(map);
      });
    }
  }, [user]);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;
  if (!user) return null;

  const activeSubs = subs.filter((s) => s.is_active);

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-dark-card border border-dark-border rounded-lg p-4">
            <div className="text-sm text-gray-400">Credits</div>
            <div className="text-2xl font-bold">{user.credit_balance}</div>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-lg p-4">
            <div className="text-sm text-gray-400">Active Pairs</div>
            <div className="text-2xl font-bold">{activeSubs.length}</div>
          </div>
          <div className="bg-dark-card border border-dark-border rounded-lg p-4">
            <div className="text-sm text-gray-400">Tier</div>
            <div className="text-2xl font-bold capitalize">{user.tier}</div>
          </div>
        </div>

        {/* Pair grid */}
        <h2 className="text-lg font-semibold mb-4">FX Pairs</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {FX_PAIRS.map((pair) => {
            const hasAccess = pairAccess[pair] || user.is_admin;
            return (
              <div
                key={pair}
                className="bg-dark-card border border-dark-border rounded-lg p-4"
              >
                <div className="font-bold text-lg mb-2">{pair}</div>
                {hasAccess ? (
                  <Link
                    href={`/reports?pair=${pair}`}
                    className="text-sm text-primary hover:underline"
                  >
                    View Report
                  </Link>
                ) : (
                  <button
                    onClick={async () => {
                      try {
                        await creditsApi.consume(pair);
                        const res = await subApi.check(pair);
                        setPairAccess((p) => ({ ...p, [pair]: res.has_access }));
                      } catch (err: any) {
                        alert(err.message);
                      }
                    }}
                    className="text-sm text-gray-400 hover:text-white"
                    disabled={user.credit_balance < 1}
                  >
                    {user.credit_balance < 1
                      ? "No credits"
                      : "Unlock (1 credit)"}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}
