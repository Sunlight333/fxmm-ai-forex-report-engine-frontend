"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/lib/auth-context";
import { user as userApi } from "@/lib/api";
import { FX_PAIRS } from "@/types/api";

export default function SettingsPage() {
  const { user, loading, refreshUser } = useAuth();
  const [language, setLanguage] = useState(user?.language || "en");
  const [selectedPairs, setSelectedPairs] = useState<string[]>(
    user?.selected_pairs || []
  );
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  if (loading) return <div className="p-8 text-gray-400">Loading...</div>;
  if (!user) return null;

  const togglePair = (pair: string) => {
    setSelectedPairs((prev) =>
      prev.includes(pair) ? prev.filter((p) => p !== pair) : [...prev, pair]
    );
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await userApi.update({ language, selected_pairs: selectedPairs });
      await refreshUser();
      setMessage("Settings saved!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err: any) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>

        <div className="space-y-6">
          {/* Language */}
          <div className="bg-dark-card border border-dark-border rounded-lg p-4">
            <h2 className="font-semibold mb-3">Language</h2>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-dark-bg border border-dark-border rounded px-3 py-2 text-white"
            >
              <option value="en">English</option>
              <option value="es">Espa&ntilde;ol</option>
            </select>
          </div>

          {/* Pair selection */}
          <div className="bg-dark-card border border-dark-border rounded-lg p-4">
            <h2 className="font-semibold mb-3">Selected Pairs</h2>
            <div className="grid grid-cols-3 gap-2">
              {FX_PAIRS.map((pair) => (
                <label
                  key={pair}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={selectedPairs.includes(pair)}
                    onChange={() => togglePair(pair)}
                    className="accent-primary"
                  />
                  <span className="text-sm">{pair}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Save */}
          <div className="flex items-center gap-4">
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded font-medium disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Settings"}
            </button>
            {message && (
              <span className="text-sm text-demand">{message}</span>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
