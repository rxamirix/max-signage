import { trustBadges as defaultTrustBadges } from "@/lib/site";
import { ArrowUpLeft, MessageCircle } from "lucide-react";
import { Button, CheckIcon } from "./ui";

export function CtaSection({
  title = "تابلوی سردر شما، اولین حرفی است که کسب‌وکارتان می‌زند",
  description = "بازدید از محل، طراحی سه‌بعدی روی عکس مغازه شما و استعلام قیمت کاملاً رایگان است. کافی است یک تماس بگیرید.",
  trustBadges = defaultTrustBadges as unknown as string[],
}: {
  title?: string;
  description?: string;
  trustBadges?: string[];
}) {
  return (
    <section id="cta" className="cta-home-section bg-brand-white py-14 md:py-20">
      <div className="container-page">
        <div className="cta-home-card relative grid items-center gap-8 overflow-hidden rounded-[34px] border border-white/10 px-6 py-9 text-white sm:px-9 md:py-12 lg:grid-cols-[1.5fr_1fr] lg:gap-12 lg:px-12">
          <div className="cta-home-orbit" aria-hidden="true" />
          <div className="relative">
            <span className="mb-5 block h-1 w-14 rounded-full bg-brand-yellow" aria-hidden="true" />
            <h2 className="max-w-2xl text-2xl leading-relaxed text-brand-white sm:text-3xl md:text-4xl">
              {title}
            </h2>
            <p className="mt-5 max-w-xl leading-8 text-white/75 md:text-lg">
              {description}
            </p>

            <div className="mt-7 flex flex-wrap gap-3">
              <Button href="/contact#quote" size="lg">استعلام رایگان <ArrowUpLeft className="size-4" aria-hidden="true" /></Button>
              <Button href="/contact" variant="outline" size="lg">تماس با ما</Button>
            </div>
          </div>
          <div className="cta-support-card relative hidden rounded-[26px] border border-white/15 p-6 sm:block sm:p-7">
            <div className="mb-5 flex items-center gap-3"><span className="grid size-11 place-items-center rounded-[14px] bg-navy-600 text-white"><MessageCircle className="size-5" aria-hidden="true" /></span><p className="text-lg font-extrabold text-white">با خیال راحت سفارش دهید</p></div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {trustBadges.map((badge) => (
                <li
                  key={badge}
                  className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-white/90"
                >
                  <CheckIcon className="size-5 shrink-0 text-navy-200" />
                  {badge}
                </li>
              ))}
            </ul>

          </div>
        </div>
      </div>
    </section>
  );
}
