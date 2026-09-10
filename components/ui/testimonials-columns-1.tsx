"use client";

import { useEffect, useRef } from "react";
import { testimonials } from "@/lib/content";
import { cn, SectionHeading } from "@/components/ui";

export type Testimonial = {
  text: string;
  image: string;
  name: string;
  role: string;
};

function TestimonialCard({
  text,
  image,
  name,
  role,
}: Testimonial) {
  return (
    <article className="w-full max-w-[11.5rem] rounded-2xl border border-navy-100 bg-brand-white p-4 shadow-[0_10px_24px_rgba(20,22,63,0.06)] sm:max-w-xs sm:rounded-3xl sm:p-8">
      <p className="text-xs leading-6 text-navy-800 sm:text-sm sm:leading-8">{text}</p>
      <div className="mt-3 flex items-center gap-2 sm:mt-5">
        <img
          width={40}
          height={40}
          src={image}
          alt=""
          className="h-8 w-8 rounded-full sm:h-10 sm:w-10"
        />
        <div className="flex min-w-0 flex-col">
          <p className="truncate text-sm font-medium leading-5 tracking-tight text-navy-900">
            {name}
          </p>
          <p className="truncate text-xs leading-5 tracking-tight text-navy-600 opacity-80 sm:text-[0.95rem]">
            {role}
          </p>
        </div>
      </div>
    </article>
  );
}

export function TestimonialsColumn({
  className,
  testimonials: items,
  duration = 18,
}: {
  className?: string;
  testimonials: Testimonial[];
  duration?: number;
}) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const applyMotion = () => {
      if (motionQuery.matches) {
        track.style.animationPlayState = "paused";
      }
    };
    applyMotion();
    motionQuery.addEventListener("change", applyMotion);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (motionQuery.matches) {
          track.style.animationPlayState = "paused";
          return;
        }
        track.style.animationPlayState = entry.isIntersecting
          ? "running"
          : "paused";
      },
      { rootMargin: "120px 0px" },
    );
    observer.observe(track);

    return () => {
      motionQuery.removeEventListener("change", applyMotion);
      observer.disconnect();
    };
  }, []);

  const cards = items.map((item) => (
    <TestimonialCard key={`${item.name}-${item.role}`} {...item} />
  ));

  return (
    <div className={cn("min-w-0", className)}>
      <div
        ref={trackRef}
        className="animate-testimonials-scroll flex flex-col gap-6 pb-6 [animation-play-state:paused]"
        style={{ animationDuration: `${duration}s` }}
      >
        <div className="flex flex-col gap-6">{cards}</div>
        <div className="flex flex-col gap-6" aria-hidden="true">
          {cards}
        </div>
      </div>
    </div>
  );
}

const firstColumn = testimonials.slice(0, 3);
const secondColumn = testimonials.slice(3, 6);
const thirdColumn = testimonials.slice(6, 9);

export function Testimonials() {
  return (
    <section id="testimonials" className="relative bg-brand-white py-16 md:py-24">
      <div className="container-page">
        <SectionHeading
          title="چیزی که درباره ما می‌گویند"
          description="از هایپرمارکت بهشهر تا کافه بابلسر؛ حرف کسانی که تابلوی‌شان را در مکس ساخته‌اند."
        />

        <div className="mt-10 flex max-h-[740px] justify-center gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_18%,black_82%,transparent)] sm:gap-6">
          <TestimonialsColumn testimonials={firstColumn} duration={22} />
          <TestimonialsColumn
            testimonials={secondColumn}
            duration={28}
          />
          <TestimonialsColumn
            testimonials={thirdColumn}
            className="hidden lg:block"
            duration={25}
          />
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
