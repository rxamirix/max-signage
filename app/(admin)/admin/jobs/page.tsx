"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { Job } from "@/lib/jobs";
import {
  DEFAULT_JOB_STAGES,
  clampStage,
  formatRemainingFa,
  isJobComplete,
  jobProgressPercent,
  warrantyRemaining,
} from "@/lib/jobs";
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
import { useAdminHints } from "@/components/admin/AdminHintsContext";
import { cn } from "@/lib/utils";

type EditorTab = "customer" | "track" | "design" | "warranty";
type ListFilter = "all" | "building" | "warranty" | "expired";

type Draft = {
  id?: string;
  userPhone: string;
  userName: string;
  title: string;
  purpose: string;
  currentStage: number;
  stagesText: string;
  warrantyMonths: number;
  warrantyStartedAt: string;
  note: string;
  designImageUrl: string;
  designNote: string;
  size: string;
  material: string;
  color: string;
  lighting: string;
  price: string;
  deposit: string;
  contractDate: string;
  contractCode: string;
  contractPdfUrl: string;
};

const EDITOR_TABS: { id: EditorTab; label: string }[] = [
  { id: "customer", label: "مشتری و سفارش" },
  { id: "track", label: "رهگیری" },
  { id: "design", label: "طراحی و قرارداد" },
  { id: "warranty", label: "گارانتی" },
];

const LIST_FILTERS: { id: ListFilter; label: string }[] = [
  { id: "all", label: "همه" },
  { id: "building", label: "در حال ساخت" },
  { id: "warranty", label: "گارانتی فعال" },
  { id: "expired", label: "گارانتی تمام" },
];

function toDateInput(iso: string | null) {
  if (!iso) return "";
  return iso.slice(0, 10);
}

function todayDateInput() {
  return new Date().toISOString().slice(0, 10);
}

function emptyDraft(): Draft {
  return {
    userPhone: "",
    userName: "",
    title: "",
    purpose: "",
    currentStage: 0,
    stagesText: DEFAULT_JOB_STAGES.join("\n"),
    warrantyMonths: 24,
    warrantyStartedAt: "",
    note: "",
    designImageUrl: "",
    designNote: "",
    size: "",
    material: "",
    color: "",
    lighting: "",
    price: "",
    deposit: "",
    contractDate: "",
    contractCode: "",
    contractPdfUrl: "",
  };
}

function parseStages(text: string) {
  return text
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

function jobToDraft(job: Job): Draft {
  return {
    id: job.id,
    userPhone: job.userPhone,
    userName: job.userName,
    title: job.title,
    purpose: job.purpose || "",
    currentStage: job.currentStage,
    stagesText: job.stages.join("\n"),
    warrantyMonths: job.warrantyMonths,
    warrantyStartedAt: toDateInput(job.warrantyStartedAt),
    note: job.note || "",
    designImageUrl: job.design?.imageUrl || "",
    designNote: job.design?.note || "",
    size: job.contract?.size || "",
    material: job.contract?.material || "",
    color: job.contract?.color || "",
    lighting: job.contract?.lighting || "",
    price: job.contract?.price || "",
    deposit: job.contract?.deposit || "",
    contractDate: job.contract?.contractDate || "",
    contractCode: job.contract?.contractCode || "",
    contractPdfUrl: job.contract?.pdfUrl || "",
  };
}

function draftToJob(
  draft: Draft,
  createdAt: string,
  updatedAt: string,
): Job | { error: string } {
  const phone = draft.userPhone.replace(/[^\d]/g, "").slice(0, 11);
  const stages = parseStages(draft.stagesText);

  if (draft.userName.trim().length < 2 || !/^09\d{9}$/.test(phone)) {
    return { error: "نام و شماره موبایل معتبر الزامی است" };
  }
  if (!draft.title.trim()) return { error: "نوع کار (عنوان) الزامی است" };
  if (stages.length < 2) return { error: "حداقل دو مرحله وارد کنید" };

  const stage = clampStage(Number(draft.currentStage) || 0, stages.length);
  const warrantyStartedAt = draft.warrantyStartedAt
    ? new Date(`${draft.warrantyStartedAt}T12:00:00`).toISOString()
    : null;

  const designImageUrl = draft.designImageUrl.trim();
  const designNote = draft.designNote.trim();
  const design =
    designImageUrl || designNote
      ? {
          imageUrl: designImageUrl || undefined,
          note: designNote.slice(0, 400) || undefined,
        }
      : undefined;

  const contractFields = {
    size: draft.size.trim().slice(0, 80) || undefined,
    material: draft.material.trim().slice(0, 120) || undefined,
    color: draft.color.trim().slice(0, 80) || undefined,
    lighting: draft.lighting.trim().slice(0, 120) || undefined,
    price: draft.price.trim().slice(0, 80) || undefined,
    deposit: draft.deposit.trim().slice(0, 80) || undefined,
    contractDate: draft.contractDate.trim().slice(0, 40) || undefined,
    contractCode: draft.contractCode.trim().slice(0, 40) || undefined,
    pdfUrl: draft.contractPdfUrl.trim() || undefined,
  };
  const contract = Object.values(contractFields).some(Boolean)
    ? contractFields
    : undefined;

  return {
    id: draft.id || `job-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    userPhone: phone,
    userName: draft.userName.trim().slice(0, 80),
    title: draft.title.trim().slice(0, 120),
    purpose: draft.purpose.trim().slice(0, 120) || undefined,
    currentStage: stage,
    stages,
    warrantyMonths: Math.max(0, Number(draft.warrantyMonths) || 0),
    warrantyStartedAt,
    note: draft.note.trim().slice(0, 500),
    design,
    contract,
    createdAt,
    updatedAt,
  };
}

function StatusPill({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "yellow" | "green" | "blue" | "red" | "gray";
}) {
  const styles = {
    yellow: "bg-brand-yellow/25 text-navy-900",
    green: "bg-emerald-50 text-emerald-800",
    blue: "bg-sky-50 text-sky-800",
    red: "bg-red-50 text-red-700",
    gray: "bg-navy-100 text-navy-700",
  }[tone];
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-extrabold",
        styles,
      )}
    >
      {children}
    </span>
  );
}

function SectionTitle({
  title,
  hint,
}: {
  title: string;
  hint?: string;
}) {
  const { showHints } = useAdminHints();
  return (
    <div className="mb-3">
      <p className="text-sm font-extrabold text-navy-950">{title}</p>
      {hint && showHints ? (
        <p className="mt-1 text-xs leading-6 text-navy-500">{hint}</p>
      ) : null}
    </div>
  );
}

function EditorHint({ children }: { children: React.ReactNode }) {
  const { showHints } = useAdminHints();
  if (!showHints) return null;
  return <p className="mt-1 text-xs text-navy-500">{children}</p>;
}

export default function AdminJobsPage() {
  const { toast, showSuccess, showError } = useAdminToast();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editorTab, setEditorTab] = useState<EditorTab>("customer");
  const [listFilter, setListFilter] = useState<ListFilter>("all");
  const [saving, setSaving] = useState(false);
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    try {
      const res = await adminFetch("/api/admin/jobs");
      setJobs(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      showError(e instanceof Error ? e.message : "خطا");
    }
  }, [showError]);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    let building = 0;
    let warranty = 0;
    let expired = 0;
    for (const job of jobs) {
      const w = warrantyRemaining(job);
      if (w.status === "active") warranty += 1;
      else if (w.status === "expired") expired += 1;
      else building += 1;
    }
    return { total: jobs.length, building, warranty, expired };
  }, [jobs]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return jobs
      .map((job, index) => ({ job, index }))
      .filter(({ job }) => {
        const w = warrantyRemaining(job);
        if (listFilter === "building" && w.status !== "not_started") return false;
        if (listFilter === "warranty" && w.status !== "active") return false;
        if (listFilter === "expired" && w.status !== "expired") return false;
        if (!q) return true;
        return (
          job.title.toLowerCase().includes(q) ||
          (job.purpose || "").toLowerCase().includes(q) ||
          job.userName.toLowerCase().includes(q) ||
          job.userPhone.includes(q.replace(/\s/g, "")) ||
          (job.contract?.contractCode || "").toLowerCase().includes(q)
        );
      });
  }, [jobs, query, listFilter]);

  function openNew() {
    setDraft(emptyDraft());
    setEditingIndex(-1);
    setEditorTab("customer");
  }

  function openEdit(index: number) {
    setDraft(jobToDraft(jobs[index]));
    setEditingIndex(index);
    setEditorTab("customer");
  }

  function closeEditor() {
    setDraft(null);
    setEditingIndex(null);
    setEditorTab("customer");
  }

  async function saveAll(next: Job[], close = true) {
    setSaving(true);
    try {
      await adminFetch("/api/admin/jobs", {
        method: "PUT",
        body: JSON.stringify({ data: next }),
      });
      setJobs(next);
      showSuccess("ذخیره شد");
      if (close) closeEditor();
    } catch (e) {
      showError(e instanceof Error ? e.message : "خطا");
    } finally {
      setSaving(false);
    }
  }

  async function saveDraft() {
    if (!draft) return;
    const now = new Date().toISOString();
    const createdAt =
      editingIndex !== null && editingIndex >= 0
        ? jobs[editingIndex].createdAt
        : now;
    const result = draftToJob(draft, createdAt, now);
    if ("error" in result) {
      showError(result.error);
      return;
    }
    const next = [...jobs];
    if (editingIndex === -1) next.unshift(result);
    else if (editingIndex !== null) next[editingIndex] = result;
    await saveAll(next);
  }

  async function removeAt(index: number) {
    if (!confirm("این پروژه حذف شود؟")) return;
    await saveAll(
      jobs.filter((_, i) => i !== index),
      false,
    );
  }

  async function bumpStage(index: number) {
    const job = jobs[index];
    const nextStage = Math.min(job.currentStage + 1, job.stages.length);
    if (nextStage === job.currentStage) {
      showError("کار قبلاً تمام شده");
      return;
    }
    const next = [...jobs];
    next[index] = {
      ...job,
      currentStage: nextStage,
      updatedAt: new Date().toISOString(),
    };
    await saveAll(next, false);
  }

  async function completeJob(index: number) {
    const job = jobs[index];
    const next = [...jobs];
    next[index] = {
      ...job,
      currentStage: job.stages.length,
      updatedAt: new Date().toISOString(),
    };
    await saveAll(next, false);
  }

  async function activateWarranty(index: number) {
    const job = jobs[index];
    if (
      !confirm(
        "تحویل و نصب انجام شده؟ گارانتی از امروز فعال می‌شود.",
      )
    ) {
      return;
    }
    const next = [...jobs];
    next[index] = {
      ...job,
      currentStage: job.stages.length,
      warrantyStartedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    await saveAll(next, false);
  }

  const draftStages = draft ? parseStages(draft.stagesText) : [];
  const draftComplete =
    !!draft && draft.currentStage >= (draftStages.length || 0);
  const draftProgress = draft
    ? jobProgressPercent({
        currentStage: clampStage(
          draft.currentStage,
          draftStages.length || 1,
        ),
        stages: draftStages.length ? draftStages : ["—"],
        warrantyStartedAt: draft.warrantyStartedAt
          ? `${draft.warrantyStartedAt}T12:00:00`
          : null,
      })
    : 0;

  return (
    <div>
      {toast}
      <AdminPageHeader
        title="رهگیری پروژه‌ها"
        description="همان سه بخش حساب کاربر: رهگیری، طراحی و قرارداد، گارانتی. مرحله را جلو ببرید؛ بعد از تحویل و نصب، گارانتی را فعال کنید."
        actions={
          <AdminButton
            className="bg-brand-yellow text-navy-950 hover:brightness-95"
            onClick={openNew}
          >
            افزودن پروژه کاربر
          </AdminButton>
        }
      />

      <div className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { label: "کل پروژه‌ها", value: stats.total, tone: "bg-navy-50 text-navy-900" },
          { label: "در حال ساخت", value: stats.building, tone: "bg-brand-yellow/20 text-navy-900" },
          { label: "گارانتی فعال", value: stats.warranty, tone: "bg-emerald-50 text-emerald-900" },
          { label: "گارانتی تمام", value: stats.expired, tone: "bg-red-50 text-red-800" },
        ].map((item) => (
          <AdminCard key={item.label} className={cn("!p-4", item.tone)}>
            <p className="text-xs font-bold opacity-70">{item.label}</p>
            <p className="mt-1 text-2xl font-extrabold tabular">
              {item.value.toLocaleString("fa-IR")}
            </p>
          </AdminCard>
        ))}
      </div>

      <AdminCard className="mb-4 space-y-3">
        <AdminInput
          label="جستجو"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="نام، موبایل، نوع کار، کد قرارداد…"
        />
        <div className="flex flex-wrap gap-2">
          {LIST_FILTERS.map((f) => (
            <button
              key={f.id}
              type="button"
              onClick={() => setListFilter(f.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-extrabold transition-colors",
                listFilter === f.id
                  ? "bg-navy-600 text-brand-white"
                  : "bg-navy-100 text-navy-700 hover:bg-navy-200",
              )}
            >
              {f.label}
            </button>
          ))}
        </div>
      </AdminCard>

      <div className="space-y-3">
        {filtered.map(({ job, index }) => {
          const percent = jobProgressPercent(job);
          const w = warrantyRemaining(job);
          const complete = isJobComplete(job);
          const stageLabel = complete
            ? "اتمام کار"
            : job.stages[job.currentStage] || "—";
          const hasDesign = Boolean(job.design?.imageUrl || job.design?.note);
          const hasContract = Boolean(
            job.contract && Object.values(job.contract).some(Boolean),
          );

          return (
            <AdminCard key={job.id} className="!p-4 md:!p-5">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-extrabold text-navy-950">
                      {job.title}
                      {job.purpose ? (
                        <span className="font-bold text-navy-500">
                          {" "}
                          · {job.purpose}
                        </span>
                      ) : null}
                    </p>
                    {w.status === "active" ? (
                      <StatusPill tone="green">گارانتی فعال</StatusPill>
                    ) : w.status === "expired" ? (
                      <StatusPill tone="red">گارانتی تمام</StatusPill>
                    ) : complete ? (
                      <StatusPill tone="green">اتمام کار</StatusPill>
                    ) : (
                      <StatusPill tone="yellow">در حال ساخت</StatusPill>
                    )}
                    {hasDesign ? <StatusPill tone="blue">طراحی</StatusPill> : null}
                    {hasContract ? (
                      <StatusPill tone="gray">قرارداد</StatusPill>
                    ) : null}
                  </div>

                  <p className="mt-1.5 text-sm font-bold text-navy-800">
                    {job.userName}
                    <span className="mx-1.5 text-navy-300">|</span>
                    <span dir="ltr" className="font-medium text-navy-600">
                      {job.userPhone}
                    </span>
                  </p>

                  <div className="mt-3">
                    <div className="mb-1.5 flex items-center justify-between gap-3 text-xs font-bold text-navy-600">
                      <span>
                        {complete
                          ? "همه مراحل انجام شده"
                          : `مرحله ${(job.currentStage + 1).toLocaleString("fa-IR")} از ${job.stages.length.toLocaleString("fa-IR")} — ${stageLabel}`}
                      </span>
                      <span className="tabular text-navy-900">
                        {percent.toLocaleString("fa-IR")}٪
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-navy-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-navy-600 to-brand-yellow"
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                  </div>

                  <p className="mt-2 text-xs text-navy-500">
                    گارانتی {job.warrantyMonths.toLocaleString("fa-IR")} ماه
                    {w.status === "active"
                      ? ` · باقی‌مانده ${formatRemainingFa(w.remainingDays)}`
                      : w.status === "expired"
                        ? " · منقضی شده"
                        : " · بعد از تحویل و نصب فعال می‌شود"}
                    {job.contract?.price ? ` · ${job.contract.price}` : ""}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 lg:max-w-[300px] lg:justify-end">
                  {w.status === "not_started" ? (
                    <>
                      {!complete ? (
                        <>
                          <AdminButton
                            variant="secondary"
                            onClick={() => bumpStage(index)}
                            disabled={saving}
                          >
                            مرحله بعد
                          </AdminButton>
                          <AdminButton
                            className="bg-navy-800 text-brand-white hover:bg-navy-900"
                            onClick={() => completeJob(index)}
                            disabled={saving}
                          >
                            اتمام کار
                          </AdminButton>
                        </>
                      ) : null}
                      <AdminButton
                        className="bg-emerald-600 text-white hover:bg-emerald-700"
                        onClick={() => activateWarranty(index)}
                        disabled={saving}
                      >
                        تحویل + گارانتی
                      </AdminButton>
                    </>
                  ) : null}
                  <AdminButton variant="secondary" onClick={() => openEdit(index)}>
                    ویرایش
                  </AdminButton>
                  <AdminButton variant="danger" onClick={() => removeAt(index)}>
                    حذف
                  </AdminButton>
                </div>
              </div>
            </AdminCard>
          );
        })}

        {!filtered.length ? (
          <AdminCard>
            <p className="py-6 text-center text-sm leading-7 text-navy-500">
              {jobs.length
                ? "پروژه‌ای با این فیلتر پیدا نشد."
                : "هنوز پروژه‌ای برای رهگیری ثبت نشده."}
            </p>
          </AdminCard>
        ) : null}
      </div>

      {draft && editingIndex !== null ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 sm:items-center sm:p-4">
          <div className="flex max-h-[94svh] w-full max-w-3xl flex-col overflow-hidden rounded-3xl bg-brand-white shadow-2xl">
            <div className="border-b border-navy-100 px-5 py-4 md:px-6">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-xl font-extrabold text-navy-950">
                    {editingIndex === -1 ? "افزودن پروژه" : "ویرایش پروژه"}
                  </h2>
                  <EditorHint>
                    چهار بخش مثل حساب کاربر — فقط همان چیزی که باید پر شود را کامل کنید.
                  </EditorHint>
                </div>
                <AdminButton variant="ghost" onClick={closeEditor}>
                  بستن
                </AdminButton>
              </div>

              <div
                className="mt-4 grid grid-cols-2 gap-1.5 rounded-2xl bg-navy-50 p-1.5 sm:grid-cols-4"
                role="tablist"
              >
                {EDITOR_TABS.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    role="tab"
                    aria-selected={editorTab === tab.id}
                    onClick={() => setEditorTab(tab.id)}
                    className={cn(
                      "rounded-xl px-2 py-2.5 text-center text-xs font-extrabold transition-colors sm:text-sm",
                      editorTab === tab.id
                        ? "bg-navy-600 text-brand-white shadow-sm"
                        : "text-navy-600 hover:bg-white",
                    )}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="admin-scroll admin-scroll--main min-h-0 flex-1">
              <div className="admin-scroll-inner px-5 py-5 md:px-6">
              {editorTab === "customer" ? (
                <div className="grid gap-3 sm:grid-cols-2">
                  <SectionTitle
                    title="مشتری"
                    hint="با این شماره موبایل در حساب کاربری پروژه را می‌بیند."
                  />
                  <div className="hidden sm:block" />
                  <AdminInput
                    label="نام مشتری"
                    value={draft.userName}
                    onChange={(e) =>
                      setDraft({ ...draft, userName: e.target.value })
                    }
                  />
                  <AdminInput
                    label="شماره موبایل"
                    value={draft.userPhone}
                    dir="ltr"
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        userPhone: e.target.value.replace(/[^\d]/g, "").slice(0, 11),
                      })
                    }
                  />
                  <div className="sm:col-span-2">
                    <SectionTitle
                      title="نوع سفارش"
                      hint="عنوان بزرگ در داشبورد کاربر: نوع کار · کاربری"
                    />
                  </div>
                  <AdminInput
                    label="نوع کار"
                    value={draft.title}
                    onChange={(e) => setDraft({ ...draft, title: e.target.value })}
                    hint="مثلاً تابلو چلنیوم"
                  />
                  <AdminInput
                    label="برای چه / کاربری"
                    value={draft.purpose}
                    onChange={(e) =>
                      setDraft({ ...draft, purpose: e.target.value })
                    }
                    hint="مثلاً طلافروشی"
                  />
                  <div className="sm:col-span-2">
                    <AdminTextarea
                      label="یادداشت داخلی"
                      value={draft.note}
                      onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                      hint="فقط برای تیم مکث — به کاربر نشان داده نمی‌شود"
                    />
                  </div>
                </div>
              ) : null}

              {editorTab === "track" ? (
                <div className="space-y-4">
                  <SectionTitle
                    title="رهگیری پیشرفت"
                    hint="درصد از تعداد مراحل انجام‌شده حساب می‌شود. اول دکمه‌ها را بزنید، بعد ذخیره کنید."
                  />

                  <div className="rounded-2xl border border-navy-100 bg-navy-50/80 p-4">
                    <div className="flex flex-wrap items-end justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-navy-500">
                          وضعیت فعلی مشتری
                        </p>
                        <p className="mt-1 truncate text-lg font-extrabold text-navy-950">
                          {draftComplete
                            ? "اتمام کار"
                            : draftStages[draft.currentStage] || "—"}
                        </p>
                        <p className="mt-0.5 text-xs font-bold text-navy-500">
                          {draftComplete
                            ? "کامل"
                            : `${Math.min(draft.currentStage, draftStages.length).toLocaleString("fa-IR")} از ${draftStages.length.toLocaleString("fa-IR")} مرحله تمام`}
                        </p>
                      </div>
                      <p className="text-3xl font-extrabold tabular text-navy-800">
                        {draftProgress.toLocaleString("fa-IR")}٪
                      </p>
                    </div>
                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-navy-100">
                      <div
                        className="h-full rounded-full bg-gradient-to-l from-navy-600 to-brand-yellow transition-[width] duration-300"
                        style={{ width: `${draftProgress}%` }}
                      />
                    </div>
                  </div>

                  {/* کلیدها بالای لیست — همیشه دم‌دست */}
                  <div className="sticky top-0 z-10 space-y-2 rounded-2xl border border-navy-200 bg-brand-white p-3 shadow-sm">
                    <p className="text-xs font-extrabold text-navy-700">
                      جلو بردن کار
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        disabled={draft.currentStage <= 0}
                        onClick={() =>
                          setDraft({
                            ...draft,
                            currentStage: Math.max(0, draft.currentStage - 1),
                          })
                        }
                        className="inline-flex items-center justify-center rounded-xl border-2 border-navy-300 bg-brand-white px-4 py-2.5 text-sm font-extrabold text-navy-800 transition hover:bg-navy-50 disabled:opacity-40"
                      >
                        مرحله قبل
                      </button>
                      <button
                        type="button"
                        disabled={draftComplete}
                        onClick={() => {
                          if (draftComplete) return;
                          setDraft({
                            ...draft,
                            currentStage: Math.min(
                              draft.currentStage + 1,
                              draftStages.length,
                            ),
                          });
                        }}
                        className="inline-flex items-center justify-center rounded-xl bg-brand-yellow px-4 py-2.5 text-sm font-extrabold text-navy-950 transition hover:brightness-95 disabled:opacity-40"
                      >
                        {draftComplete
                          ? "تمام شد"
                          : draft.currentStage >= draftStages.length - 1
                            ? "اتمام کار"
                            : "مرحله بعد"}
                      </button>
                    </div>
                    <button
                      type="button"
                      disabled={draftComplete}
                      onClick={() =>
                        setDraft({
                          ...draft,
                          currentStage: draftStages.length,
                        })
                      }
                      className="inline-flex w-full items-center justify-center rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-extrabold text-white transition hover:bg-emerald-700 disabled:opacity-40"
                    >
                      {draftComplete
                        ? "✓ اتمام کار ثبت شد (۱۰۰٪)"
                        : "اتمام کار — ۱۰۰٪"}
                    </button>
                    {!draftComplete && draftStages[draft.currentStage + 1] ? (
                      <p className="text-center text-[11px] font-bold text-navy-500">
                        بعدی می‌رود به: {draftStages[draft.currentStage + 1]}
                      </p>
                    ) : null}
                  </div>

                  <div className="space-y-1.5">
                    <p className="text-xs font-extrabold text-navy-600">
                      خلاصه مراحل
                    </p>
                    <ol className="divide-y divide-navy-100 overflow-hidden rounded-xl border border-navy-100 bg-brand-white">
                      {draftStages.map((stage, i) => {
                        const done = i < draft.currentStage;
                        const active =
                          !draftComplete && i === draft.currentStage;
                        return (
                          <li
                            key={`${stage}-${i}`}
                            className={cn(
                              "flex items-center gap-2.5 px-3 py-2",
                              done && "bg-emerald-50/70",
                              active && "bg-brand-yellow/25",
                            )}
                          >
                            <span
                              className={cn(
                                "grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-extrabold",
                                done
                                  ? "bg-emerald-500 text-white"
                                  : active
                                    ? "bg-brand-yellow text-navy-950"
                                    : "bg-navy-100 text-navy-500",
                              )}
                            >
                              {done ? "✓" : (i + 1).toLocaleString("fa-IR")}
                            </span>
                            <span
                              className={cn(
                                "min-w-0 flex-1 truncate text-sm font-bold",
                                done || active
                                  ? "text-navy-950"
                                  : "text-navy-400",
                              )}
                            >
                              {stage}
                            </span>
                            <span
                              className={cn(
                                "shrink-0 text-[10px] font-extrabold",
                                done
                                  ? "text-emerald-600"
                                  : active
                                    ? "text-navy-800"
                                    : "text-navy-300",
                              )}
                            >
                              {done
                                ? "انجام"
                                : active
                                  ? "الان"
                                  : "بعد"}
                            </span>
                          </li>
                        );
                      })}
                      <li
                        className={cn(
                          "flex items-center gap-2.5 px-3 py-2",
                          draftComplete && "bg-emerald-50",
                        )}
                      >
                        <span
                          className={cn(
                            "grid size-6 shrink-0 place-items-center rounded-full text-[10px] font-extrabold",
                            draftComplete
                              ? "bg-emerald-600 text-white"
                              : "bg-navy-100 text-navy-500",
                          )}
                        >
                          {draftComplete ? "✓" : "★"}
                        </span>
                        <span className="min-w-0 flex-1 truncate text-sm font-bold text-navy-950">
                          اتمام کار
                        </span>
                        <span
                          className={cn(
                            "shrink-0 text-[10px] font-extrabold",
                            draftComplete
                              ? "text-emerald-600"
                              : "text-navy-300",
                          )}
                        >
                          {draftComplete ? "۱۰۰٪" : "—"}
                        </span>
                      </li>
                    </ol>
                  </div>

                  <details className="rounded-xl border border-navy-100 bg-navy-50/40 px-3 py-2">
                    <summary className="cursor-pointer text-sm font-bold text-navy-700">
                      ویرایش نام مراحل (پیشرفته)
                    </summary>
                    <div className="mt-3">
                      <AdminTextarea
                        label="هر خط یک مرحله"
                        value={draft.stagesText}
                        onChange={(e) => {
                          const text = e.target.value;
                          const stages = parseStages(text);
                          setDraft({
                            ...draft,
                            stagesText: text,
                            currentStage: clampStage(
                              draft.currentStage,
                              stages.length || 1,
                            ),
                          });
                        }}
                        hint="معمولاً لازم نیست عوض شود"
                      />
                    </div>
                  </details>
                </div>
              ) : null}

              {editorTab === "design" ? (
                <div className="space-y-4">
                  <SectionTitle
                    title="طراحی سه‌بعدی"
                    hint="همان چیزی که کاربر در تب «طراحی و قرارداد» می‌بیند."
                  />
                  <ImageUploadField
                    label="رندر / تصویر طراحی"
                    hint="عکس طراحی سه‌بعدی را آپلود کنید یا آدرس را دستی بگذارید."
                    value={draft.designImageUrl}
                    onChange={(url) =>
                      setDraft({ ...draft, designImageUrl: url })
                    }
                  />
                  <AdminInput
                    label="آدرس تصویر (اختیاری)"
                    value={draft.designImageUrl}
                    dir="ltr"
                    onChange={(e) =>
                      setDraft({ ...draft, designImageUrl: e.target.value })
                    }
                  />
                  <AdminTextarea
                    label="توضیح طراحی"
                    value={draft.designNote}
                    onChange={(e) =>
                      setDraft({ ...draft, designNote: e.target.value })
                    }
                  />

                  <div className="border-t border-navy-100 pt-4">
                    <SectionTitle
                      title="جزئیات قرارداد"
                      hint="ابعاد، قیمت و متریال — کاربر همه را یکجا می‌بیند."
                    />
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <AdminInput
                      label="ابعاد"
                      value={draft.size}
                      onChange={(e) => setDraft({ ...draft, size: e.target.value })}
                      placeholder="مثلاً ۴٫۵ × ۰٫۹ متر"
                    />
                    <AdminInput
                      label="متریال"
                      value={draft.material}
                      onChange={(e) =>
                        setDraft({ ...draft, material: e.target.value })
                      }
                    />
                    <AdminInput
                      label="رنگ"
                      value={draft.color}
                      onChange={(e) =>
                        setDraft({ ...draft, color: e.target.value })
                      }
                    />
                    <AdminInput
                      label="نورپردازی"
                      value={draft.lighting}
                      onChange={(e) =>
                        setDraft({ ...draft, lighting: e.target.value })
                      }
                    />
                    <AdminInput
                      label="مبلغ کل"
                      value={draft.price}
                      onChange={(e) =>
                        setDraft({ ...draft, price: e.target.value })
                      }
                      placeholder="مثلاً ۴۸٬۰۰۰٬۰۰۰ تومان"
                    />
                    <AdminInput
                      label="پیش‌پرداخت"
                      value={draft.deposit}
                      onChange={(e) =>
                        setDraft({ ...draft, deposit: e.target.value })
                      }
                    />
                    <AdminInput
                      label="تاریخ قرارداد"
                      value={draft.contractDate}
                      onChange={(e) =>
                        setDraft({ ...draft, contractDate: e.target.value })
                      }
                      placeholder="۱۴۰۴/۰۶/۲۰"
                    />
                    <AdminInput
                      label="کد قرارداد"
                      value={draft.contractCode}
                      dir="ltr"
                      onChange={(e) =>
                        setDraft({ ...draft, contractCode: e.target.value })
                      }
                    />
                    <div className="sm:col-span-2 space-y-2">
                      <p className="text-sm font-bold text-navy-800">
                        فایل PDF قرارداد
                      </p>
                      <EditorHint>
                        اگر قرارداد هنوز آماده نیست، خالی بگذارید — فقط طراحی
                        برای کاربر نمایش داده می‌شود.
                      </EditorHint>
                      <div className="flex flex-wrap items-center gap-2">
                        <label className="inline-flex cursor-pointer items-center justify-center rounded-xl bg-brand-yellow px-4 py-2.5 text-sm font-bold text-navy-950 hover:brightness-95">
                          آپلود PDF
                          <input
                            type="file"
                            accept="application/pdf,.pdf"
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
                                if (!res.ok) {
                                  showError(data.error || "آپلود ناموفق");
                                  return;
                                }
                                setDraft({
                                  ...draft,
                                  contractPdfUrl: data.data.url as string,
                                });
                                showSuccess("PDF آپلود شد");
                              } catch (err) {
                                showError(
                                  err instanceof Error ? err.message : "خطا",
                                );
                              } finally {
                                e.target.value = "";
                              }
                            }}
                          />
                        </label>
                        {draft.contractPdfUrl ? (
                          <>
                            <a
                              href={draft.contractPdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="rounded-xl border border-navy-200 px-3 py-2 text-sm font-bold text-navy-700 hover:bg-navy-50"
                            >
                              مشاهده PDF
                            </a>
                            <AdminButton
                              variant="ghost"
                              className="text-red-600"
                              onClick={() =>
                                setDraft({ ...draft, contractPdfUrl: "" })
                              }
                            >
                              حذف
                            </AdminButton>
                          </>
                        ) : null}
                      </div>
                      <AdminInput
                        label="آدرس PDF (اختیاری)"
                        value={draft.contractPdfUrl}
                        dir="ltr"
                        onChange={(e) =>
                          setDraft({
                            ...draft,
                            contractPdfUrl: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              ) : null}

              {editorTab === "warranty" ? (
                <div className="space-y-4">
                  <SectionTitle
                    title="گارانتی"
                    hint="تا وقتی تاریخ شروع خالی باشد، کاربر پیام «بعد از تحویل و نصب فعال می‌شود» را می‌بیند."
                  />
                  <AdminInput
                    label="مدت گارانتی (ماه)"
                    type="number"
                    value={String(draft.warrantyMonths)}
                    onChange={(e) =>
                      setDraft({
                        ...draft,
                        warrantyMonths: Number(e.target.value) || 0,
                      })
                    }
                  />
                  <AdminInput
                    label="تاریخ شروع گارانتی"
                    type="date"
                    value={draft.warrantyStartedAt}
                    onChange={(e) =>
                      setDraft({ ...draft, warrantyStartedAt: e.target.value })
                    }
                    hint="خالی = هنوز فعال نیست"
                  />
                  <div className="flex flex-wrap gap-2">
                    <AdminButton
                      variant="secondary"
                      onClick={() =>
                        setDraft({ ...draft, warrantyStartedAt: "" })
                      }
                    >
                      غیرفعال (قبل از تحویل)
                    </AdminButton>
                    <AdminButton
                      className="bg-emerald-600 text-white hover:bg-emerald-700"
                      onClick={() => {
                        const stages = parseStages(draft.stagesText);
                        setDraft({
                          ...draft,
                          warrantyStartedAt: todayDateInput(),
                          currentStage: stages.length,
                        });
                      }}
                    >
                      تحویل شد — فعال از امروز
                    </AdminButton>
                  </div>

                  <div className="rounded-2xl border border-navy-100 bg-navy-50/70 p-4 text-sm leading-7 text-navy-700">
                    {draft.warrantyStartedAt ? (
                      <p>
                        فعال از{" "}
                        {new Date(
                          `${draft.warrantyStartedAt}T12:00:00`,
                        ).toLocaleDateString("fa-IR")}{" "}
                        ·{" "}
                        {Number(draft.warrantyMonths || 0).toLocaleString("fa-IR")}{" "}
                        ماه
                      </p>
                    ) : (
                      <p>هنوز فعال نشده (بعد از تحویل و نصب)</p>
                    )}
                  </div>
                </div>
              ) : null}
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-2 border-t border-navy-100 bg-navy-50/50 px-5 py-4 md:px-6">
              <AdminButton variant="secondary" onClick={closeEditor}>
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
