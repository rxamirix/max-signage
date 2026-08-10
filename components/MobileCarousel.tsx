"use client";

import {
  Children,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { cn } from "./ui";

const AUTO_MS = 4000;

function scrollSlideIntoScroller(
  scroller: HTMLElement,
  slide: HTMLElement,
  smooth = true,
) {
  const scrollerRect = scroller.getBoundingClientRect();
  const slideRect = slide.getBoundingClientRect();
  const delta =
    slideRect.left -
    scrollerRect.left -
    (scrollerRect.width - slideRect.width) / 2;

  scroller.scrollBy({
    left: delta,
    behavior: smooth ? "smooth" : "auto",
  });
}

export function MobileCarousel({
  children,
  desktopClassName,
  slideClassName,
}: {
  children: ReactNode;
  desktopClassName: string;
  slideClassName?: string;
}) {
  const slides = Children.toArray(children);
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const pausedRef = useRef(false);
  const activeRef = useRef(false);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const media = window.matchMedia("(max-width: 639px)");
    if (!media.matches) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        activeRef.current = entry.isIntersecting;
      },
      { threshold: 0.35 },
    );
    io.observe(scroller);

    const timer = window.setInterval(() => {
      if (pausedRef.current || !activeRef.current) return;
      setIndex((current) => (current + 1) % slides.length);
    }, AUTO_MS);

    return () => {
      window.clearInterval(timer);
      io.disconnect();
    };
  }, [slides.length]);

  useEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    if (!window.matchMedia("(max-width: 639px)").matches) return;

    const slide = scroller.children[index] as HTMLElement | undefined;
    if (!slide) return;

    scrollSlideIntoScroller(scroller, slide, index !== 0);
  }, [index]);

  return (
    <div className="mt-10 sm:mt-14">
      <div
        ref={scrollerRef}
        onPointerDown={() => {
          pausedRef.current = true;
        }}
        onPointerUp={() => {
          window.setTimeout(() => {
            pausedRef.current = false;
          }, AUTO_MS);
        }}
        className={cn(
          "-mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-5 py-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:mx-0 sm:snap-none sm:gap-5 sm:overflow-visible sm:px-0 sm:py-0 md:gap-7",
          desktopClassName,
        )}
      >
        {slides.map((slide, slideIndex) => (
          <div
            key={slideIndex}
            className={cn(
              "w-[min(82vw,20.5rem)] shrink-0 snap-start sm:w-auto sm:min-w-0 sm:shrink",
              slideClassName,
            )}
          >
            {slide}
          </div>
        ))}
      </div>
    </div>
  );
}
