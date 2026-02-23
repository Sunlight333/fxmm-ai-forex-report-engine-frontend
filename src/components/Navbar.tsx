"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-context";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-dark-card border-b border-dark-border px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <Link href="/dashboard" className="text-xl font-bold text-primary">
          FXMM
        </Link>
        {user && (
          <>
            <Link href="/dashboard" className="text-sm hover:text-primary">
              Dashboard
            </Link>
            <Link href="/credits" className="text-sm hover:text-primary">
              Credits ({user.credit_balance})
            </Link>
            <Link href="/settings" className="text-sm hover:text-primary">
              Settings
            </Link>
            {user.is_admin && (
              <Link href="/admin" className="text-sm hover:text-primary">
                Admin
              </Link>
            )}
          </>
        )}
      </div>
      <div className="flex items-center gap-4">
        {user ? (
          <>
            <span className="text-sm text-gray-400">{user.email}</span>
            <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
              {user.tier}
            </span>
            <button
              onClick={logout}
              className="text-sm text-gray-400 hover:text-white"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login" className="text-sm hover:text-primary">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}
