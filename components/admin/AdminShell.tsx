"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import {
  AdminHintsProvider,
  useAdminHints,
} from "@/components/admin/AdminHintsContext";
import { cn } from "@/lib/utils";

const navGroups: {
  title: string;
  items: { href: string; label: string; exact?: boolean }[];
}[] = [
  {
    title: "نمای کلی",
    items: [{ href: "/admin", label: "داشبورد", exact: true }],
  },
  {
    title: "محتوای سایت",
    items: [
      { href: "/admin/projects", label: "نمونه کارها" },
      { href: "/admin/posts", label: "مقالات" },
      { href: "/admin/services", label: "خدمات" },
      { href: "/admin/locations", label: "شهرها" },
      { href: "/admin/materials", label: "متریال" },
      { href: "/admin/testimonials", label: "نظرات" },
      { href: "/admin/faq", label: "سوالات متداول" },
      { href: "/admin/settings", label: "تنظیمات سایت" },
    ],
  },
  {
    title: "مشتریان",
    items: [
      { href: "/admin/users", label: "کاربران" },
      { href: "/admin/jobs", label: "رهگیری / گارانتی" },
      { href: "/admin/leads", label: "لیدها / استعلام" },
    ],
  },
  {
    title: "حساب",
    items: [{ href: "/admin/profile", label: "پروفایل" }],
  },
];

function HintsToggle() {
  const { showHints, toggleHints } = useAdminHints();
  return (
    <button
      type="button"
      onClick={toggleHints}
      title={
        showHints
          ? "خاموش کردن توضیحات اضافه"
          : "روشن کردن توضیحات اضافه"
      }
      className={cn(
        "rounded-full border px-3 py-1.5 text-xs font-extrabold transition-colors",
        showHints
          ? "border-navy-200 bg-navy-50 text-navy-700 hover:bg-navy-100"
          : "border-navy-200 bg-brand-white text-navy-600 hover:bg-navy-50",
      )}
    >
      {showHints ? "توضیحات: روشن" : "توضیحات: خاموش"}
    </button>
  );
}

function AdminShellInner({
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
    <aside className="flex h-full w-[15.5rem] flex-col bg-navy-950 text-brand-white">
      <div className="flex shrink-0 flex-col items-center justify-center border-b border-white/10 px-4 py-6">
        <Link
          href="/admin"
          className="flex w-full items-center justify-center"
          onClick={() => setOpen(false)}
          aria-label="داشبورد مدیریت مکث"
        >
          <Image
            src="/logo-max-white.png"
            alt="لوگوی تابلوسازی مکث"
            width={220}
            height={90}
            priority
            className="h-12 w-auto max-w-[11rem] object-contain"
          />
        </Link>
      </div>

      <nav className="admin-scroll admin-scroll--nav flex-1 px-2.5 py-3">
        {navGroups.map((group) => (
          <div key={group.title} className="mb-3">
            <p className="mb-1 px-2.5 text-[10px] font-bold tracking-wide text-brand-white/35">
              {group.title}
            </p>
            <div className="space-y-0.5">
              {group.items.map((item) => {
                const active = item.exact
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-lg px-2.5 py-2 text-[13px] font-bold transition-colors",
                      active
                        ? "bg-brand-yellow text-navy-950"
                        : "text-brand-white/70 hover:bg-white/10 hover:text-brand-white",
                    )}
                  >
                    {item.label}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/10 p-3">
        <p className="mb-2 truncate px-1 text-center text-[11px] text-brand-white/45">
          {username}
        </p>
        <Link
          href="/"
          target="_blank"
          className="mb-1.5 block rounded-lg border border-white/12 px-3 py-2 text-center text-xs font-bold text-brand-white/75 hover:bg-white/10"
        >
          مشاهده سایت
        </Link>
        <button
          type="button"
          onClick={logout}
          disabled={loggingOut}
          className="w-full rounded-lg bg-white/10 px-3 py-2 text-xs font-bold text-brand-white hover:bg-white/15 disabled:opacity-60"
        >
          {loggingOut ? "خروج…" : "خروج"}
        </button>
      </div>
    </aside>
  );

  return (
    <div className="admin-shell h-svh overflow-hidden bg-[#f6f7fc] text-navy-950">
      <div className="flex h-full">
        <div className="relative z-20 hidden h-full shrink-0 md:block">
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
            <div className="absolute inset-y-0 right-0 h-full shadow-2xl">
              {sidebar}
            </div>
          </div>
        ) : null}

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="z-30 flex shrink-0 items-center justify-between gap-3 border-b border-navy-100/80 bg-brand-white/95 px-4 py-2.5 backdrop-blur md:px-6">
            {/* RTL: first = راست */}
            <HintsToggle />
            <div className="flex items-center gap-2">
              <span className="hidden rounded-full bg-navy-50 px-2.5 py-1 text-[11px] font-bold text-navy-700 sm:inline">
                {username}
              </span>
              <button
                type="button"
                className="rounded-lg border border-navy-200 px-2.5 py-1.5 text-xs font-bold text-navy-800 md:hidden"
                onClick={() => setOpen(true)}
              >
                منو
              </button>
            </div>
          </header>

          <div className="admin-scroll admin-scroll--main min-h-0 flex-1">
            <div className="admin-scroll-inner px-4 py-5 md:px-6 md:py-6">
              <div className="mx-auto w-full max-w-5xl">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({
  children,
  username,
}: {
  children: React.ReactNode;
  username: string;
}) {
  return (
    <AdminHintsProvider>
      <AdminShellInner username={username}>{children}</AdminShellInner>
    </AdminHintsProvider>
  );
}
