import { processSteps } from "@/lib/content";

export const DEFAULT_JOB_STAGES = processSteps.map((s) => s.title);

export type JobDesign = {
  /** تصویر / رندر طراحی سه‌بعدی */
  imageUrl?: string;
  /** توضیح کوتاه طراحی */
  note?: string;
};

export type JobContract = {
  /** ابعاد مثلاً ۳×۰٫۸ متر */
  size?: string;
  material?: string;
  color?: string;
  lighting?: string;
  /** مبلغ کل (متن فارسی) */
  price?: string;
  /** پیش‌پرداخت */
  deposit?: string;
  /** تاریخ قرارداد */
  contractDate?: string;
  /** شماره / کد قرارداد */
  contractCode?: string;
  /** فایل PDF قرارداد */
  pdfUrl?: string;
};

export type Job = {
  id: string;
  userPhone: string;
  userName: string;
  /** نوع کار درخواستی (مثلاً تابلو چلنیوم) */
  title: string;
  /** برای چه می‌خواستن (مثلاً سردر فروشگاه) */
  purpose?: string;
  /** 0-based index into stages */
  currentStage: number;
  stages: string[];
  /** total warranty length in months */
  warrantyMonths: number;
  /** ISO date when warranty countdown starts; null = not started yet */
  warrantyStartedAt: string | null;
  note: string;
  design?: JobDesign;
  contract?: JobContract;
  createdAt: string;
  updatedAt: string;
};

/** currentStage === stages.length means «اتمام کار» (all steps done) */
export function clampStage(stage: number, stagesLength: number) {
  if (stagesLength <= 0) return 0;
  return Math.max(0, Math.min(stage, stagesLength));
}

export function isJobComplete(
  job: Pick<Job, "currentStage" | "stages" | "warrantyStartedAt">,
) {
  if (job.warrantyStartedAt) return true;
  return job.currentStage >= (job.stages.length || 0);
}

export function jobProgressPercent(
  job: Pick<Job, "currentStage" | "stages" | "warrantyStartedAt">,
) {
  if (job.warrantyStartedAt) return 100;
  const total = job.stages.length || 1;
  const stage = clampStage(job.currentStage, total);
  // تعداد مراحل انجام‌شده / کل — اتمام کار = ۱۰۰٪
  return Math.round((stage / total) * 100);
}

export function warrantyRemaining(job: Pick<Job, "warrantyMonths" | "warrantyStartedAt">) {
  if (!job.warrantyStartedAt || job.warrantyMonths <= 0) {
    return {
      status: "not_started" as const,
      totalDays: 0,
      remainingDays: 0,
      percentLeft: 0,
      endDate: null as string | null,
    };
  }

  const start = new Date(job.warrantyStartedAt);
  const end = new Date(start);
  end.setMonth(end.getMonth() + job.warrantyMonths);

  const now = Date.now();
  const totalMs = end.getTime() - start.getTime();
  const remainingMs = end.getTime() - now;
  const totalDays = Math.max(1, Math.ceil(totalMs / (24 * 60 * 60 * 1000)));
  const remainingDays = Math.ceil(remainingMs / (24 * 60 * 60 * 1000));

  if (remainingDays <= 0) {
    return {
      status: "expired" as const,
      totalDays,
      remainingDays: 0,
      percentLeft: 0,
      endDate: end.toISOString(),
    };
  }

  return {
    status: "active" as const,
    totalDays,
    remainingDays,
    percentLeft: Math.min(100, Math.round((remainingMs / totalMs) * 100)),
    endDate: end.toISOString(),
  };
}

export function formatRemainingFa(days: number) {
  if (days <= 0) return "منقضی شده";
  if (days < 30) return `${days.toLocaleString("fa-IR")} روز`;
  const months = Math.floor(days / 30);
  const remDays = days % 30;
  if (remDays === 0) return `${months.toLocaleString("fa-IR")} ماه`;
  return `${months.toLocaleString("fa-IR")} ماه و ${remDays.toLocaleString("fa-IR")} روز`;
}
