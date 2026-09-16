"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { MaxWordmark } from "@/components/MaxWordmark";

function LoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/admin";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "ورود ناموفق بود");
        setLoading(false);
        return;
      }
      router.replace(next.startsWith("/admin") ? next : "/admin");
      router.refresh();
    } catch {
      setError("خطای شبکه");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-svh items-center justify-center bg-navy-950 px-4">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-navy-900 p-8 shadow-2xl">
        <div className="mb-8 text-center">
          <MaxWordmark
            className="mx-auto h-auto w-48 text-brand-white"
            forSeeClassName="fill-brand-yellow"
          />
          <p className="mt-4 text-sm text-brand-white/60">ورود به پنل مدیریت</p>
        </div>
        <form onSubmit={onSubmit} className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-brand-white/80">
              نام کاربری
            </span>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-navy-950 px-4 py-3 text-brand-white outline-none focus:border-brand-yellow"
              autoComplete="username"
              required
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-bold text-brand-white/80">
              رمز عبور
            </span>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/15 bg-navy-950 px-4 py-3 text-brand-white outline-none focus:border-brand-yellow"
              autoComplete="current-password"
              required
            />
          </label>
          {error ? (
            <p className="rounded-xl bg-red-500/20 px-3 py-2 text-sm text-red-200">
              {error}
            </p>
          ) : null}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-brand-yellow py-3 font-extrabold text-navy-950 transition hover:brightness-95 disabled:opacity-60"
          >
            {loading ? "در حال ورود…" : "ورود"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-svh place-items-center bg-navy-950 text-brand-white">
          در حال بارگذاری…
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
