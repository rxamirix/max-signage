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
    <section className="bg-navy-600 py-16 md:py-20">
      <div className="container-page">
        <div className="grid-lines relative overflow-hidden rounded-[2rem] border border-brand-white/10 bg-navy-950 px-6 py-12 md:px-14 md:py-16">
          <div
            aria-hidden="true"
            className="animate-glow absolute -top-24 -left-16 size-72 rounded-full bg-brand-yellow/20 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <h2 className="text-2xl leading-relaxed text-brand-white md:text-4xl">
              {title}
            </h2>
            <p className="mt-5 leading-9 text-brand-white/75 md:text-lg">
              {description}
            </p>

            <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-3">
              {trustBadges.map((badge) => (
                <li
                  key={badge}
                  className="flex items-center gap-2 text-sm font-medium text-brand-white/90 md:text-base"
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
