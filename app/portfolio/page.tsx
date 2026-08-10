import type { Metadata } from "next";
import { CtaSection } from "@/components/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { PortfolioGrid } from "@/components/PortfolioGrid";
import { Section } from "@/components/ui";
import { projects } from "@/lib/projects";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "نمونه کارهای تابلوسازی در مازندران | پروژه‌های اجراشده مکس",
  description:
    "گالری نمونه کارهای تابلوسازی مکس در ساری، بهشهر، نکا، قائم‌شهر، آمل و بابل؛ تابلو چلنیوم، نمای کامپوزیت، حروف برجسته استیل، لایت باکس و تابلو روان با شرح کامل هر پروژه.",
  path: "/portfolio",
  absoluteTitle: true,
  keywords: [
    "نمونه کار تابلوسازی",
    "پروژه تابلو تبلیغاتی مازندران",
    "گالری تابلو چلنیوم",
    "نمونه نمای کامپوزیت",
  ],
});

const crumbs = [
  { name: "صفحه اصلی", url: "/" },
  { name: "نمونه کارها", url: "/portfolio" },
];

export default function PortfolioPage() {
  const itemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "نمونه کارهای تابلوسازی مکس",
    itemListElement: projects.map((project, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: project.title,
      url: `${site.url}/portfolio/${project.slug}`,
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), itemList]} />

      <PageHero
        eyebrow="نمونه کارها"
        title="پروژه‌هایی که در مازندران اجرا کرده‌ایم"
        crumbs={crumbs}
        description="هر پروژه با یک مسئله مشخص شروع شده است: سردر قدیمی، نمای آشفته، تابلویی که در شب دیده نمی‌شد. اینجا می‌بینید مسئله چه بود، چه راه‌حلی انتخاب کردیم و نتیجه چه شد."
      />

      <Section>
        <PortfolioGrid projects={projects} />
      </Section>

      <CtaSection
        title="پروژه بعدی می‌تواند مال شما باشد"
        description="عکس سردر فعلی مغازه‌تان را برای ما بفرستید تا طرح پیشنهادی را رایگان روی همان عکس شبیه‌سازی کنیم."
      />
    </>
  );
}
