"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState("admin@gocozycaravan.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(params.get("error") === "config" ? "Set ADMIN_JWT_SECRET in .env.local" : "");
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = (await res.json()) as { ok: boolean; error?: string };
      if (!res.ok || !data.ok) {
        setError(data.error || "Login failed");
        setLoading(false);
        return;
      }
      router.replace("/admin");
      router.refresh();
    } catch {
      setError("Network error");
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
      <div className="rounded-2xl border border-white/10 bg-charcoal-light p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gold">Go Cozy CRM</p>
        <h1 className="mt-2 font-display text-2xl font-bold text-white">Admin login</h1>
        <p className="mt-2 text-sm text-zinc-400">Manage daily bookings and enquiries.</p>

        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1.5 block text-sm text-zinc-300" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              className="input-field"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm text-zinc-300" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              className="input-field"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gold py-3 text-sm font-bold text-charcoal transition hover:bg-gold-light disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Login"}
          </button>
        </form>
        <p className="mt-4 text-xs text-zinc-500">
          Default: admin@gocozycaravan.com / Admin@123 (change after import)
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="p-8 text-zinc-400">Loading…</div>}>
      <LoginForm />
    </Suspense>
  );
}
