"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "@/lib/utils";
import { SlideDots } from "./SlideDots";

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
  positions,
  active,
  onSelect,
}: {
  canPrev: boolean;
  canNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  positions: number[];
  active: number;
  onSelect: (index: number) => void;
}) {
  return (
    <div className="home-snap-controls mt-1 flex items-center justify-center gap-4 px-4 md:mt-2">
      <button
        type="button"
        aria-label="اسلاید قبلی"
        disabled={!canPrev}
        onClick={onPrev}
        className="slide-arrow hidden size-11 items-center justify-center rounded-full border border-navy-200 bg-brand-white text-navy-800 shadow-[0_8px_20px_rgba(20,22,63,0.1)] transition enabled:hover:border-navy-600 enabled:hover:text-navy-600 disabled:opacity-35 md:inline-flex"
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

      <SlideDots count={positions.length} active={active} onSelect={onSelect} />

      <button
        type="button"
        aria-label="اسلاید بعدی"
        disabled={!canNext}
        onClick={onNext}
        className="slide-arrow hidden size-11 items-center justify-center rounded-full border border-navy-200 bg-brand-white text-navy-800 shadow-[0_8px_20px_rgba(20,22,63,0.1)] transition enabled:hover:border-navy-600 enabled:hover:text-navy-600 disabled:opacity-35 md:inline-flex"
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
  const [positions, setPositions] = useState<number[]>([0]);
  const [active, setActive] = useState(0);

  const update = useCallback(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const pos = Math.abs(el.scrollLeft);
    setCanPrev(pos > 8);
    setCanNext(pos < max - 8);
    const rtl = getComputedStyle(el).direction === "rtl";
    const center = el.getBoundingClientRect().left + el.clientWidth / 2;
    const targets = [0, ...Array.from(el.children, (slide) => {
      const rect = slide.getBoundingClientRect();
      const offset = rect.left + rect.width / 2 - center;
      return Math.max(0, Math.min(max, pos + (rtl ? -offset : offset)));
    }), max].sort((a, b) => a - b).filter((value, index, all) => index === 0 || value - all[index - 1] > 8);
    setPositions((previous) => previous.length === targets.length && previous.every((value, i) => Math.abs(value - targets[i]) < 2) ? previous : targets);
    setActive(targets.reduce((nearest, target, index) => Math.abs(target - pos) < Math.abs(targets[nearest] - pos) ? index : nearest, 0));
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

  const selectSlide = (index: number) => {
    const el = scrollerRef.current;
    if (!el) return;
    const rtl = getComputedStyle(el).direction === "rtl";
    const target = positions[index];
    if (target !== undefined) el.scrollTo({ left: rtl ? -target : target, behavior: "smooth" });
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

      {positions.length > 1 && <MaxScrollControls
        canPrev={canPrev}
        canNext={canNext}
        onPrev={() => selectSlide(Math.max(0, active - 1))}
        onNext={() => selectSlide(Math.min(positions.length - 1, active + 1))}
        positions={positions}
        active={active}
        onSelect={selectSlide}
      />}
    </div>
  );
}
