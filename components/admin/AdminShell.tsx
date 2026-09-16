"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { MaxWordmark } from "@/components/MaxWordmark";
import { cn } from "@/lib/utils";

const nav = [
  { href: "/admin", label: "داشبورد", exact: true },
  { href: "/admin/projects", label: "نمونه کارها" },
  { href: "/admin/posts", label: "مقالات" },
  { href: "/admin/services", label: "خدمات" },
  { href: "/admin/locations", label: "شهرها" },
  { href: "/admin/materials", label: "متریال" },
  { href: "/admin/testimonials", label: "نظرات" },
  { href: "/admin/faq", label: "سوالات متداول" },
  { href: "/admin/settings", label: "تنظیمات سایت" },
  { href: "/admin/users", label: "کاربران" },
  { href: "/admin/leads", label: "لیدها / استعلام" },
  { href: "/admin/profile", label: "پروفایل" },
];

export function AdminShell({
  children,
  username,
}: {
  children: React.ReactNode;
  username: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  async function logout() {
    setLoggingOut(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  const sidebar = (
    <aside className="flex h-full w-64 flex-col bg-navy-950 text-brand-white">
      <div className="border-b border-white/10 px-5 py-6">
        <Link href="/admin" className="block" onClick={() => setOpen(false)}>
          <MaxWordmark
            className="h-auto w-36 text-brand-white"
            forSeeClassName="fill-brand-yellow"
          />
        </Link>
        <p className="mt-3 text-xs text-brand-white/50">پنل مدیریت مکث</p>
      </div>
      <nav className="flex-1 space-y-0.5 overflow-y-auto px-3 py-4">
        {nav.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                "block rounded-xl px-3 py-2.5 text-sm font-bold transition-colors",
                active
                  ? "bg-brand-yellow text-navy-950"
                  : "text-brand-white/75 hover:bg-white/10 hover:text-brand-white",
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-white/10 p-4">
        <p className="mb-3 truncate text-xs text-brand-white/50">{username}</p>
        <Link
          href="/"
          target="_blank"
          className="mb-2 block rounded-xl border border-white/15 px-3 py-2 text-center text-sm font-bold text-brand-white/80 hover:bg-white/10"
        >
          مشاهده سایت
        </Link>
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="w-full rounded-xl bg-white/10 px-3 py-2 text-sm font-bold text-brand-white hover:bg-white/15 disabled:opacity-60"
        >
          {loggingOut ? "خروج…" : "خروج"}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="min-h-svh bg-brand-white text-navy-950">
      <div className="flex min-h-svh">
        <div className="hidden md:sticky md:top-0 md:block md:h-svh md:shrink-0">
          {sidebar}
        </div>

        {open ? (
          <div className="fixed inset-0 z-50 md:hidden">
            <button
              type="button"
              className="absolute inset-0 bg-black/50"
              aria-label="بستن منو"
              onClick={() => setOpen(false)}
            />
            <div className="absolute inset-y-0 right-0 shadow-2xl">{sidebar}</div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex items-center justify-between gap-3 border-b border-navy-100 bg-brand-white/95 px-4 py-3 backdrop-blur md:px-8">
            <button
              type="button"
              className="rounded-xl border border-navy-200 px-3 py-2 text-sm font-bold text-navy-800 md:hidden"
              onClick={() => setOpen(true)}
            >
              منو
            </button>
            <p className="text-sm font-bold text-navy-700">
              مدیریت محتوای تابلوسازی مکث
            </p>
            <span className="rounded-full bg-navy-50 px-3 py-1 text-xs font-bold text-navy-700">
              {username}
            </span>
          </header>
          <div className="flex-1 px-4 py-6 md:px-8 md:py-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
