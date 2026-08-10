import type { Metadata } from "next";
import { CtaSection } from "@/components/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { ServiceCarousel } from "@/components/ServiceCarousel";
import { Card, Section, SectionHeading } from "@/components/ui";
import { processSteps } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "خدمات تابلوسازی در مازندران | چلنیوم، کامپوزیت، حروف برجسته و LED",
  description:
    "خدمات تابلوسازی مکس در مازندران: ساخت تابلو چلنیوم، اجرای نمای کامپوزیت، حروف برجسته استیل، لایت باکس، تابلو روان LED و نئون فلکسی با طراحی و نصب رایگان و گارانتی کتبی.",
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

export default function ServicesPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="خدمات ما"
        title="خدمات تابلوسازی مکس در مازندران"
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
        <ServiceCarousel services={services} />
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="راهنمای انتخاب"
          title="کدام خدمت برای کسب‌وکار شما مناسب است؟"
          description="اگر مطمئن نیستید کدام گزینه را انتخاب کنید، این جدول کوتاه کمک می‌کند نقطه شروع را پیدا کنید."
        />

        <div className="mt-12 overflow-x-auto">
          <table className="w-full min-w-[42rem] border-collapse overflow-hidden rounded-2xl bg-brand-white text-start">
            <caption className="sr-only">
              مقایسه خدمات تابلوسازی مکس بر اساس نوع کسب‌وکار
            </caption>
            <thead>
              <tr className="bg-navy-600 text-brand-white">
                <th scope="col" className="px-5 py-4 text-start font-bold">
                  اگر شما ...
                </th>
                <th scope="col" className="px-5 py-4 text-start font-bold">
                  پیشنهاد ما
                </th>
                <th scope="col" className="px-5 py-4 text-start font-bold">
                  چرا
                </th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {[
                [
                  "یک مغازه یا فروشگاه معمولی دارید",
                  "کامپوزیت + چلنیوم",
                  "بهترین نسبت کیفیت به هزینه با بیشترین خوانایی در شب",
                ],
                [
                  "برند لوکس، طلافروشی یا هتل دارید",
                  "حروف برجسته استیل با نور هالو",
                  "ظاهر مجلل و ماندگاری بسیار بالا",
                ],
                [
                  "قیمت یا پیام متغیر نمایش می‌دهید",
                  "تابلو روان یا نمایشگر LED",
                  "به‌روزرسانی لحظه‌ای بدون هزینه چاپ مجدد",
                ],
                [
                  "منو یا تصویر رنگی نمایش می‌دهید",
                  "لایت باکس فریم‌لس",
                  "کل سطح روشن می‌شود و تعویض طرح آسان است",
                ],
                [
                  "بودجه محدودی دارید",
                  "نئون فلکسی روی تابلوی فعلی",
                  "کمترین هزینه با بیشترین تأثیر روی دیده‌شدن",
                ],
                [
                  "نمای ساختمان یا مجتمع را بازسازی می‌کنید",
                  "نمای کامپوزیت",
                  "یکدست کردن نما و رفع مشکل نفوذ رطوبت",
                ],
              ].map((row) => (
                <tr
                  key={row[0]}
                  className="border-b border-navy-100 last:border-0 even:bg-navy-50/50"
                >
                  <td className="px-5 py-4 font-medium text-navy-900">{row[0]}</td>
                  <td className="px-5 py-4 font-bold text-navy-600">{row[1]}</td>
                  <td className="px-5 py-4 text-navy-700/80">{row[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      <Section tone="dark">
        <SectionHeading
          tone="dark"
          eyebrow="فرآیند اجرا"
          title="همه خدمات، یک مسیر مشخص"
          description="فرقی نمی‌کند کدام خدمت را انتخاب کنید؛ مسیر کار همیشه همین شش مرحله شفاف است."
        />

        <ol className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, index) => (
            <li key={step.step}>
              <Reveal delay={index * 60}>
                <Card tone="dark" className="h-full">
                  <span className="text-3xl font-extrabold text-brand-yellow/40">
                    {step.step}
                  </span>
                  <h3 className="mt-2 text-lg text-brand-white">{step.title}</h3>
                  <p className="mt-3 text-sm leading-8 text-brand-white/70">
                    {step.description}
                  </p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <CtaSection
        title={`برای انتخاب درست، با کارشناس ${site.name} حرف بزنید`}
        description="در یک تماس کوتاه، بر اساس نوع کسب‌وکار، محل مغازه و بودجه شما، گزینه مناسب را پیشنهاد می‌دهیم. مشاوره و بازدید رایگان است."
      />
    </>
  );
}
