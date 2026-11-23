import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpLeft, BookOpenText, Clock3, Lightbulb, Ruler } from "lucide-react";
import { CtaSection } from "@/components/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Section } from "@/components/ui";
import { getPosts, getSiteSettings } from "@/lib/content-store";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "مقالات تابلوسازی | راهنمای قیمت، متریال و انتخاب تابلو تبلیغاتی",
  description:
    "راهنماهای کاربردی تابلوسازی مکث: نحوه محاسبه قیمت تابلو چلنیوم، تفاوت چلنیوم و کامپوزیت و نکات کلیدی انتخاب تابلو مغازه پیش از سفارش.",
  path: "/blog",
  keywords: ["مقالات تابلوسازی", "راهنمای تابلو تبلیغاتی", "آموزش انتخاب تابلو"],
});

const crumbs = [
  { name: "صفحه اصلی", url: "/" },
  { name: "مقالات", url: "/blog" },
];

export default async function BlogPage() {
  const [posts, site] = await Promise.all([getPosts(), getSiteSettings()]);

  const blogJsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `مقالات ${site.name}`,
    url: `${site.url}/blog`,
    inLanguage: "fa-IR",
    publisher: { "@id": `${site.url}/#organization` },
    blogPost: posts.map((post) => ({
      "@type": "BlogPosting",
      headline: post.title,
      url: `${site.url}/blog/${post.slug}`,
      datePublished: post.dateIso,
      description: post.excerpt,
    })),
  };

  return (
    <>
      <JsonLd data={[breadcrumbJsonLd(crumbs), blogJsonLd]} />

      <PageHero
        feature="blog"
        title="قبل از سفارش تابلو، این‌ها را بدانید"
        crumbs={crumbs}
        description="راهنماهایی که از دل بیست سال تجربه کارگاهی نوشته شده‌اند؛ بدون تبلیغات اضافه، فقط اطلاعاتی که به تصمیم بهتر شما کمک می‌کند."
      />

      <Section className="interior-soft-section">
        <div className="interior-pair-grid blog-list-grid grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {posts.map((post, index) => {
            const Icon = [BookOpenText, Ruler, Lightbulb][index % 3];
            return <Reveal key={post.slug} delay={Math.min(index * 65, 260)} className="h-full min-w-0">
              <article className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="interior-card group flex h-full flex-col overflow-hidden rounded-[26px] border border-[#e7e6ed] bg-white p-3"
                >
                  <div className="blog-cover relative flex aspect-[16/9] shrink-0 items-center justify-center overflow-hidden rounded-[19px]" data-blog-index={index % 3}>
                  {post.coverImage ? (<>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.coverImage}
                        alt=""
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                  </>) : <><span className="blog-cover-orbit" aria-hidden="true" /><Icon strokeWidth={1.15} className="relative z-10 size-9 transition-transform duration-500 group-hover:scale-110 sm:size-14" aria-hidden="true" /></>}
                  <span className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-[#2e2c34]">{post.category}</span>
                  </div>
                  <div className="blog-card-copy flex flex-1 flex-col px-3 pt-5 pb-3 sm:px-5">
                  <div className="flex flex-wrap items-center gap-2.5 text-[11px] text-[#777483]">
                    <time dateTime={post.dateIso}>{post.date}</time>
                    <span className="flex items-center gap-1"><Clock3 className="size-3.5" aria-hidden="true" />{post.readingTime} مطالعه</span>
                  </div>

                  <h2 className="mt-3 text-lg leading-relaxed text-[#282731] transition-colors group-hover:text-navy-600">
                    {post.title}
                  </h2>
                  <p className="mt-3 flex-1 text-sm leading-8 text-[#66646e]">
                    {post.excerpt}
                  </p>
                  <span className="mt-5 flex items-center justify-between gap-2 border-t border-[#eae9ee] pt-3 text-sm font-bold text-navy-600">
                    خواندن مقاله
                    <span className="grid size-9 place-items-center rounded-full bg-navy-50 text-navy-600 group-hover:bg-navy-600 group-hover:text-white"><ArrowUpLeft className="size-4" aria-hidden="true" /></span>
                  </span>
                  </div>
                </Link>
              </article>
            </Reveal>;
          })}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
