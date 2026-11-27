import Link from "next/link";
import { ArrowUpLeft, BookOpenText, Ruler, Lightbulb, Clock3, CircleHelp } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { Hero } from "@/components/Hero";
import { HomeSnapSlider } from "@/components/HomeSnapSlider";
import { MobileCardDetails } from "@/components/MobileCardDetails";
import { MaterialDetailContent } from "@/components/MaterialDetailContent";
import { JsonLd } from "@/components/JsonLd";
import { ProjectCard } from "@/components/ProjectCard";
import { Reveal } from "@/components/Reveal";
import { HomeCoverFlow } from "@/components/HomeCoverFlow";
import HowItWorks from "@/components/ui/how-it-works";
import { Testimonials } from "@/components/ui/testimonials-columns-1";
import { Button, Section, SectionHeading } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
import { faqJsonLd } from "@/lib/seo";
import { serviceCoverItems } from "@/lib/service-images";
import { defaultHomeSections } from "@/lib/home-content";
import {
  getDifferentiators,
  getFaq,
  getFeaturedProjects,
  getMaterials,
  getPosts,
  getProcessSteps,
  getServices,
  getSiteSettings,
  getTestimonials,
} from "@/lib/content-store";

export async function generateMetadata() {
  const site = await getSiteSettings();
  return pageMetadata({
    title: `تابلو تبلیغاتی در مازندران | چلنیوم، کامپوزیت و حروف برجسته — ${site.shortName}`,
    description: site.description,
    path: "/",
    absoluteTitle: true,
  });
}

export default async function HomePage() {
  const [
    site,
    featured,
    differentiators,
    homeFaq,
    materials,
    processSteps,
    posts,
    testimonials,
    services,
  ] = await Promise.all([
    getSiteSettings(),
    getFeaturedProjects(),
    getDifferentiators(),
    getFaq(),
    getMaterials(),
    getProcessSteps(),
    getPosts(),
    getTestimonials(),
    getServices(),
  ]);

  const howItWorksSteps = processSteps.map((step) => ({
    image: step.image,
    title: step.title,
    description: step.description,
    duration: step.duration,
    note: step.note,
  }));
  const sections = site.homeSections ?? defaultHomeSections;

  return (
    <>
      <JsonLd data={faqJsonLd(homeFaq)} />
      <Hero settings={site} />

      <div id="services" className="relative -mt-1 bg-brand-white pt-10 md:mt-0 md:pt-24">
        <div className="container-page">
          <SectionHeading
            title={sections.services.title}
            description={sections.services.description}
          />
        </div>

        <HomeCoverFlow items={serviceCoverItems(services)} />

        <div className="px-4 pb-10 text-center md:pb-20">
          <Button href="/services" variant="primary" className="home-view-all">
            مشاهده همه خدمات
          </Button>
        </div>
      </div>

      <Section tone="muted" id="portfolio" className="home-portfolio-section">
        <SectionHeading
          title={sections.portfolio.title}
          description={sections.portfolio.description}
        />

        <div className="mt-5 md:mt-8">
          <HomeSnapSlider
            ariaLabel="نمونه کارها"
            slideClassName="w-[46%] sm:w-[min(45vw,21rem)] lg:w-[min(30vw,23rem)]"
          >
            {featured.map((project) => (
              <ProjectCard key={project.slug} project={project} />
            ))}
          </HomeSnapSlider>
        </div>

        <div className="mt-5 text-center md:mt-10">
          <Button href="/portfolio" variant="primary" className="home-view-all">
            مشاهده همه نمونه کارها
          </Button>
        </div>
      </Section>

      <Section tone="dark" id="why-max" className="home-difference-section">
        <div className="grid gap-7 sm:gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="relative lg:col-span-5">
            <div className="mb-4 h-1 w-12 rounded-full bg-brand-yellow sm:mb-6 sm:w-16" aria-hidden="true" />
            <SectionHeading
              tone="dark"
              align="start"
              title={sections.difference.title}
              description={sections.difference.description}
            />
            <div className="mt-5 sm:mt-8">
              <Button href="/about" variant="outline">
                بیشتر درباره ما بدانید
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2.5 sm:gap-4 lg:col-span-7">
            {differentiators.map((item, index) => (
              <Reveal key={item.title} delay={index * 60} className="h-full">
                <div className="difference-card flex h-full flex-col rounded-[17px] border border-white/10 p-3 sm:rounded-[24px] sm:p-6">
                  <div className="mb-4 flex items-center justify-between"><span className={index === 0 ? "grid size-9 place-items-center rounded-full bg-brand-yellow font-extrabold text-[#292831]" : "grid size-9 place-items-center rounded-full bg-navy-600/25 font-extrabold text-navy-200 ring-1 ring-navy-400/30"}>{String(index + 1).padStart(2, '0')}</span><span className="h-px flex-1 mr-4 bg-white/10" aria-hidden="true" /></div>
                  <h3 className="text-[13px] leading-6 text-brand-white sm:text-lg sm:leading-7">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 flex-1 text-xs leading-5 text-brand-white/75 sm:mt-3 sm:line-clamp-none sm:text-sm sm:leading-8">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      <section id="process" className="home-process-section relative overflow-hidden pt-16 pb-0 md:pt-24">
        <div className="container-page relative z-10">
          <SectionHeading
            title={sections.process.title}
            description={sections.process.description}
          />
        </div>
        <HowItWorks features={howItWorksSteps} />
      </section>

      <Section tone="light" id="materials" className="home-materials-section">
        <SectionHeading
          title={sections.materials.title}
          description={sections.materials.description}
        />

        <div className="mt-5 grid grid-cols-2 gap-2.5 sm:mt-12 sm:gap-5 lg:grid-cols-4">
          {materials.slice(0, 4).map((material, index) => (
            <Reveal key={material.name} delay={index * 60} className="h-full">
              <MobileCardDetails title={material.name} cardTrigger={
              <article className="material-home-card flex h-full flex-col rounded-[17px] border border-[#e8e6df] bg-white p-2 sm:rounded-[25px] sm:p-3">
                <div className="material-swatch relative aspect-[2/1] overflow-hidden rounded-[12px] sm:aspect-[5/3] sm:rounded-[17px]" data-material-index={index} aria-hidden="true">{material.image ? <img src={material.image} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <><span /><span /><span /></>}</div>
                <div className="flex flex-1 flex-col px-1 pt-2.5 pb-1.5 sm:px-3 sm:pt-4 sm:pb-3">
                <span className="w-fit rounded-full bg-navy-50 px-2 py-0.5 text-[9px] font-bold text-navy-700 sm:px-2.5 sm:py-1 sm:text-xs">
                  {material.category}
                </span>
                <h3 className="mt-1.5 text-[13px] text-[#25252c] sm:mt-3 sm:min-h-10 sm:text-lg">
                  {material.name}
                </h3>
                <p className="mt-1 line-clamp-2 flex-1 text-xs leading-5 text-[#64636a] sm:mt-3 sm:line-clamp-4 sm:text-sm sm:leading-7">
                  {material.description}
                </p>
                <ul className="mt-4 hidden flex-wrap gap-1.5 border-t border-[#eae8e2] pt-3 sm:flex">
                  {material.properties.slice(0, 2).map(property => <li key={property} className="rounded-full border border-[#e8e6df] bg-[#f8f7f4] px-2 py-1 text-[10px] font-semibold text-[#4a494e]">{property}</li>)}
                </ul>
                <span className="brand-action-direct mt-3 flex items-center justify-between px-2 py-2 text-[10px] font-bold sm:text-xs">مشاهده جزئیات <ArrowUpLeft className="size-3.5" aria-hidden="true" /></span>
                </div>
              </article>
              }>
                <MaterialDetailContent material={material} />
              </MobileCardDetails>
            </Reveal>
          ))}
        </div>

        <div className="mt-6 rounded-[25px] border border-navy-100 bg-white p-4 sm:mt-10 sm:p-6">
          <h3 className="text-lg font-bold text-navy-900">راهنمای انتخاب</h3>
          <ul className="mt-3 grid gap-2 text-sm leading-7 text-navy-900 md:grid-cols-2">
            <li>ترکیب نمای کامپوزیت و حروف چلنیوم: گزینه متعادل برای اغلب مغازه‌ها</li>
            <li>استیل ۳۰۴ با نورپردازی آندریک: مناسب برندهای لوکس و نماهای سنگ</li>
          </ul>
        </div>

        <div className="mt-7 text-center sm:mt-12">
          <Button href="/materials" variant="secondary" className="home-view-all">
            جدول کامل متریال و مشخصات
          </Button>
        </div>
      </Section>

      <Testimonials items={testimonials} heading={sections.testimonials} />

      <Section tone="light" id="blog" className="home-blog-section">
        <SectionHeading
          title={sections.blog.title}
          description={sections.blog.description}
        />

        <div className="mt-5 sm:mt-10">
          <HomeSnapSlider ariaLabel="مقالات" className="home-blog-slider" slideClassName="w-[46%] sm:w-[min(45vw,20rem)] md:w-[calc((100%_-_2.5rem)/3)]">
          {posts.slice(0, 3).map((post, index) => {
            const ArticleIcon = [BookOpenText, Ruler, Lightbulb][index];
            return (
            <Reveal key={post.slug} delay={index * 70} className="h-full">
              <Link
                href={`/blog/${post.slug}`}
                className="home-blog-card group flex h-full flex-col rounded-[17px] border border-[#e5e5e9] bg-white p-2 sm:rounded-[27px] sm:p-3"
              >
                <div className="blog-cover relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-[12px] sm:aspect-[16/8] sm:rounded-[19px]" data-blog-index={index}>
                  {post.coverImage ? <img src={post.coverImage} alt="" className="absolute inset-0 h-full w-full object-cover" /> : <><span className="blog-cover-orbit" aria-hidden="true" />
                  <ArticleIcon strokeWidth={1.1} className="relative z-10 size-9 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110 sm:size-[62px]" aria-hidden="true" /></>}
                  <span className="absolute top-1.5 right-1.5 rounded-full bg-white/95 px-2 py-0.5 text-[9px] font-bold text-[#2e2c34] sm:top-3 sm:right-3 sm:px-3 sm:py-1 sm:text-xs">{post.category}</span>
                </div>
                <div className="flex flex-1 flex-col px-1 pt-2.5 pb-1.5 sm:px-4 sm:pt-4 sm:pb-3">
                <div className="flex items-center gap-1 text-[10px] text-[#77747f] sm:text-xs"><Clock3 className="size-3 sm:size-3.5" aria-hidden="true" />{post.readingTime} مطالعه</div>
                <h3 className="mt-1.5 line-clamp-2 min-h-[2.7rem] text-[13px] leading-[1.65] text-[#23232b] transition-colors group-hover:text-navy-600 sm:mt-3 sm:min-h-[3.5rem] sm:text-lg sm:leading-8">
                  {post.title}
                </h3>
                <p className="mt-2 hidden flex-1 text-sm leading-7 text-[#605f68] sm:line-clamp-3">
                  {post.excerpt}
                </p>
                <span className="mt-2 flex items-center justify-between gap-1 border-t border-[#ecebf0] pt-2 text-[10px] font-bold text-navy-600 sm:mt-5 sm:gap-2 sm:pt-3 sm:text-sm">
                  مطالعه مقاله <span className="grid size-6 place-items-center rounded-full bg-navy-50 text-navy-600 transition-colors group-hover:bg-navy-600 group-hover:text-white sm:size-9"><ArrowUpLeft className="size-3 sm:size-4" aria-hidden="true" /></span>
                </span>
                </div>
              </Link>
            </Reveal>
          );})}
          </HomeSnapSlider>
        </div>
        <div className="mt-5 text-center sm:mt-9"><Button href="/blog" variant="secondary" className="home-view-all">همه مقالات</Button></div>
      </Section>

      <Section id="faq" className="home-faq-section">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.3fr)] lg:gap-14">
          <div className="faq-intro flex flex-col items-center rounded-[28px] border border-[#e8e7ee] bg-white px-6 py-8 text-center sm:px-8 sm:py-10 lg:sticky lg:top-28">
            <div className="grid size-12 place-items-center rounded-[16px] bg-navy-50 text-navy-600"><CircleHelp className="size-6" strokeWidth={2} aria-hidden="true" /></div>
            <h2 className="mt-5 max-w-[20rem] text-balance text-[clamp(1.4rem,2.05vw,1.85rem)] font-extrabold leading-[1.55] text-navy-900">{sections.faq.title}</h2>
            <p className="mt-3 max-w-[19rem] text-pretty text-sm leading-7 text-[#64636d]">{sections.faq.description}</p>
            <div className="mt-6"><Button href="/contact" variant="secondary">سوال دیگری دارید؟</Button></div>
          </div>
          <Faq items={homeFaq} />
        </div>
      </Section>

      <CtaSection trustBadges={site.trustBadges} {...sections.cta} />
    </>
  );
}
