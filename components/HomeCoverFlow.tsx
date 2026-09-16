"use client";

import dynamic from "next/dynamic";
import type { CarouselItem } from "@/components/ui/3-d-coverflow-carousel";

const CoverFlowCarousel = dynamic(
  () =>
    import("@/components/ui/3-d-coverflow-carousel").then(
      (mod) => mod.CoverFlowCarousel,
    ),
  {
    ssr: false,
    loading: () => (
      <div
        className="mx-auto h-[min(72vw,30rem)] w-full max-w-6xl bg-navy-50/50"
        aria-hidden="true"
      />
    ),
  },
);

export function HomeCoverFlow({ items }: { items: CarouselItem[] }) {
  return (
    <CoverFlowCarousel sectionLabel="" autoplay={false} items={items} />
  );
}
