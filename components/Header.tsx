"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { navigation, site } from "@/lib/site";
import { services } from "@/lib/services";
import { GlassFilter } from "@/components/ui/liquid-glass";
import { SiteSearch } from "./SiteSearch";
import { cn, InstagramIcon, WhatsAppIcon } from "./ui";

type HeaderProps = {
  /** `hero` = overlay nav inside a page hero; layout uses default skip-only */
  variant?: "site" | "hero";
};

/** Same liquid-glass stack as `components/ui/liquid-glass` (iPhone-style refraction) */
function GlassShell({
  children,
  className,
  rounded = "rounded-full",
}: {
  children: React.ReactNode;
  className?: string;
  rounded?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-visible transition-all duration-700",
        rounded,
        className,
      )}
      style={{
        boxShadow: "0 6px 6px rgba(0, 0, 0, 0.2), 0 0 20px rgba(0, 0, 0, 0.1)",
        transitionTimingFunction: "cubic-bezier(0.175, 0.885, 0.32, 2.2)",
      }}
    >
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-0 overflow-hidden",
          rounded,
        )}
        style={{
          backdropFilter: "blur(3px)",
          WebkitBackdropFilter: "blur(3px)",
          filter: "url(#glass-distortion)",
          isolation: "isolate",
        }}
      />
      <div
        className={cn("pointer-events-none absolute inset-0 z-10", rounded)}
        style={{ background: "rgba(255, 255, 255, 0.25)" }}
      />
      <div
        className={cn(
          "pointer-events-none absolute inset-0 z-20 overflow-hidden",
          rounded,
        )}
        style={{
          boxShadow:
            "inset 0 0 0 0.5px rgba(255, 255, 255, 0.55), inset 1px 1px 0 0 rgba(255, 255, 255, 0.35), inset -1px -1px 0 0 rgba(255, 255, 255, 0.2)",
        }}
      />
      <div className="relative z-30">{children}</div>
    </div>
  );
}

function YellowLamp() {
  return (
    <motion.span
      layoutId="nav-yellow-lamp"
      className="pointer-events-none absolute inset-0 -z-10 w-full rounded-full"
      initial={false}
      transition={{ type: "spring", stiffness: 380, damping: 30 }}
    >
      <span className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-brand-yellow">
        <span className="absolute -top-2 -left-2 h-6 w-12 rounded-full bg-brand-yellow/30 blur-md" />
        <span className="absolute -top-1 h-6 w-8 rounded-full bg-brand-yellow/30 blur-md" />
        <span className="absolute top-0 left-2 h-4 w-4 rounded-full bg-brand-yellow/30 blur-sm" />
      </span>
    </motion.span>
  );
}

export function Header({ variant = "site" }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; phone: string } | null>(null);
  const inHero = variant === "hero";
  const isHome = pathname === "/";
  /** Homepage mega menu sticks while scrolling; other pages stay absolute in hero */
  const stickyHome = inHero && isHome;
  const lightChrome = stickyHome && scrolled;

  useEffect(() => {
    setOpen(false);
    setHoveredHref(null);
    document.body.style.overflow = "";
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/users/me")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setUser(json.user ?? null);
      })
      .catch(() => {
        if (!cancelled) setUser(null);
      });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!stickyHome) {
      setScrolled(false);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 48);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [stickyHome]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const activeHref =
    navigation.find((item) => isActive(item.href))?.href ?? navigation[0]?.href;
  const lampHref = hoveredHref ?? activeHref;

  const skipLink = (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-100 focus:rounded-full focus:bg-brand-yellow focus:px-5 focus:py-2 focus:font-bold focus:text-navy-900"
    >
      رفتن به محتوای اصلی
    </a>
  );

  /* Mega menu only lives inside heroes — layout header is skip-link only */
  if (!inHero) {
    return skipLink;
  }

  const shell = (
    <>
      <GlassFilter />
      <header
        className={cn(
          "inset-x-0 top-0 z-[110] w-full transition-[color,background-color] duration-500",
          stickyHome ? "fixed" : "absolute",
          lightChrome ? "text-navy-900" : "text-brand-white",
          open && "bg-navy-950 text-brand-white",
        )}
      >
        <div className="container-page">
          <div className="flex h-16 items-center justify-between gap-4 md:h-20">
            <GlassShell className="px-2.5 py-1.5 md:px-3 md:py-2">
              <Link
                href="/"
                className="flex shrink-0 items-center gap-3"
                aria-label={`${site.name} - صفحه اصلی`}
              >
                <span className="relative inline-grid h-9 w-12 place-items-center md:h-11 md:w-14">
                  <Image
                    src="/logo-mark-white.png"
                    alt=""
                    width={160}
                    height={160}
                    priority
                    sizes="48px"
                    className="col-start-1 row-start-1 h-9 w-auto transition-opacity duration-700 ease-out md:h-11"
                    style={{ opacity: lightChrome && !open ? 0 : 1 }}
                    aria-hidden={lightChrome && !open}
                  />
                  <Image
                    src="/logo-mark-navy.png"
                    alt={`لوگوی ${site.name}`}
                    width={160}
                    height={160}
                    priority
                    sizes="48px"
                    className="col-start-1 row-start-1 h-9 w-auto transition-opacity duration-700 ease-out md:h-11"
                    style={{ opacity: lightChrome && !open ? 1 : 0 }}
                  />
                </span>
                <span
                  className={cn(
                    "hidden border-r pr-3 text-xs leading-tight transition-[color,border-color] duration-700 ease-out lg:block",
                    lightChrome && !open
                      ? "border-navy-900/15 text-navy-700"
                      : "border-white/25 text-white/85",
                  )}
                >
                  <span
                    className={cn(
                      "block font-bold transition-colors duration-700 ease-out",
                      lightChrome && !open
                        ? "text-navy-900"
                        : "text-brand-white",
                    )}
                  >
                    {site.motto}
                  </span>
                  <span
                    className={cn(
                      "block transition-colors duration-700 ease-out",
                      lightChrome && !open ? "text-navy-500" : "text-white/60",
                    )}
                  >
                    تابلو تبلیغاتی مازندران
                  </span>
                </span>
              </Link>
            </GlassShell>

            <nav
              aria-label="منوی اصلی"
              className="hidden xl:block"
              onMouseLeave={() => setHoveredHref(null)}
            >
              <GlassShell className="px-1 py-1">
                <ul className="relative flex items-center gap-1">
                  {navigation.map((item) => {
                    const active = isActive(item.href);
                    const showLamp = lampHref === item.href;
                    return (
                      <li
                        key={item.href}
                        className="group relative z-30"
                        onMouseEnter={() => setHoveredHref(item.href)}
                      >
                        <Link
                          href={item.href}
                          className={cn(
                            "relative z-10 inline-block cursor-pointer rounded-full px-3.5 py-2 text-[0.9rem] font-semibold transition-colors",
                            lightChrome && !open
                              ? active || showLamp
                                ? "text-navy-600"
                                : "text-navy-800/80 hover:text-navy-600"
                              : active || showLamp
                                ? "text-brand-yellow"
                                : "text-white/90 hover:text-brand-yellow",
                          )}
                        >
                          {item.label}
                          {showLamp ? <YellowLamp /> : null}
                          {active ? (
                            <span
                              className={cn(
                                "absolute inset-0 -z-20 w-full rounded-full",
                                lightChrome && !open
                                  ? "bg-navy-50/70"
                                  : "bg-white/10",
                              )}
                            />
                          ) : null}
                        </Link>

                        {item.href === "/services" ? (
                          <div className="invisible absolute top-full right-0 z-50 w-64 pt-3 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                            <GlassShell rounded="rounded-3xl" className="p-1.5">
                              <ul className="relative flex flex-col gap-1">
                                {services.map((service) => (
                                  <li key={service.slug}>
                                    <Link
                                      href={`/services/${service.slug}`}
                                      className="block rounded-full border border-transparent px-4 py-2.5 text-sm font-semibold text-navy-900/90 transition-[background,border-color,box-shadow,color,backdrop-filter] duration-100 ease-out hover:border-brand-yellow/50 hover:bg-gradient-to-l hover:from-brand-yellow/35 hover:to-navy-500/30 hover:text-navy-950 hover:shadow-[inset_0_0_0_0.5px_rgba(255,255,255,0.45)] hover:backdrop-blur-md hover:duration-75"
                                    >
                                      {service.shortTitle}
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                            </GlassShell>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </GlassShell>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <SiteSearch
                variant="desktop"
                tone={lightChrome && !open ? "light" : "hero"}
                glass
              />

              <GlassShell className="xl:hidden">
                {user ? (
                  <Link
                    href="/account"
                    aria-label={`حساب کاربری ${user.name}`}
                    title={user.name}
                    className={cn(
                      "inline-flex size-11 items-center justify-center transition-colors duration-700 ease-out",
                      lightChrome && !open
                        ? "text-navy-800"
                        : "text-brand-white",
                    )}
                  >
                    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                      <path
                        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    href="/portfolio"
                    className={cn(
                      "inline-flex h-11 items-center justify-center px-4 text-sm font-bold transition-colors duration-700 ease-out",
                      lightChrome && !open
                        ? "text-navy-800"
                        : "text-brand-white",
                    )}
                  >
                    نمونه‌کارها
                  </Link>
                )}
              </GlassShell>

              <GlassShell className="hidden xl:block">
                {user ? (
                  <Link
                    href="/account"
                    aria-label={`حساب کاربری ${user.name}`}
                    title={user.name}
                    className={cn(
                      "inline-flex size-11 items-center justify-center transition-colors duration-700 ease-out",
                      lightChrome && !open
                        ? "text-navy-800"
                        : "text-brand-white",
                    )}
                  >
                    <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                      <path
                        d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
                        fill="currentColor"
                      />
                    </svg>
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className={cn(
                      "inline-flex h-11 items-center justify-center px-4 text-sm font-bold transition-colors duration-700 ease-out",
                      lightChrome && !open
                        ? "text-navy-800"
                        : "text-brand-white",
                    )}
                  >
                    ورود
                  </Link>
                )}
              </GlassShell>

              <GlassShell className="xl:hidden">
                <button
                  type="button"
                  onClick={() => setOpen((value) => !value)}
                  aria-expanded={open}
                  aria-controls="mobile-menu"
                  aria-label={open ? "بستن منو" : "باز کردن منو"}
                  className={cn(
                    "inline-flex size-11 items-center justify-center transition-colors duration-700 ease-out",
                    lightChrome && !open
                      ? "text-navy-800"
                      : "text-brand-white",
                  )}
                >
                  <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                    {open ? (
                      <path
                        d="m6 6 12 12M18 6 6 18"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    ) : (
                      <path
                        d="M4 7h16M4 12h16M4 17h16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                      />
                    )}
                  </svg>
                </button>
              </GlassShell>
            </div>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[105] overflow-y-auto bg-navy-950 pt-16 pb-10 xl:hidden md:pt-20"
        >
          <nav aria-label="منوی موبایل" className="container-page py-6">
            <SiteSearch variant="mobile" onNavigate={() => setOpen(false)} />

            {user ? (
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className={cn(
                  "mb-4 flex items-center justify-center gap-2 rounded-2xl px-5 py-3.5 text-lg font-bold transition-colors",
                  pathname === "/account"
                    ? "bg-brand-yellow text-navy-900"
                    : "border border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow hover:text-navy-900",
                )}
              >
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                  <path
                    d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
                    fill="currentColor"
                  />
                </svg>
                حساب من
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={cn(
                  "mb-4 block rounded-2xl px-5 py-3.5 text-center text-lg font-bold transition-colors",
                  pathname === "/login"
                    ? "bg-brand-yellow text-navy-900"
                    : "border border-brand-yellow/40 bg-brand-yellow/10 text-brand-yellow hover:bg-brand-yellow hover:text-navy-900",
                )}
              >
                ورود
              </Link>
            )}

            <ul className="flex flex-col gap-1.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "block rounded-2xl px-5 py-3.5 text-lg font-bold transition-colors",
                      isActive(item.href)
                        ? "bg-brand-yellow text-navy-900"
                        : "text-brand-white hover:bg-brand-white/10",
                    )}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>

            <p className="mt-8 mb-3 px-5 text-sm font-bold text-brand-yellow">
              خدمات ما
            </p>
            <ul className="grid grid-cols-2 gap-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    onClick={() => setOpen(false)}
                    className="block rounded-xl border border-brand-white/10 bg-brand-white/5 px-4 py-3 text-sm text-brand-white/90 transition-colors hover:border-brand-yellow/40"
                  >
                    {service.shortTitle}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-8 grid grid-cols-2 gap-2">
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-4 py-4 text-base font-extrabold text-white"
              >
                <WhatsAppIcon className="size-5" />
                واتساپ
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#f58529] via-[#dd2a7b] to-[#8134af] px-4 py-4 text-base font-extrabold text-white"
              >
                <InstagramIcon className="size-5" />
                اینستاگرام
              </a>
            </div>
          </nav>
        </div>
      ) : null}
    </>
  );

  return (
    <>
      {skipLink}
      {shell}
    </>
  );
}
