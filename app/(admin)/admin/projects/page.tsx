"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Project } from "@/lib/projects";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { VideosField } from "@/components/admin/VideosField";
import { AdminEditorModal } from "@/components/admin/AdminEditorModal";
import { useAdminHints } from "@/components/admin/AdminHintsContext";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminPageHeader,
  AdminSelect,
  AdminTextarea,
  adminFetch,
  useAdminToast,
} from "@/components/admin/ui";

type GalleryItem = { src: string; alt: string };
type SpecItem = { label: string; value: string };

const emptyProject = (): Project => ({
  slug: "",
  title: "",
  client: "",
  clientType: "",
  city: "",
  province: "مازندران",
  category: "",
  serviceSlug: "chelnium",
  year: "",
  color: "",
  material: "",
  letterHeight: "",
  lighting: "",
  duration: "",
  summary: "",
  challenge: "",
  solution: "",
  result: "",
  specs: [],
  gallery: [],
  videos: [],
  featured: false,
});

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function AdminProjectsPage() {
  const { toast, showSuccess, showError } = useAdminToast();
  const { showHints } = useAdminHints();
  const [items, setItems] = useState<Project[]>([]);
  const [services, setServices] = useState<{ slug: string; shortTitle: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<Project | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [projectsRes, servicesRes] = await Promise.all([
        adminFetch("/api/admin/projects"),
        adminFetch("/api/admin/services"),
      ]);
      setItems(projectsRes.data || []);
      setServices(
        (servicesRes.data || []).map((s: { slug: string; shortTitle: string }) => ({
          slug: s.slug,
          shortTitle: s.shortTitle,
        })),
      );
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
        `${item.title} ${item.client} ${item.city}`
          .toLowerCase()
          .includes(q.toLowerCase()),
      );
  }, [items, query]);

  function openNew() {
    setDraft(emptyProject());
    setEditingIndex(-1);
  }

  function openEdit(index: number) {
    setDraft(structuredClone(items[index]));
    setEditingIndex(index);
  }

  function setField<K extends keyof Project>(key: K, value: Project[K]) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  const mainImage = draft?.gallery?.[0] || { src: "", alt: "" };
  const secondaryImages = draft?.gallery?.slice(1) || [];

  function setMainImage(src: string, alt?: string) {
    if (!draft) return;
    const rest = draft.gallery.slice(1);
    const nextGallery: GalleryItem[] = src
      ? [{ src, alt: alt ?? (mainImage.alt || draft.title || "عکس اصلی پروژه") }, ...rest]
      : [...rest];
    setField("gallery", nextGallery);
  }

  function updateMainAlt(alt: string) {
    if (!draft?.gallery?.[0]) return;
    const next = [...draft.gallery];
    next[0] = { ...next[0], alt };
    setField("gallery", next);
  }

  function setSecondary(index: number, patch: Partial<GalleryItem>) {
    if (!draft) return;
    const main = draft.gallery[0] ? [draft.gallery[0]] : [];
    const secs = draft.gallery.slice(1).map((g, i) =>
      i === index ? { ...g, ...patch } : g,
    );
    setField("gallery", [...main, ...secs]);
  }

  function addSecondary(src: string, alt: string) {
    if (!draft) return;
    setField("gallery", [...draft.gallery, { src, alt }]);
  }

  function removeSecondary(index: number) {
    if (!draft) return;
    const main = draft.gallery[0] ? [draft.gallery[0]] : [];
    const secs = draft.gallery.slice(1).filter((_, i) => i !== index);
    setField("gallery", [...main, ...secs]);
  }

  function setSpec(index: number, patch: Partial<SpecItem>) {
    if (!draft) return;
    const specs = draft.specs.map((s, i) => (i === index ? { ...s, ...patch } : s));
    setField("specs", specs);
  }

  async function saveAll(next: Project[]) {
    setSaving(true);
    try {
      await adminFetch("/api/admin/projects", {
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
      showError("عنوان الزامی است");
      return;
    }
    let slug = draft.slug.trim() || slugify(draft.title);
    if (!slug) {
      showError("یک شناسه انگلیسی (slug) وارد کنید");
      return;
    }
    if (!draft.gallery[0]?.src) {
      showError("عکس اصلی پروژه را آپلود کنید");
      return;
    }

    const prepared: Project = {
      ...draft,
      slug,
      gallery: draft.gallery.filter((g) => g.src),
      videos: (draft.videos || []).filter((v) => v.src),
    };

    const next = [...items];
    if (editingIndex === -1) {
      if (next.some((p) => p.slug === prepared.slug)) {
        showError("این شناسه قبلاً استفاده شده");
        return;
      }
      next.unshift(prepared);
    } else if (editingIndex !== null) {
      next[editingIndex] = prepared;
    }
    await saveAll(next);
  }

  async function removeAt(index: number) {
    if (!confirm("این نمونه کار حذف شود؟")) return;
    await saveAll(items.filter((_, i) => i !== index));
  }

  return (
    <div>
      {toast}
      <AdminPageHeader
        title="نمونه کارها"
        description="عکس اصلی، عکس‌های فرعی و مشخصات را بدون JSON و با آپلود مستقیم مدیریت کنید."
        actions={
          <AdminButton
            onClick={openNew}
            className="bg-brand-yellow text-navy-950 hover:brightness-95"
          >
            افزودن نمونه کار
          </AdminButton>
        }
      />

      <AdminCard className="mb-4">
        <AdminInput
          label="جستجو"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="عنوان، کارفرما یا شهر…"
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
                  <div className="h-16 w-20 shrink-0 overflow-hidden rounded-xl bg-navy-100">
                    {item.gallery[0]?.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={item.gallery[0].src}
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
                      {[item.city, item.client].filter(Boolean).join(" · ") || "—"}
                      {item.gallery.length
                        ? ` · ${item.gallery.length.toLocaleString("fa-IR")} عکس`
                        : ""}
                      {item.featured ? " · ویژه" : ""}
                    </p>
                    {item.summary ? (
                      <p className="mt-1 line-clamp-2 text-xs leading-5 text-navy-400">
                        {item.summary}
                      </p>
                    ) : null}
                  </div>
                </div>
                <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
                  <AdminButton variant="secondary" onClick={() => openEdit(index)}>
                    ویرایش
                  </AdminButton>
                  <AdminButton variant="danger" onClick={() => removeAt(index)}>
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
                  : "هنوز نمونه کاری ثبت نشده."}
              </p>
            </AdminCard>
          ) : null}
        </div>
      )}

      {draft && editingIndex !== null ? (
        <AdminEditorModal
          wide
          title={
            editingIndex === -1 ? "افزودن نمونه کار" : "ویرایش نمونه کار"
          }
          onClose={() => {
            setEditingIndex(null);
            setDraft(null);
          }}
          footer={
            <>
              <AdminButton
                variant="secondary"
                onClick={() => {
                  setEditingIndex(null);
                  setDraft(null);
                }}
              >
                انصراف
              </AdminButton>
              <AdminButton onClick={saveDraft} disabled={saving}>
                {saving ? "در حال ذخیره…" : "ذخیره پروژه"}
              </AdminButton>
            </>
          }
        >
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="text-sm font-extrabold text-navy-800">عکس‌ها</h3>
              <ImageUploadField
                label="عکس اصلی"
                hint="این عکس روی کارت نمونه کار و اول گالری صفحه جزئیات نشان داده می‌شود."
                value={mainImage.src}
                alt={mainImage.alt}
                onChange={(url) => setMainImage(url)}
                onAltChange={updateMainAlt}
              />

              <div className="rounded-2xl border border-navy-100 p-4">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-extrabold text-navy-900">
                      عکس‌های فرعی (گالری)
                    </p>
                    {showHints ? (
                      <p className="mt-1 text-xs text-navy-500">
                        چند عکس اضافه برای صفحه جزئیات پروژه.
                      </p>
                    ) : null}
                  </div>
                  <label className="inline-flex cursor-pointer items-center justify-center rounded-xl border border-navy-200 bg-white px-3 py-2 text-sm font-bold text-navy-800 hover:bg-navy-50">
                    + افزودن عکس فرعی
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        try {
                          const form = new FormData();
                          form.append("file", file);
                          const res = await fetch("/api/admin/media", {
                            method: "POST",
                            body: form,
                          });
                          const data = await res.json();
                          if (!res.ok) throw new Error(data.error || "آپلود ناموفق");
                          addSecondary(
                            data.data.url,
                            draft.title || "عکس فرعی پروژه",
                          );
                          showSuccess("عکس فرعی اضافه شد");
                        } catch (err) {
                          showError(
                            err instanceof Error ? err.message : "خطا در آپلود",
                          );
                        } finally {
                          e.target.value = "";
                        }
                      }}
                    />
                  </label>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  {secondaryImages.map((img, i) => (
                    <div
                      key={`${img.src}-${i}`}
                      className="rounded-xl border border-navy-100 bg-navy-50/50 p-3"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.src}
                        alt=""
                        className="mb-2 h-28 w-full rounded-lg object-cover"
                      />
                      <input
                        className="mb-2 w-full rounded-lg border border-navy-200 px-2 py-1.5 text-xs"
                        value={img.alt}
                        onChange={(e) => setSecondary(i, { alt: e.target.value })}
                        placeholder="توضیح عکس"
                      />
                      <AdminButton
                        variant="danger"
                        className="w-full"
                        onClick={() => removeSecondary(i)}
                      >
                        حذف این عکس
                      </AdminButton>
                    </div>
                  ))}
                  {!secondaryImages.length ? (
                    <p className="text-xs text-navy-500 sm:col-span-2">
                      هنوز عکس فرعی اضافه نشده.
                    </p>
                  ) : null}
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <h3 className="text-sm font-extrabold text-navy-800">ویدیوها</h3>
              <VideosField
                value={draft.videos || []}
                onChange={(videos) => setField("videos", videos)}
              />
            </section>

            <section className="grid gap-3 sm:grid-cols-2">
              <AdminInput
                label="عنوان پروژه"
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
                              ? slugify(title)
                              : prev.slug,
                        }
                      : prev,
                  );
                }}
              />
              <AdminInput
                label="شناسه لینک (انگلیسی)"
                value={draft.slug}
                onChange={(e) => setField("slug", slugify(e.target.value) || e.target.value)}
                dir="ltr"
              />
              <AdminInput
                label="کارفرما"
                value={draft.client}
                onChange={(e) => setField("client", e.target.value)}
              />
              <AdminInput
                label="نوع کارفرما"
                value={draft.clientType}
                onChange={(e) => setField("clientType", e.target.value)}
              />
              <AdminInput
                label="شهر"
                value={draft.city}
                onChange={(e) => setField("city", e.target.value)}
              />
              <AdminInput
                label="استان"
                value={draft.province}
                onChange={(e) => setField("province", e.target.value)}
              />
              <AdminInput
                label="دسته / نوع تابلو"
                value={draft.category}
                onChange={(e) => setField("category", e.target.value)}
              />
              <AdminSelect
                label="خدمت مرتبط"
                value={draft.serviceSlug}
                onChange={(e) => setField("serviceSlug", e.target.value)}
              >
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    {s.shortTitle}
                  </option>
                ))}
              </AdminSelect>
              <AdminInput
                label="سال اجرا"
                value={draft.year}
                onChange={(e) => setField("year", e.target.value)}
              />
              <AdminInput
                label="رنگ"
                value={draft.color}
                onChange={(e) => setField("color", e.target.value)}
              />
              <AdminInput
                label="متریال"
                value={draft.material}
                onChange={(e) => setField("material", e.target.value)}
              />
              <AdminInput
                label="ارتفاع حروف"
                value={draft.letterHeight}
                onChange={(e) => setField("letterHeight", e.target.value)}
              />
              <AdminInput
                label="نورپردازی"
                value={draft.lighting}
                onChange={(e) => setField("lighting", e.target.value)}
              />
              <AdminInput
                label="مدت اجرا"
                value={draft.duration}
                onChange={(e) => setField("duration", e.target.value)}
              />
            </section>

            <section className="grid gap-3">
              <AdminTextarea
                label="خلاصه"
                value={draft.summary}
                onChange={(e) => setField("summary", e.target.value)}
              />
              <AdminTextarea
                label="چالش"
                value={draft.challenge}
                onChange={(e) => setField("challenge", e.target.value)}
              />
              <AdminTextarea
                label="راه‌حل"
                value={draft.solution}
                onChange={(e) => setField("solution", e.target.value)}
              />
              <AdminTextarea
                label="نتیجه"
                value={draft.result}
                onChange={(e) => setField("result", e.target.value)}
              />
              <label className="flex items-center gap-2 text-sm font-bold text-navy-800">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => setField("featured", e.target.checked)}
                />
                نمایش به‌عنوان نمونه کار ویژه در صفحه اصلی
              </label>
            </section>

            <section className="rounded-2xl border border-navy-100 p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <p className="text-sm font-extrabold text-navy-900">
                  مشخصات فنی (اختیاری)
                </p>
                <AdminButton
                  variant="secondary"
                  onClick={() =>
                    setField("specs", [...draft.specs, { label: "", value: "" }])
                  }
                >
                  + ردیف
                </AdminButton>
              </div>
              <div className="space-y-2">
                {draft.specs.map((spec, i) => (
                  <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                    <input
                      className="rounded-xl border border-navy-200 px-3 py-2 text-sm"
                      placeholder="عنوان (مثلاً ابعاد)"
                      value={spec.label}
                      onChange={(e) => setSpec(i, { label: e.target.value })}
                    />
                    <input
                      className="rounded-xl border border-navy-200 px-3 py-2 text-sm"
                      placeholder="مقدار"
                      value={spec.value}
                      onChange={(e) => setSpec(i, { value: e.target.value })}
                    />
                    <AdminButton
                      variant="danger"
                      onClick={() =>
                        setField(
                          "specs",
                          draft.specs.filter((_, idx) => idx !== i),
                        )
                      }
                    >
                      حذف
                    </AdminButton>
                  </div>
                ))}
                {!draft.specs.length ? (
                  <p className="text-xs text-navy-500">ردیفی اضافه نشده.</p>
                ) : null}
              </div>
            </section>
          </div>
        </AdminEditorModal>
      ) : null}
    </div>
  );
}
