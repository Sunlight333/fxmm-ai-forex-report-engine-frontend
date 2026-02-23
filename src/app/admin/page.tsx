"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { admin as adminApi } from "@/lib/api";
import type { User } from "@/types/api";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [genResult, setGenResult] = useState<any>(null);
  const [triggering, setTriggering] = useState(false);

  useEffect(() => {
    if (user?.is_admin) {
      adminApi.users().then(setUsers).catch(() => {});
    }
  }, [user]);

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;
  if (!user?.is_admin) {
    return (
      <>
        <Navbar />
        <main className="p-6">
          <p className="text-supply">Admin access required.</p>
        </main>
      </>
    );
  }

  const handleTriggerGeneration = async () => {
    setTriggering(true);
    try {
      const result = await adminApi.triggerGeneration();
      setGenResult(result);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setTriggering(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Panel</h1>

        {/* Trigger generation */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-4 mb-6">
          <h2 className="font-semibold mb-3">Report Generation</h2>
          <button
            onClick={handleTriggerGeneration}
            disabled={triggering}
            className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
          >
            {triggering ? "Generating..." : "Trigger Generation (All Pairs)"}
          </button>
          {genResult && (
            <pre className="mt-3 bg-dark-bg rounded p-3 text-sm overflow-auto">
              {JSON.stringify(genResult, null, 2)}
            </pre>
          )}
        </div>

        {/* User list */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-4">
          <h2 className="font-semibold mb-3">Users ({users.length})</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 border-b border-dark-border">
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Tier</th>
                  <th className="pb-2">Credits</th>
                  <th className="pb-2">Admin</th>
                  <th className="pb-2">Joined</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id} className="border-b border-dark-border/50">
                    <td className="py-2">{u.email}</td>
                    <td className="py-2 capitalize">{u.tier}</td>
                    <td className="py-2">{u.credit_balance}</td>
                    <td className="py-2">{u.is_admin ? "Yes" : "No"}</td>
                    <td className="py-2 text-gray-400">
                      {new Date(u.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  );
}
