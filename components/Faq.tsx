"use client";

import { useState } from "react";
import { cn } from "./ui";

export function Faq({
  items,
  tone = "light",
}: {
  items: { question: string; answer: string }[];
  tone?: "light" | "dark";
}) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className={cn(
              "rounded-2xl border transition-colors duration-200",
              tone === "light"
                ? isOpen
                  ? "border-navy-300 bg-brand-white"
                  : "border-navy-100 bg-brand-white"
                : isOpen
                  ? "border-brand-yellow/40 bg-brand-white/5"
                  : "border-brand-white/10 bg-brand-white/5",
            )}
          >
            <button
              type="button"
              aria-expanded={isOpen}
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              className={cn(
                "flex w-full cursor-pointer items-center justify-between gap-4 px-5 py-4 text-start font-bold md:px-6 md:py-5",
                tone === "light" ? "text-navy-900" : "text-brand-white",
              )}
            >
              <h3 className="text-base font-bold md:text-lg">{item.question}</h3>
              <span
                aria-hidden="true"
                className={cn(
                  "grid size-7 shrink-0 place-items-center rounded-full text-lg transition-transform duration-200 ease-out",
                  isOpen ? "rotate-45" : "rotate-0",
                  tone === "light"
                    ? "bg-navy-100 text-navy-700"
                    : "bg-brand-white/10 text-brand-yellow",
                )}
              >
                +
              </span>
            </button>

            <div
              className={cn(
                "grid transition-[grid-template-rows] duration-200 ease-out motion-reduce:transition-none",
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
              )}
            >
              <div className="overflow-hidden">
                <p
                  className={cn(
                    "px-5 pb-5 leading-8 md:px-6 md:pb-6",
                    tone === "light"
                      ? "text-navy-700/85"
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
