"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { homeHrefFromPath } from "@/lib/home-sections";
import { cn } from "./ui";

export type Crumb = { name: string; url: string };

export function Breadcrumbs({
  items,
  tone = "light",
}: {
  items: Crumb[];
  tone?: "light" | "dark";
}) {
  const pathname = usePathname();
  const homeHref = homeHrefFromPath(pathname);

  return (
    <nav aria-label="مسیر صفحه">
      <ol
        className={cn(
          "flex flex-wrap items-center gap-x-2 gap-y-1 text-sm",
          tone === "light" ? "text-navy-700/70" : "text-brand-white/60",
        )}
      >
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-2">
              {last ? (
                <span
                  aria-current="page"
                  className={tone === "light" ? "text-navy-900" : "text-brand-yellow"}
                >
                  {item.name}
                </span>
              ) : (
                <Link
                  href={item.url === "/" ? homeHref : item.url}
                  scroll={item.url !== "/"}
                  className="transition-colors hover:underline"
                >
                  {item.name}
                </Link>
              )}
              {last ? null : <span aria-hidden="true">/</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
