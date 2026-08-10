import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { JsonLd } from "@/components/JsonLd";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { MobileCarousel } from "@/components/MobileCarousel";
import { ServiceCarousel } from "@/components/ServiceCarousel";
import { Button, Card, Section, SectionHeading } from "@/components/ui";
import {
  differentiators,
  homeFaq,
  materials,
  processSteps,
  testimonials,
} from "@/lib/content";
import { locations } from "@/lib/locations";
import { posts } from "@/lib/posts";
import { getFeaturedProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/metadata";
import { faqJsonLd } from "@/lib/seo";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `تابلو تبلیغاتی در مازندران | چلنیوم، کامپوزیت و حروف برجسته — ${site.shortName}`,
  description: site.description,
  path: "/",
  absoluteTitle: true,
});

export default function HomePage() {
  const featured = getFeaturedProjects();

  return (
    <>
      <JsonLd data={faqJsonLd(homeFaq)} />
      <Hero />

      <Section id="services">
        <SectionHeading
          eyebrow="خدمات ما"
          title="هر نوع تابلو تبلیغاتی که کسب‌وکار شما لازم دارد"
          description="از سردر ساده مغازه تا نمای کامل یک مجتمع تجاری؛ طراحی، ساخت و نصب همه در کارگاه خودمان انجام می‌شود."
        />

        <ServiceCarousel services={services} />

        <div className="mt-12 text-center">
          <Button href="/services" variant="secondary" size="lg">
            مشاهده همه خدمات
          </Button>
        </div>
      </Section>

      <Section tone="muted" id="portfolio">
        <SectionHeading
          eyebrow="نمونه کارها"
          title="کارهایی که در مازندران اجرا کرده‌ایم"
          description="هر پروژه با شرایط خاص خودش شروع می‌شود. اینجا می‌بینید مسئله چه بود و ما چطور حلش کردیم."
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 md:gap-7 lg:grid-cols-4">
          {featured.map((project, index) => (
            <Reveal key={project.slug} delay={index * 70} className="h-full">
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/portfolio" variant="secondary" size="lg">
            مشاهده همه نمونه کارها
          </Button>
        </div>
      </Section>

      <Section tone="dark">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHeading
              tone="dark"
              align="start"
              eyebrow="چرا مکس"
              title="تفاوت ما در چیزهایی است که بعد از دو زمستان معلوم می‌شود"
              description="در روز تحویل، همه تابلوها زیبا به نظر می‌رسند. آنچه یک تابلوی خوب را از یک تابلوی ارزان جدا می‌کند، جزئیاتی است که دیده نمی‌شود: کیفیت ماژول، زیرسازی و آب‌بندی."
            />
            <div className="mt-8">
              <Button href="/about" variant="primary">
                بیشتر درباره ما بدانید
              </Button>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
            {differentiators.map((item, index) => (
              <Reveal key={item.title} delay={index * 60} className="h-full">
                <Card tone="dark" className="flex h-full flex-col">
                  <h3 className="line-clamp-2 text-lg text-brand-white">
                    {item.title}
                  </h3>
                  <p className="mt-3 line-clamp-4 flex-1 text-sm leading-8 text-brand-white/70">
                    {item.description}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <Section id="process">
        <SectionHeading
          eyebrow="نحوه کار"
          title="از اولین تماس تا تحویل نهایی"
          description="فرآیند ما شفاف است و در هر مرحله دقیقاً می‌دانید چه اتفاقی می‌افتد و چقدر طول می‌کشد."
        />

        <ol className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
          {processSteps.map((step, index) => (
            <li key={step.step} className="h-full">
              <Reveal delay={index * 60} className="h-full">
                <Card className="relative flex h-full flex-col">
                  <span className="absolute -top-4 right-6 grid size-11 place-items-center rounded-full bg-brand-yellow text-lg font-extrabold text-navy-900 shadow-lg shadow-brand-yellow/30">
                    {step.step}
                  </span>
                  <h3 className="mt-4 line-clamp-2 text-lg text-navy-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 line-clamp-4 flex-1 text-sm leading-8 text-navy-700/80">
                    {step.description}
                  </p>
                  <p className="mt-4 self-center rounded-full bg-navy-50 px-4 py-1.5 text-center text-[0.7875rem] font-bold text-navy-600">
                    {step.duration}
                  </p>
                </Card>
              </Reveal>
            </li>
          ))}
        </ol>
      </Section>

      <Section tone="muted" id="materials">
        <SectionHeading
          eyebrow="متریال"
          title="با چه چیزی تابلوی شما را می‌سازیم"
          description="کیفیت نهایی تابلو مستقیماً به متریال بستگی دارد. اینجا دقیقاً می‌گوییم از چه چیزی استفاده می‌کنیم و چرا."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {materials.slice(0, 4).map((material, index) => (
            <Reveal key={material.name} delay={index * 60} className="h-full">
              <Card className="flex h-full flex-col">
                <span className="text-xs font-bold text-navy-600">
                  {material.category}
                </span>
                <h3 className="mt-2 line-clamp-2 text-lg text-navy-900">
                  {material.name}
                </h3>
                <p className="mt-3 line-clamp-4 flex-1 text-sm leading-8 text-navy-700/80">
                  {material.description}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button href="/materials" variant="secondary" size="lg">
            جدول کامل متریال و مشخصات
          </Button>
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="نظر مشتریان"
          title="آنچه کسب‌وکارهای مازندران درباره ما می‌گویند"
        />

        <MobileCarousel desktopClassName="sm:grid sm:grid-cols-2 lg:grid-cols-4">
          {testimonials.map((item) => (
            <Card
              key={item.name}
              className="flex h-full flex-col overflow-hidden"
            >
              <span
                className="text-4xl leading-none text-brand-yellow"
                aria-hidden="true"
              >
                ”
              </span>
              <p className="mt-3 line-clamp-5 flex-1 text-sm leading-8 text-navy-700/85">
                {item.text}
              </p>
              <div className="mt-5 border-t border-navy-100 pt-4">
                <p className="font-bold text-navy-900">{item.name}</p>
                <p className="text-sm text-navy-600">{item.business}</p>
              </div>
            </Card>
          ))}
        </MobileCarousel>
      </Section>

      <Section tone="navy">
        <SectionHeading
          tone="dark"
          eyebrow="پوشش خدمات"
          title="در کدام شهرهای مازندران خدمات می‌دهیم"
          description="کارگاه ما در بهشهر و شعبه دوم در نکاست، اما پروژه‌های ما در سراسر استان اجرا می‌شود."
        />

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {locations.map((location) => (
            <Link
              key={location.slug}
              href={`/${location.slug}`}
              className="group flex items-center justify-between gap-4 rounded-2xl border border-brand-white/15 bg-brand-white/5 px-6 py-5 transition-all duration-300 hover:border-brand-yellow/50 hover:bg-brand-white/10"
            >
              <span>
                <span className="block font-bold text-brand-white">
                  تابلو تبلیغاتی {location.city}
                </span>
                <span className="mt-1 block text-sm text-brand-white/60">
                  نزدیک‌ترین شعبه: {location.nearestBranch}
                </span>
              </span>
              <span
                aria-hidden="true"
                className="grid size-9 shrink-0 place-items-center rounded-full bg-brand-yellow/15 text-brand-yellow transition-colors group-hover:bg-brand-yellow group-hover:text-navy-900"
              >
                <svg viewBox="0 0 20 20" className="size-4">
                  <path
                    d="M12 4 6 10l6 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    fill="none"
                  />
                </svg>
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="muted">
        <SectionHeading
          eyebrow="مقالات"
          title="قبل از سفارش تابلو، این‌ها را بخوانید"
          description="راهنماهای کاربردی درباره قیمت، متریال و انتخاب درست تابلو برای کسب‌وکار شما."
        />

        <div className="mt-14 grid gap-7 md:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 70} className="h-full">
              <Link
                href={`/blog/${post.slug}`}
                className="group flex h-full flex-col rounded-card border border-navy-100 bg-brand-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-navy-300 hover:shadow-2xl hover:shadow-navy-900/10"
              >
                <div className="flex items-center gap-3 text-xs text-navy-600">
                  <span className="rounded-full bg-navy-50 px-3 py-1 font-bold">
                    {post.category}
                  </span>
                  <span>{post.readingTime} مطالعه</span>
                </div>
                <h3 className="mt-4 line-clamp-2 min-h-[3.5rem] text-lg leading-8 text-navy-900 transition-colors group-hover:text-navy-600">
                  {post.title}
                </h3>
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-8 text-navy-700/75">
                  {post.excerpt}
                </p>
                <span className="mt-5 text-sm font-bold text-navy-600">
                  مشاهده بیشتر
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section>
        <SectionHeading
          eyebrow="سوالات متداول"
          title="پرتکرارترین سوال‌هایی که از ما می‌پرسند"
        />
        <div className="mt-12">
          <Faq items={homeFaq} />
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
