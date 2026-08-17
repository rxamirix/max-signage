import type { CSSProperties } from "react";
import Image from "next/image";
import { site, stats, trustBadges } from "@/lib/site";
import { Header } from "./Header";
import { MaxWordmark } from "./MaxWordmark";
import { Button, CheckIcon } from "./ui";

const stageHeight = "min-h-[calc(100svh-4.5rem)] md:min-h-[calc(100svh-5.5rem)]";
const heroTop = "clamp(1.25rem,3vh,2.25rem)";
const wordmarkWidth = "w-[min(88vw,40rem)]";

function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Fixed photo — stays put while content scrolls */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: "url(/images/hero/signage-street.jpg)",
          backgroundAttachment: "fixed",
          backgroundSize: "cover",
          backgroundPosition: "center 40%",
        }}
      />
      <Image
        src="/images/hero/signage-street.jpg"
        alt=""
        width={2400}
        height={1350}
        priority
        sizes="100vw"
        className="pointer-events-none absolute h-px w-px opacity-0"
      />

      {/* Light wash — photo stays visible, text still readable */}
      <div className="absolute inset-0 bg-navy-950/35" />
      <div className="absolute inset-0 bg-gradient-to-b from-navy-950/55 via-navy-900/25 to-navy-950/60" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_50%_at_50%_40%,rgba(8,10,32,0.45)_0%,transparent_70%)]" />

      {/* Soft motion on top of the fixed photo */}
      <span className="animate-orb-float absolute top-[10%] left-[6%] size-[26rem] rounded-full bg-brand-yellow/16 blur-[110px]" />
      <span
        className="animate-orb-float absolute right-[4%] bottom-[16%] size-[20rem] rounded-full bg-navy-400/28 blur-[95px]"
        style={{ animationDelay: "2.4s" }}
      />
      <span className="animate-light-sweep absolute inset-y-[8%] left-0 w-1/3 bg-gradient-to-r from-transparent via-brand-white/14 to-transparent" />
      <span className="animate-glow absolute inset-x-[18%] top-[22%] h-40 rounded-full bg-brand-yellow/10 blur-[70px]" />
    </div>
  );
}

function WaveDivider() {
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
          fill="#fefff9"
          d="M0 48C180 88 320 8 480 36C640 64 720 92 900 52C1080 12 1260 8 1440 44V96H0V48Z"
        />
        <path
          fill="#fefff9"
          opacity="0.45"
          d="M0 62C220 28 380 78 560 58C740 38 900 6 1100 34C1280 58 1360 70 1440 50V96H0V62Z"
        />
      </svg>
    </div>
  );
}



export function Hero() {
  return (
    <section
      className="relative overflow-hidden bg-navy-950 text-brand-white"
      style={{ "--hero-top": heroTop } as CSSProperties}
    >
      <Backdrop />

      <Header variant="hero" />

      <div className="container-page relative z-10">
        <div className={`relative flex flex-col justify-center ${stageHeight}`}>
          <div
            className="mx-auto flex w-full max-w-4xl flex-col items-center pb-4 text-center md:pb-6"
            style={{ paddingTop: "var(--hero-top)" }}
          >
            <div className={`animate-fade-up relative mx-auto ${wordmarkWidth}`}>
              <span
                aria-hidden="true"
                className="animate-glow absolute inset-x-[-8%] -inset-y-[60%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(234,234,53,0.38)_0%,rgba(45,49,146,0.4)_42%,transparent_70%)] blur-[80px]"
              />
              <MaxWordmark
                className="relative mx-auto block w-full text-brand-white drop-shadow-[0_2px_24px_rgba(0,0,0,0.65)] [filter:drop-shadow(0_0_28px_rgba(234,234,53,0.35))]"
                forSeeClassName="fill-brand-yellow"
              />
              <h1 className="sr-only">
                {site.name} — طراحی، ساخت و نصب تابلو تبلیغاتی در مازندران از ایده
                تا نصب. {site.brandPromise}
              </h1>
            </div>

            <ul
              className="animate-fade-up mt-[clamp(1.5rem,4vh,2.5rem)] flex flex-wrap items-center justify-center gap-y-2 text-sm font-medium text-brand-white md:text-base"
              style={{ animationDelay: "140ms" }}
            >
              {trustBadges.map((badge, index) => (
                <li key={badge} className="flex items-center">
                  {index > 0 ? (
                    <span
                      aria-hidden="true"
                      className="mx-3 h-4 w-px bg-brand-white/30 md:mx-4"
                    />
                  ) : null}
                  <span className="inline-flex items-center gap-1.5 drop-shadow-sm">
                    <CheckIcon className="size-4 shrink-0 text-brand-yellow" />
                    {badge}
                  </span>
                </li>
              ))}
            </ul>

            <div
              className="animate-fade-up mt-[clamp(1.25rem,3vh,2rem)] flex w-full max-w-md flex-col gap-3 sm:w-auto sm:flex-row sm:justify-center"
              style={{ animationDelay: "240ms" }}
            >
              <Button href="/contact#quote" size="lg">
                استعلام
              </Button>
              <Button
                href="/portfolio"
                variant="outline"
                size="lg"
                className="border-brand-white/50 bg-white/5 text-brand-white backdrop-blur-sm hover:border-brand-yellow hover:bg-brand-yellow/15"
              >
                نمونه کار
              </Button>
            </div>
          </div>

          <dl className="relative z-10 mb-10 grid grid-cols-2 border-t border-brand-white/20 md:mb-14 lg:mb-16 lg:grid-cols-4">
            {stats.map((stat, index) => (
              <div
                key={stat.label}
                className="relative px-3 py-5 text-center md:px-6 md:py-6"
              >
                {index > 0 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-1/2 right-0 hidden h-12 w-px -translate-y-1/2 bg-brand-white/25 lg:block"
                  />
                ) : null}
                <dt className="text-xs font-medium text-white/75 md:text-sm">
                  {stat.label}
                </dt>
                <dd className="mt-2 flex items-end justify-center gap-1.5">
                  <bdi
                    dir="ltr"
                    className="text-3xl font-extrabold tracking-tight text-white drop-shadow-md md:text-5xl"
                  >
                    {stat.value}
                  </bdi>
                  <span className="mb-1 text-sm font-bold text-brand-yellow md:mb-1.5 md:text-base">
                    {stat.suffix}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <WaveDivider />
    </section>
  );
}
