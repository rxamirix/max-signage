"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Post, PostSection } from "@/lib/posts";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import {
  FaqPairsEditor,
  LinesEditor,
  slugifyFa,
} from "@/components/admin/form-helpers";
import { AdminEditorModal } from "@/components/admin/AdminEditorModal";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminPageHeader,
  AdminTextarea,
  adminFetch,
  useAdminToast,
} from "@/components/admin/ui";

function emptyPost(): Post {
  return {
    slug: "",
    title: "",
    metaTitle: "",
    metaDescription: "",
    keywords: [],
    excerpt: "",
    date: "",
    dateIso: new Date().toISOString().slice(0, 10),
    readingTime: "۵ دقیقه",
    category: "",
    lead: "",
    coverImage: "",
    sections: [{ heading: "", body: [""] }],
    faq: [],
  };
}

function paragraphsToText(body?: string[]) {
  return (body || []).join("\n\n");
}

function textToParagraphs(text: string) {
  return text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);
}

export default function AdminPostsPage() {
  const { toast, showSuccess, showError } = useAdminToast();
  const [items, setItems] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<Post | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch("/api/admin/posts");
      setItems(res.data || []);
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
    const q = query.trim();
    if (!q) return items.map((item, index) => ({ item, index }));
    return items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) =>
        `${item.title} ${item.category}`.includes(q),
      );
  }, [items, query]);

  function setField<K extends keyof Post>(key: K, value: Post[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  function updateSection(index: number, patch: Partial<PostSection>) {
    if (!draft) return;
    const sections = draft.sections.map((s, i) =>
      i === index ? { ...s, ...patch } : s,
    );
    setField("sections", sections);
  }

  async function saveAll(next: Post[]) {
    setSaving(true);
    try {
      await adminFetch("/api/admin/posts", {
        method: "PUT",
        body: JSON.stringify({ data: next }),
      });
      setItems(next);
      showSuccess("ذخیره شد");
      setEditingIndex(null);
      setDraft(null);
    } catch (e) {
      showError(e instanceof Error ? e.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  async function saveDraft() {
    if (!draft) return;
    if (!draft.title.trim()) {
      showError("عنوان مقاله الزامی است");
      return;
    }
    const slug = draft.slug.trim() || slugifyFa(draft.title) || `post-${Date.now()}`;
    const prepared: Post = {
      ...draft,
      slug,
      metaTitle: draft.metaTitle.trim() || draft.title,
      metaDescription: draft.metaDescription.trim() || draft.excerpt,
      coverImage: draft.coverImage || undefined,
      sections: draft.sections
        .filter((s) => s.heading.trim())
        .map((s) => ({
          heading: s.heading.trim(),
          body: (s.body || []).map((p) => p.trim()).filter(Boolean),
          list: (s.list || []).map((p) => p.trim()).filter(Boolean),
          table: s.table,
        })),
      faq: (draft.faq || []).filter((f) => f.question.trim() && f.answer.trim()),
      keywords: (draft.keywords || []).map((k) => k.trim()).filter(Boolean),
    };
    if (!prepared.sections.length) {
      showError("حداقل یک بخش با عنوان اضافه کنید");
      return;
    }

    const next = [...items];
    if (editingIndex === -1) {
      if (next.some((p) => p.slug === prepared.slug)) {
        showError("این لینک قبلاً استفاده شده");
        return;
      }
      next.unshift(prepared);
    } else if (editingIndex !== null) {
      next[editingIndex] = prepared;
    }
    await saveAll(next);
  }

  return (
    <div>
      {toast}
      <AdminPageHeader
        title="مقالات"
        description="نوشتن و ویرایش مقاله با فرم ساده فارسی؛ عکس کاور، بخش‌ها و سوالات بدون کد."
        actions={
          <AdminButton
            className="bg-brand-yellow text-navy-950 hover:brightness-95"
            onClick={() => {
              setDraft(emptyPost());
              setEditingIndex(-1);
            }}
          >
            افزودن مقاله
          </AdminButton>
        }
      />

      <AdminCard className="mb-4">
        <AdminInput
          label="جستجو"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="عنوان یا دسته‌بندی…"
        />
      </AdminCard>

      {loading ? (
        <p className="text-sm text-navy-500">در حال بارگذاری…</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(({ item, index }) => (
            <AdminCard key={item.slug} className="!p-4 md:!p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="h-16 w-24 shrink-0 overflow-hidden rounded-xl bg-navy-100">
                    {item.coverImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.coverImage}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    ) : null}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate font-extrabold text-navy-950">
                      {item.title}
                    </p>
                    <p className="mt-1 truncate text-xs text-navy-500">
                      {item.category || "بدون دسته"} · {item.date || item.dateIso}
                    </p>
                    {item.excerpt ? (
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-navy-400">
                        {item.excerpt}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                  <AdminButton
                    variant="secondary"
                    onClick={() => {
                      setDraft(structuredClone({ ...emptyPost(), ...item }));
                      setEditingIndex(index);
                    }}
                  >
                    ویرایش
                  </AdminButton>
                  <AdminButton
                    variant="danger"
                    onClick={() => {
                      if (confirm("این مقاله حذف شود؟")) {
                        saveAll(items.filter((_, i) => i !== index));
                      }
                    }}
                  >
                    حذف
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          ))}
          {!filtered.length ? (
            <AdminCard>
              <p className="text-sm text-navy-500">
                {items.length
                  ? "نتیجه‌ای با این جستجو پیدا نشد."
                  : "هنوز مقاله‌ای ثبت نشده."}
              </p>
            </AdminCard>
          ) : null}
        </div>
      )}

      {draft && editingIndex !== null ? (
        <AdminEditorModal
          wide
          title={editingIndex === -1 ? "افزودن مقاله" : "ویرایش مقاله"}
          onClose={() => {
            setDraft(null);
            setEditingIndex(null);
          }}
          footer={
            <>
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
                {saving ? "در حال ذخیره…" : "ذخیره مقاله"}
              </AdminButton>
            </>
          }
        >
          <div className="space-y-5">
            <ImageUploadField
              label="عکس کاور مقاله"
              hint="این عکس در لیست مقالات و بالای مطلب نمایش داده می‌شود."
              value={draft.coverImage || ""}
              onChange={(url) => setField("coverImage", url)}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <AdminInput
                label="عنوان مقاله"
                value={draft.title}
                onChange={(e) => {
                  const title = e.target.value;
                  setDraft((prev) =>
                    prev
                      ? {
                          ...prev,
                          title,
                          slug:
                            editingIndex === -1 && !prev.slug
                              ? slugifyFa(title)
                              : prev.slug,
                          metaTitle: prev.metaTitle || title,
                        }
                      : prev,
                  );
                }}
              />
              <AdminInput
                label="دسته‌بندی"
                value={draft.category}
                onChange={(e) => setField("category", e.target.value)}
                placeholder="مثلاً راهنمای خرید"
              />
              <AdminInput
                label="تاریخ نمایش (فارسی)"
                value={draft.date}
                onChange={(e) => setField("date", e.target.value)}
                placeholder="مثلاً ۱۵ مرداد ۱۴۰۵"
              />
              <AdminInput
                label="زمان مطالعه"
                value={draft.readingTime}
                onChange={(e) => setField("readingTime", e.target.value)}
                placeholder="مثلاً ۸ دقیقه"
              />
              <AdminInput
                label="شناسه لینک (انگلیسی، خودکار ساخته می‌شود)"
                value={draft.slug}
                onChange={(e) => setField("slug", slugifyFa(e.target.value) || e.target.value)}
                dir="ltr"
              />
              <AdminInput
                label="تاریخ سیستم"
                type="date"
                value={draft.dateIso}
                onChange={(e) => setField("dateIso", e.target.value)}
              />
            </div>

            <AdminTextarea
              label="خلاصه کوتاه (در لیست مقالات)"
              value={draft.excerpt}
              onChange={(e) => setField("excerpt", e.target.value)}
            />
            <AdminTextarea
              label="مقدمه مقاله"
              value={draft.lead}
              onChange={(e) => setField("lead", e.target.value)}
            />

            <div className="space-y-3 rounded-2xl border border-navy-100 p-4">
              <p className="text-sm font-extrabold text-navy-900">
                تنظیمات نمایش در گوگل
              </p>
              <AdminInput
                label="عنوان گوگل"
                value={draft.metaTitle}
                onChange={(e) => setField("metaTitle", e.target.value)}
                placeholder="عنوانی که در نتایج گوگل دیده می‌شود"
              />
              <AdminTextarea
                label="توضیح گوگل"
                value={draft.metaDescription}
                onChange={(e) => setField("metaDescription", e.target.value)}
                placeholder="یک یا دو جمله کوتاه برای نتایج جستجو"
              />
              <LinesEditor
                label="کلمات کلیدی"
                hint="هر کلمه یا عبارت را در یک خط بنویسید."
                value={draft.keywords}
                onChange={(keywords) => setField("keywords", keywords)}
              />
            </div>

            <div className="space-y-3 rounded-2xl border border-navy-100 p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-extrabold text-navy-900">بخش‌های مقاله</p>
                <AdminButton
                  variant="secondary"
                  onClick={() =>
                    setField("sections", [
                      ...draft.sections,
                      { heading: "", body: [""], list: [] },
                    ])
                  }
                >
                  + بخش جدید
                </AdminButton>
              </div>

              {draft.sections.map((section, i) => (
                <div key={i} className="space-y-3 rounded-xl bg-navy-50/60 p-4">
                  <AdminInput
                    label={`عنوان بخش ${i + 1}`}
                    value={section.heading}
                    onChange={(e) => updateSection(i, { heading: e.target.value })}
                  />
                  <AdminTextarea
                    label="متن بخش"
                    hint="برای پاراگراف جدید یک خط خالی بگذارید."
                    value={paragraphsToText(section.body)}
                    onChange={(e) =>
                      updateSection(i, { body: textToParagraphs(e.target.value) })
                    }
                  />
                  <LinesEditor
                    label="لیست نکات (اختیاری)"
                    hint="هر نکته در یک خط."
                    value={section.list || []}
                    onChange={(list) => updateSection(i, { list })}
                  />
                  {section.table ? (
                    <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs text-amber-800">
                      این بخش یک جدول دارد. برای ویرایش جدول فعلاً از پشتیبانی کمک بگیرید؛
                      متن و لیست را می‌توانید آزادانه عوض کنید.
                    </p>
                  ) : null}
                  <AdminButton
                    variant="danger"
                    onClick={() =>
                      setField(
                        "sections",
                        draft.sections.filter((_, idx) => idx !== i),
                      )
                    }
                  >
                    حذف این بخش
                  </AdminButton>
                </div>
              ))}
            </div>

            <FaqPairsEditor
              items={draft.faq}
              onChange={(faq) => setField("faq", faq)}
            />
          </div>
        </AdminEditorModal>
      ) : null}
    </div>
  );
}
