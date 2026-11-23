import type { Metadata } from "next";
import { Check, Droplets, ShieldCheck, Zap } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { MobileCardDetails } from "@/components/MobileCardDetails";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/ui";
import { getMaterials, getSiteSettings } from "@/lib/content-store";
import { defaultPageDetails } from "@/lib/home-content";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "متریال و تجهیزات تابلوسازی | چلنیوم، کامپوزیت، استیل و LED – مکث",
  description:
    "معرفی کامل متریال مورد استفاده در تابلوسازی مکث: چلنیوم آلومینیومی، پلکسی‌گلاس، ورق کامپوزیت PVDF، استیل ۳۰۴، ماژول LED ضدآب، پروفیل گالوانیزه و نئون فلکسی.",
  path: "/materials",
  absoluteTitle: true,
  keywords: [
    "متریال تابلوسازی",
    "چلنیوم آلومینیومی",
    "ورق کامپوزیت",
    "پلکسی گلاس",
    "ماژول LED تابلو",
  ],
});

const crumbs = [
  { name: "صفحه اصلی", url: "/" },
  { name: "متریال", url: "/materials" },
];

export default async function MaterialsPage() {
  const [materials, site] = await Promise.all([getMaterials(), getSiteSettings()]);
  const details = site.pageDetails ?? defaultPageDetails;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        feature="materials"
        title="با چه متریالی تابلوی شما را می‌سازیم"
        crumbs={crumbs}
        description="کیفیت یک تابلو تقریباً به‌طور کامل به متریال و نحوه اجرای آن بستگی دارد. اینجا بدون کلی‌گویی می‌گوییم از چه چیزی استفاده می‌کنیم، چه گریدهایی وجود دارد و چرا این انتخاب‌ها برای اقلیم مازندران اهمیت دارند."
      />

      <Section className="interior-soft-section">
        <div className="interior-pair-grid material-list-grid grid grid-cols-2 gap-3 sm:gap-5">
          {materials.map((material, index) => (
            <Reveal key={material.name} delay={index * 50} className="h-full">
              <article className="interior-card flex h-full flex-col rounded-[25px] border border-[#e7e6ed] bg-white p-3 sm:p-4">
                <div className="material-swatch relative aspect-[2.8/1] overflow-hidden rounded-[17px]" data-material-index={index % 8} aria-hidden="true">{material.image ? <img src={material.image} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <><span /><span /><span /></>}</div>
                <div className="flex flex-1 flex-col px-3 pt-5 pb-3 sm:px-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h2 className="text-xl text-[#282731]">{material.name}</h2>
                  <span className="w-fit rounded-full bg-navy-50 px-3 py-1 text-xs font-bold text-navy-700">{material.category}</span>
                </div>

                <MobileCardDetails title={material.name} preview={material.description}>
                <p className="mt-3 flex-1 text-sm leading-8 text-[#66646e]">
                  {material.description}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {material.properties.map((property) => (
                    <li
                      key={property}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#e9e8ed] bg-[#f8f8fa] px-2.5 py-1 text-xs font-medium text-[#5e5c66]"
                    >
                      <Check className="size-3 text-navy-600" aria-hidden="true" />
                      {property}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 border-t border-[#e9e8ee] pt-3 text-sm leading-7 text-[#66646e]">
                  <span className="font-bold text-navy-900">گریدها و انواع: </span>
                  {material.grades}
                </p>
                </MobileCardDetails>
                </div>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="dark" className="interior-dark-section">
        <SectionHeading
          tone="dark"
          title={details.climateTitle}
          description={details.climateDescription}
        />

        <div className="interior-pair-grid mt-12 grid grid-cols-2 gap-3 sm:gap-6 md:grid-cols-3">
          {details.climate.map((item, index) => {
            const Icon = [ShieldCheck, Droplets, Zap][index % 3];
            return <Reveal key={item.title} delay={index * 60} className="h-full">
              <article className="difference-card h-full rounded-[25px] border border-white/10 p-6">
                <span className="mb-5 grid size-12 place-items-center rounded-[15px] bg-navy-600/30 text-navy-200 ring-1 ring-navy-400/20"><Icon className="size-6" aria-hidden="true" /></span>
                <h3 className="text-lg text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-8 text-brand-white/70">
                  {item.body}
                </p>
              </article>
            </Reveal>;
          })}
        </div>
      </Section>

      <CtaSection
        title="نمونه متریال را از نزدیک ببینید"
        description="در کارگاه بهشهر نمونه چلنیوم، پلکسی، ورق کامپوزیت و استیل موجود است. بدون هماهنگی قبلی هم می‌توانید سر بزنید."
      />
    </>
  );
}
