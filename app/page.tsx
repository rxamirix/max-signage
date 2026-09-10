import type { Metadata } from "next";
import Link from "next/link";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { HomeSnapSlider } from "@/components/HomeSnapSlider";
import { JsonLd } from "@/components/JsonLd";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { HomeCoverFlow } from "@/components/HomeCoverFlow";
import HowItWorks from "@/components/ui/how-it-works";
import { Testimonials } from "@/components/ui/testimonials-columns-1";
import { Button, Card, Section, SectionHeading } from "@/components/ui";
import {
  differentiators,
  homeFaq,
  howItWorksSteps,
  materials,
} from "@/lib/content";
import { posts } from "@/lib/posts";
import { getFeaturedProjects } from "@/lib/projects";
import { pageMetadata } from "@/lib/metadata";
import { faqJsonLd } from "@/lib/seo";
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

      <div id="services" className="relative -mt-1 bg-brand-white pt-10 md:mt-0 md:pt-24">
        <div className="container-page">
          <SectionHeading
            title="هر نوع تابلو تبلیغاتی که کسب‌وکار شما لازم دارد"
            description="از سردر ساده مغازه تا نمای کامل یک مجتمع تجاری؛ طراحی، ساخت و نصب همه در کارگاه خودمان انجام می‌شود."
          />
        </div>

        <HomeCoverFlow />

        <div className="px-4 pb-16 text-center md:pb-20">
          <Button href="/services" variant="primary" size="lg">
            مشاهده همه خدمات
          </Button>
        </div>
      </div>

      <Section tone="muted" id="portfolio">
        <SectionHeading
          title="کارهایی که در مازندران اجرا کرده‌ایم"
          description="هر پروژه با شرایط خاص خودش شروع می‌شود. اینجا می‌بینید مسئله چه بود و ما چطور حلش کردیم."
        />

        <div className="mt-8 md:mt-12">
          <HomeSnapSlider
            ariaLabel="نمونه کارها"
            slideClassName="w-[min(58vw,14.5rem)] sm:w-[min(42vw,17rem)] lg:w-[min(24vw,19rem)]"
          >
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </HomeSnapSlider>
        </div>

        <div className="mt-8 text-center md:mt-10">
          <Button href="/portfolio" variant="secondary" size="lg">
            مشاهده همه نمونه کارها
          </Button>
        </div>
      </Section>

      <Section tone="dark" id="why-max">
        <div className="grid gap-10 lg:grid-cols-12 lg:gap-10">
          <div className="lg:col-span-5">
            <SectionHeading
              tone="dark"
              align="start"
              title="تفاوت ما در چیزهایی است که بعد از دو زمستان معلوم می‌شود"
              description="در روز تحویل، همه تابلوها زیبا به نظر می‌رسند. آنچه یک تابلوی خوب را از یک تابلوی ارزان جدا می‌کند، جزئیاتی است که دیده نمی‌شود: کیفیت ماژول، زیرسازی و آب‌بندی."
            />
            <div className="mt-8">
              <Button href="/about" variant="primary">
                بیشتر درباره ما بدانید
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:gap-5 lg:col-span-7">
            {differentiators.map((item, index) => (
              <Reveal key={item.title} delay={index * 60} className="h-full">
                <Card tone="dark" className="flex h-full flex-col !p-4 sm:!p-6">
                  <h3 className="line-clamp-2 text-sm text-brand-white sm:text-lg">
                    {item.title}
                  </h3>
                  <p className="mt-2 line-clamp-4 flex-1 text-xs leading-6 text-brand-white/70 sm:mt-3 sm:text-sm sm:leading-8">
                    {item.description}
                  </p>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <section id="process" className="bg-white pt-16 pb-0 md:pt-24">
        <div className="container-page">
          <SectionHeading
            title="از اولین تماس تا تحویل نهایی"
            description="فرآیند ما شفاف است و در هر مرحله دقیقاً می‌دانید چه اتفاقی می‌افتد و چقدر طول می‌کشد."
          />
        </div>
        <HowItWorks features={howItWorksSteps} />
      </section>

      <Section tone="muted" id="materials">
        <SectionHeading
          title="با چه چیزی تابلوی شما را می‌سازیم"
          description="کیفیت نهایی تابلو مستقیماً به متریال بستگی دارد. اینجا دقیقاً می‌گوییم از چه چیزی استفاده می‌کنیم و چرا."
        />

        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-14 sm:gap-5 lg:grid-cols-4">
          {materials.slice(0, 4).map((material, index) => (
            <Reveal key={material.name} delay={index * 60} className="h-full">
              <Card className="flex h-full flex-col !p-4 sm:!p-6">
                <span className="text-[0.65rem] font-bold text-navy-600 sm:text-xs">
                  {material.category}
                </span>
                <h3 className="mt-1.5 line-clamp-2 text-sm text-navy-900 sm:mt-2 sm:text-lg">
                  {material.name}
                </h3>
                <p className="mt-2 line-clamp-4 flex-1 text-xs leading-6 text-navy-700/80 sm:mt-3 sm:text-sm sm:leading-8">
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

      <Testimonials />

      <Section tone="muted" id="blog">
        <SectionHeading
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

      <Section id="faq">
        <SectionHeading title="پرتکرارترین سوال‌هایی که از ما می‌پرسند" />
        <div className="mt-12">
          <Faq items={homeFaq} />
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
