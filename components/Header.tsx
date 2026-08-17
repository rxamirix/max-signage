"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { navigation, site } from "@/lib/site";
import { services } from "@/lib/services";
import { SiteSearch } from "./SiteSearch";
import { cn, InstagramIcon, WhatsAppIcon } from "./ui";

type HeaderProps = {
  /** `hero` = embedded inside the homepage hero; `site` = sticky bar on other pages */
  variant?: "site" | "hero";
};

export function Header({ variant = "site" }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [veil, setVeil] = useState(0);
  const [mounted, setMounted] = useState(false);
  const inHero = variant === "hero";
  const lightChrome = !inHero || veil > 0.42;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    setOpen(false);
    document.body.style.overflow = "";
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!inHero) return;
    let ticking = false;
    const update = () => {
      const y = window.scrollY;
      // Ease across ~180px so the white glass fades in gently
      const raw = Math.min(1, Math.max(0, (y - 12) / 180));
      const eased = raw * raw * (3 - 2 * raw); // smoothstep
      setVeil(eased);
      ticking = false;
    };
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [inHero]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  const skipLink = (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-100 focus:rounded-full focus:bg-brand-yellow focus:px-5 focus:py-2 focus:font-bold focus:text-navy-900"
    >
      رفتن به محتوای اصلی
    </a>
  );

  /* Homepage uses the hero-embedded nav — skip the global sticky bar */
  if (variant === "site" && pathname === "/") {
    return skipLink;
  }

  const shell = (
    <>
      <header
        className={cn(
          "z-[100] w-full",
          inHero && "fixed inset-x-0 top-0 text-brand-white",
          !inHero &&
            "sticky top-0 bg-white/80 text-navy-900 shadow-lg shadow-navy-900/10 backdrop-blur-xl backdrop-saturate-150 supports-[backdrop-filter]:bg-white/70",
          inHero && lightChrome && "text-navy-900",
        )}
        style={
          inHero
            ? {
                backgroundColor: `rgba(254, 255, 249, ${0.94 * veil})`,
                backdropFilter:
                  veil > 0.02
                    ? `blur(${18 * veil}px) saturate(${100 + 40 * veil}%)`
                    : "none",
                WebkitBackdropFilter:
                  veil > 0.02
                    ? `blur(${18 * veil}px) saturate(${100 + 40 * veil}%)`
                    : "none",
                boxShadow:
                  veil > 0.08
                    ? `0 10px 36px rgba(15, 23, 42, ${0.12 * veil})`
                    : "none",
              }
            : undefined
        }
      >
        <div className="container-page">
          <div className="flex h-18 items-center justify-between gap-4 md:h-22">
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
                  style={{ opacity: inHero ? 1 - veil : 0 }}
                  aria-hidden={lightChrome}
                />
                <Image
                  src="/logo-mark-navy.png"
                  alt={`لوگوی ${site.name}`}
                  width={160}
                  height={160}
                  priority
                  sizes="48px"
                  className="col-start-1 row-start-1 h-9 w-auto transition-opacity duration-700 ease-out md:h-11"
                  style={{ opacity: inHero ? veil : 1 }}
                />
              </span>
              <span
                className={cn(
                  "hidden border-r pr-3 text-xs leading-tight transition-[color,border-color] duration-700 ease-out lg:block",
                  lightChrome
                    ? "border-navy-900/15 text-navy-700"
                    : "border-white/25 text-white/85",
                )}
              >
                <span
                  className={cn(
                    "block font-bold transition-colors duration-700 ease-out",
                    lightChrome ? "text-navy-900" : "text-brand-white",
                  )}
                >
                  {site.motto}
                </span>
                <span
                  className={cn(
                    "block transition-colors duration-700 ease-out",
                    lightChrome ? "text-navy-500" : "text-white/60",
                  )}
                >
                  تابلو تبلیغاتی مازندران
                </span>
              </span>
            </Link>

            <nav aria-label="منوی اصلی" className="hidden xl:block">
              <ul className="flex items-center gap-1">
                {navigation.map((item) => (
                  <li key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      className={cn(
                        "relative inline-block px-3.5 py-2 text-[0.95rem] font-medium transition-colors duration-700 ease-out after:pointer-events-none after:absolute after:-bottom-0.5 after:left-1/2 after:h-0.5 after:-translate-x-1/2 after:rounded-full after:bg-brand-yellow after:transition-all after:duration-300 after:ease-out after:content-['']",
                        lightChrome
                          ? isActive(item.href)
                            ? "text-navy-600 after:w-3/5"
                            : "text-navy-800 after:w-0 hover:text-navy-600 hover:after:w-3/5 focus-within:after:w-3/5"
                          : isActive(item.href)
                            ? "text-brand-yellow after:w-3/5"
                            : "text-white/90 after:w-0 hover:text-brand-yellow hover:after:w-3/5 focus-within:after:w-3/5",
                      )}
                    >
                      {item.label}
                    </Link>

                    {item.href === "/services" ? (
                      <div className="invisible absolute top-full right-0 z-50 w-64 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        <ul className="overflow-hidden rounded-2xl border border-navy-100 bg-white/95 p-2 shadow-2xl shadow-navy-900/10 backdrop-blur-xl">
                          {services.map((service) => (
                            <li key={service.slug}>
                              <Link
                                href={`/services/${service.slug}`}
                                className="block rounded-xl px-4 py-2.5 text-sm text-navy-800 transition-colors hover:bg-navy-50 hover:text-navy-600"
                              >
                                {service.shortTitle}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : null}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <SiteSearch variant="desktop" />

              <button
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? "بستن منو" : "باز کردن منو"}
                className={cn(
                  "inline-flex size-11 items-center justify-center rounded-full transition-colors duration-700 ease-out xl:hidden",
                  lightChrome
                    ? "border border-navy-900/10 bg-white/50 text-navy-800 backdrop-blur-md hover:bg-white/80"
                    : "border border-white/30 bg-white/10 text-brand-white hover:bg-white/20",
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
            </div>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 top-18 z-[100] overflow-y-auto bg-navy-950/98 pb-32 backdrop-blur-sm md:top-22 xl:hidden"
        >
          <nav aria-label="منوی موبایل" className="container-page py-6">
            <SiteSearch variant="mobile" onNavigate={() => setOpen(false)} />

            <ul className="flex flex-col gap-1.5">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
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

  if (inHero) {
    return (
      <>
        {skipLink}
        <div className="h-18 shrink-0 md:h-22" aria-hidden="true" />
        {mounted ? createPortal(shell, document.body) : null}
      </>
    );
  }

  return (
    <>
      {skipLink}
      {shell}
    </>
  );
}
