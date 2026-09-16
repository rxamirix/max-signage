import type { Metadata } from "next";
import Link from "next/link";
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
        title="قبل از سفارش تابلو، این‌ها را بدانید"
        crumbs={crumbs}
        description="راهنماهایی که از دل بیست سال تجربه کارگاهی نوشته شده‌اند؛ بدون تبلیغات اضافه، فقط اطلاعاتی که به تصمیم بهتر شما کمک می‌کند."
      />

      <Section>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <Reveal key={post.slug} delay={index * 70}>
              <article className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="group flex h-full flex-col overflow-hidden rounded-card border border-navy-100 bg-brand-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-300 hover:shadow-2xl hover:shadow-navy-900/10"
                >
                  {post.coverImage ? (
                    <div className="aspect-[16/10] overflow-hidden bg-navy-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={post.coverImage}
                        alt=""
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    </div>
                  ) : null}
                  <div className="flex flex-1 flex-col p-7">
                  <div className="flex flex-wrap items-center gap-3 text-xs text-navy-600">
                    <span className="rounded-full bg-navy-50 px-3 py-1 font-bold">
                      {post.category}
                    </span>
                    <time dateTime={post.dateIso}>{post.date}</time>
                    <span>{post.readingTime} مطالعه</span>
                  </div>

                  <h2 className="mt-4 text-xl leading-9 text-navy-900 transition-colors group-hover:text-navy-600">
                    {post.title}
                  </h2>
                  <p className="mt-4 flex-1 leading-8 text-navy-700/80">
                    {post.excerpt}
                  </p>
                  <span className="mt-6 inline-flex items-center gap-2 font-bold text-navy-600">
                    خواندن مقاله
                    <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true">
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
                  </div>
                </Link>
              </article>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
