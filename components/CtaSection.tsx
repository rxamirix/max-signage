import { trustBadges } from "@/lib/site";
import { Button, CheckIcon } from "./ui";

export function CtaSection({
  title = "تابلوی سردر شما، اولین حرفی است که کسب‌وکارتان می‌زند",
  description = "بازدید از محل، طراحی سه‌بعدی روی عکس مغازه شما و استعلام قیمت کاملاً رایگان است. کافی است یک تماس بگیرید.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <section id="cta" className="bg-brand-white py-16 md:py-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-[2rem] border border-navy-900/20 bg-[#05060f] px-6 py-12 shadow-[0_24px_60px_rgba(11,12,38,0.18)] md:px-14 md:py-16">
          <div
            aria-hidden="true"
            className="absolute inset-0 bg-[radial-gradient(ellipse_70%_80%_at_85%_0%,rgba(45,49,146,0.55),transparent_55%),radial-gradient(ellipse_50%_60%_at_10%_100%,rgba(234,234,53,0.14),transparent_50%)]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-x-8 top-0 h-px bg-gradient-to-l from-transparent via-brand-yellow/50 to-transparent"
          />

          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="text-2xl leading-relaxed text-brand-white md:text-4xl">
              {title}
            </h2>
            <p className="mt-5 leading-9 text-white/70 md:text-lg">
              {description}
            </p>

            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
              {trustBadges.map((badge) => (
                <li
                  key={badge}
                  className="flex items-center gap-2 text-sm font-medium text-white/85 md:text-base"
                >
                  <CheckIcon className="size-5 text-brand-yellow" />
                  {badge}
                </li>
              ))}
            </ul>

            <div className="mt-10 flex justify-center">
              <Button href="/contact#quote" size="lg">
                استعلام رایگان
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
