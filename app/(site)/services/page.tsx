import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft, Building2, Gem, ImageIcon, Monitor, Store, Wallet } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ServiceCard } from "@/components/ServiceCard";
import { Section, SectionHeading } from "@/components/ui";
import { getServices, getSiteSettings } from "@/lib/content-store";
import { defaultPageDetails } from "@/lib/home-content";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "خدمات تابلوسازی در مازندران | چلنیوم، کامپوزیت، حروف برجسته و LED",
  description:
    "خدمات تابلوسازی مکث در مازندران: ساخت تابلو چلنیوم، اجرای نمای کامپوزیت، حروف برجسته استیل، لایت باکس، تابلو روان LED و نئون فلکسی با طراحی و نصب رایگان و گارانتی کتبی.",
  path: "/services",
  keywords: [
    "خدمات تابلوسازی",
    "ساخت تابلو تبلیغاتی",
    "تابلو چلنیوم",
    "نمای کامپوزیت",
    "حروف برجسته",
    "لایت باکس",
    "تابلو روان",
  ],
});

const crumbs = [
  { name: "صفحه اصلی", url: "/" },
  { name: "خدمات", url: "/services" },
];

export default async function ServicesPage() {
  const [services, site] = await Promise.all([
    getServices(),
    getSiteSettings(),
  ]);

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        title="خدمات تابلوسازی مکث در مازندران"
        crumbs={crumbs}
        description={
          <>
            هر کسب‌وکاری شرایط متفاوتی دارد: بودجه، نوع نما، فاصله دید مشتری و
            هویت برند. به همین دلیل ما یک راه‌حل ثابت پیشنهاد نمی‌دهیم. در ادامه
            شش دسته اصلی خدمات ما را می‌بینید و اینکه هر کدام برای چه شرایطی
            مناسب است.
          </>
        }
      />

      <Section>
        <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3">
          {services.map((service, index) => (
            <Reveal key={service.slug} delay={index * 50} className="h-full">
              <ServiceCard service={service} />
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="light" className="interior-soft-section">
        <SectionHeading
          title={(site.pageDetails ?? defaultPageDetails).serviceGuideTitle}
          description={(site.pageDetails ?? defaultPageDetails).serviceGuideDescription}
        />

        <div className="interior-pair-grid service-choice-grid mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:gap-5">
              {(site.pageDetails ?? defaultPageDetails).serviceChoices.map((row, index) => {
                const Icon = [Store, Gem, Monitor, ImageIcon, Wallet, Building2][index];
                const slug = ["chelnium", "3d-letters", "led-display", "lightbox", "neon-flex", "composite"][index];
                return <Reveal key={row[0]} delay={index * 55} className="h-full"><article className="interior-card flex h-full gap-4 rounded-[24px] border border-[#e7e6ed] bg-white p-5 sm:p-6"><span className="grid size-12 shrink-0 place-items-center rounded-[16px] bg-navy-50 text-navy-600 sm:size-14"><Icon className="size-6" aria-hidden="true" /></span><div className="min-w-0 flex-1"><h3 className="text-base font-extrabold text-[#282731]">{row[0]}</h3><Link href={`/services/${slug}`} className="mt-3 inline-flex items-center gap-2 rounded-full bg-navy-50 px-3 py-1.5 text-xs font-bold text-navy-700 hover:bg-navy-100">{row[1]} <ArrowUpLeft className="size-3.5" aria-hidden="true" /></Link><p className="mt-3 text-sm leading-7 text-[#66646e]">{row[2]}</p></div></article></Reveal>;
              })}
        </div>
      </Section>

      <CtaSection
        title={`برای انتخاب درست، با کارشناس ${site.name} حرف بزنید`}
        description="در یک تماس کوتاه، بر اساس نوع کسب‌وکار، محل مغازه و بودجه شما، گزینه مناسب را پیشنهاد می‌دهیم. مشاوره و بازدید رایگان است."
      />
    </>
  );
}
