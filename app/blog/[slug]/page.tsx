import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaSection } from "@/components/CtaSection";
import { Faq } from "@/components/Faq";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Section, SectionHeading } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
import { getPost, posts } from "@/lib/posts";
import { articleJsonLd, breadcrumbJsonLd, faqJsonLd } from "@/lib/seo";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};

  return pageMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    absoluteTitle: true,
    keywords: post.keywords,
    type: "article",
    publishedTime: post.dateIso,
  });
}

export default async function BlogPostPage({ params }: Params) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();

  const others = posts.filter((item) => item.slug !== post.slug);

  const crumbs = [
    { name: "صفحه اصلی", url: "/" },
    { name: "مقالات", url: "/blog" },
    { name: post.title, url: `/blog/${post.slug}` },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          articleJsonLd({
            title: post.title,
            description: post.metaDescription,
            url: `${site.url}/blog/${post.slug}`,
            datePublished: post.dateIso,
          }),
          faqJsonLd(post.faq),
        ]}
      />

      <PageHero
        eyebrow={post.category}
        title={post.title}
        crumbs={crumbs}
        description={
          <span className="flex flex-wrap items-center gap-4 text-sm text-brand-white/60">
            <time dateTime={post.dateIso}>{post.date}</time>
            <span aria-hidden="true">•</span>
            <span>{post.readingTime} مطالعه</span>
          </span>
        }
      />

      <Section>
        <article className="mx-auto max-w-3xl">
          <p className="border-r-4 border-brand-yellow bg-navy-50 p-6 text-lg leading-9 text-navy-800 md:text-xl md:leading-10">
            {post.lead}
          </p>

          <nav aria-label="فهرست مطالب" className="mt-10 rounded-card border border-navy-100 p-6">
            <h2 className="text-lg text-navy-900">فهرست مطالب</h2>
            <ol className="mt-4 space-y-2 text-navy-700/85">
              {post.sections.map((section, index) => (
                <li key={section.heading}>
                  <a
                    href={`#section-${index}`}
                    className="transition-colors hover:text-navy-600 hover:underline"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ol>
          </nav>

          <div className="mt-12 flex flex-col gap-12">
            {post.sections.map((section, index) => (
              <section key={section.heading} id={`section-${index}`}>
                <h2 className="text-2xl text-navy-900 md:text-3xl">
                  {section.heading}
                </h2>

                {section.body ? (
                  <div className="mt-5 flex flex-col gap-5 text-base leading-9 text-navy-800 md:text-lg">
                    {section.body.map((paragraph) => (
                      <p key={paragraph.slice(0, 24)}>{paragraph}</p>
                    ))}
                  </div>
                ) : null}

                {section.list ? (
                  <ul className="mt-6 flex flex-col gap-3">
                    {section.list.map((item) => (
                      <li
                        key={item}
                        className="flex items-start gap-3 rounded-2xl border border-navy-100 bg-navy-50/60 p-4 leading-8 text-navy-800"
                      >
                        <span className="mt-3 size-1.5 shrink-0 rounded-full bg-brand-yellow" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : null}

                {section.table ? (
                  <div className="mt-6 overflow-x-auto">
                    <table className="w-full min-w-[36rem] border-collapse overflow-hidden rounded-2xl">
                      <thead>
                        <tr className="bg-navy-600 text-brand-white">
                          {section.table.head.map((cell) => (
                            <th
                              key={cell}
                              scope="col"
                              className="px-4 py-3 text-start text-sm font-bold"
                            >
                              {cell}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        {section.table.rows.map((row) => (
                          <tr
                            key={row[0]}
                            className="border-b border-navy-100 last:border-0 even:bg-navy-50/60"
                          >
                            {row.map((cell, cellIndex) => (
                              <td
                                key={cell}
                                className={
                                  cellIndex === 0
                                    ? "px-4 py-3 font-bold text-navy-900"
                                    : "px-4 py-3 text-navy-700/85"
                                }
                              >
                                {cell}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : null}
              </section>
            ))}
          </div>
        </article>
      </Section>

      <Section tone="muted">
        <SectionHeading eyebrow="سوالات متداول" title="سوال‌های مرتبط با این مقاله" />
        <div className="mt-12">
          <Faq items={post.faq} />
        </div>
      </Section>

      <Section>
        <SectionHeading eyebrow="ادامه مطالعه" title="مقالات دیگر" align="start" />
        <div className="mt-8 grid gap-6 md:grid-cols-2">
          {others.map((item) => (
            <Link
              key={item.slug}
              href={`/blog/${item.slug}`}
              className="group rounded-card border border-navy-100 p-6 transition-all hover:-translate-y-1 hover:border-navy-300 hover:shadow-xl hover:shadow-navy-900/5"
            >
              <span className="text-xs font-bold text-navy-600">
                {item.category}
              </span>
              <h3 className="mt-2 text-lg leading-8 text-navy-900 transition-colors group-hover:text-navy-600">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-8 text-navy-700/75">
                {item.excerpt}
              </p>
            </Link>
          ))}
        </div>
      </Section>

      <CtaSection />
    </>
  );
}
