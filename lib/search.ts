import { locations } from "@/lib/locations";
import { posts } from "@/lib/posts";
import { services } from "@/lib/services";
import { navigation } from "@/lib/site";

export type SearchItem = {
  href: string;
  title: string;
  description: string;
  keywords: string;
};

export const searchIndex: SearchItem[] = [
  ...navigation.map((item) => ({
    href: item.href,
    title: item.label,
    description: "صفحات اصلی سایت",
    keywords: item.label,
  })),
  ...services.map((service) => ({
    href: `/services/${service.slug}`,
    title: service.shortTitle,
    description: service.excerpt,
    keywords: [service.shortTitle, service.title, ...service.keywords].join(" "),
  })),
  ...locations.map((location) => ({
    href: `/${location.slug}`,
    title: location.title,
    description: `پوشش خدمات در ${location.city}`,
    keywords: [location.city, location.title, ...location.keywords].join(" "),
  })),
  ...posts.map((post) => ({
    href: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    keywords: [post.title, post.category, ...post.keywords].join(" "),
  })),
];

export function searchSite(query: string, limit = 8): SearchItem[] {
  const normalized = query.trim().toLowerCase().replace(/\s+/g, " ");
  if (normalized.length < 2) return [];

  const terms = normalized.split(" ");

  return searchIndex
    .map((item) => {
      const haystack = `${item.title} ${item.description} ${item.keywords}`.toLowerCase();
      let score = 0;
      for (const term of terms) {
        if (item.title.toLowerCase().includes(term)) score += 5;
        if (haystack.includes(term)) score += 1;
      }
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}
