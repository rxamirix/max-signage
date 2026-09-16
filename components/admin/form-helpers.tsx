"use client";

import { AdminButton, AdminInput, AdminTextarea } from "@/components/admin/ui";

export function LinesEditor({
  label,
  hint,
  value,
  onChange,
  rows = 4,
}: {
  label: string;
  hint?: string;
  value: string[];
  onChange: (next: string[]) => void;
  rows?: number;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-bold text-navy-800">{label}</span>
      {hint ? <span className="mb-1.5 block text-xs text-navy-500">{hint}</span> : null}
      <textarea
        className="min-h-24 w-full rounded-xl border border-navy-200 bg-brand-white px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20"
        rows={rows}
        value={(value || []).join("\n")}
        onChange={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((l) => l.trimEnd())
              .filter((l, i, arr) => !(l === "" && i === arr.length - 1)),
          )
        }
        onBlur={(e) =>
          onChange(
            e.target.value
              .split("\n")
              .map((l) => l.trim())
              .filter(Boolean),
          )
        }
      />
    </label>
  );
}

export function FaqPairsEditor({
  items,
  onChange,
}: {
  items: { question: string; answer: string }[];
  onChange: (next: { question: string; answer: string }[]) => void;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-navy-100 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-extrabold text-navy-900">سوالات پرتکرار</p>
        <AdminButton
          variant="secondary"
          onClick={() => onChange([...(items || []), { question: "", answer: "" }])}
        >
          + سوال
        </AdminButton>
      </div>
      {(items || []).map((item, i) => (
        <div key={i} className="space-y-2 rounded-xl bg-navy-50/50 p-3">
          <AdminInput
            label="سوال"
            value={item.question}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], question: e.target.value };
              onChange(next);
            }}
          />
          <AdminTextarea
            label="پاسخ"
            value={item.answer}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], answer: e.target.value };
              onChange(next);
            }}
          />
          <AdminButton
            variant="danger"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          >
            حذف سوال
          </AdminButton>
        </div>
      ))}
      {!items?.length ? (
        <p className="text-xs text-navy-500">هنوز سوالی اضافه نشده.</p>
      ) : null}
    </div>
  );
}

export function SpecsEditor({
  items,
  onChange,
  title = "مشخصات",
}: {
  items: { label: string; value: string }[];
  onChange: (next: { label: string; value: string }[]) => void;
  title?: string;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-navy-100 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-extrabold text-navy-900">{title}</p>
        <AdminButton
          variant="secondary"
          onClick={() => onChange([...(items || []), { label: "", value: "" }])}
        >
          + ردیف
        </AdminButton>
      </div>
      {(items || []).map((item, i) => (
        <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
          <input
            className="rounded-xl border border-navy-200 px-3 py-2 text-sm"
            placeholder="عنوان"
            value={item.label}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], label: e.target.value };
              onChange(next);
            }}
          />
          <input
            className="rounded-xl border border-navy-200 px-3 py-2 text-sm"
            placeholder="مقدار"
            value={item.value}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], value: e.target.value };
              onChange(next);
            }}
          />
          <AdminButton
            variant="danger"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          >
            حذف
          </AdminButton>
        </div>
      ))}
    </div>
  );
}

export function FeaturesEditor({
  items,
  onChange,
  title = "ویژگی‌ها",
}: {
  items: { title: string; description: string }[];
  onChange: (next: { title: string; description: string }[]) => void;
  title?: string;
}) {
  return (
    <div className="space-y-3 rounded-2xl border border-navy-100 p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-extrabold text-navy-900">{title}</p>
        <AdminButton
          variant="secondary"
          onClick={() =>
            onChange([...(items || []), { title: "", description: "" }])
          }
        >
          + ویژگی
        </AdminButton>
      </div>
      {(items || []).map((item, i) => (
        <div key={i} className="space-y-2 rounded-xl bg-navy-50/50 p-3">
          <AdminInput
            label="عنوان ویژگی"
            value={item.title}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], title: e.target.value };
              onChange(next);
            }}
          />
          <AdminTextarea
            label="توضیح ویژگی"
            value={item.description}
            onChange={(e) => {
              const next = [...items];
              next[i] = { ...next[i], description: e.target.value };
              onChange(next);
            }}
          />
          <AdminButton
            variant="danger"
            onClick={() => onChange(items.filter((_, idx) => idx !== i))}
          >
            حذف ویژگی
          </AdminButton>
        </div>
      ))}
      {!items?.length ? (
        <p className="text-xs text-navy-500">هنوز ویژگی‌ای اضافه نشده.</p>
      ) : null}
    </div>
  );
}

export function slugifyFa(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
