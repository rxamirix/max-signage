"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PageLoader } from "./PageLoader";

function isInternalNav(anchor: HTMLAnchorElement) {
  if (anchor.target && anchor.target !== "_self") return false;
  if (anchor.hasAttribute("download")) return false;
  const href = anchor.getAttribute("href");
  if (
    !href ||
    href.startsWith("#") ||
    href.startsWith("mailto:") ||
    href.startsWith("tel:")
  ) {
    return false;
  }
  try {
    const url = new URL(href, window.location.href);
    if (url.origin !== window.location.origin) return false;
    return (
      url.pathname !== window.location.pathname ||
      url.search !== window.location.search
    );
  } catch {
    return false;
  }
}

/** Covers viewport on internal navigations so footer/content appear together. */
export function RouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!pending) return;
    const timeout = window.setTimeout(() => setPending(false), 12000);
    return () => window.clearTimeout(timeout);
  }, [pending]);

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      if (event.defaultPrevented) return;
      if (event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const anchor = (event.target as Element | null)?.closest?.("a");
      if (!anchor || !(anchor instanceof HTMLAnchorElement)) return;
      if (!isInternalNav(anchor)) return;
      setPending(true);
    };

    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  if (!pending) return null;
  return <PageLoader />;
}
