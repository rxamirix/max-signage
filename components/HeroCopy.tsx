"use client";

import { site } from "@/lib/site";
import { MaxWordmark } from "./MaxWordmark";

export function HeroCopy() {
  return (
    <main className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-5 pb-20 select-none sm:px-6 sm:pb-24 md:pb-16">
      <div className="pointer-events-auto flex w-full max-w-4xl flex-col items-center pt-12 text-center sm:pt-14 md:translate-y-8 md:pt-16 lg:translate-y-10 lg:pt-20">
        <h1 className="animate-fade-up mb-5 text-brand-white sm:mb-7 md:mb-10 [animation-delay:120ms]">
          <MaxWordmark
            className="mx-auto h-auto w-[min(82vw,20rem)] text-brand-white sm:w-[min(78vw,28rem)] md:w-[min(82vw,50rem)] lg:w-[min(70vw,56rem)]"
            forSeeClassName="fill-brand-yellow"
          />
          <span className="sr-only">
            {site.mottoEn} — {site.motto}. {site.name}. {site.brandPromise}
          </span>
        </h1>

        <a
          href="/contact#quote"
          className="animate-fade-up group relative inline-flex items-center gap-2.5 overflow-hidden rounded-full bg-brand-yellow px-7 py-3 text-[0.95rem] font-bold text-navy-950 shadow-[0_14px_40px_rgba(234,234,53,0.32)] transition-transform duration-200 hover:-translate-y-0.5 hover:scale-[1.03] active:scale-[0.98] sm:gap-3 sm:px-8 sm:py-3.5 sm:text-base md:px-10 md:py-4 md:text-lg [animation-delay:280ms]"
        >
          <span
            aria-hidden="true"
            className="absolute inset-x-4 top-0 h-px rounded-full bg-white/55"
          />
          <span
            aria-hidden="true"
            className="absolute inset-0 translate-x-full bg-gradient-to-l from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:-translate-x-full"
          />
          <span className="relative">استعلام رایگان</span>
          <svg
            viewBox="0 0 20 20"
            className="relative size-4 transition-transform duration-300 group-hover:-translate-x-1 sm:size-5"
            aria-hidden="true"
          >
            <path
              d="M12 4 6 10l6 6"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
        </a>
      </div>
    </main>
  );
}
