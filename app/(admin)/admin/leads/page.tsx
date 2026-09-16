"use client";

import { useEffect, useState } from "react";
import type { Lead } from "@/lib/content-store";
import {
  AdminButton,
  AdminCard,
  AdminPageHeader,
  adminFetch,
  useAdminToast,
} from "@/components/admin/ui";

export default function AdminLeadsPage() {
  const { toast, showSuccess, showError } = useAdminToast();
  const [leads, setLeads] = useState<Lead[]>([]);

  async function load() {
    const res = await adminFetch("/api/admin/leads");
    setLeads(res.data || []);
  }

  useEffect(() => {
    load().catch((e) => showError(e.message));
  }, [showError]);

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
          <AdminButton variant="danger" onClick={clearAll} disabled={!leads.length}>
            پاک‌سازی همه
          </AdminButton>
        }
      />

      <div className="space-y-3">
        {leads.map((lead) => (
          <AdminCard key={lead.id}>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <p className="font-extrabold text-navy-950">{lead.name}</p>
                <p className="mt-1 text-sm text-navy-700">{lead.phone}</p>
                <p className="mt-2 text-sm text-navy-600">
                  {lead.city || "—"} · {lead.service || "—"} · {lead.size || "—"}
                </p>
                {lead.note ? (
                  <p className="mt-2 text-sm leading-7 text-navy-600">{lead.note}</p>
                ) : null}
                <p className="mt-2 text-xs text-navy-400">
                  {new Date(lead.createdAt).toLocaleString("fa-IR")}
                </p>
              </div>
              <div className="flex gap-2">
                <a
                  href={`https://wa.me/98${lead.phone.replace(/^0/, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-xl bg-[#25D366] px-4 py-2.5 text-sm font-bold text-white"
                >
                  واتساپ
                </a>
                <AdminButton variant="danger" onClick={() => remove(lead.id)}>
                  حذف
                </AdminButton>
              </div>
            </div>
          </AdminCard>
        ))}
        {!leads.length ? (
          <AdminCard>
            <p className="text-sm text-navy-500">هنوز استعلامی ثبت نشده.</p>
          </AdminCard>
        ) : null}
      </div>
    </div>
  );
}
