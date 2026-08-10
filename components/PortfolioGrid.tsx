"use client";

import { useMemo, useState } from "react";
import { projectCategories, type Project } from "@/lib/projects";
import { ProjectCard } from "./ProjectCard";
import { cn } from "./ui";

export function PortfolioGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState("all");

  const available = useMemo(() => {
    const used = new Set(projects.map((project) => project.serviceSlug));
    return projectCategories.filter(
      (category) => category.id === "all" || used.has(category.id),
    );
  }, [projects]);

  const filtered = useMemo(
    () =>
      active === "all"
        ? projects
        : projects.filter((project) => project.serviceSlug === active),
    [projects, active],
  );

  return (
    <div>
      <div
        role="tablist"
        aria-label="فیلتر نمونه کارها"
        className="mb-10 flex flex-wrap justify-center gap-2"
      >
        {available.map((category) => (
          <button
            key={category.id}
            type="button"
            role="tab"
            aria-selected={active === category.id}
            onClick={() => setActive(category.id)}
            className={cn(
              "rounded-full px-5 py-2.5 text-sm font-bold transition-all duration-200",
              active === category.id
                ? "bg-navy-600 text-brand-white shadow-lg shadow-navy-600/20"
                : "border border-navy-200 text-navy-700 hover:border-navy-400 hover:bg-navy-50",
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 sm:gap-5 md:gap-7 lg:grid-cols-3">
        {filtered.map((project, index) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-navy-700/70">
          برای این دسته هنوز نمونه کاری منتشر نشده است.
        </p>
      ) : null}
    </div>
  );
}
