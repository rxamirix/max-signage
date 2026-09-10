import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Header } from "./Header";

export function PageHero({
  title,
  description,
  crumbs,
  children,
}: {
  title: string;
  description?: ReactNode;
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-brand-white">
      <Header variant="hero" />

      <div className="grid-lines absolute inset-0 opacity-60" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -top-40 -left-24 size-96 rounded-full bg-navy-600/45 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-20 bottom-0 size-72 rounded-full bg-navy-600/25 blur-3xl"
      />

      <div className="container-page relative pt-28 pb-14 md:pt-36 md:pb-20">
        <Breadcrumbs items={crumbs} tone="dark" />

        <div className="mt-12 max-w-3xl md:mt-16">
          <h1 className="text-3xl leading-tight text-brand-white md:text-5xl">
            {title}
          </h1>
          {description ? (
            <div className="mt-5 text-base leading-9 text-white/70 md:text-lg">
              {description}
            </div>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
