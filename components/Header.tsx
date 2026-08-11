"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, site } from "@/lib/site";
import { services } from "@/lib/services";
import { SiteSearch } from "./SiteSearch";
import { cn, InstagramIcon, WhatsAppIcon } from "./ui";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
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

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:right-4 focus:z-100 focus:rounded-full focus:bg-brand-yellow focus:px-5 focus:py-2 focus:font-bold focus:text-navy-900"
      >
        رفتن به محتوای اصلی
      </a>

      <header
        className={cn(
          "sticky top-0 z-50 transition-all duration-300",
          scrolled
            ? "bg-brand-white/95 shadow-lg shadow-navy-900/5 backdrop-blur-md"
            : "bg-brand-white",
        )}
      >
        <div className="container-page">
          <div className="flex h-18 items-center justify-between gap-4 md:h-22">
            <Link
              href="/"
              className="flex shrink-0 items-center gap-3"
              aria-label={`${site.name} - صفحه اصلی`}
            >
              <Image
                src="/logo-max-navy.png"
                alt={`لوگوی ${site.name}`}
                width={908}
                height={262}
                priority
                sizes="160px"
                className="h-8 w-auto md:h-10"
              />
              <span className="hidden border-r border-navy-200 pr-3 text-xs leading-tight text-navy-600 lg:block">
                <span className="block font-bold">{site.motto}</span>
                <span className="block text-navy-500">تابلو تبلیغاتی مازندران</span>
              </span>
            </Link>

            <nav aria-label="منوی اصلی" className="hidden xl:block">
              <ul className="flex items-center gap-1">
                {navigation.map((item) => (
                  <li key={item.href} className="group relative">
                    <Link
                      href={item.href}
                      className={cn(
                        "relative inline-block rounded-full px-3.5 py-2 text-[0.95rem] font-medium transition-colors",
                        isActive(item.href)
                          ? "bg-navy-600 text-brand-white"
                          : "text-navy-800 hover:bg-navy-50",
                      )}
                    >
                      {item.label}
                      {!isActive(item.href) ? (
                        <span
                          aria-hidden="true"
                          className="pointer-events-none absolute -bottom-1 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-brand-yellow transition-all duration-300 ease-out group-hover:w-3/5 group-focus-within:w-3/5"
                        />
                      ) : null}
                    </Link>

                    {item.href === "/services" ? (
                      <div className="invisible absolute top-full right-0 z-50 w-64 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                        <ul className="overflow-hidden rounded-2xl border border-navy-100 bg-brand-white p-2 shadow-2xl shadow-navy-900/10">
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
                className="inline-flex size-11 items-center justify-center rounded-full border border-navy-200 text-navy-800 transition-colors hover:bg-navy-50 xl:hidden"
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
          className="fixed inset-0 top-18 z-40 overflow-y-auto bg-navy-950/98 pb-32 backdrop-blur-sm md:top-22 xl:hidden"
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
}
