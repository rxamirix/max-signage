import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import {
  Button,
  PhoneIcon,
  PhoneText,
  PinIcon,
  Section,
  SectionHeading,
  WhatsAppIcon,
  InstagramIcon,
  ClockIcon,
  CheckIcon,
} from "@/components/ui";
import { locations } from "@/lib/locations";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { branches, site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "تماس با تابلوسازی مکس | بهشهر میدان قدس و نکا مقابل دارایی",
  description:
    "تماس با تابلوسازی مکس: ۰۹۱۱۲۵۸۸۸۴۶. کارگاه بهشهر میدان قدس و شعبه نکا مقابل اداره دارایی. بازدید، طراحی و استعلام قیمت رایگان در سراسر مازندران.",
  path: "/contact",
  absoluteTitle: true,
  keywords: [
    "تماس تابلوسازی مکس",
    "شماره تابلوسازی بهشهر",
    "تابلوسازی نکا آدرس",
    "استعلام قیمت تابلو",
  ],
});

const crumbs = [
  { name: "صفحه اصلی", url: "/" },
  { name: "ارتباط با ما", url: "/contact" },
];

const contactFaq = [
  {
    question: "سریع‌ترین راه گرفتن قیمت چیست؟",
    answer:
      "تماس تلفنی با ۰۹۱۱۲۵۸۸۸۴۶ یا ارسال عکس سردر مغازه در واتساپ. معمولاً در همان تماس اول یک برآورد اولیه می‌گیرید و قیمت دقیق بعد از بازدید اعلام می‌شود.",
  },
  {
    question: "بازدید از محل چقدر طول می‌کشد؟",
    answer:
      "معمولاً کمتر از نیم ساعت. کارشناس ما ابعاد را برداشت می‌کند، شرایط برق و نصب را بررسی می‌کند و گزینه‌های مناسب را توضیح می‌دهد.",
  },
  {
    question: "خارج از بهشهر و نکا هم بازدید می‌آیید؟",
    answer:
      "بله. بازدید در ساری، قائم‌شهر، آمل، بابل و سایر شهرهای مازندران هم رایگان انجام می‌شود؛ فقط زمان آن با هماهنگی قبلی تنظیم می‌گردد.",
  },
  {
    question: "امکان مراجعه حضوری به کارگاه هست؟",
    answer:
      "بله. کارگاه بهشهر در میدان قدس و شعبه نکا مقابل اداره دارایی، شنبه تا پنجشنبه از ۸ صبح تا ۸ شب پذیرای شماست.",
  },
];

export default function ContactPage() {
  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(contactFaq)]} />

      <PageHero
        eyebrow="ارتباط با ما"
        title="یک تماس، و کار از همین‌جا شروع می‌شود"
        crumbs={crumbs}
        description="بازدید از محل، طراحی سه‌بعدی و استعلام قیمت کاملاً رایگان است و هیچ تعهدی برای شما ایجاد نمی‌کند."
      >
        <div className="flex flex-col gap-3 sm:flex-row">
          <Button href={`tel:${site.phone}`} size="lg" external>
            <PhoneIcon className="size-5" />
            <PhoneText />
          </Button>
          <Button
            href={`https://wa.me/${site.whatsapp}`}
            variant="outline"
            size="lg"
            external
            className="text-brand-white"
          >
            <WhatsAppIcon className="size-5" />
            واتساپ
          </Button>
        </div>
      </PageHero>

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading
              align="start"
              eyebrow="راه‌های ارتباطی"
              title="ما را کجا پیدا کنید"
            />

            <div className="mt-8 flex flex-col gap-5">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="rounded-card border border-navy-100 bg-navy-50 p-6"
                >
                  <h3 className="text-lg text-navy-900">{branch.title}</h3>
                  <p className="mt-3 flex items-start gap-2.5 text-navy-700/85">
                    <PinIcon className="mt-1 size-5 text-navy-600" />
                    {branch.address}
                  </p>
                  <p className="mt-2 flex items-center gap-2.5 text-navy-700/85">
                    <ClockIcon className="size-5 text-navy-600" />
                    {site.workingHours}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <Button href={`tel:${site.phone}`} external>
                      <PhoneIcon className="size-4" />
                      <PhoneText />
                    </Button>
                    <Button href={branch.mapUrl} variant="outline" external>
                      مسیریابی
                    </Button>
                  </div>
                </div>
              ))}

              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between gap-4 rounded-card border border-navy-100 p-6 transition-colors hover:border-navy-300 hover:bg-navy-50"
              >
                <span>
                  <span className="block font-bold text-navy-900">
                    نمونه کارهای بیشتر در اینستاگرام
                  </span>
                  <span className="mt-1 block text-sm text-navy-600" dir="ltr">
                    @{site.instagramHandle}
                  </span>
                </span>
                <InstagramIcon className="size-7 text-navy-600" />
              </a>
            </div>
          </div>

          <div className="lg:col-span-7" id="quote">
            <div className="rounded-card border border-navy-100 bg-brand-white p-6 shadow-xl shadow-navy-900/5 md:p-9">
              <h2 className="text-2xl text-navy-900 md:text-3xl">
                فرم استعلام قیمت رایگان
              </h2>
              <p className="mt-3 leading-8 text-navy-700/80">
                فرم را پر کنید تا اطلاعات به‌صورت یک پیام آماده در واتساپ باز
                شود و شما فقط آن را ارسال کنید.
              </p>

              <ul className="mt-6 mb-8 flex flex-wrap gap-x-6 gap-y-2">
                {["بدون هزینه", "بدون تعهد", "پاسخ سریع"].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-2 text-sm font-medium text-navy-700"
                  >
                    <CheckIcon className="size-5 text-navy-600" />
                    {item}
                  </li>
                ))}
              </ul>

              <QuoteForm />
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="پوشش خدمات"
          title="در سراسر مازندران در خدمت شما هستیم"
        />
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {locations.map((location) => (
            <a
              key={location.slug}
              href={`/${location.slug}`}
              className="rounded-full border border-navy-200 bg-brand-white px-5 py-2.5 text-sm font-bold text-navy-700 transition-colors hover:border-navy-600 hover:bg-navy-600 hover:text-brand-white"
            >
              تابلو تبلیغاتی {location.city}
            </a>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="سوالات متداول" title="قبل از تماس، شاید بپرسید" />
        <div className="mt-12">
          <Faq items={contactFaq} />
        </div>
      </Section>
    </>
  );
}
