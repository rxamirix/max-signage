import Link from "next/link";
import { Button, PhoneText } from "@/components/ui";
import { locations } from "@/lib/locations";
import { services } from "@/lib/services";
import { site } from "@/lib/site";

export const metadata = {
  title: "صفحه پیدا نشد",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <section className="relative overflow-hidden bg-navy-950 py-24 text-brand-white">
      <div className="grid-lines absolute inset-0" aria-hidden="true" />
      <div className="container-page relative text-center">
        <p className="sign-glow text-6xl font-extrabold text-brand-yellow md:text-8xl">
          ۴۰۴
        </p>
        <h1 className="mt-6 text-2xl md:text-4xl">این صفحه روشن نشد</h1>
        <p className="mx-auto mt-5 max-w-xl leading-9 text-brand-white/70">
          آدرسی که دنبال آن بودید وجود ندارد یا جابه‌جا شده است. از این‌جا
          می‌توانید ادامه دهید.
        </p>

        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button href="/" size="lg">
            بازگشت به صفحه اصلی
          </Button>
          <Button
            href={`tel:${site.phone}`}
            variant="outline"
            size="lg"
            external
            className="text-brand-white"
          >
            <span className="tabular">
              <PhoneText />
            </span>
          </Button>
        </div>

        <div className="mx-auto mt-14 max-w-3xl">
          <p className="mb-4 text-sm font-bold text-brand-yellow">خدمات ما</p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {services.map((service) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="rounded-full border border-brand-white/15 px-4 py-2 text-sm transition-colors hover:border-brand-yellow hover:text-brand-yellow"
              >
                {service.shortTitle}
              </Link>
            ))}
          </div>

          <p className="mt-8 mb-4 text-sm font-bold text-brand-yellow">
            شهرهای تحت پوشش
          </p>
          <div className="flex flex-wrap justify-center gap-2.5">
            {locations.map((location) => (
              <Link
                key={location.slug}
                href={`/${location.slug}`}
                className="rounded-full border border-brand-white/15 px-4 py-2 text-sm transition-colors hover:border-brand-yellow hover:text-brand-yellow"
              >
                {location.city}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
