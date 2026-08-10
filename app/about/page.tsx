import type { Metadata } from "next";
import Image from "next/image";
import { CtaSection } from "@/components/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Card, CheckIcon, Section, SectionHeading } from "@/components/ui";
import { differentiators } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";
import { branches, site, stats } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "درباره تابلوسازی مکس | ۲۰ سال ساخت تابلو تبلیغاتی در مازندران",
  description:
    "داستان تابلوسازی مکس؛ دو دهه تجربه ساخت تابلو چلنیوم، کامپوزیت و حروف برجسته در بهشهر، نکا و سراسر مازندران. کارگاه مجهز، گارانتی کتبی و تعهد به کیفیت.",
  path: "/about",
  absoluteTitle: true,
  keywords: [
    "درباره تابلوسازی مکس",
    "تابلوسازی بهشهر",
    "تابلوسازی نکا",
    "سابقه تابلوسازی مازندران",
  ],
});

const crumbs = [
  { name: "صفحه اصلی", url: "/" },
  { name: "درباره ما", url: "/about" },
];

const values = [
  {
    title: "شفافیت در قیمت",
    description:
      "قیمت به‌صورت مکتوب با ریز متریال اعلام می‌شود و در طول اجرا تغییر نمی‌کند. هیچ هزینه‌ای وسط کار اضافه نمی‌شود.",
  },
  {
    title: "صداقت در پیشنهاد",
    description:
      "اگر گزینه ارزان‌تری برای شما مناسب‌تر باشد، همان را پیشنهاد می‌دهیم. فروش تابلوی گران‌تر هدف ما نیست.",
  },
  {
    title: "کیفیت در جزئیات نامرئی",
    description:
      "زیرسازی، آب‌بندی و کیفیت ماژول‌ها؛ چیزهایی که مشتری نمی‌بیند اما عمر تابلو را تعیین می‌کند.",
  },
  {
    title: "ماندن پای کار",
    description:
      "بعد از نصب هم در دسترس هستیم. پشتیبانی ما به اتمام پروژه ختم نمی‌شود.",
  },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="درباره ما"
        title={`${site.name}؛ ${site.experienceYearsFa} سال تابلو ساختن در مازندران`}
        crumbs={crumbs}
        description="ما یک کارگاه محلی هستیم، نه یک شرکت واسطه. تابلوی شما در کارگاه خودمان در بهشهر ساخته می‌شود و همان تیمی که آن را می‌سازد، نصبش می‌کند."
      />

      <Section>
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <div className="flex flex-col gap-6 text-base leading-9 text-navy-800 md:text-lg">
              <p>
                کار ما بیش از دو دهه پیش با یک کارگاه کوچک در بهشهر شروع شد؛
                زمانی که بیشتر تابلوهای مغازه‌های شهر هنوز دست‌ساز و رنگی بودند.
                از آن روزها تا امروز، هم فناوری تابلوسازی به‌کلی عوض شده و هم
                انتظار کسب‌وکارها از یک سردر حرفه‌ای.
              </p>
              <p>
                آنچه در این سال‌ها تغییر نکرده، اصل ساده‌ای است که کار را با آن
                شروع کردیم: تابلویی بسازیم که بعد از چند زمستان شمال هم همان‌طور
                تمیز و روشن بماند. در اقلیم مرطوب مازندران، این جمله بیشتر از
                یک شعار تبلیغاتی است؛ یعنی پروفیل گالوانیزه به‌جای آهن رنگ‌شده،
                یعنی آب‌بندی کامل درزها، یعنی ماژول LED گارانتی‌دار به‌جای
                ارزان‌ترین گزینه بازار.
              </p>
              <p>
                امروز مکس با دو شعبه در بهشهر و نکا و یک کارگاه مجهز به دستگاه
                برش CNC و خم‌کاری، پروژه‌های سراسر استان از ساری و قائم‌شهر تا
                آمل و بابل را اجرا می‌کند. از سردر یک مغازه ده‌متری تا بازسازی
                کامل نمای یک مجتمع تجاری.
              </p>
              <p>
                {`شعار ما «${site.motto}» است؛ چون در نهایت تنها معیار موفقیت یک تابلو این است که دیده شود.`}
              </p>
            </div>

            <dl className="mt-12 grid grid-cols-2 gap-5">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-card border border-navy-100 bg-navy-50 p-6"
                >
                  <dt className="text-sm text-navy-700/80">{stat.label}</dt>
                  <dd className="mt-2 text-3xl font-extrabold text-navy-600">
                    <span className="tabular" dir="ltr">
                      {stat.value}
                    </span>
                    <span className="mr-1 text-lg">{stat.suffix}</span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="sticky top-28 overflow-hidden rounded-card bg-navy-950 p-8 text-brand-white">
              <Image
                src="/logo-max-white.png"
                alt={`لوگوی ${site.name}`}
                width={908}
                height={262}
                className="h-12 w-auto"
              />
              <p className="mt-6 text-sm leading-8 text-brand-white/70">
                {site.tagline} — {site.slogan}
              </p>

              <div className="mt-8 space-y-5">
                {branches.map((branch) => (
                  <div
                    key={branch.id}
                    className="rounded-2xl border border-brand-white/10 bg-brand-white/5 p-5"
                  >
                    <p className="font-bold text-brand-yellow">{branch.title}</p>
                    <p className="mt-1.5 text-sm text-brand-white/75">
                      {branch.address}
                    </p>
                  </div>
                ))}
              </div>

              <p className="mt-8 text-sm text-brand-white/60">
                بنیان‌گذاران: {site.founders.join(" و ")}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="ارزش‌های ما"
          title="اصولی که سر آن‌ها کوتاه نمی‌آییم"
        />
        <div className="mt-14 grid gap-6 md:grid-cols-2">
          {values.map((value, index) => (
            <Reveal key={value.title} delay={index * 60}>
              <Card className="flex h-full gap-4">
                <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-yellow text-navy-900">
                  <CheckIcon />
                </span>
                <div>
                  <h3 className="text-lg text-navy-900">{value.title}</h3>
                  <p className="mt-2 text-sm leading-8 text-navy-700/80">
                    {value.description}
                  </p>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <SectionHeading
          tone="dark"
          eyebrow="چرا مکس"
          title="شش دلیل برای اینکه کار را به ما بسپارید"
        />
        <div className="mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {differentiators.map((item, index) => (
            <Reveal key={item.title} delay={index * 60}>
              <Card tone="dark" className="h-full">
                <h3 className="text-lg text-brand-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-8 text-brand-white/70">
                  {item.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
