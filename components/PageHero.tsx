import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { Eyebrow } from "./ui";

export function PageHero({
  eyebrow,
  title,
  description,
  crumbs,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: ReactNode;
  crumbs: Crumb[];
  children?: ReactNode;
}) {
  return (
    <section className="relative overflow-hidden bg-navy-950 text-brand-white">
      <div className="grid-lines absolute inset-0" aria-hidden="true" />
      <div
        aria-hidden="true"
        className="absolute -top-40 -left-24 size-96 rounded-full bg-navy-600/50 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="absolute -right-20 bottom-0 size-72 rounded-full bg-brand-yellow/10 blur-3xl"
      />

      <div className="container-page relative py-12 md:py-20">
        <Breadcrumbs items={crumbs} tone="dark" />

        <div className="mt-8 max-w-3xl">
          {eyebrow ? <Eyebrow tone="dark">{eyebrow}</Eyebrow> : null}
          <h1 className="mt-4 text-3xl leading-tight md:text-5xl">{title}</h1>
          {description ? (
            <div className="mt-5 text-base leading-9 text-brand-white/75 md:text-lg">
              {description}
            </div>
          ) : null}
          {children ? <div className="mt-8">{children}</div> : null}
        </div>
      </div>
    </section>
  );
}
