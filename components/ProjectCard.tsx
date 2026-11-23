import Image from "next/image";
import Link from "next/link";
import { ArrowUpLeft, MapPin } from "lucide-react";
import type { Project } from "@/lib/projects";

export function ProjectCard({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  const cover = project.gallery?.[0];
  const imageSrc = cover?.src || "/images/services/chelnium.jpg";
  const imageAlt = cover?.alt || project.title;

  return (
    <Link
      href={`/portfolio/${project.slug}`}
      prefetch
      className="portfolio-project-card group flex h-full flex-col rounded-[25px] border border-[#e9e6de] bg-white p-2.5 sm:p-3"
    >
      <div className="project-cover relative aspect-[5/4] shrink-0 overflow-hidden rounded-[18px] bg-navy-50 sm:aspect-[4/3]">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          priority={priority}
          sizes="(max-width: 640px) 76vw, (max-width: 1200px) 45vw, 30vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
        />
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-t from-navy-950/35 via-transparent to-transparent" />
        <span className="project-category absolute top-3 right-3 rounded-full border border-white/80 bg-white/95 px-3 py-1 text-[0.7rem] font-bold text-navy-700 shadow-sm backdrop-blur-md sm:text-xs">
          {project.category}
        </span>
        <span className="project-city absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-navy-950/55 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-md"><MapPin className="size-3.5" aria-hidden="true" />{project.city}</span>
      </div>

      <div className="project-copy flex flex-1 flex-col px-2 py-3 sm:px-3 sm:py-4">
        <div className="project-meta flex items-center justify-between gap-2 text-[0.7rem] text-[#69676b] sm:text-xs">
          <span className="truncate font-semibold">{project.client}</span>
          <span className="shrink-0 rounded-full bg-[#f5f3ee] px-2 py-0.5 tabular text-[#625d4f]">{project.year}</span>
        </div>
        <h3 className="mt-2 line-clamp-2 min-h-[2.9rem] text-base leading-relaxed text-[#272630] transition-colors group-hover:text-navy-600 sm:min-h-[3.3rem] sm:text-lg">
          {project.title}
        </h3>
        <p className="project-summary mt-1.5 line-clamp-2 flex-1 text-xs leading-6 text-[#66646a] sm:text-sm sm:leading-7">
          {project.summary}
        </p>
        <span className="project-action mt-4 flex items-center justify-between border-t border-[#eae8e1] pt-3 text-xs font-bold text-navy-600 sm:text-sm">
          بررسی پروژه
          <span className="grid size-9 place-items-center rounded-full bg-navy-50 text-navy-600 transition-all duration-300 group-hover:bg-brand-yellow group-hover:text-[#32300e]"><ArrowUpLeft className="size-4 transition-transform group-hover:-translate-x-0.5 group-hover:-translate-y-0.5" aria-hidden="true" /></span>
        </span>
      </div>
    </Link>
  );
}
