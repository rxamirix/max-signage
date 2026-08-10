import type { CSSProperties } from "react";
import { site, stats, trustBadges } from "@/lib/site";
import { MaxWordmark } from "./MaxWordmark";
import { Button, CheckIcon, PhoneIcon, PhoneText } from "./ui";

// On desktop the stage fills the first screen so stats arrive after a scroll.
// On mobile it hugs the content, otherwise the bottom crop marks and the
// numbers sit too far down in empty space.
const stageHeight = "md:min-h-[calc(100svh-5.5rem)]";

// Shared offset for the top padding and the backdrop grid, so a grid line
// lands on the MAX cap line.
const heroTop = "clamp(2.75rem,8vh,5.5rem)";

const wordmarkWidth = "w-[min(90vw,42rem)]";
const gapRule = "mt-[clamp(2.75rem,7vh,4.25rem)]";
const gapHeading = "mt-[clamp(2.5rem,6.5vh,3.75rem)]";
const gapActions = "mt-[clamp(1.75rem,4vh,2.5rem)]";
const gapBadges = "mt-[clamp(1.25rem,2.8vh,1.75rem)]";

// The heading sets the second clause of the promise in brand yellow. Each
// clause is kept unbreakable so the line can only ever wrap at the comma.
const [promiseLead, promiseAccent] = site.brandPromise
  .split("،")
  .map((clause) => clause.trim().replace(/ /g, "\u00a0"));

function Backdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Deep stage + mixed brand wash */}
      <div className="absolute inset-0 bg-[radial-gradient(70rem_42rem_at_50%_-18%,rgba(45,49,146,0.78),transparent_68%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(38rem_26rem_at_78%_18%,rgba(234,234,53,0.09),transparent_62%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(34rem_24rem_at_16%_28%,rgba(61,71,173,0.32),transparent_58%)]" />

      {/* Soft spotlight cone over the sign */}
      <div className="absolute top-0 left-1/2 h-[68%] w-[120%] -translate-x-1/2 blur-3xl">
        <div className="size-full bg-gradient-to-b from-brand-yellow/[0.14] via-navy-500/25 to-transparent [clip-path:polygon(38%_0,62%_0,100%_100%,0_100%)]" />
      </div>

      {/* Faint horizon glow behind stats */}
      <div className="absolute inset-x-0 bottom-[8%] h-56 bg-[radial-gradient(50%_70%_at_50%_100%,rgba(45,49,146,0.18),transparent_75%)] blur-2xl" />

      <div
        className="grid-lines absolute inset-0 opacity-90 [mask-image:radial-gradient(ellipse_72%_62%_at_50%_28%,black,transparent_78%)]"
        style={{ backgroundPosition: "50% var(--hero-top)" }}
      />

      {/* Edge vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_42%,rgba(8,10,26,0.72)_100%)]" />
      <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-b from-transparent to-[#080a1a]" />
    </div>
  );
}

/** Crop marks, like the setout drawing of a sign panel. */
function CornerMarks() {
  const mark = "pointer-events-none absolute size-6 border-brand-yellow/60";
  return (
    <>
      <span
        aria-hidden="true"
        className={`${mark} top-4 left-0 border-t-2 border-l-2`}
      />
      <span
        aria-hidden="true"
        className={`${mark} top-4 right-0 border-t-2 border-r-2`}
      />
      <span
        aria-hidden="true"
        className={`${mark} bottom-4 left-0 border-b-2 border-l-2`}
      />
      <span
        aria-hidden="true"
        className={`${mark} bottom-4 right-0 border-b-2 border-r-2`}
      />
    </>
  );
}

/** A lit rule with end ticks, carrying the track record like a dimension label. */
function ExperienceRule() {
  const tick = "h-2.5 w-0.5 shrink-0 bg-brand-yellow/75";
  const line =
    "relative h-px flex-1 bg-gradient-to-l from-transparent via-brand-yellow/70 to-transparent";
  const glow =
    "animate-glow absolute inset-0 bg-gradient-to-l from-transparent via-brand-yellow to-transparent blur-[5px]";
  const label =
    "hidden shrink-0 text-xs font-medium tracking-wide text-white/55 sm:block md:text-sm";

  return (
    <div className="flex w-full items-center gap-3 md:gap-4">
      <span className={label}>از سال ۱۳۸۵</span>
      <span aria-hidden="true" className={tick} />
      <span aria-hidden="true" className={line}>
        <span className={glow} />
      </span>
      <span className="shrink-0 px-2 text-sm font-bold tracking-wide text-brand-yellow md:px-3 md:text-base">
        {site.experienceYearsFa} سال سابقه ساخت تابلو تبلیغاتی در مازندران
      </span>
      <span aria-hidden="true" className={line}>
        <span className={glow} />
      </span>
      <span aria-hidden="true" className={tick} />
      <span className={label}>ساری · بهشهر · نکا</span>
    </div>
  );
}

export function Hero() {
  return (
    <section
      className="relative isolate overflow-hidden bg-[#080a1a] text-brand-white"
      style={{ "--hero-top": heroTop } as CSSProperties}
    >
      <Backdrop />

      <div className="container-page relative">
        <div className={`relative flex flex-col justify-center ${stageHeight}`}>
          <CornerMarks />

          <div
            className="flex flex-col items-center pb-8 text-center md:pb-14"
            style={{ paddingTop: "var(--hero-top)" }}
          >
            <div className={`animate-fade-up relative ${wordmarkWidth}`}>
              <span
                aria-hidden="true"
                className="animate-glow absolute inset-x-[2%] -inset-y-[52%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(234,234,53,0.3)_0%,rgba(45,49,146,0.4)_48%,transparent_72%)] blur-[72px]"
              />
              <span
                aria-hidden="true"
                className="animate-glow absolute inset-x-[18%] -inset-y-[26%] rounded-[50%] bg-[radial-gradient(ellipse_at_center,rgba(45,49,146,0.38)_0%,rgba(234,234,53,0.24)_52%,transparent_76%)] blur-[52px]"
              />
              <MaxWordmark
                className="relative w-full text-brand-white [filter:drop-shadow(0_0_36px_rgba(45,49,146,0.4))_drop-shadow(0_0_28px_rgba(234,234,53,0.3))]"
                forSeeClassName="fill-brand-yellow"
              />
              <span className="sr-only">{site.nameEn}</span>
            </div>

            <div
              className={`animate-fade-up w-full ${gapRule}`}
              style={{ animationDelay: "160ms" }}
            >
              <ExperienceRule />
            </div>

            <h1
              className={`animate-fade-up text-[clamp(1.35rem,5.1vw,2.75rem)] leading-[1.35] font-extrabold whitespace-nowrap ${gapHeading}`}
              style={{ animationDelay: "220ms" }}
            >
              {promiseLead}
              {"، "}
              <span className="sign-glow text-brand-yellow">{promiseAccent}</span>
            </h1>

            <div
              className={`animate-fade-up flex w-full max-w-md flex-col gap-3 sm:w-auto sm:flex-row ${gapActions}`}
              style={{ animationDelay: "310ms" }}
            >
              <Button href={`tel:${site.phone}`} size="lg" external>
                <PhoneIcon className="size-5" />
                <PhoneText />
              </Button>
              <Button
                href="/contact#quote"
                variant="outline"
                size="lg"
                className="border-brand-yellow/45 text-brand-white hover:border-brand-yellow hover:bg-brand-yellow/10"
              >
                استعلام قیمت رایگان
              </Button>
            </div>

            <ul
              className={`animate-fade-up flex flex-wrap justify-center gap-x-5 gap-y-2.5 ${gapBadges}`}
              style={{ animationDelay: "360ms" }}
            >
              {trustBadges.map((badge) => (
                <li
                  key={badge}
                  className="flex items-center gap-1.5 text-sm font-medium text-white/90"
                >
                  <CheckIcon className="size-4 shrink-0 text-brand-yellow" />
                  {badge}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <dl className="grid grid-cols-2 border-t border-navy-400/35 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="relative px-3 py-7 text-center md:px-6 md:py-9"
            >
              {index > 0 ? (
                <span
                  aria-hidden="true"
                  className="absolute top-1/2 right-0 hidden h-12 w-px -translate-y-1/2 bg-navy-400/40 lg:block"
                />
              ) : null}
              <dt className="text-xs font-medium text-white/60 md:text-sm">
                {stat.label}
              </dt>
              <dd className="mt-2 flex items-end justify-center gap-1.5">
                <bdi
                  dir="ltr"
                  className="text-3xl font-extrabold tracking-tight text-white md:text-5xl"
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
    </section>
  );
}
