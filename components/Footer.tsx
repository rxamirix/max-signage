import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft } from "lucide-react";
import { services as servicesSeed, type Service } from "@/lib/services";
import {
  branches as branchesSeed,
  site as siteSeed,
} from "@/lib/site";
import type { Project, SiteSettings } from "@/lib/content-store";
import { ClockIcon, InstagramIcon, PinIcon, WhatsAppIcon } from "./ui";

type FooterProps = {
  site?: SiteSettings;
  services?: Service[];
  recentProjects?: Project[];
};

export function Footer({
  site = {
    ...siteSeed,
    founders: [...siteSeed.founders],
    branches: [...branchesSeed],
    stats: [],
    trustBadges: [],
    navigation: [],
  },
  services = servicesSeed,
  recentProjects = [],
}: FooterProps) {
  const year = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
    new Date(),
  );
  const branches = site.branches?.length ? site.branches : branchesSeed;
  const projects = recentProjects.slice(0, 6);

  return (
    <footer id="footer" className="max-footer text-brand-white">
      <div className="border-b border-white/10">
        <div className="container-page py-7 md:py-9">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
            <Link href="/" aria-label={`${site.name} - صفحه اصلی`} className="w-fit">
              <Image src={site.brandImages?.footer || "/logo-max-white.png"} alt={`لوگوی ${site.name}`} width={908} height={262} sizes="180px" className="h-9 w-auto md:h-11" />
            </Link>
          </div>
          <div className="grid gap-6 lg:grid-cols-12 lg:gap-7">
            <div className="lg:col-span-4">
              <h2 className="footer-heading text-base font-extrabold text-white">{site.name}</h2>
              <p className="mt-3 max-w-sm text-sm leading-7 text-brand-white/70">
                {site.footerDescription || `${site.name} با ${site.experienceYearsFa} سال سابقه، تولید و نصب انواع تابلو تبلیغاتی چلنیوم، نمای کامپوزیت، حروف برجسته و لایت باکس در سراسر استان مازندران.`}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:border-navy-400/70 hover:bg-navy-600/25"
                >
                  <WhatsAppIcon className="size-4" />
                  واتساپ
                </a>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs font-bold text-white transition-colors hover:border-navy-400/70 hover:bg-navy-600/25"
                >
                  <InstagramIcon className="size-4" />
                  اینستاگرام
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:gap-10 lg:col-span-5">
              <div>
                <h2 className="footer-heading mb-3 text-sm font-extrabold text-white">
                  خدمات ما
                </h2>
                <ul className="space-y-1.5 text-sm leading-6 text-brand-white/70">
                  {services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="transition-colors hover:text-navy-200"
                      >
                        {service.shortTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="footer-heading mb-3 text-sm font-extrabold text-white">
                  پروژه‌های اخیر
                </h2>
                <ul className="space-y-1.5 text-sm leading-6 text-brand-white/70">
                  {projects.map((project) => (
                    <li key={project.slug}>
                      <Link
                        href={`/portfolio/${project.slug}`}
                        className="transition-colors hover:text-navy-200"
                      >
                        {project.title}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <Link
                      href="/portfolio"
                      className="inline-flex items-center gap-1.5 font-bold text-navy-200 transition-colors hover:text-brand-yellow"
                    >
                      مشاهده همه نمونه کارها <ArrowUpLeft className="size-3.5" aria-hidden="true" />
                    </Link>
                  </li>
                </ul>
              </div>
            </div>

            <div className="lg:col-span-3">
              <h2 className="footer-heading mb-3 text-sm font-extrabold text-white">
                شعب‌های حضوری ما
              </h2>
              <ul className="footer-branches grid grid-cols-2 gap-2 lg:grid-cols-1">
                {branches.map((branch) => (
                  <li
                    key={branch.id}
                    className="rounded-[16px] border border-white/10 bg-white/[.045] p-3"
                  >
                    <p className="text-sm font-bold">{branch.title}</p>
                    <p className="mt-1 flex items-start gap-2 text-xs leading-6 text-brand-white/70">
                      <PinIcon className="mt-1 size-4 shrink-0 text-navy-200" />
                      {branch.address}
                    </p>
                    <a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1.5 text-xs font-semibold text-navy-200 hover:text-brand-yellow"
                    >
                      مشاهده روی نقشه <ArrowUpLeft className="size-3.5" aria-hidden="true" />
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-3 flex items-center gap-2 text-xs text-brand-white/70">
                <ClockIcon className="size-4 shrink-0 text-navy-200" />
                {site.workingHours}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page flex flex-col items-center justify-between gap-2 py-3 text-xs text-brand-white/55 md:flex-row">
        <p>
          © {year} {site.name} — تمامی حقوق محفوظ است.
        </p>
        <div className="flex flex-wrap justify-center gap-4"><Link href="/about" className="hover:text-white">درباره ما</Link><Link href="/contact" className="hover:text-white">ارتباط با ما</Link><Link href="/blog" className="hover:text-white">مقالات</Link></div>
        <p className="font-semibold tracking-widest text-brand-white/50" dir="ltr">{site.mottoEn}<span className="ml-2 inline-block size-1.5 rounded-full bg-brand-yellow" aria-hidden="true" /></p>
      </div>
    </footer>
  );
}
