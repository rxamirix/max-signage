"use client";

import { useState } from "react";
import type { StoryVideo } from "@/lib/story-video";
import { AdminButton } from "@/components/admin/ui";
import { useAdminHints } from "@/components/admin/AdminHintsContext";
import { uploadAdminImage } from "@/components/admin/ImageUploadField";

export function VideosField({
  label = "ویدیوها",
  hint = "ویدیوها کنار عنوان هیرو با دکمه پخش استوری و در گالری پایین صفحه نشان داده می‌شوند.",
  value,
  onChange,
}: {
  label?: string;
  hint?: string;
  value: StoryVideo[];
  onChange: (videos: StoryVideo[]) => void;
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
      onChange([
        ...value,
        {
          src: url,
          alt: file.name.replace(/\.[^.]+$/, ""),
        },
      ]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در آپلود");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="rounded-2xl border border-navy-100 bg-navy-50/40 p-4">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div>
          <p className="text-sm font-extrabold text-navy-900">{label}</p>
          {hint && showHints ? (
            <p className="mt-1 text-xs leading-6 text-navy-500">{hint}</p>
          ) : null}
        </div>
        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-brand-yellow px-3 py-2 text-sm font-bold text-navy-950 hover:brightness-95">
          {uploading ? "در حال آپلود…" : "+ افزودن ویدیو"}
          <input
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/*"
            className="hidden"
            disabled={uploading}
            onChange={(e) => {
              void onFile(e.target.files?.[0] || null);
              e.target.value = "";
            }}
          />
        </label>
      </div>

      {error ? <p className="mb-2 text-sm text-red-600">{error}</p> : null}

      <div className="grid gap-3 sm:grid-cols-2">
        {value.map((video, index) => (
          <div
            key={`${video.src}-${index}`}
            className="rounded-xl border border-navy-100 bg-white p-3"
          >
            <video
              src={video.src}
              className="mb-2 aspect-video w-full rounded-lg bg-navy-950 object-cover"
              controls
              preload="metadata"
            />
            <input
              className="mb-2 w-full rounded-lg border border-navy-200 px-2 py-1.5 text-xs"
              value={video.alt || ""}
              onChange={(e) => {
                const next = [...value];
                next[index] = { ...video, alt: e.target.value };
                onChange(next);
              }}
              placeholder="عنوان / توضیح ویدیو"
            />
            <input
              className="mb-2 w-full rounded-lg border border-navy-200 px-2 py-1.5 text-xs"
              value={video.poster || ""}
              onChange={(e) => {
                const next = [...value];
                next[index] = { ...video, poster: e.target.value };
                onChange(next);
              }}
              placeholder="آدرس پوستر (اختیاری)"
              dir="ltr"
            />
            <label className="mb-2 inline-flex cursor-pointer text-xs font-bold text-navy-700 hover:text-navy-900">
              آپلود پوستر
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  try {
                    const url = await uploadAdminImage(file);
                    const next = [...value];
                    next[index] = { ...video, poster: url };
                    onChange(next);
                  } catch (err) {
                    setError(err instanceof Error ? err.message : "خطا در آپلود پوستر");
                  } finally {
                    e.target.value = "";
                  }
                }}
              />
            </label>
            <AdminButton
              variant="danger"
              className="w-full"
              onClick={() => onChange(value.filter((_, i) => i !== index))}
            >
              حذف این ویدیو
            </AdminButton>
          </div>
        ))}
        {!value.length ? (
          <p className="text-xs text-navy-500 sm:col-span-2">
            هنوز ویدیویی اضافه نشده.
          </p>
        ) : null}
      </div>
    </div>
  );
}
