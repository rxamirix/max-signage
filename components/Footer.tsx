import Image from "next/image";
import Link from "next/link";
import { locations } from "@/lib/locations";
import { services } from "@/lib/services";
import { branches, site } from "@/lib/site";
import { ClockIcon, InstagramIcon, PinIcon, WhatsAppIcon } from "./ui";

export function Footer() {
  const year = new Intl.DateTimeFormat("fa-IR", { year: "numeric" }).format(
    new Date(),
  );

  return (
    <footer className="bg-navy-950 text-brand-white">
      <div className="grid-lines border-b border-brand-white/10">
        <div className="container-page py-14 md:py-16">
          <div className="grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <Image
                src="/logo-max-white.png"
                alt={`لوگوی ${site.name}`}
                width={908}
                height={262}
                sizes="180px"
                className="h-11 w-auto"
              />
              <p className="mt-5 max-w-sm leading-8 text-brand-white/70">
                {site.name} با ۲۰ سال سابقه، تولید و نصب انواع تابلو تبلیغاتی
                چلنیوم، نمای کامپوزیت، حروف برجسته، لایت باکس و تابلو روان در
                سراسر استان مازندران.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={`https://wa.me/${site.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-2.5 font-bold text-white transition-transform hover:-translate-y-0.5"
                >
                  <WhatsAppIcon className="size-4" />
                  واتساپ
                </a>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-brand-white/20 px-5 py-2.5 font-medium transition-colors hover:border-brand-yellow hover:text-brand-yellow"
                >
                  <InstagramIcon className="size-4" />
                  اینستاگرام
                </a>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 sm:gap-10 lg:col-span-5">
              <div>
                <h2 className="mb-4 text-base font-extrabold text-brand-yellow">
                  خدمات ما
                </h2>
                <ul className="space-y-2.5 text-sm text-brand-white/70">
                  {services.map((service) => (
                    <li key={service.slug}>
                      <Link
                        href={`/services/${service.slug}`}
                        className="transition-colors hover:text-brand-white"
                      >
                        {service.shortTitle}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h2 className="mb-4 text-base font-extrabold text-brand-yellow">
                  شهرهای تحت پوشش
                </h2>
                <ul className="space-y-2.5 text-sm text-brand-white/70">
                  {locations.map((location) => (
                    <li key={location.slug}>
                      <Link
                        href={`/${location.slug}`}
                        className="transition-colors hover:text-brand-white"
                      >
                        <span className="sm:hidden">{location.city}</span>
                        <span className="hidden sm:inline">
                          تابلو تبلیغاتی {location.city}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="lg:col-span-3">
              <h2 className="mb-4 text-base font-extrabold text-brand-yellow">
                شعب ما
              </h2>
              <ul className="space-y-5">
                {branches.map((branch) => (
                  <li
                    key={branch.id}
                    className="rounded-2xl border border-brand-white/10 bg-brand-white/5 p-5"
                  >
                    <p className="font-bold">{branch.title}</p>
                    <p className="mt-2 flex items-start gap-2 text-sm text-brand-white/70">
                      <PinIcon className="mt-1 size-4 text-brand-yellow" />
                      {branch.address}
                    </p>
                    <a
                      href={branch.mapUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-block text-sm font-medium text-brand-yellow hover:underline"
                    >
                      مشاهده روی نقشه
                    </a>
                  </li>
                ))}
              </ul>

              <p className="mt-5 flex items-center gap-2 text-sm text-brand-white/70">
                <ClockIcon className="size-4 text-brand-yellow" />
                {site.workingHours}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="container-page flex flex-col items-center justify-between gap-3 py-6 text-sm text-brand-white/50 md:flex-row">
        <p>
          © {year} {site.name} — تمامی حقوق محفوظ است.
        </p>
        <p className="font-medium tracking-widest text-brand-white/40">
          {site.mottoEn}
        </p>
      </div>
    </footer>
  );
}
