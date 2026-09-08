"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export interface CarouselItem {
  tag?: string;
  titleLine1: string;
  titleLine2?: string;
  desc?: string;
  img: string;
  ctaText?: string;
  ctaUrl?: string;
}

export interface CoverFlowCarouselProps {
  items?: CarouselItem[];
  sectionLabel?: string;
  autoplay?: boolean;
  autoplayDelay?: number;
  className?: string;
  onCtaClick?: (item: CarouselItem) => void;
}

export const defaultDishes: CarouselItem[] = [
  {
    tag: "#پرفروش",
    titleLine1: "تابلو چلنیوم",
    titleLine2: "– حروف برجسته",
    desc: "پرطرفدارترین تابلو مغازه؛ بدنه آلومینیومی، رویه پلکسی و نور یکنواخت LED",
    img: "/images/services/chelnium.jpg",
    ctaText: "مشاهده",
    ctaUrl: "/services/chelnium",
  },
  {
    tag: "#نما",
    titleLine1: "کامپوزیت",
    titleLine2: "– نمای ساختمان",
    desc: "پوشش نما با ورق کامپوزیت، زیرسازی مقاوم و اجرای دقیق در ابعاد بزرگ",
    img: "/images/services/composite-facade.jpg",
    ctaText: "مشاهده",
    ctaUrl: "/services/composite",
  },
  {
    tag: "#سه‌بعدی",
    titleLine1: "حروف برجسته",
    titleLine2: "– حجم و نور",
    desc: "حروف سه‌بعدی با عمق واقعی، مناسب برندهایی که می‌خواهند از فاصله دیده شوند",
    img: "/images/services/3d-letters.jpg",
    ctaText: "مشاهده",
    ctaUrl: "/services/3d-letters",
  },
  {
    tag: "#نورانی",
    titleLine1: "لایت‌باکس",
    titleLine2: "– نور یکدست",
    desc: "جعبه نوری با پخش یکنواخت، برای سردر فروشگاه و ویترین‌های شبانه",
    img: "/images/services/lightbox-sign.jpg",
    ctaText: "مشاهده",
    ctaUrl: "/services/lightbox",
  },
  {
    tag: "#دیجیتال",
    titleLine1: "تلویزیون شهری",
    titleLine2: "– نمایشگر LED",
    desc: "بیلبورد و نمایشگر LED برای محتوای متحرک، تبلیغات و اطلاع‌رسانی",
    img: "/images/services/led-billboard.jpg",
    ctaText: "مشاهده",
    ctaUrl: "/services/led-display",
  },
  {
    tag: "#نئون",
    titleLine1: "نئون فلکسی",
    titleLine2: "– خط نورانی",
    desc: "نئون انعطاف‌پذیر با رنگ اشباع، مناسب لوگو، کافه و فضاهای شبانه",
    img: "/images/services/neon-flex.jpg",
    ctaText: "مشاهده",
    ctaUrl: "/services/neon-flex",
  },
];

export function CoverFlowCarousel({
  items = defaultDishes,
  sectionLabel = "",
  autoplay = false,
  autoplayDelay = 5000,
  className = "",
  onCtaClick,
}: CoverFlowCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const total = items.length;

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % total);
  }, [total]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  }, [total]);

  const goToSlide = (idx: number) => {
    setCurrentIndex(idx % total);
  };

  useEffect(() => {
    if (!autoplay || total <= 1) return;
    const interval = setInterval(nextSlide, autoplayDelay);
    return () => clearInterval(interval);
  }, [autoplay, autoplayDelay, nextSlide, total]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = e.changedTouches[0].clientY - touchStartY.current;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) nextSlide();
      else prevSlide();
    }
  };

  if (!items || items.length === 0) return null;

  return (
    <section
      className={`relative w-full flex items-center justify-center overflow-x-hidden overflow-y-visible py-6 sm:py-8 select-none bg-brand-white text-navy-900 touch-pan-y [--cf-w:240px] [--cf-h:360px] [--cf-near:155px] [--cf-far:275px] sm:[--cf-w:270px] sm:[--cf-h:430px] sm:[--cf-near:215px] sm:[--cf-far:380px] ${className}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center px-3 sm:px-4">
        {sectionLabel ? (
          <div className="mb-3 flex items-center gap-3 sm:mb-4">
            <span className="h-px w-8 bg-gradient-to-l from-brand-yellow to-transparent sm:w-9" />
            <h3 className="m-0 text-[0.7rem] font-bold tracking-[0.28em] text-navy-600 uppercase">
              {sectionLabel}
            </h3>
            <span className="h-px w-8 bg-gradient-to-r from-brand-yellow to-transparent sm:w-9" />
          </div>
        ) : null}

        <div
          className="relative mb-4 flex h-[380px] w-full items-center justify-center sm:mb-5 sm:h-[450px]"
          style={{ perspective: "1400px" }}
        >
          {items.map((item, idx) => {
            const offset = (idx - currentIndex + total) % total;

            let transform = "translateX(0px) scale(0.4) rotateY(0deg)";
            let opacity = 0;
            let zIndex = 0;
            let isCenter = false;

            if (offset === 0) {
              isCenter = true;
              transform = "translateX(0px) scale(1) rotateY(0deg)";
              opacity = 1;
              zIndex = 30;
            } else if (offset === 1) {
              transform = "translateX(var(--cf-near)) scale(0.84) rotateY(-24deg)";
              opacity = 0.88;
              zIndex = 20;
            } else if (offset === 2) {
              transform = "translateX(var(--cf-far)) scale(0.68) rotateY(-38deg)";
              opacity = 0.55;
              zIndex = 10;
            } else if (offset === total - 1) {
              transform = "translateX(calc(var(--cf-near) * -1)) scale(0.84) rotateY(24deg)";
              opacity = 0.88;
              zIndex = 20;
            } else if (offset === total - 2) {
              transform = "translateX(calc(var(--cf-far) * -1)) scale(0.68) rotateY(38deg)";
              opacity = 0.55;
              zIndex = 10;
            }

            const inner = (
              <>
                <img
                  src={item.img}
                  alt={item.titleLine1}
                  className="absolute inset-0 h-full w-full object-cover"
                />

                <div
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(180deg, rgba(8,10,32,0) 36%, rgba(8,10,32,0.62) 68%, rgba(8,10,32,0.94) 100%)",
                    opacity: isCenter ? 1 : 0,
                    transition: "opacity 350ms ease",
                  }}
                />

                <div
                  className="absolute inset-x-0 bottom-0 z-10 flex flex-col items-center px-3 pb-4 text-center sm:px-4 sm:pb-5"
                  style={{
                    opacity: isCenter ? 1 : 0,
                    transform: isCenter ? "translateY(0)" : "translateY(10px)",
                    transition: "opacity 350ms ease, transform 350ms ease",
                    pointerEvents: isCenter ? "auto" : "none",
                  }}
                >
                  {item.tag ? (
                    <span className="mb-2 rounded-full bg-brand-yellow px-2.5 py-0.5 text-[0.7rem] font-bold text-navy-900">
                      {item.tag.replace(/^#/, "")}
                    </span>
                  ) : null}
                  <h3 className="m-0 text-[1.2rem] font-black leading-tight text-white sm:text-[1.35rem]">
                    {item.titleLine1}
                  </h3>
                  {item.titleLine2 ? (
                    <span className="mt-0.5 text-[0.9rem] font-bold text-white/95 sm:text-[0.98rem]">
                      {item.titleLine2}
                    </span>
                  ) : null}
                  {item.desc ? (
                    <p className="mt-1.5 line-clamp-2 max-w-[230px] text-[0.78rem] leading-relaxed text-white/90 sm:text-[0.82rem]">
                      {item.desc}
                    </p>
                  ) : null}
                </div>
              </>
            );

            return (
              <div
                key={idx}
                onClick={() => {
                  if (!isCenter) goToSlide(idx);
                }}
                style={{
                  position: "absolute",
                  width: "var(--cf-w)",
                  height: "var(--cf-h)",
                  borderRadius: "16px",
                  overflow: "hidden",
                  backgroundColor: "#14163f",
                  border: "1px solid rgba(255,255,255,0.14)",
                  transform,
                  opacity,
                  zIndex,
                  transformOrigin: "center center",
                  transition:
                    "transform 700ms cubic-bezier(0.25, 1, 0.5, 1), opacity 700ms cubic-bezier(0.25, 1, 0.5, 1)",
                  boxShadow: isCenter
                    ? "0 16px 36px rgba(20,22,63,0.28)"
                    : "0 10px 22px rgba(20,22,63,0.14)",
                  cursor: "pointer",
                }}
              >
                {isCenter && item.ctaUrl ? (
                  <a
                    href={item.ctaUrl}
                    onClick={(e) => {
                      if (onCtaClick) {
                        e.preventDefault();
                        onCtaClick(item);
                      }
                    }}
                    className="absolute inset-0 text-inherit no-underline"
                  >
                    {inner}
                  </a>
                ) : (
                  <div className="absolute inset-0">{inner}</div>
                )}
              </div>
            );
          })}
        </div>

        <button
          type="button"
          onClick={prevSlide}
          aria-label="اسلاید قبلی"
          className="absolute top-1/2 left-2 z-40 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-navy-200 bg-white/90 text-navy-700 shadow-sm sm:left-6 sm:h-10 sm:w-10"
        >
          <ChevronLeft size={18} strokeWidth={2.5} />
        </button>

        <button
          type="button"
          onClick={nextSlide}
          aria-label="اسلاید بعدی"
          className="absolute top-1/2 right-2 z-40 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full border border-navy-200 bg-white/90 text-navy-700 shadow-sm sm:right-6 sm:h-10 sm:w-10"
        >
          <ChevronRight size={18} strokeWidth={2.5} />
        </button>

        <div className="z-30 flex items-center justify-center gap-1.5">
          {items.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => goToSlide(idx)}
              aria-label={`رفتن به اسلاید ${idx + 1}`}
              className={`h-2 rounded-full border-none transition-all duration-300 ${
                idx === currentIndex ? "w-6 bg-brand-yellow" : "w-2 bg-navy-300"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

export const Component = CoverFlowCarousel;
export default CoverFlowCarousel;
