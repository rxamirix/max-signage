import type { Metadata } from "next";
import { CtaSection } from "@/components/CtaSection";
import { JsonLd } from "@/components/JsonLd";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { Badge, Card, Section, SectionHeading } from "@/components/ui";
import { materials } from "@/lib/content";
import { pageMetadata } from "@/lib/metadata";
import { breadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "متریال و تجهیزات تابلوسازی | چلنیوم، کامپوزیت، استیل و LED – مکس",
  description:
    "معرفی کامل متریال مورد استفاده در تابلوسازی مکس: چلنیوم آلومینیومی، پلکسی‌گلاس، ورق کامپوزیت PVDF، استیل ۳۰۴، ماژول LED ضدآب، پروفیل گالوانیزه و نئون فلکسی.",
  path: "/materials",
  absoluteTitle: true,
  keywords: [
    "متریال تابلوسازی",
    "چلنیوم آلومینیومی",
    "ورق کامپوزیت",
    "پلکسی گلاس",
    "ماژول LED تابلو",
  ],
});

const crumbs = [
  { name: "صفحه اصلی", url: "/" },
  { name: "متریال", url: "/materials" },
];

export default function MaterialsPage() {
  return (
    <>
      <JsonLd data={breadcrumbJsonLd(crumbs)} />

      <PageHero
        eyebrow="متریال"
        title="با چه متریالی تابلوی شما را می‌سازیم"
        crumbs={crumbs}
        description="کیفیت یک تابلو تقریباً به‌طور کامل به متریال و نحوه اجرای آن بستگی دارد. اینجا بدون کلی‌گویی می‌گوییم از چه چیزی استفاده می‌کنیم، چه گریدهایی وجود دارد و چرا این انتخاب‌ها برای اقلیم مازندران اهمیت دارند."
      />

      <Section>
        <div className="grid gap-6 md:grid-cols-2">
          {materials.map((material, index) => (
            <Reveal key={material.name} delay={index * 50}>
              <Card className="h-full">
                <div className="flex items-start justify-between gap-4">
                  <h2 className="text-xl text-navy-900">{material.name}</h2>
                  <Badge>{material.category}</Badge>
                </div>

                <p className="mt-4 leading-8 text-navy-700/85">
                  {material.description}
                </p>

                <ul className="mt-5 flex flex-wrap gap-2">
                  {material.properties.map((property) => (
                    <li
                      key={property}
                      className="rounded-full bg-navy-50 px-3 py-1 text-xs font-medium text-navy-700"
                    >
                      {property}
                    </li>
                  ))}
                </ul>

                <p className="mt-5 border-t border-navy-100 pt-4 text-sm text-navy-700/75">
                  <span className="font-bold text-navy-900">گریدها و انواع: </span>
                  {material.grades}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <Section tone="dark">
        <SectionHeading
          tone="dark"
          eyebrow="نکته مهم"
          title="چرا در مازندران انتخاب متریال حساس‌تر است"
          description="رطوبت بالا، بارندگی زیاد و در مناطق ساحلی هوای نمکی؛ سه عاملی که ضعف متریال و اجرا را خیلی سریع‌تر از سایر استان‌ها آشکار می‌کنند."
        />

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {[
            {
              title: "خوردگی زیرسازی",
              body: "زیرسازی آهن رنگ‌شده در رطوبت بالا زنگ می‌زند و باعث موج برداشتن نما می‌شود. راه‌حل ما پروفیل گالوانیزه در تمام پروژه‌هاست.",
            },
            {
              title: "نفوذ آب به پشت نما",
              body: "درزهای آب‌بندی‌نشده کامپوزیت، آب را به پشت نما و در نهایت به دیوار داخلی می‌رسانند. تمام درزها با نوار و چسب مخصوص آب‌بندی می‌شوند.",
            },
            {
              title: "خرابی زودرس تجهیزات نوری",
              body: "ماژول و ترانس غیرضدآب در شرجی شمال به‌سرعت از کار می‌افتند. ما فقط از ماژول ضدآب و ترانس در جعبه محافظ استفاده می‌کنیم.",
            },
          ].map((item, index) => (
            <Reveal key={item.title} delay={index * 60}>
              <Card tone="dark" className="h-full">
                <h3 className="text-lg text-brand-yellow">{item.title}</h3>
                <p className="mt-3 text-sm leading-8 text-brand-white/70">
                  {item.body}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      <CtaSection
        title="نمونه متریال را از نزدیک ببینید"
        description="در کارگاه بهشهر نمونه چلنیوم، پلکسی، ورق کامپوزیت و استیل موجود است. بدون هماهنگی قبلی هم می‌توانید سر بزنید."
      />
    </>
  );
}
