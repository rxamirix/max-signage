"use client";

import * as React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Check,
  Cuboid,
  FileSignature,
  MapPinned,
  ShieldCheck,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export type StepStatus = "completed" | "active" | "pending" | "error";

export interface TrackerStep {
  title: string;
  description: string;
  date?: string;
  status: StepStatus;
  href?: string;
  icon?: LucideIcon;
}

export interface ProposalTrackerCardProps {
  status: string;
  title: string;
  purpose?: string;
  progressPercent: number;
  steps: TrackerStep[];
  buttonText?: string;
  buttonHref?: string;
  className?: string;
  /** وقتی داخل تب هستیم، عنوان تکراری نباشد */
  hideHeader?: boolean;
}

export const JOB_STAGE_ICONS: LucideIcon[] = [
  MapPinned,
  Cuboid,
  FileSignature,
  Wrench,
  ShieldCheck,
];

function ProgressBlock({
  percent,
  label,
  barClass,
}: {
  percent: number;
  label: string;
  barClass: string;
}) {
  const safe = Math.max(0, Math.min(100, percent));
  return (
    <div className="rounded-2xl bg-navy-50/70 px-4 py-5 text-center">
      <p className="text-3xl font-extrabold tracking-tight tabular text-navy-700 md:text-4xl">
        {safe.toLocaleString("fa-IR")}٪
      </p>
      <p className="mt-1 text-sm font-bold text-navy-500">{label}</p>
      <div
        className="mt-3.5 h-3 w-full overflow-hidden rounded-full bg-navy-100"
        role="progressbar"
        aria-valuenow={safe}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={label}
      >
        <motion.div
          className={cn("h-full rounded-full", barClass)}
          initial={{ width: 0 }}
          animate={{ width: `${safe}%` }}
          transition={{ type: "spring", stiffness: 80, damping: 18 }}
        />
      </div>
    </div>
  );
}

export function ProposalTrackerCard({
  status,
  title,
  purpose,
  progressPercent,
  steps,
  buttonText,
  buttonHref,
  className,
  hideHeader = false,
}: ProposalTrackerCardProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 14 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring" as const, stiffness: 110, damping: 14 },
    },
  };

  return (
    <Card
      className={cn(
        "w-full overflow-hidden rounded-2xl border border-navy-100 bg-brand-white text-navy-950 shadow-lg",
        className,
      )}
    >
      <CardHeader className="space-y-4 p-6 pb-2">
        {!hideHeader ? (
          <>
            <Badge
              variant="outline"
              className="w-fit border-brand-yellow/60 bg-brand-yellow/15 text-navy-800"
            >
              {status}
            </Badge>
            <h2 className="text-[1.65rem] font-extrabold leading-snug tracking-tight text-navy-950 md:text-[2rem]">
              <span>{title}</span>
              {purpose ? (
                <span className="whitespace-nowrap font-bold text-navy-500">
                  {" "}
                  · {purpose}
                </span>
              ) : null}
            </h2>
          </>
        ) : (
          <Badge
            variant="outline"
            className="w-fit border-brand-yellow/60 bg-brand-yellow/15 text-navy-800"
          >
            {status}
          </Badge>
        )}

        <ProgressBlock
          percent={progressPercent}
          label="از کار پیش رفته"
          barClass="bg-gradient-to-l from-navy-600 to-brand-yellow"
        />
      </CardHeader>

      <CardContent className="space-y-4 px-6 pb-6 pt-4">
        <motion.ul
          className="relative space-y-0"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {steps.map((step, index) => {
            const StageIcon = step.icon || JOB_STAGE_ICONS[index] || Wrench;
            const isLastStep = index === steps.length - 1;
            const done = step.status === "completed";
            const active = step.status === "active";

            const circleClass = done
              ? "bg-emerald-500 text-white"
              : active
                ? "bg-brand-yellow text-navy-950"
                : "bg-sky-600 text-brand-white";

            const lineClass = done
              ? "bg-emerald-500"
              : active
                ? "bg-brand-yellow/70"
                : "bg-sky-200";

            return (
              <motion.li
                key={`${step.title}-${index}`}
                className="flex items-start gap-4"
                variants={itemVariants}
              >
                <div className="relative flex flex-col items-center">
                  <div
                    className={cn(
                      "z-10 mt-0.5 flex size-9 items-center justify-center rounded-full shadow-sm",
                      circleClass,
                    )}
                  >
                    {done ? (
                      <Check className="size-5" strokeWidth={3} aria-hidden />
                    ) : (
                      <StageIcon
                        className="size-4"
                        strokeWidth={2.2}
                        aria-hidden
                      />
                    )}
                  </div>
                  {!isLastStep ? (
                    <div
                      className={cn(
                        "absolute top-10 h-[calc(100%-1rem)] w-0.5",
                        lineClass,
                      )}
                    />
                  ) : null}
                </div>
                <div className="flex-1 pt-1.5 pb-6">
                  <p
                    className={cn(
                      "font-extrabold text-navy-950",
                      done && "text-navy-800",
                    )}
                  >
                    {step.title}
                  </p>
                  <p
                    className={cn(
                      "mt-0.5 text-sm font-extrabold",
                      done
                        ? "text-emerald-600"
                        : active
                          ? "text-yellow-500"
                          : "text-sky-600",
                    )}
                  >
                    {done
                      ? "انجام شده"
                      : active
                        ? "در حال انجام"
                        : "در حال انتظار"}
                  </p>
                </div>
              </motion.li>
            );
          })}
        </motion.ul>

        {buttonText ? (
          buttonHref ? (
            <Button
              asChild
              size="lg"
              className="h-12 w-full rounded-xl bg-navy-600 text-base font-extrabold text-brand-white hover:bg-navy-700"
            >
              <Link href={buttonHref}>{buttonText}</Link>
            </Button>
          ) : (
            <Button
              size="lg"
              className="h-12 w-full rounded-xl bg-navy-600 text-base font-extrabold text-brand-white hover:bg-navy-700"
            >
              {buttonText}
            </Button>
          )
        ) : null}
      </CardContent>
    </Card>
  );
}
