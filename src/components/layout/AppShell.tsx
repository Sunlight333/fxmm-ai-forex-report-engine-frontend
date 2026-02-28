"use client";

import { useState, type ReactNode } from "react";
import { Sidebar } from "./Sidebar";
import { TopBar } from "./TopBar";

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Sidebar (fixed on desktop, overlay on mobile) */}
      <Sidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main content area — offset by sidebar width on desktop */}
      <div className="flex min-h-screen flex-col lg:pl-sidebar">
        <TopBar onMenuToggle={() => setMobileOpen((v) => !v)} />

        <main className="flex-1 px-4 py-6 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
