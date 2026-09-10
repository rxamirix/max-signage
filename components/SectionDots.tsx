"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { jumpToHomeSection } from "@/lib/home-sections";
import { cn } from "./ui";

const sections = [
  { id: "hero", label: "هیرو" },
  { id: "services", label: "خدمات" },
  { id: "portfolio", label: "نمونه کارها" },
  { id: "why-max", label: "چرا مکس" },
  { id: "process", label: "نحوه کار" },
  { id: "materials", label: "متریال" },
  { id: "testimonials", label: "نظرها" },
  { id: "blog", label: "مقالات" },
  { id: "faq", label: "سوالات" },
  { id: "cta", label: "استعلام" },
  { id: "footer", label: "فوتر" },
] as const;

export function SectionDots() {
  const pathname = usePathname();
  const [active, setActive] = useState("hero");
  const activeRef = useRef(active);
  activeRef.current = active;

  useEffect(() => {
    if (pathname !== "/") return;

    const nodes = sections
      .map((section) => document.getElementById(section.id))
      .filter((node): node is HTMLElement => node !== null);

    const pick = () => {
      const scrollY = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      let next = activeRef.current;

      if (scrollY <= 16) {
        next = "hero";
      } else if (maxScroll > 0 && scrollY >= maxScroll - 16) {
        next = "footer";
      } else {
        const marker = scrollY + window.innerHeight * 0.35;
        for (const node of nodes) {
          if (node.offsetTop <= marker) next = node.id;
        }
      }

      if (next !== activeRef.current) setActive(next);
    };

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(() => {
        frame = 0;
        pick();
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    pick();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [pathname]);

  if (pathname !== "/") return null;

  return (
    <nav
      aria-label="بخش‌های صفحه"
      className="fixed top-1/2 right-4 z-40 hidden -translate-y-1/2 md:block"
    >
      <div className="flex flex-col items-center gap-1 rounded-full bg-white/70 px-1.5 py-2 shadow-[0_8px_24px_rgba(20,22,63,0.08)] ring-1 ring-navy-900/10 backdrop-blur-md">
        {sections.map((section) => {
          const isActive = section.id === active;
          return (
            <a
              key={section.id}
              href={`#${section.id}`}
              aria-label={section.label}
              aria-current={isActive ? "true" : undefined}
              className="group relative grid size-6 place-items-center"
              onClick={(event) => {
                event.preventDefault();
                setActive(section.id);
                jumpToHomeSection(section.id);
              }}
            >
              <span className="pointer-events-none absolute right-full mr-2.5 rounded-full bg-navy-950/90 px-2.5 py-1 text-[11px] whitespace-nowrap text-white opacity-0 transition-opacity duration-150 group-hover:opacity-100">
                {section.label}
              </span>
              <span
                className={cn(
                  "block rounded-full transition-[width,height,background-color,box-shadow] duration-200",
                  isActive
                    ? "size-2 bg-navy-600 ring-4 ring-navy-600/15"
                    : "size-1.5 bg-navy-300 group-hover:bg-navy-500",
                )}
              />
            </a>
          );
        })}
      </div>
    </nav>
  );
}
