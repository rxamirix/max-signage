"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { site } from "@/lib/site";
import { cn, PhoneIcon } from "./ui";

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <button
        type="button"
        onClick={() => window.scrollTo({ top: 0, behavior: "auto" })}
        aria-label="بازگشت به بالای صفحه"
        className={cn(
          "fixed right-4 bottom-24 z-40 grid size-11 place-items-center rounded-full border border-navy-200 bg-brand-white text-navy-700 shadow-lg transition-all duration-300 hover:bg-navy-50 sm:right-5 sm:bottom-5 md:right-8 md:bottom-8",
          showTop
            ? "translate-y-0 opacity-100"
            : "pointer-events-none translate-y-3 opacity-0",
        )}
      >
        <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
          <path
            d="m6 14 6-6 6 6"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
      </button>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-navy-100 bg-brand-white/95 backdrop-blur-md sm:hidden">
        <div className="grid grid-cols-2 gap-2 p-2.5">
          <a
            href={`tel:${site.phone}`}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-brand-yellow py-3 font-extrabold text-navy-900"
          >
            <PhoneIcon className="size-5" />
            تماس فوری
          </a>
          <Link
            href="/contact#quote"
            className="inline-flex items-center justify-center gap-2 rounded-full bg-navy-600 py-3 font-extrabold text-brand-white"
          >
            استعلام رایگان
          </Link>
        </div>
      </div>

      <div className="h-19 sm:hidden" aria-hidden="true" />
    </>
  );
}
