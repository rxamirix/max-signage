import type { Metadata } from "next";
import Image from "next/image";
import { ArrowUpLeft, Handshake, MapPin, ShieldCheck, Sparkles, Wallet } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { MobileCardDetails } from "@/components/MobileCardDetails";
import { Reveal } from "@/components/Reveal";
import { Section, SectionHeading } from "@/components/ui";
import { getSiteSettings } from "@/lib/content-store";
import { defaultPageDetails } from "@/lib/home-content";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "درباره تابلوسازی مکث | ۲۰ سال ساخت تابلو تبلیغاتی در مازندران",
  description:
    "داستان تابلوسازی مکث؛ دو دهه تجربه ساخت تابلو چلنیوم، کامپوزیت و حروف برجسته در بهشهر، نکا و سراسر مازندران. کارگاه مجهز، گارانتی کتبی و تعهد به کیفیت.",
  path: "/about",
  absoluteTitle: true,
  keywords: [
    "درباره تابلوسازی مکث",
    "تابلوسازی بهشهر",
    "تابلوسازی نکا",
    "سابقه تابلوسازی مازندران",
  ],
});

const crumbs = [
  { name: "صفحه اصلی", url: "/" },
  { name: "درباره ما", url: "/about" },
];


export default async function AboutPage() {
  const site = await getSiteSettings();
  const { branches, stats } = site;
  const details = site.pageDetails ?? defaultPageDetails;
  const values = details.aboutValues;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        feature="about"
        title={`${site.name}؛ ${site.experienceYearsFa} سال تابلو ساختن در مازندران`}
        crumbs={crumbs}
        description="ما یک کارگاه محلی هستیم، نه یک شرکت واسطه. تابلوی شما در کارگاه خودمان در بهشهر ساخته می‌شود و همان تیمی که آن را می‌سازد، نصبش می‌کند."
      />

      <Section className="interior-soft-section">
        <div className="grid items-start gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="interior-card about-story-card rounded-[28px] border border-[#e7e6ed] bg-white p-6 sm:p-8 lg:p-9">
            <span className="mb-4 block h-[3px] w-10 rounded-full bg-navy-600" aria-hidden="true" />
            <h2 className="mb-5 text-2xl font-extrabold text-[#282731]">{details.aboutStoryTitle}</h2>
            <MobileCardDetails title={details.aboutStoryTitle} label="خواندن داستان مکث" preview={details.aboutStory[0]}>
            <div className="flex flex-col gap-5 text-sm leading-8 text-[#5e5c66] sm:text-base sm:leading-9">
              {details.aboutStory.map((paragraph, index) => <p key={index}>{paragraph}</p>)}
              <p>
                {`شعار ما «${site.motto}» است؛ چون در نهایت تنها معیار موفقیت یک تابلو این است که دیده شود.`}
              </p>
            </div>
            </MobileCardDetails>
            </div>

            <dl className="mt-5 grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="interior-card rounded-[20px] border border-[#e7e6ed] bg-white p-4 sm:p-5"
                >
                  <dt className="text-xs font-semibold text-[#777483] sm:text-sm">{stat.label}</dt>
                  <dd className="mt-2 text-2xl font-extrabold text-navy-600 sm:text-3xl">
                    {stat.value}
                    <span className="mr-1 text-sm font-bold text-[#55535e]">
                      {stat.suffix}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[5/4] overflow-hidden rounded-[25px] border border-white/80 shadow-lg shadow-navy-900/5">
              <Image
                src={site.aboutImage || "/images/services/chelnium.jpg"}
                alt="نمونه حروف برجسته چلنیوم"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" aria-hidden="true" />
            </div>
            <div className="interior-pair-grid about-branch-grid mt-5 grid grid-cols-2 gap-3 lg:grid-cols-1">
              {branches.map((branch) => (
                <article key={branch.id} className="interior-card flex items-center gap-3 rounded-[20px] border border-[#e7e6ed] bg-white p-4">
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-navy-50 text-navy-600"><MapPin className="size-5" aria-hidden="true" /></span>
                  <div className="min-w-0 flex-1"><h3 className="text-sm font-extrabold text-[#282731]">{branch.title}</h3>
                  <p className="mt-1 text-xs leading-6 text-[#66646e]">
                    {branch.address}
                  </p></div>
                  <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" aria-label={`نقشه ${branch.title}`} className="grid size-9 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-600 hover:bg-navy-100"><ArrowUpLeft className="size-4" aria-hidden="true" /></a>
                </article>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="dark" className="interior-dark-section">
        <SectionHeading title={details.aboutValuesTitle} tone="dark" />
        <div className="interior-pair-grid mt-10 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {values.map((value, index) => {
            const Icon = [Wallet, Handshake, Sparkles, ShieldCheck][index % 4];
            return <Reveal key={value.title} delay={index * 60} className="h-full">
              <article className="difference-card flex h-full flex-col rounded-[23px] border border-white/10 p-5 sm:p-6">
                <span className="mb-4 grid size-11 shrink-0 place-items-center rounded-xl bg-navy-600/30 text-navy-200 ring-1 ring-navy-400/20"><Icon className="size-5" aria-hidden="true" /></span>
                  <h3 className="text-base text-white">{value.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-white/75">
                    {value.description}
                  </p>
              </article>
            </Reveal>;
          })}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
