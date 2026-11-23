import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Header } from "./Header";
import { cn } from "./ui";
import { getSiteSettings } from "@/lib/content-store";
import { defaultPageHeroes, type PageHeroes } from "@/lib/home-content";

type HeroFeature = "materials" | "about" | "blog" | "contact";

export async function PageHero({
  title,
  titleNode,
  description,
  crumbs,
  children,
  feature,
}: {
  title: string;
  /** Optional custom title row (e.g. title + story play) */
  titleNode?: ReactNode;
  description?: ReactNode;
  crumbs: Crumb[];
  children?: ReactNode;
  feature?: HeroFeature;
}) {
  const path = crumbs.at(-1)?.url as keyof PageHeroes | undefined;
  const pageContent = path && Object.hasOwn(defaultPageHeroes, path) ? (await getSiteSettings()).pageHeroes?.[path] : undefined;
  const heading = pageContent?.title || title;
  const intro = pageContent?.description || description;
  return (
    <section className={cn("relative overflow-hidden bg-navy-950 text-brand-white", feature && "editorial-page-hero")}>
      <Header variant="hero" />

      <div className={cn("grid-lines absolute inset-0", feature ? "opacity-20" : "opacity-60")} aria-hidden="true" />
      <div
        aria-hidden="true"
        className={cn("absolute -top-40 -left-24 size-96 rounded-full blur-3xl", feature ? "bg-navy-600/20" : "bg-navy-600/45")}
      />
      <div
        aria-hidden="true"
        className={cn("absolute -right-20 bottom-0 size-72 rounded-full blur-3xl", feature ? "bg-navy-600/10" : "bg-navy-600/25")}
      />

      <div className="page-hero-inner container-page relative pt-28 pb-14 md:pt-36 md:pb-20">
        <Breadcrumbs items={crumbs} tone="dark" />

        <div className={cn(feature ? "mt-8 max-w-4xl md:mt-12" : "mt-12 max-w-3xl md:mt-16")}>
          <div>
          {feature && <span className="mb-5 block h-[3px] w-12 rounded-full bg-brand-yellow" aria-hidden="true" />}
          {titleNode ?? (
            <h1 className="text-3xl leading-tight text-brand-white md:text-5xl">
              {heading}
            </h1>
          )}
          {intro ? (
            <div className="mt-5 text-base leading-9 text-white/70 md:text-lg">
              {intro}
            </div>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
          </div>
        </div>
      </div>
    </section>
  );
}
