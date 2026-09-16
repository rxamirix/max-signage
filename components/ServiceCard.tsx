import Image from "next/image";
import Link from "next/link";
import type { Service } from "@/lib/services";
import { serviceImage } from "@/lib/service-images";

export function ServiceCard({
  service,
  tone = "light",
}: {
  service: Service;
  tone?: "light" | "dark";
}) {
  const dark = tone === "dark";
  const src = serviceImage(service);

  return (
    <Link
      href={`/services/${service.slug}`}
      className={
        dark
          ? "group flex h-full flex-col overflow-hidden rounded-card border border-brand-white/10 bg-brand-white/5 p-4 transition-colors duration-300 hover:border-brand-yellow/50 hover:bg-brand-white/10 sm:p-5 md:p-7 sm:hover:-translate-y-1 sm:hover:shadow-none"
          : "group flex h-full flex-col overflow-hidden rounded-card border border-navy-100 bg-brand-white p-4 transition-all duration-300 hover:border-navy-300 sm:p-5 md:p-7 sm:hover:-translate-y-1 sm:hover:shadow-2xl sm:hover:shadow-navy-900/10"
      }
    >
      {src ? (
        <div
          className={
            dark
              ? "relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-brand-white/10 bg-navy-900"
              : "relative mb-4 aspect-[16/10] overflow-hidden rounded-xl border border-navy-100 bg-navy-50"
          }
        >
          <Image
            src={src}
            alt={service.shortTitle}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 sm:group-hover:scale-105"
          />
        </div>
      ) : null}

      <div className="flex min-w-0 items-start gap-3 sm:gap-4">
        <h3
          className={
            dark
              ? "line-clamp-2 min-w-0 flex-1 text-lg leading-8 text-brand-white sm:text-xl"
              : "line-clamp-2 min-w-0 flex-1 text-lg leading-8 text-navy-900 transition-colors group-hover:text-navy-600 sm:text-xl"
          }
        >
          {service.shortTitle}
        </h3>
      </div>

      <p
        className={
          dark
            ? "mt-3 line-clamp-2 min-w-0 flex-1 text-sm leading-7 text-brand-white/70 sm:line-clamp-3 sm:leading-8"
            : "mt-3 line-clamp-2 min-w-0 flex-1 text-sm leading-7 text-navy-700/75 sm:line-clamp-3 sm:leading-8"
        }
      >
        {service.excerpt}
      </p>

      <span
        className={
          dark
            ? "mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-brand-yellow"
            : "mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-navy-600"
        }
      >
        مشاهده بیشتر
        <svg viewBox="0 0 20 20" className="size-4 shrink-0" aria-hidden="true">
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
    </Link>
  );
}
