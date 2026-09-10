export const HOME_SECTION_KEY = "max-home-section";

export const homeSectionIds = [
  "hero",
  "services",
  "portfolio",
  "why-max",
  "process",
  "materials",
  "testimonials",
  "blog",
  "faq",
  "cta",
  "footer",
] as const;

export type HomeSectionId = (typeof homeSectionIds)[number];

export function isHomeSectionId(value: string): value is HomeSectionId {
  return homeSectionIds.includes(value as HomeSectionId);
}

export function homeSectionFromPath(pathname: string): HomeSectionId | null {
  if (pathname === "/") return null;
  if (pathname.startsWith("/services")) return "services";
  if (pathname.startsWith("/portfolio")) return "portfolio";
  if (pathname.startsWith("/materials")) return "materials";
  if (pathname.startsWith("/process")) return "process";
  if (pathname.startsWith("/about")) return "why-max";
  if (pathname.startsWith("/blog")) return "blog";
  if (pathname.startsWith("/contact")) return "cta";
  return null;
}

export function homeHrefFromPath(pathname: string) {
  const section = homeSectionFromPath(pathname);
  return section ? `/#${section}` : "/";
}

export function jumpToHomeSection(id: string, instant = false) {
  if (typeof window === "undefined") return;

  if (id === "hero") {
    window.scrollTo({ top: 0, behavior: instant ? "auto" : "smooth" });
    return;
  }

  if (id === "footer") {
    window.scrollTo({
      top: document.documentElement.scrollHeight,
      behavior: instant ? "auto" : "smooth",
    });
    return;
  }

  const node = document.getElementById(id);
  if (!node) return;
  window.scrollTo({
    top: node.getBoundingClientRect().top + window.scrollY,
    behavior: instant ? "auto" : "smooth",
  });
}
