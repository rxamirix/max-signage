"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, site } from "@/lib/site";
import { services } from "@/lib/services";
import { SiteSearch } from "./SiteSearch";
import { cn, InstagramIcon, WhatsAppIcon } from "./ui";

type HeaderProps = {
  /** `hero` = overlay nav inside a page hero; layout uses default skip-only */
  variant?: "site" | "hero";
};

export function Header({ variant = "site" }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const inHero = variant === "hero";
  const lightChrome = false;

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

  /* Mega menu only lives inside heroes — layout header is skip-link only */
  if (!inHero) {
    return skipLink;
  }

  const shell = (
    <>
      <header
        className={cn(
          "absolute inset-x-0 top-0 z-[110] w-full text-brand-white",
          open && "bg-navy-950",
        )}
      >
        <div className="container-page">
          <div className="flex h-16 items-center justify-between gap-4 md:h-20">
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
                  style={{ opacity: lightChrome ? 0 : 1 }}
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
                  style={{ opacity: lightChrome ? 1 : 0 }}
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
              <ul
                className={cn(
                  "flex items-center gap-1 rounded-full border px-1 py-1 shadow-lg backdrop-blur-lg",
                  lightChrome
                    ? "border-navy-200/80 bg-white/50"
                    : "border-white/20 bg-white/10",
                )}
              >
                {navigation.map((item) => {
                  const active = isActive(item.href);
                  return (
                    <li key={item.href} className="group relative">
                      <Link
                        href={item.href}
                        className={cn(
                          "relative z-10 inline-block cursor-pointer rounded-full px-3.5 py-2 text-[0.9rem] font-semibold transition-colors",
                          lightChrome
                            ? active
                              ? "text-navy-600"
                              : "text-navy-800/80 hover:text-navy-600"
                            : active
                              ? "text-brand-yellow"
                              : "text-white/80 hover:text-brand-yellow",
                        )}
                      >
                        {item.label}
                        {active ? (
                          <span
                            className={cn(
                              "absolute inset-0 -z-10 w-full rounded-full",
                              lightChrome ? "bg-navy-50" : "bg-white/10",
                            )}
                          >
                            <span className="absolute -top-2 left-1/2 h-1 w-8 -translate-x-1/2 rounded-t-full bg-brand-yellow">
                              <span className="absolute -top-2 -left-2 h-6 w-12 rounded-full bg-brand-yellow/30 blur-md" />
                              <span className="absolute -top-1 h-6 w-8 rounded-full bg-brand-yellow/30 blur-md" />
                              <span className="absolute top-0 left-2 h-4 w-4 rounded-full bg-brand-yellow/30 blur-sm" />
                            </span>
                          </span>
                        ) : null}
                      </Link>

                      {item.href === "/services" ? (
                        <div className="invisible absolute top-full right-0 z-50 w-64 pt-3 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
                          <ul
                            className={cn(
                              "flex flex-col gap-1 rounded-3xl border p-1.5 shadow-lg backdrop-blur-lg",
                              lightChrome
                                ? "border-navy-200/80 bg-white/50"
                                : "border-white/20 bg-white/10",
                            )}
                          >
                            {services.map((service) => (
                              <li key={service.slug}>
                                <Link
                                  href={`/services/${service.slug}`}
                                  className={cn(
                                    "block rounded-full px-4 py-2.5 text-sm font-semibold transition-colors",
                                    lightChrome
                                      ? "text-navy-800/80 hover:bg-navy-50 hover:text-navy-600"
                                      : "text-white/85 hover:bg-white/10 hover:text-brand-yellow",
                                  )}
                                >
                                  {service.shortTitle}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <SiteSearch
                variant="desktop"
                tone={lightChrome ? "light" : "hero"}
              />

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
          className="fixed inset-0 z-[105] overflow-y-auto bg-navy-950 pt-16 pb-10 xl:hidden md:pt-20"
        >
          <nav aria-label="منوی موبایل" className="container-page py-6">
            <SiteSearch variant="mobile" onNavigate={() => setOpen(false)} />

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
