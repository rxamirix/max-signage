"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Cuboid, FileText, Route, ShieldCheck } from "lucide-react";
import {
  ProposalTrackerCard,
  JOB_STAGE_ICONS,
  type TrackerStep,
} from "@/components/ui/tracker-card-1";
import type { JobContract, JobDesign } from "@/lib/jobs";
import { cn } from "@/lib/utils";

type AccountJob = {
  id: string;
  title: string;
  purpose?: string;
  currentStage: number;
  stages: string[];
  progressPercent: number;
  warrantyMonths: number;
  warrantyStartedAt: string | null;
  note: string;
  design?: JobDesign;
  contract?: JobContract;
  warranty: {
    status: "not_started" | "active" | "expired";
    remainingDays: number;
    percentLeft: number;
    remainingLabel: string;
    endDate: string | null;
  };
};

type AccountPayload = {
  user: { name: string; phone: string };
  jobs: AccountJob[];
};

type JobTab = "track" | "design" | "warranty";

const TABS: { id: JobTab; label: string; icon: typeof Route }[] = [
  { id: "track", label: "رهگیری", icon: Route },
  { id: "design", label: "طراحی و قرارداد", icon: Cuboid },
  { id: "warranty", label: "گارانتی", icon: ShieldCheck },
];

function isWarrantyLive(job: AccountJob) {
  return job.warranty.status === "active" || job.warranty.status === "expired";
}

function jobToSteps(job: AccountJob): TrackerStep[] {
  const delivered = isWarrantyLive(job);
  const complete =
    delivered || job.currentStage >= (job.stages.length || 0);
  return job.stages.map((title, index) => {
    const done = complete || index < job.currentStage;
    const active =
      !complete && index === job.currentStage;
    return {
      title,
      description: "",
      status: (done
        ? "completed"
        : active
          ? "active"
          : "pending") as TrackerStep["status"],
      icon: JOB_STAGE_ICONS[index],
    };
  });
}

function formatEndDateFa(iso: string | null) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString("fa-IR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function SpecRow({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 border-b border-navy-100 py-3 last:border-0">
      <span className="shrink-0 text-sm font-bold text-navy-500">{label}</span>
      <span className="text-left text-sm font-extrabold text-navy-950" dir="auto">
        {value}
      </span>
    </div>
  );
}

function DesignContractPanel({ job }: { job: AccountJob }) {
  const design = job.design;
  const contract = job.contract;
  const hasDesign = Boolean(design?.imageUrl || design?.note);
  const hasContractDetails = Boolean(
    contract &&
      (contract.size ||
        contract.material ||
        contract.color ||
        contract.lighting ||
        contract.price ||
        contract.deposit ||
        contract.contractDate ||
        contract.contractCode ||
        contract.pdfUrl),
  );

  if (!hasDesign && !hasContractDetails) {
    return (
      <div className="rounded-2xl border border-navy-100 bg-brand-white p-8 text-center shadow-lg">
        <Cuboid className="mx-auto size-10 text-navy-300" />
        <p className="mt-4 text-lg font-extrabold text-navy-950">
          هنوز طراحی ثبت نشده
        </p>
        <p className="mt-2 text-sm leading-7 text-navy-600">
          به‌محض آماده شدن طراحی سه‌بعدی، اینجا نمایش داده می‌شود.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {hasDesign ? (
        <div className="overflow-hidden rounded-2xl border border-navy-100 bg-brand-white shadow-lg">
          <div className="border-b border-navy-100 px-5 py-3">
            <p className="text-sm font-extrabold text-navy-950">طراحی سه‌بعدی</p>
          </div>
          {design?.imageUrl ? (
            <div className="relative aspect-[16/10] bg-navy-50">
              <Image
                src={design.imageUrl}
                alt={`طراحی ${job.title}`}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 512px"
              />
            </div>
          ) : null}
          {design?.note ? (
            <p className="px-5 py-4 text-sm leading-7 text-navy-700">{design.note}</p>
          ) : null}
        </div>
      ) : null}

      {hasContractDetails ? (
        <div className="rounded-2xl border border-navy-100 bg-brand-white p-5 shadow-lg">
          <div className="mb-2 flex items-center gap-2">
            <FileText className="size-5 text-navy-600" />
            <p className="text-sm font-extrabold text-navy-950">جزئیات قرارداد</p>
          </div>
          <div>
            <SpecRow label="نوع تابلو" value={job.title} />
            <SpecRow label="کاربری" value={job.purpose} />
            <SpecRow label="ابعاد" value={contract?.size} />
            <SpecRow label="متریال" value={contract?.material} />
            <SpecRow label="رنگ" value={contract?.color} />
            <SpecRow label="نورپردازی" value={contract?.lighting} />
            <SpecRow label="مبلغ کل" value={contract?.price} />
            <SpecRow label="پیش‌پرداخت" value={contract?.deposit} />
            <SpecRow label="تاریخ قرارداد" value={contract?.contractDate} />
            <SpecRow label="کد قرارداد" value={contract?.contractCode} />
          </div>
          {contract?.pdfUrl ? (
            <a
              href={contract.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-navy-600 text-base font-extrabold text-brand-white transition-colors hover:bg-navy-700"
            >
              <FileText className="size-5" />
              PDF قرارداد
            </a>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

function WarrantyPanel({ job }: { job: AccountJob }) {
  const live = isWarrantyLive(job);

  if (!live) {
    return (
      <div className="rounded-2xl border border-navy-100 bg-brand-white p-8 text-center shadow-lg">
        <span className="mx-auto grid size-14 place-items-center rounded-full bg-navy-50 text-navy-400">
          <ShieldCheck className="size-7" />
        </span>
        <p className="mt-5 text-xl font-extrabold text-navy-950">گارانتی هنوز فعال نیست</p>
        <p className="mt-3 text-sm leading-8 text-navy-600">
          گارانتی بعد از تحویل و نصب فعال می‌شود. تا وقتی مراحل ساخت تمام نشده،
          شمارش‌معکوس گارانتی شروع نمی‌شود.
        </p>
        <p className="mt-4 text-sm font-extrabold text-navy-800">
          مدت گارانتی کتبی پس از تحویل:{" "}
          {job.warrantyMonths.toLocaleString("fa-IR")} ماه
        </p>
      </div>
    );
  }

  const expired = job.warranty.status === "expired";
  const percent = job.warranty.percentLeft;
  const endLabel = formatEndDateFa(job.warranty.endDate);

  return (
    <div className="rounded-2xl border border-navy-100 bg-brand-white p-6 shadow-lg">
      <span
        className={cn(
          "inline-flex rounded-full px-3 py-1 text-xs font-extrabold",
          expired
            ? "bg-red-50 text-red-700"
            : "bg-emerald-50 text-emerald-800",
        )}
      >
        {expired ? "گارانتی منقضی" : "گارانتی فعال"}
      </span>

      <div className="mt-5 rounded-2xl bg-navy-50/70 px-4 py-5 text-center">
        <p className="text-3xl font-extrabold tracking-tight tabular text-navy-700 md:text-4xl">
          {percent.toLocaleString("fa-IR")}٪
        </p>
        <p className="mt-1 text-sm font-bold text-navy-500">
          {expired
            ? "گارانتی تمام شده"
            : `${job.warranty.remainingLabel} گارانتی باقی مانده`}
        </p>
        <div className="mt-3.5 h-3 w-full overflow-hidden rounded-full bg-navy-100">
          <div
            className={cn(
              "h-full rounded-full",
              expired
                ? "bg-red-500"
                : "bg-gradient-to-l from-navy-600 to-brand-yellow",
            )}
            style={{ width: `${Math.max(0, Math.min(100, percent))}%` }}
          />
        </div>
      </div>

      <div className="mt-5 space-y-3 rounded-2xl border border-navy-100 bg-navy-50/60 p-4 text-center">
        <p className="text-sm font-bold text-navy-500">مدت گارانتی کتبی</p>
        <p className="text-2xl font-extrabold text-navy-950">
          {job.warrantyMonths.toLocaleString("fa-IR")} ماه
        </p>
        {endLabel ? (
          <p className="text-sm font-bold text-navy-600">پایان گارانتی: {endLabel}</p>
        ) : null}
        <p className="text-sm leading-7 text-navy-600">
          پروژه تحویل و نصب شده. تا پایان گارانتی، پشتیبانی مکث برقرار است.
        </p>
      </div>
    </div>
  );
}

function JobPanels({ job }: { job: AccountJob }) {
  const [tab, setTab] = useState<JobTab>("track");
  const delivered = isWarrantyLive(job);

  return (
    <div className="mx-auto w-full max-w-lg">
      <div className="mb-5 text-center md:text-right">
        <h2 className="text-[1.65rem] font-extrabold leading-snug text-navy-950 md:text-[2rem]">
          <span>{job.title}</span>
          {job.purpose ? (
            <span className="whitespace-nowrap font-bold text-navy-500">
              {" "}
              · {job.purpose}
            </span>
          ) : null}
        </h2>
      </div>

      <div
        className="mb-5 grid grid-cols-3 gap-2 rounded-2xl border border-navy-100 bg-brand-white p-1.5 shadow-sm"
        role="tablist"
        aria-label="بخش‌های پروژه"
      >
        {TABS.map(({ id, label, icon: Icon }) => {
          const active = tab === id;
          return (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setTab(id)}
              className={cn(
                "flex flex-col items-center gap-1 rounded-xl px-1 py-2.5 text-center transition-colors",
                active
                  ? "bg-navy-600 text-brand-white shadow-sm"
                  : "text-navy-600 hover:bg-navy-50",
              )}
            >
              <Icon className="size-4" strokeWidth={2.2} />
              <span className="text-[11px] font-extrabold leading-tight sm:text-xs">
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <div role="tabpanel">
        {tab === "track" ? (
          <ProposalTrackerCard
                  status={
                    delivered || job.currentStage >= job.stages.length
                      ? "اتمام کار"
                      : job.stages[job.currentStage] || "در حال پیگیری"
                  }
            title={job.title}
            purpose={job.purpose}
            progressPercent={job.progressPercent}
            steps={jobToSteps(job)}
            hideHeader
            buttonText="تماس با مکث"
            buttonHref="/contact"
          />
        ) : null}
        {tab === "design" ? <DesignContractPanel job={job} /> : null}
        {tab === "warranty" ? <WarrantyPanel job={job} /> : null}
      </div>
    </div>
  );
}

export function AccountDashboard() {
  const router = useRouter();
  const [data, setData] = useState<AccountPayload | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/account/jobs");
      if (res.status === 401) {
        router.replace("/login?next=/account");
        return;
      }
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "خطا");
      setData(json);
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    load();
  }, [load]);

  async function logout() {
    await fetch("/api/users/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  if (loading) {
    return (
      <p className="py-20 text-center text-sm text-navy-500">در حال بارگذاری…</p>
    );
  }

  if (error || !data) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-red-600">{error || "خطا"}</p>
        <Link href="/login" className="mt-4 inline-block font-bold text-navy-700">
          ورود مجدد
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-gradient-to-b from-navy-50/80 to-brand-white">
      <div className="border-b border-navy-100 bg-brand-white/90 backdrop-blur-md">
        <div className="container-page flex flex-wrap items-center justify-between gap-3 py-4">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-navy-200 bg-brand-white px-4 py-2 text-sm font-bold text-navy-800 transition-colors hover:bg-navy-50"
          >
            <svg viewBox="0 0 24 24" className="size-4" aria-hidden="true">
              <path
                d="M15 6 9 12l6 6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            بازگشت به خانه
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/portfolio"
              className="rounded-full px-3 py-2 text-sm font-bold text-navy-700 hover:bg-navy-50"
            >
              نمونه‌کارها
            </Link>
            <Link
              href="/contact"
              className="rounded-full px-3 py-2 text-sm font-bold text-navy-700 hover:bg-navy-50"
            >
              تماس / سفارش
            </Link>
          </div>
        </div>
      </div>

      <div className="container-page py-10 md:py-14">
        <div className="mb-10">
          <p className="text-sm font-bold text-navy-500">حساب کاربری</p>
          <h1 className="mt-1 text-2xl font-extrabold text-navy-950 md:text-3xl">
            سلام، {data.user.name}
          </h1>
          <p className="mt-2 text-right text-sm text-navy-600" dir="ltr">
            {data.user.phone}
          </p>
        </div>

        {!data.jobs.length ? (
          <div className="mx-auto max-w-xl rounded-3xl border border-navy-100 bg-brand-white p-8 text-center shadow-[0_20px_50px_rgba(20,22,63,0.06)] md:p-12">
            <span className="mx-auto grid size-16 place-items-center rounded-full bg-navy-50 text-navy-400">
              <svg viewBox="0 0 24 24" className="size-8" aria-hidden="true">
                <path
                  d="M4 7h16M4 12h10M4 17h7"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </span>
            <p className="mt-5 text-xl font-extrabold text-navy-950">
              هنوز سفارشی ثبت نشده
            </p>
            <p className="mt-3 text-sm leading-8 text-navy-600">
              وقتی پروژه شما در مکث ثبت شود، اینجا رهگیری، طراحی و گارانتی را
              می‌بینید.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/contact"
                className="inline-flex items-center justify-center rounded-full bg-navy-600 px-6 py-3 text-sm font-bold text-brand-white hover:bg-navy-700"
              >
                ثبت درخواست جدید
              </Link>
              <Link
                href="/portfolio"
                className="inline-flex items-center justify-center rounded-full border border-navy-200 bg-brand-white px-6 py-3 text-sm font-bold text-navy-800 hover:bg-navy-50"
              >
                مشاهده نمونه‌کارها
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-10">
            {data.jobs.map((job) => (
              <JobPanels key={job.id} job={job} />
            ))}
          </div>
        )}

        <div className="mt-16 border-t border-navy-100 pt-8 pb-4 text-center">
          <button
            type="button"
            onClick={logout}
            className="rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-red-700"
          >
            خروج از حساب
          </button>
        </div>
      </div>
    </div>
  );
}
