import type { Service } from "@/lib/services";
import type { CarouselItem } from "@/components/ui/3-d-coverflow-carousel";

export const DEFAULT_SERVICE_IMAGES: Record<string, string> = {
  chelnium: "/images/services/chelnium.jpg",
  composite: "/images/services/composite-facade.jpg",
  "3d-letters": "/images/services/3d-letters.jpg",
  lightbox: "/images/services/lightbox-sign.jpg",
  "led-display": "/images/services/led-billboard.jpg",
  "neon-flex": "/images/services/neon-flex.jpg",
};

export function serviceImage(service: Pick<Service, "slug" | "image">) {
  return service.image || DEFAULT_SERVICE_IMAGES[service.slug] || "";
}

export function serviceCoverItems(services: Service[]): CarouselItem[] {
  return services.map((service) => ({
    titleLine1: service.shortTitle,
    desc: service.excerpt,
    img: serviceImage(service),
    ctaText: "مشاهده",
    ctaUrl: `/services/${service.slug}`,
  }));
}
