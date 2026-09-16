"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";

type HomeSnapSliderProps = {
  children: ReactNode[];
  slideClassName?: string;
  className?: string;
  ariaLabel?: string;
};

function MaxScrollControls({
  canPrev,
  canNext,
  onPrev,
  onNext,
}: {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <div className="mt-1 flex items-center justify-center gap-4 px-4 md:mt-2">
      <button
        type="button"
        aria-label="اسلاید قبلی"
        disabled={!canPrev}
        onClick={onPrev}
        className="inline-flex size-11 items-center justify-center rounded-full border border-navy-200 bg-brand-white text-navy-800 shadow-[0_8px_20px_rgba(20,22,63,0.1)] transition enabled:hover:border-navy-600 enabled:hover:text-navy-600 disabled:opacity-35"
      >
        <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
          <path
            d="M8 4l6 6-6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <span
        aria-hidden="true"
        className="h-1.5 w-1.5 rounded-full bg-brand-yellow shadow-[0_0_12px_rgba(234,234,53,0.7)]"
      />

      <button
        type="button"
        aria-label="اسلاید بعدی"
        disabled={!canNext}
        onClick={onNext}
        className="inline-flex size-11 items-center justify-center rounded-full border border-navy-200 bg-brand-white text-navy-800 shadow-[0_8px_20px_rgba(20,22,63,0.1)] transition enabled:hover:border-navy-600 enabled:hover:text-navy-600 disabled:opacity-35"
      >
        <svg viewBox="0 0 20 20" className="size-5" aria-hidden="true">
          <path
            d="M12 4 6 10l6 6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}

export function HomeSnapSlider({
  children,
  slideClassName = "w-[min(62vw,15rem)] sm:w-[min(48vw,18rem)] lg:w-[min(26vw,20rem)]",
  className,
  ariaLabel = "اسلایدر",
}: HomeSnapSliderProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    setCanPrev(pos > 8);
    setCanNext(pos < max - 8);
  }, []);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      el.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, [update, children.length]);

  const scrollByDir = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.75, 280);
    const rtl = getComputedStyle(el).direction === "rtl";
    const delta = (rtl ? -dir : dir) * amount;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  return (
    <div className={cn("relative", className)}>
      <div
        ref={scrollerRef}
        role="region"
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain px-5 py-6 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-4 sm:px-6 md:py-8 [&::-webkit-scrollbar]:hidden"
      >
        {children.map((child, index) => (
          <div
            key={index}
            className={cn(
              "snap-center shrink-0 [scroll-margin-inline:1.25rem]",
              slideClassName,
            )}
          >
            {child}
          </div>
        ))}
      </div>

      <MaxScrollControls
        canPrev={canPrev}
        canNext={canNext}
        onPrev={() => scrollByDir(-1)}
        onNext={() => scrollByDir(1)}
      />
    </div>
  );
}
