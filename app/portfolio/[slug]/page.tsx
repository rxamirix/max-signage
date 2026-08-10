import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CtaSection } from "@/components/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { ProjectCard } from "@/components/ProjectCard";
import { Section, SectionHeading } from "@/components/ui";
import { pageMetadata } from "@/lib/metadata";
import { getProject, projects } from "@/lib/projects";
import { breadcrumbJsonLd, creativeWorkJsonLd } from "@/lib/seo";
import { getService } from "@/lib/services";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return projects.map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const title = `${project.title} | نمونه کار تابلوسازی مکس`;

  return pageMetadata({
    title,
    description: project.summary,
    path: `/portfolio/${project.slug}`,
    absoluteTitle: true,
    keywords: [
      project.title,
      `تابلو ${project.city}`,
      `${project.category} ${project.city}`,
      "نمونه کار تابلوسازی",
    ],
    image: project.gallery[0]?.src,
    imageAlt: project.gallery[0]?.alt ?? project.title,
    type: "article",
  });
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const service = getService(project.serviceSlug);
  const related = projects
    .filter((item) => item.slug !== project.slug)
    .filter(
      (item) =>
        item.serviceSlug === project.serviceSlug || item.city === project.city,
    )
    .slice(0, 3);

  const crumbs = [
    { name: "صفحه اصلی", url: "/" },
    { name: "نمونه کارها", url: "/portfolio" },
    { name: project.title, url: `/portfolio/${project.slug}` },
  ];

  const story = [
    { heading: "صورت مسئله", body: project.challenge },
    { heading: "راه‌حل ما", body: project.solution },
    { heading: "نتیجه", body: project.result },
  ];

  return (
    <>
      <JsonLd
        data={[
          breadcrumbJsonLd(crumbs),
          creativeWorkJsonLd({
            name: project.title,
            description: project.summary,
            url: `${site.url}/portfolio/${project.slug}`,
            image: project.gallery[0].src,
            city: project.city,
          }),
        ]}
      />

      <PageHero
        eyebrow={`${project.category} • ${project.city}`}
        title={project.title}
        crumbs={crumbs}
        description={project.summary}
      />

      <Section>
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <div className="overflow-hidden rounded-card border border-navy-100">
              <Image
                src={project.gallery[0].src}
                alt={project.gallery[0].alt}
                width={1200}
                height={800}
                priority
                sizes="(max-width: 1024px) 100vw, 66vw"
                className="w-full"
              />
            </div>

            <div className="mt-12 flex flex-col gap-10">
              {story.map((item) => (
                <div key={item.heading}>
                  <h2 className="text-2xl text-navy-900 md:text-3xl">
                    {item.heading}
                  </h2>
                  <p className="mt-4 text-base leading-9 text-navy-800 md:text-lg">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>

            {project.gallery.length > 1 ? (
              <div className="mt-12 grid gap-5 sm:grid-cols-2">
                {project.gallery.slice(1).map((image) => (
                  <div
                    key={image.src}
                    className="overflow-hidden rounded-card border border-navy-100"
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={1200}
                      height={800}
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="w-full"
                    />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <aside className="lg:col-span-4">
            <div className="sticky top-28 flex flex-col gap-6">
              <div className="rounded-card border border-navy-100 bg-navy-50 p-6">
                <h2 className="text-lg text-navy-900">مشخصات پروژه</h2>
                <dl className="mt-4 divide-y divide-navy-200/60">
                  <div className="flex items-start justify-between gap-4 py-3">
                    <dt className="text-sm text-navy-700/80">کارفرما</dt>
                    <dd className="text-sm font-bold text-navy-900">
                      {project.client}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 py-3">
                    <dt className="text-sm text-navy-700/80">شهر</dt>
                    <dd className="text-sm font-bold text-navy-900">
                      {project.city}
                    </dd>
                  </div>
                  <div className="flex items-start justify-between gap-4 py-3">
                    <dt className="text-sm text-navy-700/80">سال اجرا</dt>
                    <dd className="tabular text-sm font-bold text-navy-900">
                      {project.year}
                    </dd>
                  </div>
                  {project.specs.map((spec) => (
                    <div
                      key={spec.label}
                      className="flex items-start justify-between gap-4 py-3"
                    >
                      <dt className="shrink-0 text-sm text-navy-700/80">
                        {spec.label}
                      </dt>
                      <dd className="text-sm font-bold text-navy-900">
                        {spec.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              {service ? (
                <Link
                  href={`/services/${service.slug}`}
                  className="rounded-card bg-navy-950 p-6 text-brand-white transition-colors hover:bg-navy-900"
                >
                  <span className="text-sm text-brand-yellow">خدمت مرتبط</span>
                  <p className="mt-2 text-lg font-bold">{service.title}</p>
                  <p className="mt-2 text-sm leading-7 text-brand-white/70">
                    {service.excerpt}
                  </p>
                </Link>
              ) : null}
            </div>
          </aside>
        </div>
      </Section>

      {related.length > 0 ? (
        <Section tone="muted">
          <SectionHeading
            eyebrow="پروژه‌های مرتبط"
            title="نمونه کارهای مشابه"
            align="start"
          />
          <div className="mt-10 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {related.map((item) => (
              <ProjectCard key={item.slug} project={item} />
            ))}
          </div>
        </Section>
      ) : null}

      <CtaSection />
    </>
  );
}
