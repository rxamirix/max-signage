import { Header } from "./Header";
import { HeroCopy } from "./HeroCopy";
import ShaderShowcase from "@/components/ui/hero";

export function WaveDivider({
  fill = "#fefff9",
}: {
  fill?: string;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 leading-none md:hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent via-[#fefff9]/25 to-[#fefff9]/80" />
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="relative block h-24 w-full sm:h-28"
      >
        <path
          fill={fill}
          opacity="0.55"
          d="M0 72C160 28 280 118 420 78C560 38 680 8 820 48C960 88 1100 128 1260 88C1340 68 1400 52 1440 60V160H0V72Z"
        />
        <path
          fill={fill}
          d="M0 96C200 48 320 128 480 100C640 72 760 24 920 64C1080 104 1220 140 1360 100C1400 88 1420 84 1440 88V160H0V96Z"
        />
      </svg>
    </div>
  );
}

export function Hero() {
  return (
    <section id="hero" className="relative overflow-hidden bg-navy-950">
      <ShaderShowcase>
        <HeroCopy />
      </ShaderShowcase>
      <WaveDivider fill="#fefff9" />
      {/* Header above the wave so the mobile menu never shows cream edges through it */}
      <div className="absolute inset-x-0 top-0 z-50">
        <Header variant="hero" />
      </div>
    </section>
  );
}
