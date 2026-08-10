import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { ProjectCard } from "@/components/ProjectCard";
import { QuoteForm } from "@/components/QuoteForm";
import { Reveal } from "@/components/Reveal";
import { Button, Card, CheckIcon, PhoneText, Section, SectionHeading } from "@/components/ui";
import { locations } from "@/lib/locations";
import { projects } from "@/lib/projects";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, faqJsonLd, serviceJsonLd } from "@/lib/seo";
import { getService, services } from "@/lib/services";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};

  return pageMetadata({
    title: service.metaTitle,
    description: service.metaDescription,
    path: `/services/${service.slug}`,
    absoluteTitle: true,
    keywords: service.keywords,
    image: `/images/services/${
      service.slug === "composite"
        ? "composite-facade"
        : service.slug === "lightbox"
          ? "lightbox-sign"
          : service.slug === "led-display"
            ? "led-billboard"
            : service.slug
    }.jpg`,
    imageAlt: service.shortTitle,
  });
}

export default async function ServicePage({ params }: Params) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const related = projects.filter((project) => project.serviceSlug === service.slug);
  const others = services.filter((item) => item.slug !== service.slug);

  const crumbs = [
    { name: "صفحه اصلی", url: "/" },
    { name: "خدمات", url: "/services" },
    { name: service.shortTitle, url: `/services/${service.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          serviceJsonLd({
            name: service.title,
            description: service.metaDescription,
            url: `${site.url}/services/${service.slug}`,
            serviceType: service.shortTitle,
          }),
          faqJsonLd(service.faq),
        ]}
      />

      <PageHero
        eyebrow={service.shortTitle}
        title={service.title}
        crumbs={crumbs}
        description={service.excerpt}
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={`tel:${site.phone}`} external>
            <PhoneText />
          </Button>
          <Button href="#quote" variant="outline" className="text-brand-white">
            استعلام قیمت این خدمت
          </Button>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="flex flex-col gap-6 text-base leading-9 text-navy-800 md:text-lg">
              {service.intro.map((paragraph) => (
                <p key={paragraph.slice(0, 24)}>{paragraph}</p>
              ))}
            </div>

            <h2 className="mt-14 text-2xl text-navy-900 md:text-3xl">
              ویژگی‌های اجرای {service.shortTitle} در مکس
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {service.features.map((feature, index) => (
                <Reveal key={feature.title} delay={index * 60}>
                  <Card className="h-full">
                    <span className="grid size-10 place-items-center rounded-xl bg-brand-yellow text-navy-900">
                      <CheckIcon />
                    </span>
                    <h3 className="mt-4 text-lg text-navy-900">{feature.title}</h3>
                    <p className="mt-2 text-sm leading-8 text-navy-700/80">
                      {feature.description}
                    </p>
                  </Card>
                </Reveal>
              ))}
            </div>

            <h2 className="mt-14 text-2xl text-navy-900 md:text-3xl">
              مناسب برای چه کسب‌وکارهایی است؟
            </h2>
            <ul className="mt-6 flex flex-wrap gap-3">
              {service.useCases.map((useCase) => (
                <li
                  key={useCase}
                  className="rounded-full border border-navy-200 bg-navy-50 px-4 py-2 text-sm font-medium text-navy-700"
                >
                  {useCase}
                </li>
              ))}
            </ul>
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 flex flex-col gap-6">
              <div className="rounded-card border border-navy-100 bg-navy-50 p-6">
                <h2 className="text-lg text-navy-900">مشخصات فنی</h2>
                <dl className="mt-4 divide-y divide-navy-200/60">
                  {service.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-start justify-between gap-4 py-3"
                    >
                      <dt className="shrink-0 text-sm text-navy-700/80">
                        {spec.label}
                      </dt>
                      <dd className="text-sm font-bold text-navy-900">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="rounded-card bg-navy-950 p-6 text-brand-white">
                <h2 className="text-lg">قیمت این خدمت چقدر است؟</h2>
                <p className="mt-3 text-sm leading-8 text-brand-white/70">
                  قیمت به ابعاد، متریال و شرایط نصب بستگی دارد. بازدید و استعلام
                  کاملاً رایگان است.
                </p>
                <Button href={`tel:${site.phone}`} className="mt-5 w-full" external>
                  <PhoneText />
                </Button>
              </div>
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="muted">
          <SectionHeading
            eyebrow="نمونه کار"
            title={`پروژه‌های ${service.shortTitle} ما`}
            align="start"
          />
          <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {related.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </div>
        </Section>
      ) : null}

      <Section tone={related.length > 0 ? "light" : "muted"}>
        <SectionHeading
          eyebrow="سوالات متداول"
          title={`سوال‌های رایج درباره ${service.shortTitle}`}
        />
        <div className="mt-12">
          <Faq items={service.faq} />
        </div>
      </Section>

      <Section tone="navy" id="quote">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              tone="dark"
              align="start"
              eyebrow="استعلام رایگان"
              title={`قیمت ${service.shortTitle} برای کسب‌وکار شما`}
              description="فرم را پر کنید تا اطلاعات به‌صورت یک پیام آماده در واتساپ باز شود. در کمترین زمان پاسخ می‌دهیم."
            />
            <ul className="mt-8 space-y-3 text-brand-white/85">
              {["بازدید رایگان از محل", "طراحی سه‌بعدی رایگان", "قیمت مکتوب و بدون هزینه پنهان"].map(
                (item) => (
                  <li key={item} className="flex items-center gap-2">
                    <CheckIcon className="size-5 text-brand-yellow" />
                    {item}
                  </li>
                ),
              )}
            </ul>
          </div>

          <div className="rounded-card bg-brand-white p-6 md:p-8 lg:col-span-7">
            <QuoteForm defaultService={service.shortTitle} />
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="سایر خدمات"
          title="شاید این خدمات هم به کار شما بیاید"
          align="start"
        />
        <div className="mt-8 flex flex-wrap gap-3">
          {others.map((item) => (
            <Link
              key={item.slug}
              href={`/services/${item.slug}`}
              className="rounded-full border border-navy-200 bg-brand-white px-5 py-2.5 text-sm font-bold text-navy-700 transition-colors hover:border-navy-600 hover:bg-navy-600 hover:text-brand-white"
            >
              {item.shortTitle}
            </Link>
          ))}
        </div>

        <h2 className="mt-12 text-lg text-navy-900">
          {service.shortTitle} در شهرهای مازندران
        </h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {locations.map((location) => (
            <Link
              key={location.slug}
              href={`/${location.slug}`}
              className="rounded-full border border-navy-200 px-5 py-2.5 text-sm text-navy-700 transition-colors hover:border-navy-600 hover:text-navy-600"
            >
              {service.shortTitle} در {location.city}
            </Link>
          ))}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
