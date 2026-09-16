import type { Metadata } from "next";
import Image from "next/image";
import { CtaSection } from "@/components/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Card, CheckIcon, Section, SectionHeading } from "@/components/ui";
import { getSiteSettings } from "@/lib/content-store";
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

export default async function AboutPage() {
  const site = await getSiteSettings();
  const { branches, stats } = site;

  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
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
                امروز مکث با دو شعبه در بهشهر و نکا و یک کارگاه مجهز به دستگاه
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
                  className="rounded-2xl border border-navy-100 bg-navy-50/60 p-5"
                >
                  <dt className="text-sm text-navy-600">{stat.label}</dt>
                  <dd className="mt-2 text-2xl font-extrabold text-navy-950">
                    {stat.value}
                    <span className="mr-1 text-base font-bold text-navy-600">
                      {stat.suffix}
                    </span>
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="relative aspect-[4/5] overflow-hidden rounded-card">
              <Image
                src="/images/services/chelnium.jpg"
                alt="کارگاه تابلوسازی مکث"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
            </div>
            <div className="mt-6 space-y-4">
              {branches.map((branch) => (
                <Card key={branch.id}>
                  <h3 className="text-lg text-navy-900">{branch.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-navy-700/80">
                    {branch.address}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading title="اصولی که با آن کار می‌کنیم" />
        <div className="mt-12 grid gap-5 md:grid-cols-2">
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

      <CtaSection />
    </>
  );
}
