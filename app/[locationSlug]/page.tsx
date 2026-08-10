import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { ProjectCard } from "@/components/ProjectCard";
import { QuoteForm } from "@/components/QuoteForm";
import {
  Button,
  Card,
  CheckIcon,
  PhoneIcon,
  PhoneText,
  PinIcon,
  Section,
  SectionHeading,
} from "@/components/ui";
import { getLocation, locations } from "@/lib/locations";
import { pageMetadata } from "@/lib/metadata";
import { projects } from "@/lib/projects";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { services } from "@/lib/services";
import { branches, site } from "@/lib/site";

type Params = { params: Promise<{ locationSlug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locations.map((location) => ({ locationSlug: location.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { locationSlug } = await params;
  const location = getLocation(locationSlug);
  if (!location) return {};

  return pageMetadata({
    title: location.metaTitle,
    description: location.metaDescription,
    path: `/${location.slug}`,
    absoluteTitle: true,
    keywords: location.keywords,
  });
}

export default async function LocationPage({ params }: Params) {
  const { locationSlug } = await params;
  const location = getLocation(locationSlug);
  if (!location) notFound();

  const cityProjects = projects.filter(
    (project) => project.city === location.city,
  );
  const branch =
    branches.find((item) => item.city === location.nearestBranch) ?? branches[0];
  const otherCities = locations.filter((item) => item.slug !== location.slug);

  const crumbs = [
    { name: "صفحه اصلی", url: "/" },
    { name: location.title, url: `/${location.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          serviceJsonLd({
            name: `ساخت و نصب تابلو تبلیغاتی در ${location.city}`,
            description: location.metaDescription,
            url: `${site.url}/${location.slug}`,
            serviceType: "تابلو تبلیغاتی",
          }),
          faqJsonLd(location.faq),
        ]}
      />

      <PageHero
        eyebrow={`خدمات ${location.city}`}
        title={location.title}
        crumbs={crumbs}
        description={`ساخت، طراحی و نصب انواع تابلو تبلیغاتی در ${location.city} با ${site.experienceYearsFa} سال سابقه؛ چلنیوم، نمای کامپوزیت، حروف برجسته، لایت باکس، تابلو روان و نئون فلکسی.`}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={`tel:${site.phone}`} external>
            <PhoneIcon className="size-4" />
            <PhoneText />
          </Button>
          <Button href="#quote" variant="outline" className="text-brand-white">
            استعلام قیمت رایگان
          </Button>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="text-2xl text-navy-900 md:text-3xl">
              تابلوسازی در {location.city}
            </h2>
            <div className="mt-6 flex flex-col gap-6 text-base leading-9 text-navy-800 md:text-lg">
              {location.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>

            <div className="mt-10 rounded-card border-r-4 border-brand-yellow bg-navy-50 p-6 md:p-7">
              <h3 className="text-lg text-navy-900">
                توصیه فنی ما برای {location.city}
              </h3>
              <p className="mt-3 leading-9 text-navy-700/85">
                {location.localContext}
              </p>
            </div>

            <h2 className="mt-14 text-2xl text-navy-900 md:text-3xl">
              خدمات ما در {location.city}
            </h2>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {services.map((service) => (
                <Link
                  key={service.slug}
                  href={`/services/${service.slug}`}
                  className="flex items-center gap-3 rounded-2xl border border-navy-100 px-4 py-3.5 transition-all hover:border-navy-300 hover:bg-navy-50"
                >
                  <CheckIcon className="size-5 shrink-0 text-navy-600" />
                  <span className="font-bold text-navy-900">
                    {service.shortTitle} در {location.city}
                  </span>
                </Link>
              ))}
            </div>

            <h2 className="mt-14 text-2xl text-navy-900 md:text-3xl">
              مناطق تحت پوشش در {location.city}
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {location.neighborhoods.map((neighborhood) => (
                <li
                  key={neighborhood}
                  className="flex items-center gap-2 rounded-full border border-navy-200 bg-navy-50 px-4 py-2 text-sm text-navy-700"
                >
                  <PinIcon className="size-4 text-navy-600" />
                  {neighborhood}
                </li>
              ))}
            </ul>
            <p className="mt-6 leading-9 text-navy-700/85">
              {location.travelNote}
            </p>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 flex flex-col gap-6">
              <div className="rounded-card bg-navy-950 p-6 text-brand-white">
                <h2 className="text-lg">نزدیک‌ترین شعبه به {location.city}</h2>
                <p className="mt-3 flex items-start gap-2 text-sm text-brand-white/75">
                  <PinIcon className="mt-1 size-4 text-brand-yellow" />
                  {branch.address}
                </p>
                <p className="mt-2 text-sm text-brand-white/60">
                  {site.workingHours}
                </p>
                <Button href={`tel:${site.phone}`} className="mt-5 w-full" external>
                  <PhoneText />
                </Button>
                <Button
                  href={branch.mapUrl}
                  variant="outline"
                  className="mt-3 w-full text-brand-white"
                  external
                >
                  مسیریابی روی نقشه
                </Button>
              </div>

              <Card className="bg-navy-50">
                <h2 className="text-lg text-navy-900">{`چرا مکس در ${location.city}؟`}</h2>
                <ul className="mt-4 space-y-3 text-sm text-navy-700/85">
                  {[
                    `${site.experienceYearsFa} سال سابقه اجرا در مازندران`,
                    "بازدید و طراحی سه‌بعدی رایگان",
                    "نصب رایگان و گارانتی کتبی",
                    "پشتیبانی محلی و سریع بعد از نصب",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2">
                      <CheckIcon className="mt-0.5 size-5 text-navy-600" />
                      {item}
                    </li>
                  ))}
                </ul>
              </Card>
            </div>
          </aside>
        </div>
      </Section>

      {cityProjects.length > 0 ? (
        <Section tone="muted">
          <SectionHeading
            eyebrow="نمونه کار"
            title={`پروژه‌های اجراشده ما در ${location.city}`}
            align="start"
          />
          <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {cityProjects.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Section>
      ) : (
        <Section tone="muted">
          <SectionHeading
            eyebrow="نمونه کار"
            title={`نمونه‌کارهای مرتبط با سفارش در ${location.city}`}
            description="برای دیدن پروژه‌های اجراشده در مازندران به گالری نمونه‌کارها سر بزنید."
            align="start"
          />
          <div className="mt-8">
            <Button href="/portfolio" variant="secondary">
              مشاهده نمونه کارها
            </Button>
          </div>
        </Section>
      )}

      <Section tone="dark">
        <SectionHeading
          tone="dark"
          eyebrow="نحوه کار"
          title={`سفارش تابلو در ${location.city} چطور انجام می‌شود`}
          description="از بازدید رایگان تا نصب و گارانتی، مسیر سفارش در شش مرحله شفاف پیش می‌رود."
        />
        <div className="mt-10 text-center">
          <Button href="/process" variant="outline" className="text-brand-white">
            مشاهده مراحل کامل کار
          </Button>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="سوالات متداول"
          title={`سوال‌های رایج مشتریان ${location.city}`}
        />
        <div className="mt-12">
          <Faq items={location.faq} />
        </div>
      </Section>

      <Section tone="navy" id="quote">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              tone="dark"
              align="start"
              eyebrow="استعلام رایگان"
              title={`قیمت تابلو برای کسب‌وکار شما در ${location.city}`}
              description="فرم را پر کنید تا اطلاعات به‌صورت یک پیام آماده در واتساپ باز شود. بازدید و طراحی رایگان است."
            />
          </div>
          <div className="rounded-card bg-brand-white p-6 md:p-8 lg:col-span-7">
            <QuoteForm />
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <h2 className="text-lg text-navy-900">سایر شهرهای تحت پوشش</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {otherCities.map((item) => (
            <Link
              key={item.slug}
              href={`/${item.slug}`}
              className="rounded-full border border-navy-200 bg-brand-white px-5 py-2.5 text-sm font-bold text-navy-700 transition-colors hover:border-navy-600 hover:bg-navy-600 hover:text-brand-white"
            >
              تابلو تبلیغاتی {item.city}
            </Link>
          ))}
        </div>
      </Section>

      <CtaSection
        title={`تابلوی بعدی ${location.city} می‌تواند مال شما باشد`}
        description="عکس سردر فعلی را برای ما بفرستید تا طرح پیشنهادی را رایگان روی همان عکس شبیه‌سازی کنیم."
      />
    </>
  );
}
