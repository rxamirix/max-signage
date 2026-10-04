"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { User } from "@/lib/content-store";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminPageHeader,
  adminFetch,
  useAdminToast,
} from "@/components/admin/ui";

const sourceLabel: Record<User["source"], string> = {
  login: "ورود / ثبت‌نام",
  quote: "فرم استعلام",
  other: "سایر",
};

export default function AdminUsersPage() {
  const { toast, showSuccess, showError } = useAdminToast();
  const [users, setUsers] = useState<User[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/users");
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      showError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  }, [showError]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.phone.includes(q.replace(/\s/g, "")),
    );
  }, [users, query]);

  async function remove(id: string) {
    if (!confirm("این کاربر حذف شود؟")) return;
    const next = users.filter((u) => u.id !== id);
    await adminFetch("/api/admin/users", {
      method: "PUT",
      body: JSON.stringify({ data: next }),
    });
    setUsers(next);
    showSuccess("حذف شد");
  }

  return (
    <div>
      {toast}
      <AdminPageHeader
        title="کاربران"
        description="افرادی که با نام و شماره موبایل و تأیید پیامک ثبت‌نام کرده‌اند."
        actions={
          <span className="rounded-full bg-navy-50 px-4 py-2 text-sm font-extrabold text-navy-800">
            {users.length.toLocaleString("fa-IR")} کاربر
          </span>
        }
      />

      <AdminCard className="mb-4">
        <AdminInput
          label="جستجو"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="نام یا شماره موبایل…"
        />
      </AdminCard>

      {loading ? (
        <p className="text-sm text-navy-500">در حال بارگذاری…</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((user) => (
            <AdminCard key={user.id} className="!p-4 md:!p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-extrabold text-navy-950">
                    {user.name}
                  </p>
                  <p className="mt-1 text-sm font-bold text-navy-700" dir="ltr">
                    {user.phone}
                  </p>
                  <p className="mt-2 truncate text-sm text-navy-600">
                    {sourceLabel[user.source] || "—"} ·{" "}
                    {(user.loginCount || 1).toLocaleString("fa-IR")} بار ورود
                  </p>
                  <p className="mt-2 text-xs leading-5 text-navy-400">
                    ثبت‌نام: {new Date(user.createdAt).toLocaleString("fa-IR")}
                    <span className="mx-1 text-navy-200">|</span>
                    آخرین ورود:{" "}
                    {new Date(user.lastLoginAt).toLocaleString("fa-IR")}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                  <a
                    href={`tel:${user.phone}`}
                    className="inline-flex items-center justify-center rounded-xl border border-navy-200 bg-brand-white px-4 py-2.5 text-sm font-bold text-navy-800 hover:bg-navy-50"
                  >
                    تماس
                  </a>
                  <a
                    href={`https://wa.me/98${user.phone.replace(/^0/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white hover:brightness-95"
                  >
                    واتساپ
                  </a>
                  <AdminButton
                    variant="danger"
                    onClick={() => remove(user.id)}
                  >
                    حذف
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          ))}
          {!filtered.length ? (
            <AdminCard>
              <p className="py-6 text-center text-sm text-navy-500">
                {users.length
                  ? "نتیجه‌ای با این جستجو پیدا نشد."
                  : "هنوز کاربری ثبت نشده."}
              </p>
            </AdminCard>
          ) : null}
        </div>
      )}
    </div>
  );
}
