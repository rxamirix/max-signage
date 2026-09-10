"use client";

import { useLayoutEffect } from "react";
import { usePathname } from "next/navigation";
import {
  HOME_SECTION_KEY,
  homeSectionFromPath,
  isHomeSectionId,
  jumpToHomeSection,
} from "@/lib/home-sections";

export function HomeScroll() {
  const pathname = usePathname();

  useLayoutEffect(() => {
    if (pathname !== "/") {
      const section = homeSectionFromPath(pathname);
      if (section) sessionStorage.setItem(HOME_SECTION_KEY, section);
      return;
    }

    const hash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
    const saved = sessionStorage.getItem(HOME_SECTION_KEY) ?? "";
    const id = isHomeSectionId(hash) ? hash : saved;
    if (!id || id === "hero" || !isHomeSectionId(id)) return;

    if ("scrollRestoration" in history) {
      history.scrollRestoration = "manual";
    }

    const go = () => jumpToHomeSection(id, true);
    go();

    const frames = [
      window.requestAnimationFrame(go),
      window.requestAnimationFrame(() => window.requestAnimationFrame(go)),
    ];
    const timers = [0, 50, 150].map((delay) => window.setTimeout(go, delay));
    const finish = window.setTimeout(() => {
      if (window.location.hash.replace(/^#/, "") !== id) {
        history.replaceState(null, "", `/#${id}`);
      }
      sessionStorage.removeItem(HOME_SECTION_KEY);
    }, 160);

    const onPageShow = (event: PageTransitionEvent) => {
      if (!event.persisted || pathname !== "/") return;
      const pending = sessionStorage.getItem(HOME_SECTION_KEY);
      const currentHash = decodeURIComponent(window.location.hash.replace(/^#/, ""));
      const id = isHomeSectionId(currentHash) ? currentHash : pending;
      if (id && id !== "hero") jumpToHomeSection(id, true);
    };
    window.addEventListener("pageshow", onPageShow);
    return () => {
      for (const frame of frames) window.cancelAnimationFrame(frame);
      for (const timer of timers) window.clearTimeout(timer);
      window.clearTimeout(finish);
      window.removeEventListener("pageshow", onPageShow);
    };
  }, [pathname]);

  return null;
}
