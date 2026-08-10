import type { Service } from "@/lib/services";
import { MobileCarousel } from "./MobileCarousel";
import { ServiceCard } from "./ServiceCard";

export function ServiceCarousel({
  services,
  tone = "light",
}: {
  services: Service[];
  tone?: "light" | "dark";
}) {
  return (
    <MobileCarousel desktopClassName="sm:grid sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <ServiceCard key={service.slug} service={service} tone={tone} />
      ))}
    </MobileCarousel>
  );
}
