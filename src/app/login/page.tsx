"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function LoginPage() {
  const { login, register } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isRegister) {
        await register(email, password);
      } else {
        await login(email, password);
      }
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="bg-dark-card border border-dark-border rounded-lg p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          {isRegister ? "Create Account" : "Sign In"}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:border-primary outline-none"
              required
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-dark-bg border border-dark-border rounded px-3 py-2 text-white focus:border-primary outline-none"
              required
              minLength={8}
            />
          </div>

          {error && (
            <div className="text-supply text-sm bg-supply/10 rounded p-2">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-primary/90 text-white py-2 rounded font-medium disabled:opacity-50"
          >
            {loading ? "..." : isRegister ? "Register" : "Sign In"}
          </button>
        </form>

        <p className="text-sm text-gray-400 text-center mt-4">
          {isRegister ? "Already have an account?" : "No account?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-primary hover:underline"
          >
            {isRegister ? "Sign In" : "Register"}
          </button>
        </p>
      </div>
    </div>
  );
}
