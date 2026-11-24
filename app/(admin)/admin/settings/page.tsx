"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/content-store";
import type { Branch } from "@/lib/site";
import { LinesEditor } from "@/components/admin/form-helpers";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { defaultHomeSections, defaultHeroContent, defaultPageHeroes, defaultPageDetails, type HomeSections, type PageHeroes } from "@/lib/home-content";
import {
  AdminButton,
  AdminCard,
  AdminInput,
  AdminPageHeader,
  AdminTextarea,
  adminFetch,
  useAdminToast,
} from "@/components/admin/ui";

type NavItem = { href: string; label: string };
type StatItem = { value: string; suffix: string; label: string };

function emptyBranch(): Branch {
  return {
    id: "",
    title: "",
    city: "",
    address: "",
    geo: { lat: 0, lng: 0 },
    mapUrl: "",
  };
}

export default function AdminSettingsPage() {
  const { toast, showSuccess, showError } = useAdminToast();
  const [site, setSite] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    adminFetch("/api/admin/site")
      .then((res) => setSite(res.data as SiteSettings))
      .catch((e) => showError(e.message));
  }, [showError]);

  function set<K extends keyof SiteSettings>(key: K, value: SiteSettings[K]) {
    setSite((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function save() {
    if (!site) return;
    setSaving(true);
    try {
      await adminFetch("/api/admin/site", {
        method: "PUT",
        body: JSON.stringify({ data: site }),
      });
      showSuccess("تنظیمات ذخیره شد");
    } catch (e) {
      showError(e instanceof Error ? e.message : "خطا در ذخیره");
    } finally {
      setSaving(false);
    }
  }

  if (!site) {
    return <p className="text-sm text-navy-500">در حال بارگذاری…</p>;
  }
  const home = site.homeSections ?? defaultHomeSections;
  const hero = site.heroContent ?? defaultHeroContent;
  const pageHeroes = site.pageHeroes ?? defaultPageHeroes;
  const details = site.pageDetails ?? defaultPageDetails;
  const brandImages = site.brandImages ?? { hero: "", light: "", dark: "", footer: "" };
  const sectionLabels: Record<keyof HomeSections, string> = { services: "خدمات", portfolio: "نمونه کارها", difference: "تفاوت مکث", process: "مراحل سفارش", materials: "متریال", testimonials: "نظرات مشتریان", blog: "مقالات", faq: "سوالات متداول", cta: "دعوت به استعلام" };

  return (
    <div className="pb-24">
      {toast}
      <AdminPageHeader
        title="تنظیمات سایت"
        description="اطلاعات تماس، شعب، آمار، نشان‌های اعتماد و منو — بدون کد."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard className="space-y-4 lg:col-span-2">
          <h2 className="border-b border-navy-100 pb-2 font-extrabold text-navy-950">هیروی صفحه اصلی</h2>
          <ImageUploadField label="تصویر اصلی هیرو" value={hero.image} previewFallback={defaultHeroContent.image} onChange={(url) => set("heroContent", { ...hero, image: url })} />
          <div className="grid gap-3 sm:grid-cols-2">
            <AdminInput label="خط اول تیتر هیرو" value={hero.headlineTop} onChange={(e) => set("heroContent", { ...hero, headlineTop: e.target.value })} />
            <AdminInput label="خط دوم تیتر هیرو" value={hero.headlineBottom} onChange={(e) => set("heroContent", { ...hero, headlineBottom: e.target.value })} />
            <AdminInput label="دکمه مشاوره" value={hero.primaryLabel} onChange={(e) => set("heroContent", { ...hero, primaryLabel: e.target.value })} />
            <AdminInput label="دکمه نمونه کارها" value={hero.secondaryLabel} onChange={(e) => set("heroContent", { ...hero, secondaryLabel: e.target.value })} />
          </div>
        </AdminCard>
        <AdminCard className="space-y-4 lg:col-span-2">
          <h2 className="border-b border-navy-100 pb-2 font-extrabold text-navy-950">متن بخش‌های صفحه اصلی</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {(Object.keys(sectionLabels) as (keyof HomeSections)[]).map((key) => <div key={key} className="space-y-2 rounded-2xl border border-navy-100 p-3">
              <h3 className="font-bold text-navy-900">{sectionLabels[key]}</h3>
              <AdminInput label="عنوان" value={home[key].title} onChange={(e) => set("homeSections", { ...home, [key]: { ...home[key], title: e.target.value } })} />
              <AdminTextarea label="توضیح" value={home[key].description} onChange={(e) => set("homeSections", { ...home, [key]: { ...home[key], description: e.target.value } })} />
            </div>)}
          </div>
        </AdminCard>
        <AdminCard className="space-y-3 lg:col-span-2">
          <h2 className="border-b border-navy-100 pb-2 font-extrabold text-navy-950">عنوان و توضیح صفحات داخلی</h2>
          <div className="grid gap-4 lg:grid-cols-2">
            {(Object.keys(pageHeroes) as (keyof PageHeroes)[]).map((key) => <div key={key} className="space-y-2 rounded-2xl border border-navy-100 p-3">
              <h3 className="font-bold text-navy-900">{({ "/services": "خدمات", "/portfolio": "نمونه کارها", "/materials": "متریال", "/about": "درباره ما", "/blog": "مقالات", "/contact": "ارتباط با ما" })[key]}</h3>
              <AdminInput label="عنوان هیرو" value={pageHeroes[key].title} onChange={(e) => set("pageHeroes", { ...pageHeroes, [key]: { ...pageHeroes[key], title: e.target.value } })} />
              <AdminTextarea label="توضیح هیرو" value={pageHeroes[key].description} onChange={(e) => set("pageHeroes", { ...pageHeroes, [key]: { ...pageHeroes[key], description: e.target.value } })} />
            </div>)}
          </div>
        </AdminCard>
        <AdminCard className="space-y-3 lg:col-span-2">
          <h2 className="border-b border-navy-100 pb-2 font-extrabold text-navy-950">تصاویر صفحات</h2>
          <ImageUploadField label="تصویر کارگاه در صفحه درباره ما" value={site.aboutImage || "/images/services/chelnium.jpg"} onChange={(url) => set("aboutImage", url)} />
          <div className="grid gap-3 lg:grid-cols-2">
            <ImageUploadField label="لوگوی هدر روشن و ورود" value={brandImages.light} previewFallback="/logo-mark-navy.png" onChange={(url) => set("brandImages", { ...brandImages, light: url })} />
            <ImageUploadField label="لوگوی هدر تیره" value={brandImages.dark} previewFallback="/logo-mark-white.png" onChange={(url) => set("brandImages", { ...brandImages, dark: url })} />
            <ImageUploadField label="لوگوی فوتر" value={brandImages.footer} previewFallback="/logo-max-white.png" onChange={(url) => set("brandImages", { ...brandImages, footer: url })} />
          </div>
        </AdminCard>
        <AdminCard className="space-y-4 lg:col-span-2">
          <h2 className="border-b border-navy-100 pb-2 font-extrabold text-navy-950">محتوای صفحات داخلی</h2>
          <details className="rounded-xl border border-navy-100 p-4">
            <summary className="cursor-pointer font-bold">عنوان بخش‌های صفحات داخلی</summary>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {([['serviceGuideTitle','عنوان راهنمای خدمات'],['serviceGuideDescription','توضیح راهنمای خدمات'],['climateTitle','عنوان نکات متریال'],['climateDescription','توضیح نکات متریال'],['aboutStoryTitle','عنوان داستان مکث'],['aboutValuesTitle','عنوان اصول کاری'],['contactBranchesTitle','عنوان شعب'],['contactFaqTitle','عنوان سوالات تماس'],['contactLocationsTitle','عنوان شهرها'],['contactQuoteTitle','عنوان فرم استعلام']] as const).map(([key,label]) => <AdminInput key={key} label={label} value={details[key]} onChange={(e) => set("pageDetails", { ...details, [key]: e.target.value })} />)}
            </div>
          </details>
          <details className="rounded-xl border border-navy-100 p-4">
            <summary className="cursor-pointer font-bold">درباره ما</summary>
            <div className="mt-4 space-y-3"><LinesEditor label="داستان مکث (هر بند در یک خط)" value={details.aboutStory} onChange={(aboutStory) => set("pageDetails", { ...details, aboutStory })} />
            {details.aboutValues.map((item, index) => <div className="grid gap-2 rounded-xl bg-navy-50/50 p-3" key={index}>
              <AdminInput label="عنوان اصل کاری" value={item.title} onChange={(e) => set("pageDetails", { ...details, aboutValues: details.aboutValues.map((value, i) => i === index ? { ...value, title: e.target.value } : value) })} />
              <AdminTextarea label="توضیح" value={item.description} onChange={(e) => set("pageDetails", { ...details, aboutValues: details.aboutValues.map((value, i) => i === index ? { ...value, description: e.target.value } : value) })} />
            </div>)}</div>
          </details>
          <details className="rounded-xl border border-navy-100 p-4">
            <summary className="cursor-pointer font-bold">نکات اقلیمی متریال</summary>
            <div className="mt-4 space-y-3">{details.climate.map((item, index) => <div className="grid gap-2 rounded-xl bg-navy-50/50 p-3" key={index}>
              <AdminInput label="عنوان" value={item.title} onChange={(e) => set("pageDetails", { ...details, climate: details.climate.map((value, i) => i === index ? { ...value, title: e.target.value } : value) })} />
              <AdminTextarea label="توضیح" value={item.body} onChange={(e) => set("pageDetails", { ...details, climate: details.climate.map((value, i) => i === index ? { ...value, body: e.target.value } : value) })} />
            </div>)}</div>
          </details>
          <details className="rounded-xl border border-navy-100 p-4">
            <summary className="cursor-pointer font-bold">راهنمای انتخاب خدمات</summary>
            <div className="mt-4 space-y-3">{details.serviceChoices.map((row, index) => <div className="grid gap-2 rounded-xl bg-navy-50/50 p-3" key={index}>
              {row.map((value, fieldIndex) => <AdminInput key={fieldIndex} label={["نیاز مشتری", "خدمت پیشنهادی", "توضیح"][fieldIndex]} value={value} onChange={(e) => set("pageDetails", { ...details, serviceChoices: details.serviceChoices.map((item, i) => i === index ? item.map((entry, j) => j === fieldIndex ? e.target.value : entry) : item) })} />)}
            </div>)}</div>
          </details>
          <details className="rounded-xl border border-navy-100 p-4">
            <summary className="cursor-pointer font-bold">سوالات صفحه ارتباط با ما</summary>
            <div className="mt-4 space-y-3">{details.contactFaq.map((item, index) => <div className="grid gap-2 rounded-xl bg-navy-50/50 p-3" key={index}>
              <AdminInput label="سوال" value={item.question} onChange={(e) => set("pageDetails", { ...details, contactFaq: details.contactFaq.map((value, i) => i === index ? { ...value, question: e.target.value } : value) })} />
              <AdminTextarea label="پاسخ" value={item.answer} onChange={(e) => set("pageDetails", { ...details, contactFaq: details.contactFaq.map((value, i) => i === index ? { ...value, answer: e.target.value } : value) })} />
            </div>)}</div>
          </details>
        </AdminCard>
        <AdminCard className="space-y-3">
          <h2 className="border-b border-navy-100 pb-2 font-extrabold text-navy-950">
            هویت برند
          </h2>
          <AdminInput
            label="نام فارسی"
            value={site.name}
            onChange={(e) => set("name", e.target.value)}
          />
          <AdminInput
            label="نام انگلیسی"
            value={site.nameEn}
            onChange={(e) => set("nameEn", e.target.value)}
          />
          <AdminInput
            label="نام کوتاه"
            value={site.shortName}
            onChange={(e) => set("shortName", e.target.value)}
          />
          <AdminInput
            label="شعار فارسی"
            value={site.motto}
            onChange={(e) => set("motto", e.target.value)}
          />
          <AdminInput
            label="شعار انگلیسی"
            value={site.mottoEn}
            onChange={(e) => set("mottoEn", e.target.value)}
          />
          <AdminInput
            label="وعده برند"
            value={site.brandPromise}
            onChange={(e) => set("brandPromise", e.target.value)}
          />
          <AdminTextarea
            label="توضیح کوتاه سایت (برای گوگل)"
            value={site.description}
            onChange={(e) => set("description", e.target.value)}
          />
          <AdminTextarea label="متن معرفی در فوتر (خالی = متن خودکار)" value={site.footerDescription ?? ""} onChange={(e) => set("footerDescription", e.target.value)} />
          <AdminInput
            label="سابقه (نمایش فارسی)"
            value={site.experienceYearsFa}
            onChange={(e) => set("experienceYearsFa", e.target.value)}
          />
        </AdminCard>

        <AdminCard className="space-y-3">
          <h2 className="border-b border-navy-100 pb-2 font-extrabold text-navy-950">
            تماس
          </h2>
          <AdminInput
            label="شماره تلفن (برای تماس)"
            value={site.phone}
            onChange={(e) => set("phone", e.target.value)}
            dir="ltr"
          />
          <AdminInput
            label="نمایش تلفن در سایت"
            value={site.phoneDisplay}
            onChange={(e) => set("phoneDisplay", e.target.value)}
            dir="ltr"
            hint="همان شماره‌ای که روی سایت دیده می‌شود — با فاصله هم بنویسید، مثلاً ۰۹۱۱ ۲۵۸ ۸۸۴۶"
          />
          <AdminInput
            label="تلفن بین‌المللی"
            value={site.phoneIntl}
            onChange={(e) => set("phoneIntl", e.target.value)}
            dir="ltr"
          />
          <AdminInput
            label="واتساپ (بدون +)"
            value={site.whatsapp}
            onChange={(e) => set("whatsapp", e.target.value)}
            dir="ltr"
          />
          <AdminInput
            label="آدرس اینستاگرام"
            value={site.instagram}
            onChange={(e) => set("instagram", e.target.value)}
            dir="ltr"
          />
          <AdminInput
            label="آیدی اینستاگرام"
            value={site.instagramHandle}
            onChange={(e) => set("instagramHandle", e.target.value)}
            dir="ltr"
          />
          <AdminInput
            label="ایمیل"
            value={site.email}
            onChange={(e) => set("email", e.target.value)}
            dir="ltr"
          />
          <AdminInput
            label="ساعات کاری"
            value={site.workingHours}
            onChange={(e) => set("workingHours", e.target.value)}
          />
          <AdminInput
            label="آدرس سایت"
            value={site.url}
            onChange={(e) => set("url", e.target.value)}
            dir="ltr"
          />
        </AdminCard>

        <AdminCard className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between gap-2 border-b border-navy-100 pb-2">
            <h2 className="font-extrabold text-navy-950">شعب</h2>
            <AdminButton
              variant="secondary"
              onClick={() => set("branches", [...site.branches, emptyBranch()])}
            >
              + شعبه
            </AdminButton>
          </div>
          {site.branches.map((branch, i) => (
            <div
              key={i}
              className="grid gap-3 rounded-2xl border border-navy-100 p-4 sm:grid-cols-2"
            >
              <AdminInput
                label="شناسه شعبه (انگلیسی)"
                value={branch.id}
                onChange={(e) => {
                  const branches = [...site.branches];
                  branches[i] = { ...branches[i], id: e.target.value };
                  set("branches", branches);
                }}
                dir="ltr"
              />
              <AdminInput
                label="عنوان شعبه"
                value={branch.title}
                onChange={(e) => {
                  const branches = [...site.branches];
                  branches[i] = { ...branches[i], title: e.target.value };
                  set("branches", branches);
                }}
              />
              <AdminInput
                label="شهر"
                value={branch.city}
                onChange={(e) => {
                  const branches = [...site.branches];
                  branches[i] = { ...branches[i], city: e.target.value };
                  set("branches", branches);
                }}
              />
              <AdminInput
                label="آدرس"
                value={branch.address}
                onChange={(e) => {
                  const branches = [...site.branches];
                  branches[i] = { ...branches[i], address: e.target.value };
                  set("branches", branches);
                }}
              />
              <AdminInput
                label="عرض جغرافیایی"
                type="number"
                value={String(branch.geo?.lat ?? 0)}
                onChange={(e) => {
                  const branches = [...site.branches];
                  branches[i] = {
                    ...branches[i],
                    geo: { ...branches[i].geo, lat: Number(e.target.value) || 0 },
                  };
                  set("branches", branches);
                }}
                dir="ltr"
              />
              <AdminInput
                label="طول جغرافیایی"
                type="number"
                value={String(branch.geo?.lng ?? 0)}
                onChange={(e) => {
                  const branches = [...site.branches];
                  branches[i] = {
                    ...branches[i],
                    geo: { ...branches[i].geo, lng: Number(e.target.value) || 0 },
                  };
                  set("branches", branches);
                }}
                dir="ltr"
              />
              <div className="sm:col-span-2">
                <AdminInput
                  label="لینک نقشه"
                  value={branch.mapUrl}
                  onChange={(e) => {
                    const branches = [...site.branches];
                    branches[i] = { ...branches[i], mapUrl: e.target.value };
                    set("branches", branches);
                  }}
                  dir="ltr"
                />
              </div>
              <AdminButton
                variant="danger"
                onClick={() =>
                  set(
                    "branches",
                    site.branches.filter((_, idx) => idx !== i),
                  )
                }
              >
                حذف شعبه
              </AdminButton>
            </div>
          ))}
        </AdminCard>

        <AdminCard className="space-y-4">
          <div className="flex items-center justify-between gap-2 border-b border-navy-100 pb-2">
            <h2 className="font-extrabold text-navy-950">آمار صفحه اصلی</h2>
            <AdminButton
              variant="secondary"
              onClick={() =>
                set("stats", [
                  ...site.stats,
                  { value: "", suffix: "", label: "" } as StatItem,
                ])
              }
            >
              + آمار
            </AdminButton>
          </div>
          {site.stats.map((stat, i) => (
            <div key={i} className="grid gap-2 rounded-xl bg-navy-50/50 p-3 sm:grid-cols-3">
              <AdminInput
                label="عدد"
                value={stat.value}
                onChange={(e) => {
                  const stats = [...site.stats];
                  stats[i] = { ...stats[i], value: e.target.value };
                  set("stats", stats);
                }}
              />
              <AdminInput
                label="پسوند"
                value={stat.suffix}
                onChange={(e) => {
                  const stats = [...site.stats];
                  stats[i] = { ...stats[i], suffix: e.target.value };
                  set("stats", stats);
                }}
              />
              <AdminInput
                label="عنوان"
                value={stat.label}
                onChange={(e) => {
                  const stats = [...site.stats];
                  stats[i] = { ...stats[i], label: e.target.value };
                  set("stats", stats);
                }}
              />
              <AdminButton
                variant="danger"
                onClick={() =>
                  set(
                    "stats",
                    site.stats.filter((_, idx) => idx !== i),
                  )
                }
              >
                حذف
              </AdminButton>
            </div>
          ))}
        </AdminCard>

        <AdminCard className="space-y-3">
          <h2 className="border-b border-navy-100 pb-2 font-extrabold text-navy-950">
            اعتماد و نشان‌ها
          </h2>
          <LinesEditor
            label="نشان‌های اعتماد"
            hint="مثلاً طراحی رایگان — هر مورد در یک خط."
            value={site.trustBadges}
            onChange={(trustBadges) => set("trustBadges", trustBadges)}
          />
        </AdminCard>

        <AdminCard className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between gap-2 border-b border-navy-100 pb-2">
            <h2 className="font-extrabold text-navy-950">منوی سایت</h2>
            <AdminButton
              variant="secondary"
              onClick={() =>
                set("navigation", [
                  ...site.navigation,
                  { href: "/", label: "" } as NavItem,
                ])
              }
            >
              + آیتم منو
            </AdminButton>
          </div>
          {site.navigation.map((item, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
              <AdminInput
                label="متن منو"
                value={item.label}
                onChange={(e) => {
                  const navigation = [...site.navigation];
                  navigation[i] = { ...navigation[i], label: e.target.value };
                  set("navigation", navigation);
                }}
              />
              <AdminInput
                label="آدرس صفحه"
                value={item.href}
                onChange={(e) => {
                  const navigation = [...site.navigation];
                  navigation[i] = { ...navigation[i], href: e.target.value };
                  set("navigation", navigation);
                }}
                dir="ltr"
              />
              <AdminButton
                variant="danger"
                onClick={() =>
                  set(
                    "navigation",
                    site.navigation.filter((_, idx) => idx !== i),
                  )
                }
              >
                حذف
              </AdminButton>
            </div>
          ))}
        </AdminCard>
      </div>

      <div className="fixed bottom-0 end-0 start-0 z-40 border-t border-navy-100 bg-navy-50/90 backdrop-blur-sm md:start-[15.5rem]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <p className="hidden text-xs font-bold text-navy-500 sm:block">
            تغییرات تا ذخیره شدن اعمال نمی‌شوند.
          </p>
          <AdminButton onClick={save} disabled={saving} className="ms-auto">
            {saving ? "در حال ذخیره…" : "ذخیره تنظیمات"}
          </AdminButton>
        </div>
      </div>
    </div>
  );
}
