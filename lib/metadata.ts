import type { Metadata } from "next";
import { site } from "./site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
  absoluteTitle?: boolean;
  image?: string;
  imageAlt?: string;
  type?: "website" | "article";
  publishedTime?: string;
};

/** Builds title/description/canonical/OG/Twitter together so pages never inherit the homepage card. */
export function pageMetadata({
  title,
  description,
  path,
  keywords,
  absoluteTitle = false,
  image = "/og-image.png",
  imageAlt = site.name,
  type = "website",
  publishedTime,
}: PageMetaInput): Metadata {
  const url = path === "/" ? site.url : `${site.url}${path}`;
  const ogImage = image.startsWith("http") ? image : `${site.url}${image}`;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: { canonical: path },
    openGraph:
      type === "article"
        ? {
            title,
            description,
            url,
            type: "article",
            locale: site.locale,
            siteName: site.name,
            images: [{ url: ogImage, width: 1200, height: 630, alt: imageAlt }],
            ...(publishedTime ? { publishedTime } : {}),
          }
        : {
            title,
            description,
            url,
            type: "website",
            locale: site.locale,
            siteName: site.name,
            images: [{ url: ogImage, width: 1200, height: 630, alt: imageAlt }],
          },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}
