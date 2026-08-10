import Image from "next/image";
import Link from "next/link";
import type { Project } from "@/lib/projects";

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <Link
      href={`/portfolio/${project.slug}`}
      className="group flex h-full flex-col overflow-hidden rounded-card border border-navy-100 bg-brand-white transition-all duration-300 hover:-translate-y-1 hover:border-navy-300 hover:shadow-2xl hover:shadow-navy-900/10"
    >
      <div className="relative aspect-square shrink-0 overflow-hidden bg-navy-900 sm:aspect-[3/2]">
        <Image
          src={project.gallery[0].src}
          alt={project.gallery[0].alt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 50vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <span className="absolute top-2 right-2 rounded-full bg-brand-yellow px-2 py-0.5 text-[0.65rem] font-bold text-navy-900 sm:top-4 sm:right-4 sm:px-3 sm:py-1 sm:text-xs">
          {project.category}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-6">
        <div className="flex items-center gap-1.5 text-[0.7rem] text-navy-600 sm:gap-2 sm:text-sm">
          <span className="font-bold">{project.city}</span>
          <span aria-hidden="true">•</span>
          <span className="tabular">{project.year}</span>
        </div>
        <h3 className="mt-1.5 line-clamp-2 text-sm text-navy-900 transition-colors group-hover:text-navy-600 sm:mt-2 sm:min-h-[3.25rem] sm:text-lg md:text-xl">
          {project.title}
        </h3>
        <p className="mt-1.5 hidden line-clamp-3 flex-1 text-sm leading-7 text-navy-700/75 sm:mt-3 sm:block">
          {project.summary}
        </p>
        <span className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-navy-600 sm:mt-4 sm:gap-2 sm:text-sm">
          مشاهده بیشتر
          <svg viewBox="0 0 20 20" className="size-3.5 sm:size-4" aria-hidden="true">
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
  );
}
