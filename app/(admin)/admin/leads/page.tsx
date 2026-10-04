"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Lead } from "@/lib/content-store";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminPageHeader,
  adminFetch,
  useAdminToast,
} from "@/components/admin/ui";

export default function AdminLeadsPage() {
  const { toast, showSuccess, showError } = useAdminToast();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/leads");
      setLeads(Array.isArray(res.data) ? res.data : []);
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
    if (!q) return leads;
    return leads.filter((lead) => {
      const hay = [
        lead.name,
        lead.phone,
        lead.city,
        lead.service,
        lead.size,
        lead.note,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q) || lead.phone.includes(q.replace(/\s/g, ""));
    });
  }, [leads, query]);

  async function remove(id: string) {
    if (!confirm("حذف این استعلام؟")) return;
    const next = leads.filter((l) => l.id !== id);
    await adminFetch("/api/admin/leads", {
      method: "PUT",
      body: JSON.stringify({ data: next }),
    });
    setLeads(next);
    showSuccess("حذف شد");
  }

  async function clearAll() {
    if (!confirm("همه لیدها پاک شوند؟")) return;
    await adminFetch("/api/admin/leads", {
      method: "PUT",
      body: JSON.stringify({ data: [] }),
    });
    setLeads([]);
    showSuccess("همه پاک شد");
  }

  return (
    <div>
      {toast}
      <AdminPageHeader
        title="لیدها / استعلام"
        description="درخواست‌های استعلام ذخیره‌شده از فرم تماس سایت."
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-navy-50 px-4 py-2 text-sm font-extrabold text-navy-800">
              {leads.length.toLocaleString("fa-IR")} استعلام
            </span>
            <AdminButton
              variant="danger"
              onClick={clearAll}
              disabled={!leads.length}
            >
              پاک‌سازی همه
            </AdminButton>
          </div>
        }
      />

      <AdminCard className="mb-4">
        <AdminInput
          label="جستجو"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="نام، موبایل، شهر، خدمت یا یادداشت…"
        />
      </AdminCard>

      {loading ? (
        <p className="text-sm text-navy-500">در حال بارگذاری…</p>
      ) : (
        <div className="space-y-3">
          {filtered.map((lead) => (
            <AdminCard key={lead.id} className="!p-4 md:!p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-extrabold text-navy-950">
                    {lead.name}
                  </p>
                  <p className="mt-1 text-sm font-bold text-navy-700" dir="ltr">
                    {lead.phone}
                  </p>
                  <p className="mt-2 truncate text-sm text-navy-600">
                    {[lead.city, lead.service, lead.size]
                      .filter(Boolean)
                      .join(" · ") || "بدون جزئیات"}
                  </p>
                  {lead.note ? (
                    <p className="mt-2 line-clamp-3 text-sm leading-7 text-navy-500">
                      {lead.note}
                    </p>
                  ) : null}
                  <p className="mt-2 text-xs text-navy-400">
                    {new Date(lead.createdAt).toLocaleString("fa-IR")}
                  </p>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                  <a
                    href={`tel:${lead.phone}`}
                    className="inline-flex items-center justify-center rounded-xl border border-navy-200 bg-brand-white px-4 py-2.5 text-sm font-bold text-navy-800 hover:bg-navy-50"
                  >
                    تماس
                  </a>
                  <a
                    href={`https://wa.me/98${lead.phone.replace(/^0/, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white hover:brightness-95"
                  >
                    واتساپ
                  </a>
                  <AdminButton
                    variant="danger"
                    onClick={() => remove(lead.id)}
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
                {leads.length
                  ? "نتیجه‌ای با این جستجو پیدا نشد."
                  : "هنوز استعلامی ثبت نشده."}
              </p>
            </AdminCard>
          ) : null}
        </div>
      )}
    </div>
  );
}
