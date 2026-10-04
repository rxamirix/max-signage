"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FaqPairsEditor,
  FeaturesEditor,
  LinesEditor,
  SpecsEditor,
} from "@/components/admin/form-helpers";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { VideosField } from "@/components/admin/VideosField";
import { AdminEditorModal } from "@/components/admin/AdminEditorModal";
import type { StoryVideo } from "@/lib/story-video";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminPageHeader,
  AdminTextarea,
  adminFetch,
  useAdminToast,
} from "@/components/admin/ui";

type Field =
  | {
      key: string;
      label: string;
      type?: "text" | "textarea" | "checkbox" | "number" | "lines" | "image" | "videos";
      hint?: string;
      dir?: "ltr" | "rtl";
    }
  | { key: string; label: string; type: "faq" }
  | { key: string; label: string; type: "specs" }
  | { key: string; label: string; type: "features" };

export function ArrayCollectionPage({
  title,
  description,
  collection,
  itemLabel,
  getItemTitle,
  createEmpty,
  fields,
  idKey = "slug",
  idLabel = "شناسه لینک",
}: {
  title: string;
  description: string;
  collection: string;
  itemLabel: string;
  getItemTitle: (item: Record<string, unknown>) => string;
  createEmpty: () => Record<string, unknown>;
  fields: Field[];
  idKey?: string;
  idLabel?: string;
}) {
  const { toast, showSuccess, showError } = useAdminToast();
  const [items, setItems] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<Record<string, unknown> | null>(null);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/${collection}`);
      setItems(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      showError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  }, [collection, showError]);

  useEffect(() => {
    load();
  }, [load]);

  const filtered = useMemo(() => {
    const q = query.trim();
    if (!q) return items.map((item, index) => ({ item, index }));
    return items
      .map((item, index) => ({ item, index }))
      .filter(({ item }) =>
        getItemTitle(item).toLowerCase().includes(q.toLowerCase()),
      );
  }, [items, query, getItemTitle]);

  function openNew() {
    setDraft(createEmpty());
    setEditingIndex(-1);
  }

  function openEdit(index: number) {
    setDraft(structuredClone(items[index]));
    setEditingIndex(index);
  }

  async function saveAll(next: Record<string, unknown>[]) {
    setSaving(true);
    try {
      await adminFetch(`/api/admin/${collection}`, {
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
    const next = [...items];
    if (editingIndex === -1) {
      const id = String(draft[idKey] || "");
      if (!id) {
        showError(`${idLabel} الزامی است`);
        return;
      }
      if (next.some((x) => String(x[idKey]) === id)) {
        showError("این شناسه تکراری است");
        return;
      }
      next.unshift(draft);
    } else if (editingIndex !== null) {
      next[editingIndex] = draft;
    }
    await saveAll(next);
  }

  async function removeAt(index: number) {
    if (!confirm(`حذف این ${itemLabel}؟`)) return;
    const next = items.filter((_, i) => i !== index);
    await saveAll(next);
  }

  function setField(key: string, value: unknown) {
    setDraft((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  return (
    <div>
      {toast}
      <AdminPageHeader
        title={title}
        description={description}
        actions={
          <AdminButton
            onClick={openNew}
            className="bg-brand-yellow text-navy-950 hover:brightness-95"
          >
            افزودن {itemLabel}
          </AdminButton>
        }
      />

      <AdminCard className="mb-4">
        <AdminInput
          label="جستجو"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={`جستجو در ${itemLabel}ها…`}
        />
      </AdminCard>

      {loading ? (
        <p className="text-sm text-navy-500">در حال بارگذاری…</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(({ item, index }) => (
            <AdminCard
              key={`${String(item[idKey])}-${index}`}
              className="!p-4 md:!p-5"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate font-extrabold text-navy-950">
                    {getItemTitle(item)}
                  </p>
                  {idKey !== "question" &&
                  idKey !== "title" &&
                  idKey !== "name" ? (
                    <p className="mt-1 truncate text-xs text-navy-500" dir="ltr">
                      {idLabel}: {String(item[idKey] || "—")}
                    </p>
                  ) : null}
                  {typeof item.summary === "string" && item.summary ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-navy-400">
                      {item.summary}
                    </p>
                  ) : typeof item.excerpt === "string" && item.excerpt ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-navy-400">
                      {item.excerpt}
                    </p>
                  ) : typeof item.description === "string" &&
                    item.description ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-navy-400">
                      {item.description}
                    </p>
                  ) : typeof item.answer === "string" && item.answer ? (
                    <p className="mt-1 line-clamp-2 text-xs leading-5 text-navy-400">
                      {item.answer}
                    </p>
                  ) : null}
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
              <p className="py-6 text-center text-sm leading-7 text-navy-500">
                {items.length
                  ? `نتیجه‌ای در ${itemLabel}ها پیدا نشد.`
                  : `هنوز ${itemLabel}ی ثبت نشده.`}
              </p>
            </AdminCard>
          ) : null}
        </div>
      )}

      {draft && editingIndex !== null ? (
        <AdminEditorModal
          title={
            editingIndex === -1 ? `افزودن ${itemLabel}` : `ویرایش ${itemLabel}`
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
                {saving ? "در حال ذخیره…" : "ذخیره"}
              </AdminButton>
            </>
          }
        >
          <div className="grid gap-4">
              {fields.map((field) => {
                if (field.type === "checkbox") {
                  return (
                    <label
                      key={field.key}
                      className="flex items-center gap-2 text-sm font-bold text-navy-800"
                    >
                      <input
                        type="checkbox"
                        checked={Boolean(draft[field.key])}
                        onChange={(e) => setField(field.key, e.target.checked)}
                      />
                      {field.label}
                    </label>
                  );
                }
                if (field.type === "image") {
                  return (
                    <ImageUploadField
                      key={field.key}
                      label={field.label}
                      hint={field.hint}
                      value={String(draft[field.key] ?? "")}
                      onChange={(url) => setField(field.key, url)}
                    />
                  );
                }
                if (field.type === "videos") {
                  return (
                    <VideosField
                      key={field.key}
                      label={field.label}
                      hint={field.hint}
                      value={
                        Array.isArray(draft[field.key])
                          ? (draft[field.key] as StoryVideo[])
                          : []
                      }
                      onChange={(next) => setField(field.key, next)}
                    />
                  );
                }
                if (field.type === "lines") {
                  return (
                    <LinesEditor
                      key={field.key}
                      label={field.label}
                      hint={field.hint || "هر مورد را در یک خط بنویسید."}
                      value={
                        Array.isArray(draft[field.key])
                          ? (draft[field.key] as string[])
                          : []
                      }
                      onChange={(next) => setField(field.key, next)}
                    />
                  );
                }
                if (field.type === "faq") {
                  return (
                    <FaqPairsEditor
                      key={field.key}
                      items={
                        Array.isArray(draft[field.key])
                          ? (draft[field.key] as {
                              question: string;
                              answer: string;
                            }[])
                          : []
                      }
                      onChange={(next) => setField(field.key, next)}
                    />
                  );
                }
                if (field.type === "specs") {
                  return (
                    <SpecsEditor
                      key={field.key}
                      title={field.label}
                      items={
                        Array.isArray(draft[field.key])
                          ? (draft[field.key] as {
                              label: string;
                              value: string;
                            }[])
                          : []
                      }
                      onChange={(next) => setField(field.key, next)}
                    />
                  );
                }
                if (field.type === "features") {
                  return (
                    <FeaturesEditor
                      key={field.key}
                      title={field.label}
                      items={
                        Array.isArray(draft[field.key])
                          ? (draft[field.key] as {
                              title: string;
                              description: string;
                            }[])
                          : []
                      }
                      onChange={(next) => setField(field.key, next)}
                    />
                  );
                }
                if (field.type === "textarea") {
                  return (
                    <AdminTextarea
                      key={field.key}
                      label={field.label}
                      hint={field.hint}
                      value={String(draft[field.key] ?? "")}
                      onChange={(e) => setField(field.key, e.target.value)}
                    />
                  );
                }
                return (
                  <AdminInput
                    key={field.key}
                    label={field.label}
                    hint={field.hint}
                    type={field.type === "number" ? "number" : "text"}
                    dir={field.dir}
                    value={String(draft[field.key] ?? "")}
                    onChange={(e) =>
                      setField(
                        field.key,
                        field.type === "number"
                          ? Number(e.target.value)
                          : e.target.value,
                      )
                    }
                  />
                );
              })}
          </div>
        </AdminEditorModal>
      ) : null}
    </div>
  );
}
