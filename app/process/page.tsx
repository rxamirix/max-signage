import type { Metadata } from "next";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { CheckIcon, Section, SectionHeading } from "@/components/ui";
import { processSteps } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "نحوه کار ما | از بازدید رایگان تا نصب و گارانتی – تابلوسازی مکس",
  description:
    "فرآیند شش مرحله‌ای تابلوسازی مکس: بازدید رایگان، طراحی سه‌بعدی، قرارداد کتبی، ساخت در کارگاه، نصب رایگان و گارانتی. در هر مرحله دقیقاً می‌دانید چه اتفاقی می‌افتد.",
  path: "/process",
  absoluteTitle: true,
  keywords: ["نحوه ساخت تابلو", "مراحل سفارش تابلو", "فرآیند تابلوسازی"],
});

const crumbs = [
  { name: "صفحه اصلی", url: "/" },
  { name: "نحوه کار", url: "/process" },
];

const processFaq = [
  {
    question: "برای شروع باید چه چیزی آماده داشته باشم؟",
    answer:
      "یک عکس واضح از سردر فعلی، اندازه تقریبی عرض و ارتفاع پیشانی، و متن دقیقی که می‌خواهید روی تابلو باشد. اگر لوگو دارید، فایل آن هم کمک می‌کند.",
  },
  {
    question: "اگر از طرح خوشم نیامد چه می‌شود؟",
    answer:
      "طراحی رایگان است و تا رسیدن به نتیجه مورد پسند شما اصلاح می‌شود. تا زمانی که طرح را تأیید نکنید، هیچ پرداختی انجام نمی‌شود و هیچ تعهدی ندارید.",
  },
  {
    question: "پرداخت چگونه انجام می‌شود؟",
    answer:
      "معمولاً بخشی به‌عنوان پیش‌پرداخت هنگام تأیید طرح و عقد قرارداد، و مابقی پس از نصب و تحویل نهایی دریافت می‌شود.",
  },
  {
    question: "آیا هزینه‌ای وسط کار اضافه می‌شود؟",
    answer:
      "خیر. قیمت مندرج در قرارداد نهایی است. تنها در صورتی که خود شما در طول اجرا تغییری در طرح یا ابعاد بخواهید، تفاوت هزینه با هماهنگی قبلی محاسبه می‌شود.",
  },
  {
    question: "نصب چقدر طول می‌کشد و مغازه باید تعطیل باشد؟",
    answer:
      "نصب معمولاً بین یک تا سه روز طول می‌کشد. در بیشتر پروژه‌ها نیازی به تعطیلی مغازه نیست و کار در ساعاتی که کمترین اختلال را ایجاد کند انجام می‌شود.",
  },
];

export default function ProcessPage() {
  const howTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "مراحل سفارش و ساخت تابلو تبلیغاتی در تابلوسازی مکس",
    description:
      "فرآیند شش مرحله‌ای از بازدید رایگان تا تحویل تابلو همراه با گارانتی کتبی.",
    inLanguage: "fa-IR",
    step: processSteps.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.description,
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), howTo, faqJsonLd(processFaq)]} />

      <PageHero
        eyebrow="نحوه کار"
        title="از اولین تماس تا تابلوی روشن روی سردر شما"
        crumbs={crumbs}
        description="بیشتر نگرانی مشتریان درباره ابهام است: نمی‌دانند چقدر طول می‌کشد، چه زمانی باید پول بدهند و آیا نتیجه همان چیزی می‌شود که تصور کرده‌اند. این صفحه دقیقاً همین‌ها را روشن می‌کند."
      />

      <Section>
        <ol className="relative mx-auto flex max-w-4xl flex-col gap-8">
          {processSteps.map((step, index) => (
            <li key={step.step}>
              <Reveal delay={index * 60}>
                <div className="relative grid gap-6 rounded-card border border-navy-100 bg-brand-white p-6 md:grid-cols-[auto_1fr] md:p-8">
                  <div className="flex items-center gap-4 md:flex-col md:items-center md:gap-3">
                    <span className="grid size-14 shrink-0 place-items-center rounded-2xl bg-navy-600 text-2xl font-extrabold text-brand-white">
                      {step.step}
                    </span>
                    <span className="rounded-full bg-brand-yellow px-3 py-1 text-xs font-bold whitespace-nowrap text-navy-900">
                      {step.duration}
                    </span>
                  </div>

                  <div>
                    <h2 className="text-xl text-navy-900 md:text-2xl">
                      {step.title}
                    </h2>
                    <p className="mt-3 leading-9 text-navy-700/85">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="navy">
        <SectionHeading
          tone="dark"
          eyebrow="تعهد ما"
          title="چه چیزی رایگان است و چه چیزی هزینه دارد"
          description="برای اینکه از ابتدا تصویر روشنی داشته باشید، دقیقاً می‌گوییم بابت چه چیزی پول می‌دهید."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          <div className="rounded-card border border-brand-yellow/30 bg-brand-white/5 p-7">
            <h3 className="text-xl text-brand-yellow">کاملاً رایگان</h3>
            <ul className="mt-5 space-y-3">
              {[
                "بازدید از محل و اندازه‌گیری دقیق",
                "مشاوره انتخاب نوع تابلو و متریال",
                "طراحی و شبیه‌سازی سه‌بعدی روی عکس سردر شما",
                "اصلاح طرح تا رسیدن به نتیجه مورد پسند",
                "استعلام و برآورد قیمت مکتوب",
                "نصب در محل",
                "پشتیبانی در دوره گارانتی",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-brand-white/85">
                  <CheckIcon className="mt-1 size-5 text-brand-yellow" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-card border border-brand-white/15 bg-brand-white/5 p-7">
            <h3 className="text-xl text-brand-white">هزینه‌دار</h3>
            <ul className="mt-5 space-y-3">
              {[
                "ساخت تابلو شامل متریال و دستمزد تولید",
                "زیرسازی و اجرای نما در صورت نیاز",
                "تجهیزات ویژه نصب در ارتفاع مانند جرثقیل یا داربست",
                "تغییرات درخواستی شما بعد از تأیید نهایی طرح",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-brand-white/75">
                  <span className="mt-2.5 size-1.5 shrink-0 rounded-full bg-brand-white/50" />
                  {item}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-8 text-brand-white/60">
              همه این موارد پیش از شروع کار، به‌صورت مکتوب در قرارداد مشخص
              می‌شوند.
            </p>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="سوالات متداول"
          title="سوال‌های رایج درباره فرآیند کار"
        />
        <div className="mt-12">
          <Faq items={processFaq} />
        </div>
      </Section>

      <CtaSection
        title="مرحله اول رایگان است؛ فقط یک تماس"
        description="در بازدید اول هیچ تعهدی برای شما ایجاد نمی‌شود. فقط اطلاعات لازم برای تصمیم‌گیری درست را به دست می‌آورید."
      />
    </>
  );
}
