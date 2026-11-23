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
  progress,
}: {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  progress: number;
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

      <span aria-hidden="true" className="h-1.5 w-24 overflow-hidden rounded-full bg-navy-100 sm:w-36">
        <span className="block h-full origin-right rounded-full bg-gradient-to-l from-navy-600 to-navy-400 transition-transform duration-300" style={{ transform: `scaleX(${Math.max(.12, progress)})` }} />
      </span>

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
  const dragRef = useRef({ x: 0, y: 0, moved: false, active: false });
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    setCanPrev(pos > 8);
    setCanNext(pos < max - 8);
    setProgress(max > 0 ? Math.max(0, Math.min(1, pos / max)) : 1);
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
    const firstSlide = el.firstElementChild?.getBoundingClientRect();
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    const amount = firstSlide ? firstSlide.width + gap : el.clientWidth * .75;
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
        className="home-snap-track flex snap-x snap-mandatory gap-2.5 overflow-x-auto overscroll-x-contain px-2 pt-5 pb-7 [-ms-overflow-style:none] [scrollbar-width:none] sm:gap-5 sm:px-7 sm:pt-7 sm:pb-10 md:pt-9 md:pb-12 [&::-webkit-scrollbar]:hidden"
        style={{ maskImage: `linear-gradient(to right, ${canNext ? 'transparent' : '#000'}, #000 var(--snap-fade, 22px), #000 calc(100% - var(--snap-fade, 22px)), ${canPrev ? 'transparent' : '#000'})` }}
        onPointerDown={(event) => {
          dragRef.current = {
            x: event.clientX,
            y: event.clientY,
            moved: false,
            active: true,
          };
        }}
        onPointerMove={(event) => {
          if (!dragRef.current.active) return;
          const dx = Math.abs(event.clientX - dragRef.current.x);
          const dy = Math.abs(event.clientY - dragRef.current.y);
          if (dx > 10 || dy > 10) dragRef.current.moved = true;
        }}
        onPointerUp={() => { dragRef.current.active = false; }}
        onPointerCancel={() => { dragRef.current.active = false; }}
        onPointerLeave={() => { dragRef.current.active = false; }}
        onClickCapture={(event) => {
          if (!dragRef.current.moved) return;
          event.preventDefault();
          event.stopPropagation();
          dragRef.current.moved = false;
        }}
      >
        {children.map((child, index) => (
          <div
            key={index}
            className={cn(
              "home-snap-slide snap-center shrink-0 [scroll-margin-inline:1.25rem]",
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
        progress={progress}
      />
    </div>
  );
}
