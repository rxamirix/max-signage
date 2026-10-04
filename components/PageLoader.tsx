"use client";

import { LumaSpin } from "@/components/ui/luma-spin";

/** Full-viewport loader while pages resolve together (content + footer). */
export function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-brand-white"
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <div className="relative grid place-items-center">
        <div
          className="pointer-events-none absolute size-40 rounded-full bg-[radial-gradient(circle,rgba(234,234,53,0.45)_0%,rgba(45,49,146,0.25)_45%,transparent_70%)] blur-2xl"
          aria-hidden
        />
        <LumaSpin className="relative z-10" />
      </div>
      <span className="sr-only">در حال بارگذاری…</span>
    </div>
  );
}
