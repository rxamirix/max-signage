import type { Metadata } from "next";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { QuoteForm } from "@/components/QuoteForm";
import {
  Button,
  PinIcon,
  Section,
  SectionHeading,
  InstagramIcon,
  ClockIcon,
  CheckIcon,
} from "@/components/ui";
import { getLocations, getSiteSettings } from "@/lib/content-store";
import { defaultPageDetails } from "@/lib/home-content";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "تماس با تابلوسازی مکث | بهشهر میدان قدس و نکا مقابل دارایی",
  description:
    "تماس با تابلوسازی مکث: ۰۹۱۱۲۵۸۸۸۴۶. کارگاه بهشهر میدان قدس و شعبه نکا مقابل اداره دارایی. بازدید، طراحی و استعلام قیمت رایگان در سراسر مازندران.",
  path: "/contact",
  absoluteTitle: true,
  keywords: [
    "تماس تابلوسازی مکث",
    "شماره تابلوسازی بهشهر",
    "تابلوسازی نکا آدرس",
    "استعلام قیمت تابلو",
  ],
});

const crumbs = [
  { name: "صفحه اصلی", url: "/" },
  { name: "ارتباط با ما", url: "/contact" },
];


export default async function ContactPage() {
  const [locations, site] = await Promise.all([
    getLocations(),
    getSiteSettings(),
  ]);
  const { branches } = site;
  const details = site.pageDetails ?? defaultPageDetails;
  const contactFaq = details.contactFaq;

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), faqJsonLd(contactFaq)]} />

      <PageHero
        feature="contact"
        title="یک تماس، و کار از همین‌جا شروع می‌شود"
        crumbs={crumbs}
        description="بازدید از محل، طراحی سه‌بعدی و استعلام قیمت کاملاً رایگان است و هیچ تعهدی برای شما ایجاد نمی‌کند."
      />

      <Section className="interior-soft-section">
        <div className="grid items-start gap-7 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHeading
              align="start"
              title={details.contactBranchesTitle}
            />

            <div className="mt-6 flex flex-col gap-4">
              <div className="interior-pair-grid contact-branch-grid grid grid-cols-2 gap-3 lg:grid-cols-1">
              {branches.map((branch) => (
                <div
                  key={branch.id}
                  className="interior-card rounded-[23px] border border-[#e7e6ed] bg-white p-5 sm:p-6"
                >
                  <div className="flex items-center gap-3"><span className="grid size-11 place-items-center rounded-[14px] bg-navy-50 text-navy-600"><PinIcon className="size-5" /></span><h3 className="text-lg text-[#282731]">{branch.title}</h3></div>
                  <p className="mt-3 flex items-start gap-2.5 text-navy-700/85">
                    <PinIcon className="mt-1 size-5 text-navy-600" />
                    {branch.address}
                  </p>
                  <p className="mt-2 flex items-center gap-2.5 text-navy-700/85">
                    <ClockIcon className="size-5 text-navy-600" />
                    {site.workingHours}
                  </p>
                  <div className="mt-4 border-t border-[#eae9ee] pt-4">
                    <Button href={branch.mapUrl} variant="secondary" external>
                      مسیریابی
                    </Button>
                  </div>
                </div>
              ))}
              </div>

              <a
                href={site.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="interior-card flex items-center gap-3 rounded-[23px] border border-[#e7e6ed] bg-white p-5 transition-colors hover:border-navy-300"
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-[14px] bg-navy-50 text-navy-600"><InstagramIcon className="size-6" /></span>
                <span className="min-w-0 flex-1 text-right">
                  <span className="block font-bold text-navy-900">
                    نمونه کارهای بیشتر در اینستاگرام
                  </span>
                  <span className="mt-1 inline-block max-w-full break-all text-sm text-navy-600" dir="ltr">
                    @{site.instagramHandle}
                  </span>
                </span>
              </a>
            </div>
          </div>

          <div className="lg:col-span-7" id="quote">
            <div className="interior-card rounded-[28px] border border-[#e7e6ed] bg-white p-6 md:p-9">
              <span className="mb-5 block h-[3px] w-12 rounded-full bg-brand-yellow" aria-hidden="true" />
              <h2 className="text-2xl text-navy-900 md:text-3xl">
                {details.contactQuoteTitle}
              </h2>
              <p className="mt-3 leading-8 text-navy-700/80">
                فرم را پر کنید تا اطلاعات به‌صورت یک پیام آماده در واتساپ باز
                شود و شما فقط آن را ارسال کنید.
              </p>

              <ul className="mt-5 mb-7 flex flex-wrap gap-2">
                {["بدون هزینه", "بدون تعهد", "پاسخ سریع"].map((item) => (
                  <li
                    key={item}
                    className="flex items-center gap-1.5 rounded-full bg-navy-50 px-3 py-1.5 text-xs font-semibold text-navy-700"
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

      <Section tone="light" className="interior-soft-section">
        <SectionHeading
          title={details.contactLocationsTitle}
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
        <SectionHeading title={details.contactFaqTitle} />
        <div className="mt-12">
          <Faq items={contactFaq} />
        </div>
      </Section>
    </>
  );
}
