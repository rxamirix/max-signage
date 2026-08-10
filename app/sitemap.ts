import type { MetadataRoute } from "next";
import { locations } from "@/lib/locations";
import { posts } from "@/lib/posts";
import { projects } from "@/lib/projects";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

type Frequency = NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>;

/** Stable content revision date — bump when site content meaningfully changes. */
const CONTENT_UPDATED = new Date("2026-08-10");

export default function sitemap(): MetadataRoute.Sitemap {
  const routes: { url: string; changeFrequency: Frequency; priority: number }[] =
    [
      { url: "/", changeFrequency: "weekly", priority: 1 },
      { url: "/services", changeFrequency: "monthly", priority: 0.9 },
      { url: "/portfolio", changeFrequency: "weekly", priority: 0.9 },
      { url: "/materials", changeFrequency: "monthly", priority: 0.7 },
      { url: "/process", changeFrequency: "monthly", priority: 0.7 },
      { url: "/about", changeFrequency: "yearly", priority: 0.6 },
      { url: "/blog", changeFrequency: "weekly", priority: 0.7 },
      { url: "/contact", changeFrequency: "yearly", priority: 0.9 },
    ];

  const staticRoutes: MetadataRoute.Sitemap = routes.map((route) => ({
    ...route,
    url: `${site.url}${route.url === "/" ? "" : route.url}`,
    lastModified: CONTENT_UPDATED,
  }));

  const serviceRoutes: MetadataRoute.Sitemap = services.map((service) => ({
    url: `${site.url}/services/${service.slug}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: "monthly",
    priority: 0.85,
  }));

  const locationRoutes: MetadataRoute.Sitemap = locations.map((location) => ({
    url: `${site.url}/${location.slug}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: "monthly",
    priority: 0.9,
  }));

  const projectRoutes: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${site.url}/portfolio/${project.slug}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${site.url}/blog/${post.slug}`,
    lastModified: new Date(post.dateIso),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...locationRoutes,
    ...projectRoutes,
    ...postRoutes,
  ];
}
