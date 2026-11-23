import { branches, site } from "./site";
import { services } from "./services";
import type { SiteSettings } from "./content-store";

export function organizationJsonLd(settings?: SiteSettings) {
  const current = settings ?? site;
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${site.url}/#organization`,
    name: current.name,
    alternateName: [current.nameEn, "تابلو سازی مکث", "MAX"],
    slogan: current.motto,
    url: site.url,
    logo: {
      "@type": "ImageObject",
      url: `${site.url}/logo-max-navy.png`,
      width: 908,
      height: 262,
    },
    image: {
      "@type": "ImageObject",
      url: `${site.url}/og-image.png`,
      width: 1200,
      height: 630,
    },
    description: current.description,
    telephone: current.phoneIntl,
    email: current.email,
    foundingDate: "2006",
    sameAs: [current.instagram],
    areaServed: {
      "@type": "State",
      name: "مازندران",
    },
  };
}

export function localBusinessJsonLd(settings?: SiteSettings) {
  const current = settings ?? site;
  const branchPages: Record<string, string> = {
    behshahr: `${site.url}/tablo-tabligati-behshahr`,
    neka: `${site.url}/tablo-tabligati-neka`,
  };

  return (settings?.branches ?? branches).map((branch) => ({
    "@context": "https://schema.org",
    "@type": ["LocalBusiness", "ProfessionalService"],
    "@id": `${site.url}/#${branch.id}`,
    name: `${current.name} - ${branch.title}`,
    parentOrganization: { "@id": `${site.url}/#organization` },
    description: current.description,
    url: branchPages[branch.id] ?? site.url,
    telephone: current.phoneIntl,
    email: current.email,
    image: {
      "@type": "ImageObject",
      url: `${site.url}/og-image.png`,
      width: 1200,
      height: 630,
    },
    priceRange: "$$",
    currenciesAccepted: "IRR",
    address: {
      "@type": "PostalAddress",
      streetAddress: branch.address,
      addressLocality: branch.city,
      addressRegion: "مازندران",
      addressCountry: "IR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: branch.geo.lat,
      longitude: branch.geo.lng,
    },
    hasMap: branch.mapUrl,
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Saturday",
          "Sunday",
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
        ],
        opens: "08:00",
        closes: "20:00",
      },
    ],
    areaServed: [
      { "@type": "State", name: "مازندران" },
      { "@type": "City", name: "ساری" },
      { "@type": "City", name: "بهشهر" },
      { "@type": "City", name: "نکا" },
      { "@type": "City", name: "قائم‌شهر" },
      { "@type": "City", name: "آمل" },
      { "@type": "City", name: "بابل" },
    ],
    sameAs: [current.instagram],
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "خدمات تابلوسازی",
      itemListElement: services.map((service) => ({
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: service.title,
          url: `${site.url}/services/${service.slug}`,
        },
      })),
    },
  }));
}

export function serviceJsonLd(input: {
  name: string;
  description: string;
  url: string;
  serviceType: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: input.name,
    description: input.description,
    url: input.url,
    serviceType: input.serviceType,
    provider: { "@id": `${site.url}/#organization` },
    areaServed: { "@type": "State", name: "مازندران" },
    availableChannel: {
      "@type": "ServiceChannel",
      servicePhone: site.phoneIntl,
      serviceUrl: `${site.url}/contact`,
    },
  };
}

export function faqJsonLd(faq: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${site.url}${item.url}`,
    })),
  };
}

export function articleJsonLd(input: {
  title: string;
  description: string;
  url: string;
  datePublished: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: input.title,
    description: input.description,
    url: input.url,
    datePublished: input.datePublished,
    dateModified: input.datePublished,
    inLanguage: "fa-IR",
    image: `${site.url}/og-image.png`,
    author: { "@id": `${site.url}/#organization` },
    publisher: { "@id": `${site.url}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": input.url },
  };
}

export function creativeWorkJsonLd(input: {
  name: string;
  description: string;
  url: string;
  image: string;
  city: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: input.name,
    description: input.description,
    url: input.url,
    image: `${site.url}${input.image}`,
    creator: { "@id": `${site.url}/#organization` },
    locationCreated: {
      "@type": "Place",
      name: input.city,
      address: {
        "@type": "PostalAddress",
        addressLocality: input.city,
        addressRegion: "مازندران",
        addressCountry: "IR",
      },
    },
  };
}
