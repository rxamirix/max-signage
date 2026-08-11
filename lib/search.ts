import { locations } from "@/lib/locations";
import { posts } from "@/lib/posts";
import { services } from "@/lib/services";
import { navigation, site } from "@/lib/site";

export type SearchItem = {
  href: string;
  title: string;
  description: string;
  keywords: string;
};

/** Normalize Persian/Arabic letters and digits for more reliable matching. */
function normalize(text: string) {
  return text
    .toLowerCase()
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/ۀ|ة/g, "ه")
    .replace(/ؤ/g, "و")
    .replace(/إ|أ|آ/g, "ا")
    .replace(/[\u200c\u200f\u202a-\u202e]/g, "")
    .replace(/[۰-۹]/g, (digit) => String(digit.charCodeAt(0) - 1728))
    .replace(/[٠-٩]/g, (digit) => String(digit.charCodeAt(0) - 1632))
    .replace(/\s+/g, " ")
    .trim();
}

export const searchIndex: SearchItem[] = [
  {
    href: "/",
    title: site.name,
    description: "صفحه اصلی تابلوسازی مکس در مازندران",
    keywords: `${site.name} ${site.shortName} ${site.nameEn} مکس تابلو تبلیغاتی مازندران max`,
  },
  ...navigation
    .filter((item) => item.href !== "/")
    .map((item) => ({
      href: item.href,
      title: item.label,
      description: "صفحات اصلی سایت",
      keywords: `${item.label} ${site.shortName} مکس`,
    })),
  ...services.map((service) => ({
    href: `/services/${service.slug}`,
    title: service.shortTitle,
    description: service.excerpt,
    keywords: [service.shortTitle, service.title, service.slug, ...service.keywords].join(
      " ",
    ),
  })),
  ...locations.map((location) => ({
    href: `/${location.slug}`,
    title: location.title,
    description: `پوشش خدمات در ${location.city}`,
    keywords: [location.city, location.title, location.slug, ...location.keywords].join(
      " ",
    ),
  })),
  ...posts.map((post) => ({
    href: `/blog/${post.slug}`,
    title: post.title,
    description: post.excerpt,
    keywords: [post.title, post.category, post.slug, ...post.keywords].join(" "),
  })),
  {
    href: "/contact#quote",
    title: "استعلام قیمت رایگان",
    description: "فرم درخواست قیمت و مشاوره",
    keywords: "استعلام قیمت رایگان مشاوره واتساپ تماس",
  },
];

export function searchSite(query: string, limit = 8): SearchItem[] {
  const normalized = normalize(query);
  if (normalized.length < 1) return [];

  const terms = normalized.split(" ").filter(Boolean);

  return searchIndex
    .map((item) => {
      const title = normalize(item.title);
      const haystack = normalize(
        `${item.title} ${item.description} ${item.keywords}`,
      );
      let score = 0;
      for (const term of terms) {
        if (!term) continue;
        if (title === term) score += 12;
        else if (title.startsWith(term)) score += 8;
        else if (title.includes(term)) score += 5;
        if (haystack.includes(term)) score += 2;
      }
      return { item, score };
    })
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, "fa"))
    .slice(0, limit)
    .map((entry) => entry.item);
}
