import { site } from "@/lib/site";
import { Header } from "./Header";
import { HeroGemScene } from "./HeroGemScene";

const stageHeight = "h-[calc(100svh-4.5rem)] md:h-[calc(100svh-5.5rem)]";

export function WaveDivider({
  fill = "#fefff9",
}: {
  fill?: string;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 leading-none"
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 1440 96"
        preserveAspectRatio="none"
        className="block h-16 w-full md:h-24"
      >
        <path
          fill={fill}
          d="M0 48C180 88 320 8 480 36C640 64 720 92 900 52C1080 12 1260 8 1440 44V96H0V48Z"
        />
        <path
          fill={fill}
          opacity="0.45"
          d="M0 62C220 28 380 78 560 58C740 38 900 6 1100 34C1280 58 1360 70 1440 50V96H0V62Z"
        />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-[#050505]">
      <Header variant="hero" />
      <div className={`relative ${stageHeight}`}>
        <HeroGemScene />
        <div
          className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_80%_70%_at_0%_50%,rgba(5,5,5,0.78)_0%,rgba(5,5,5,0.35)_42%,rgba(5,5,5,0)_70%)]"
          aria-hidden="true"
        />
        <div className="absolute inset-y-0 left-0 z-20 flex w-[58%] items-center px-5 pt-16 md:w-[42%] md:px-10 md:pt-8 lg:w-[40%] lg:px-16">
          <h1
            dir="rtl"
            className="max-w-[8.2em] text-[clamp(2.1rem,4.6vw,5.25rem)] font-extrabold leading-[1.2] text-brand-white"
          >
            مکس برای{" "}
            <span className="text-brand-yellow">دیدن</span>
            <span className="sr-only">
              {" "}
              — {site.name}. {site.brandPromise}
            </span>
          </h1>
        </div>
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-[12] h-[42%] bg-gradient-to-b from-transparent from-0% via-brand-white/35 via-40% to-brand-white to-78% md:h-[46%]"
          aria-hidden="true"
        />
      </div>
    </section>
  );
}
