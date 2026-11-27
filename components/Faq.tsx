"use client";

import { useEffect, useId, useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "./ui";

export function Faq({
  items,
  tone = "light",
}: {
  items: { question: string; answer: string }[];
  tone?: "light" | "dark";
}) {
  const [openIndex, setOpenIndex] = useState(0);
  const faqId = useId();
  useEffect(() => { if (window.matchMedia("(max-width: 639px)").matches) setOpenIndex(-1); }, []);

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const questionId = `${faqId}-question-${index}`;
        const answerId = `${faqId}-answer-${index}`;

        return (
          <div
            key={item.question}
            className={cn(
              "faq-card relative overflow-hidden rounded-[20px] border transition-colors duration-300",
              tone === "light"
                ? isOpen
                  ? "border-navy-200 bg-white shadow-[0_12px_30px_-22px_rgba(0,35,111,.22)]"
                  : "border-[#e7e6ec] bg-white hover:border-navy-200"
                : isOpen
                  ? "border-brand-yellow/40 bg-brand-white/5"
                  : "border-brand-white/10 bg-brand-white/5",
            )}
            data-open={isOpen}
          >
            <h3 className="font-bold">
            <button
              type="button"
              id={questionId}
              aria-expanded={isOpen}
              aria-controls={answerId}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-start text-sm font-bold md:px-6 md:py-5 md:text-base",
                tone === "light" ? "text-[#292831]" : "text-brand-white",
              )}
            >
              <span className="flex items-center gap-3"><span className={cn("hidden text-xs font-bold tabular-nums sm:block", isOpen ? "text-navy-600" : "text-[#9c99a5]")}>{String(index + 1).padStart(2, '0')}</span>{item.question}</span>
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-9 shrink-0 place-items-center rounded-full transition-all duration-300 ease-out",
                  isOpen ? "rotate-45" : "rotate-0",
                  tone === "light"
                    ? isOpen ? "bg-navy-600 text-white" : "bg-navy-50 text-navy-700"
                    : "bg-brand-white/10 text-brand-yellow",
                )}
              >
                <Plus className="size-4" strokeWidth={2.4} />
              </span>
            </button>
            </h3>

            <div
              id={answerId}
              role="region"
              aria-labelledby={questionId}
              aria-hidden={!isOpen}
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p
                  className={cn(
                    "mx-5 border-t border-current/10 pt-3 pb-5 text-sm leading-8 md:mx-6 md:pb-6 md:text-base",
                    tone === "light"
                      ? "text-[#5f5c67]"
                      : "text-brand-white/75",
                    isOpen ? "opacity-100" : "opacity-0",
                    "transition-opacity duration-200 ease-out motion-reduce:transition-none",
                  )}
                >
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
