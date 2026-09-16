"use client";

import { useCallback, useEffect, useState } from "react";
import type { Testimonial } from "@/lib/content-store";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminPageHeader,
  AdminTextarea,
  adminFetch,
  useAdminToast,
} from "@/components/admin/ui";

export default function AdminTestimonialsPage() {
  const { toast, showSuccess, showError } = useAdminToast();
  const [items, setItems] = useState<Testimonial[]>([]);
  const [draft, setDraft] = useState<Testimonial | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/testimonials");
      setItems(res.data || []);
    } catch (e) {
      showError(e instanceof Error ? e.message : "خطا");
    }
  }, [showError]);

  useEffect(() => {
    load();
  }, [load]);

  async function saveAll(next: Testimonial[]) {
    setSaving(true);
    try {
      await adminFetch("/api/admin/testimonials", {
        method: "PUT",
        body: JSON.stringify({ data: next }),
      });
      setItems(next);
      showSuccess("ذخیره شد");
      setDraft(null);
      setEditingIndex(null);
    } catch (e) {
      showError(e instanceof Error ? e.message : "خطا");
    } finally {
      setSaving(false);
    }
  }

  async function saveDraft() {
    if (!draft) return;
    if (!draft.name.trim() || !draft.text.trim()) {
      showError("نام و متن نظر الزامی است");
      return;
    }
    const next = [...items];
    if (editingIndex === -1) next.unshift(draft);
    else if (editingIndex !== null) next[editingIndex] = draft;
    await saveAll(next);
  }

  return (
    <div>
      {toast}
      <AdminPageHeader
        title="نظرات مشتریان"
        description="نام، نقش، متن و عکس پروفایل را با آپلود مستقیم تنظیم کنید — بدون JSON."
        actions={
          <AdminButton
            className="bg-brand-yellow text-navy-950 hover:brightness-95"
            onClick={() => {
              setDraft({ name: "", role: "", image: "", text: "" });
              setEditingIndex(-1);
            }}
          >
            افزودن نظر
          </AdminButton>
        }
      />

      <div className="space-y-3">
        {items.map((item, index) => (
          <AdminCard
            key={`${item.name}-${index}`}
            className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 overflow-hidden rounded-full bg-navy-100">
                {item.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={item.image} alt="" className="h-full w-full object-cover" />
                ) : null}
              </div>
              <div>
                <p className="font-extrabold text-navy-950">{item.name}</p>
                <p className="text-xs text-navy-500">{item.role}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <AdminButton
                variant="secondary"
                onClick={() => {
                  setDraft(structuredClone(item));
                  setEditingIndex(index);
                }}
              >
                ویرایش
              </AdminButton>
              <AdminButton
                variant="danger"
                onClick={() => {
                  if (confirm("حذف شود؟")) {
                    saveAll(items.filter((_, i) => i !== index));
                  }
                }}
              >
                حذف
              </AdminButton>
            </div>
          </AdminCard>
        ))}
      </div>

      {draft && editingIndex !== null ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
          <div className="max-h-[90svh] w-full max-w-xl overflow-y-auto rounded-3xl bg-brand-white p-5 shadow-2xl md:p-7">
            <h2 className="mb-4 text-xl font-extrabold text-navy-950">
              {editingIndex === -1 ? "افزودن نظر" : "ویرایش نظر"}
            </h2>
            <div className="space-y-3">
              <ImageUploadField
                label="عکس پروفایل"
                value={draft.image}
                onChange={(url) => setDraft({ ...draft, image: url })}
              />
              <AdminInput
                label="نام"
                value={draft.name}
                onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              />
              <AdminInput
                label="نقش / کسب‌وکار"
                value={draft.role}
                onChange={(e) => setDraft({ ...draft, role: e.target.value })}
              />
              <AdminTextarea
                label="متن نظر"
                value={draft.text}
                onChange={(e) => setDraft({ ...draft, text: e.target.value })}
              />
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <AdminButton
                variant="secondary"
                onClick={() => {
                  setDraft(null);
                  setEditingIndex(null);
                }}
              >
                انصراف
              </AdminButton>
              <AdminButton onClick={saveDraft} disabled={saving}>
                {saving ? "…" : "ذخیره"}
              </AdminButton>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
