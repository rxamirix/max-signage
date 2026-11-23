"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpLeft, Layers3, MessageCircle, House, BriefcaseBusiness, Package, Info, BookOpenText, UserRound } from "lucide-react";
import { navigation as defaultNavigation, site as defaultSite } from "@/lib/site";
import { services as defaultServices } from "@/lib/services";
import { useSiteContent } from "./SiteContentProvider";
import { serviceImage } from "@/lib/service-images";
import { SiteSearch } from "./SiteSearch";
import { cn, InstagramIcon, WhatsAppIcon } from "./ui";

type HeaderProps = {
  /** `hero` = overlay nav inside a page hero; layout uses default skip-only */
  variant?: "site" | "hero";
  lightHero?: boolean;
};

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

export function Header({ variant = "site", lightHero = false }: HeaderProps) {
  const content = useSiteContent();
  const site = content?.site ?? defaultSite;
  const navigation = content?.site.navigation ?? defaultNavigation;
  const services = content?.services ?? defaultServices;
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const [user, setUser] = useState<{ name: string; phone: string } | null>(null);
  const inHero = variant === "hero";
  const isHome = pathname === "/";
  /** Homepage mega menu sticks while scrolling; other pages stay absolute in hero */
  const stickyHome = inHero && isHome;
  const lightChrome = (stickyHome && scrolled) || (inHero && lightHero);

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
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(false); };
    if (open) window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
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
      <header
        data-home={stickyHome}
        data-scrolled={scrolled}
        data-open={open}
        className={cn(
          "inset-x-0 top-0 z-[110] w-full transition-[color,background-color] duration-500",
          stickyHome ? "fixed" : "absolute",
          lightChrome ? "text-navy-900" : "text-brand-white",
          open && "bg-navy-950 text-brand-white",
        )}
      >
        <div className="container-page">
          <div className="flex h-16 items-center justify-between gap-4 md:h-20">
            <div className="shrink-0">
              <Link
                href="/"
                className="flex shrink-0 items-center gap-3"
                aria-label={`${site.name} - صفحه اصلی`}
              >
                <span className="relative inline-grid h-9 w-12 place-items-center md:h-11 md:w-14">
                  <Image
                    src={content?.site.brandImages?.dark || "/logo-mark-white.png"}
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
                    src={content?.site.brandImages?.light || "/logo-mark-navy.png"}
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
                    "hidden text-xs leading-tight transition-colors duration-700 ease-out lg:block",
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
            </div>

            <nav
              aria-label="منوی اصلی"
              className="hidden xl:block"
              onMouseLeave={() => setHoveredHref(null)}
            >
              <div className="header-chrome rounded-full p-1.5" data-tone={lightChrome && !open ? "light" : "hero"}>
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
                          <div className="invisible absolute top-full right-0 z-50 w-[min(740px,calc(100vw_-_3rem))] translate-y-2 pt-4 opacity-0 transition-[opacity,translate,visibility] duration-300 ease-out group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                            <div dir="rtl" className="mega-services-panel rounded-[26px] border border-[#e5e5ed] bg-white p-4 text-[#24242d]">
                              <div className="mb-4 flex items-center justify-between gap-3 px-1">
                                <span className="flex items-center gap-2.5 text-sm font-extrabold"><span className="grid size-9 place-items-center rounded-xl bg-navy-50 text-navy-600"><Layers3 className="size-4" aria-hidden="true" /></span>خدمات تابلوسازی مکث</span>
                                <Link href="/services" className="site-button-sweep inline-flex items-center gap-2 rounded-full bg-navy-50 px-3.5 py-2 text-xs font-bold text-navy-700 hover:bg-navy-100">همه خدمات <ArrowLeft className="size-4" aria-hidden="true" /></Link>
                              </div>
                              <ul className="grid grid-cols-3 gap-3">
                                {services.map((service) => (
                                  <li key={service.slug} className="min-w-0">
                                    <Link href={`/services/${service.slug}`} className="mega-service-tile group/service block overflow-hidden rounded-[17px] border border-[#e9e9ee] bg-white p-1.5">
                                      <div className="relative aspect-[16/8] overflow-hidden rounded-[12px] bg-navy-50">
                                        <Image src={serviceImage(service) || "/images/services/chelnium.jpg"} alt="" fill sizes="220px" className="object-cover transition-transform duration-500 group-hover/service:scale-110" />
                                        <span className="absolute inset-0 bg-gradient-to-t from-black/15 to-transparent" aria-hidden="true" />
                                      </div>
                                      <div className="flex items-center justify-between gap-2 px-2 py-2.5">
                                        <span className="text-sm font-bold leading-6 text-[#25242e] group-hover/service:text-navy-600">{service.shortTitle}</span>
                                        <span className="grid size-7 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-600 transition-colors group-hover/service:bg-navy-600 group-hover/service:text-white"><ArrowUpLeft className="size-3.5" aria-hidden="true" /></span>
                                      </div>
                                    </Link>
                                  </li>
                                ))}
                              </ul>
                              <div className="mt-4 flex items-center justify-between gap-4 rounded-[17px] bg-[#21212b] px-4 py-3 text-white">
                                <div className="flex items-center gap-2.5 text-xs font-semibold"><MessageCircle className="size-5 text-navy-200" aria-hidden="true" />برای انتخاب تابلو، مشاوره رایگان بگیرید.</div>
                                <Link href="/contact#quote" className="site-button-sweep inline-flex shrink-0 items-center gap-1.5 rounded-full bg-brand-yellow px-4 py-2 text-xs font-extrabold text-[#222212]">استعلام رایگان <ArrowLeft className="size-3.5" aria-hidden="true" /></Link>
                              </div>
                            </div>
                          </div>
                        ) : null}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </nav>

            <div className="flex shrink-0 items-center gap-2">
              <SiteSearch
                variant="desktop"
                tone={lightChrome && !open ? "light" : "hero"}
              />

              <div className="header-chrome rounded-full xl:hidden" data-tone={lightChrome && !open ? "light" : "hero"}>
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
              </div>

              <div className="header-chrome hidden rounded-full xl:block" data-tone={lightChrome && !open ? "light" : "hero"}>
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
              </div>

              <div className="header-chrome rounded-full xl:hidden" data-tone={lightChrome && !open ? "light" : "hero"}>
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
              </div>
            </div>
          </div>
        </div>
      </header>

      {open ? (
        <div
          id="mobile-menu"
          className="fixed inset-0 z-[105] bg-black/30 px-2 pt-[4.25rem] pb-2 backdrop-blur-sm xl:hidden md:pt-[5.25rem]"
          onClick={event => { if (event.target === event.currentTarget) setOpen(false); }}
        >
          <motion.nav initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25, ease: [.22,1,.36,1] }} aria-label="منوی موبایل" className="mobile-nav-sheet mx-auto h-full max-w-lg overflow-y-auto overscroll-contain rounded-[25px] border border-white/80 bg-white p-4 text-[#282731] shadow-[0_24px_65px_rgba(0,0,0,.18)] sm:p-6">
            <div className="mb-4 flex items-center justify-between gap-2"><span className="flex items-center gap-2 text-sm font-extrabold"><span className="size-2 rounded-full bg-navy-600" />منوی مکث</span><span className="text-xs font-semibold text-navy-500">{site.name}</span></div>
            <SiteSearch variant="mobile" tone="light" onNavigate={() => setOpen(false)} />

            {user ? (
              <Link
                href="/account"
                onClick={() => setOpen(false)}
                className={cn(
                  "mb-4 flex items-center justify-between gap-2 rounded-[18px] bg-navy-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-navy-600/15",
                )}
              >
                <svg viewBox="0 0 24 24" className="size-5" aria-hidden="true">
                  <path
                    d="M12 12a4 4 0 1 0-4-4 4 4 0 0 0 4 4Zm0 2c-4.4 0-8 2.2-8 5v1h16v-1c0-2.8-3.6-5-8-5Z"
                    fill="currentColor"
                  />
                </svg>
                <span className="flex-1">حساب من</span><ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className={cn(
                  "mb-4 flex items-center justify-between gap-3 rounded-[18px] bg-navy-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-navy-600/15",
                )}
              >
                <span className="grid size-9 place-items-center rounded-xl bg-white/15"><UserRound className="size-5" aria-hidden="true" /></span><span className="flex-1">ورود / ثبت‌نام</span><ArrowLeft className="size-4" aria-hidden="true" />
              </Link>
            )}

            <ul className="mobile-nav-grid grid grid-cols-2 gap-2">
              {navigation.map((item, index) => {
                const Icon = [House, Layers3, BriefcaseBusiness, Package, Info, BookOpenText, MessageCircle][index] ?? Layers3;
                return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex min-h-14 items-center gap-2 rounded-[15px] border px-2.5 py-2.5 text-xs font-bold transition-colors sm:text-sm",
                      isActive(item.href)
                        ? "border-navy-200 bg-navy-50 text-navy-700"
                        : "border-[#e9e8ee] bg-[#fafafc] text-[#35343e] hover:border-navy-200",
                    )}
                  >
                    <span className="grid size-8 shrink-0 place-items-center rounded-[10px] bg-white text-navy-600"><Icon className="size-4" aria-hidden="true" /></span><span className="min-w-0 flex-1">{item.label}</span><ArrowUpLeft className="size-3 shrink-0 text-navy-400" aria-hidden="true" />
                  </Link>
                </li>
              );})}
            </ul>

            <p className="mt-6 mb-3 flex items-center gap-2 text-sm font-extrabold text-[#282731]">
              <span className="h-3 w-1 rounded-full bg-navy-600" aria-hidden="true" />
              خدمات ما
            </p>
            <ul className="grid grid-cols-2 gap-2">
              {services.map((service) => (
                <li key={service.slug}>
                  <Link
                    href={`/services/${service.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-2 rounded-[15px] border border-[#e9e8ee] bg-white p-2 text-xs font-semibold text-[#35343e] transition-colors hover:border-navy-200"
                  >
                    <span className="relative size-10 shrink-0 overflow-hidden rounded-[10px] bg-navy-50"><Image src={serviceImage(service) || "/images/services/chelnium.jpg"} alt="" fill loading="eager" sizes="40px" className="object-cover" /></span><span className="leading-5">{service.shortTitle}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-5 grid grid-cols-2 gap-2 border-t border-[#e9e8ee] pt-4">
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-[#e9e8ee] bg-[#f7f8fa] px-3 py-3 text-xs font-bold text-[#35343e]"
              >
                <WhatsAppIcon className="size-5" />
                واتساپ
              </a>
              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-[14px] border border-[#e9e8ee] bg-[#f7f8fa] px-3 py-3 text-xs font-bold text-[#35343e]"
              >
                <InstagramIcon className="size-5" />
                اینستاگرام
              </a>
            </div>
          </motion.nav>
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
