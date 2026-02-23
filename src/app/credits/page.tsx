"use client";

import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { credits as creditsApi } from "@/lib/api";
import type { CreditBalance } from "@/types/api";

export default function CreditsPage() {
  const { user, loading: authLoading, refreshUser } = useAuth();
  const [data, setData] = useState<CreditBalance | null>(null);
  const [amount, setAmount] = useState(1);
  const [purchasing, setPurchasing] = useState(false);

  const fetchBalance = () => {
    creditsApi.balance().then(setData).catch(() => {});
  };

  useEffect(() => {
    if (user) fetchBalance();
  }, [user]);

  if (authLoading) return <div className="p-8 text-gray-400">Loading...</div>;
  if (!user) return null;

  const handlePurchase = async () => {
    setPurchasing(true);
    try {
      await creditsApi.purchase(amount, `manual-${Date.now()}`);
      await refreshUser();
      fetchBalance();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setPurchasing(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Credit Management</h1>

        {/* Balance */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-6">
          <div className="text-sm text-gray-400">Current Balance</div>
          <div className="text-4xl font-bold">{user.credit_balance} credits</div>
          <p className="text-sm text-gray-400 mt-1">
            1 credit = 5 trading days of access for a single pair
          </p>
        </div>

        {/* Purchase */}
        <div className="bg-dark-card border border-dark-border rounded-lg p-6 mb-6">
          <h2 className="font-semibold mb-4">Purchase Credits</h2>
          <div className="flex items-center gap-4">
            <input
              type="number"
              min={1}
              max={100}
              value={amount}
              onChange={(e) => setAmount(parseInt(e.target.value) || 1)}
              className="w-24 bg-dark-bg border border-dark-border rounded px-3 py-2 text-white"
            />
            <button
              onClick={handlePurchase}
              disabled={purchasing}
              className="bg-primary hover:bg-primary/90 text-white px-4 py-2 rounded font-medium disabled:opacity-50"
            >
              {purchasing ? "..." : `Purchase ${amount} credit${amount > 1 ? "s" : ""}`}
            </button>
          </div>
        </div>

        {/* Transaction history */}
        {data && data.transactions.length > 0 && (
          <div className="bg-dark-card border border-dark-border rounded-lg p-6">
            <h2 className="font-semibold mb-4">Transaction History</h2>
            <div className="space-y-2">
              {data.transactions.map((txn) => (
                <div
                  key={txn.id}
                  className="flex justify-between items-center px-3 py-2 bg-dark-bg rounded text-sm"
                >
                  <div>
                    <span className="font-medium">{txn.type}</span>
                    {txn.pair && (
                      <span className="text-gray-400 ml-2">{txn.pair}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <span
                      className={
                        txn.amount > 0 ? "text-demand" : "text-supply"
                      }
                    >
                      {txn.amount > 0 ? "+" : ""}
                      {txn.amount}
                    </span>
                    <span className="text-gray-400">
                      bal: {txn.balance_after}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}
