"use client";

import { useState } from "react";
import { AdminButton } from "@/components/admin/ui";
import { useAdminHints } from "@/components/admin/AdminHintsContext";

export async function uploadAdminImage(file: File): Promise<string> {
  const form = new FormData();
  form.append("file", file);
  const res = await fetch("/api/admin/media", { method: "POST", body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "آپلود ناموفق");
  return data.data.url as string;
}

export function ImageUploadField({
  label,
  hint,
  value,
  alt,
  onChange,
  onAltChange,
}: {
  label: string;
  hint?: string;
  value: string;
  alt?: string;
  onChange: (url: string) => void;
  onAltChange?: (alt: string) => void;
}) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { showHints } = useAdminHints();

  async function onFile(file: File | null) {
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const url = await uploadAdminImage(file);
      onChange(url);
      if (onAltChange && !alt) onAltChange(file.name.replace(/\.[^.]+$/, ""));
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در آپلود");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-navy-100 bg-navy-50/40 p-4">
      <p className="text-sm font-extrabold text-navy-900">{label}</p>
      {hint && showHints ? (
        <p className="mt-1 text-xs leading-6 text-navy-500">{hint}</p>
      ) : null}

      <div className="mt-3 flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="relative h-36 w-full overflow-hidden rounded-xl bg-navy-900/10 sm:w-48">
          {value ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={value} alt={alt || ""} className="h-full w-full object-cover" />
          ) : (
            <div className="grid h-full place-items-center text-xs text-navy-400">
              هنوز عکسی نیست
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2">
          <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-brand-yellow px-4 py-2.5 text-sm font-bold text-navy-950 hover:brightness-95">
            {uploading ? "در حال آپلود…" : "انتخاب و آپلود عکس"}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploading}
              onChange={(e) => onFile(e.target.files?.[0] || null)}
            />
          </label>
          {value ? (
            <AdminButton
              variant="ghost"
              className="text-red-600"
              onClick={() => onChange("")}
            >
              حذف عکس
            </AdminButton>
          ) : null}
          {onAltChange ? (
            <label className="block">
              <span className="mb-1 block text-xs font-bold text-navy-700">
                توضیح عکس (برای سئو)
              </span>
              <input
                className="w-full rounded-xl border border-navy-200 bg-brand-white px-3 py-2 text-sm outline-none focus:border-navy-600"
                value={alt || ""}
                onChange={(e) => onAltChange(e.target.value)}
                placeholder="مثلاً نمای شب تابلو چلنیوم"
              />
            </label>
          ) : null}
          {error ? <p className="text-xs text-red-600">{error}</p> : null}
        </div>
      </div>
    </div>
  );
}
