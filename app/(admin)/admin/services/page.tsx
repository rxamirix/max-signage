"use client";

import { ArrayCollectionPage } from "@/components/admin/ArrayCollectionPage";

export default function AdminServicesPage() {
  return (
    <ArrayCollectionPage
      title="خدمات"
      description="ویرایش متن، عکس و جزئیات خدمات. شناسه لینک‌های فعلی را تغییر ندهید تا آدرس صفحات نشکند."
      collection="services"
      itemLabel="خدمت"
      idKey="slug"
      idLabel="شناسه لینک"
      getItemTitle={(item) =>
        String(item.shortTitle || item.title || item.slug || "خدمت")
      }
      createEmpty={() => ({
        slug: "",
        title: "",
        shortTitle: "",
        excerpt: "",
        image: "",
        metaTitle: "",
        metaDescription: "",
        keywords: [],
        intro: [],
        features: [],
        specs: [],
        useCases: [],
        faq: [],
      })}
      fields={[
        {
          key: "image",
          label: "عکس خدمت",
          type: "image",
          hint: "این عکس در صفحه خدمات و اسلایدر صفحه اصلی نمایش داده می‌شود.",
        },
        {
          key: "slug",
          label: "شناسه لینک (انگلیسی)",
          hint: "مثلاً chelnium — در آدرس صفحه استفاده می‌شود.",
          dir: "ltr",
        },
        { key: "title", label: "عنوان کامل" },
        { key: "shortTitle", label: "عنوان کوتاه" },
        { key: "excerpt", label: "خلاصه", type: "textarea" },
        {
          key: "metaTitle",
          label: "عنوان گوگل",
          hint: "عنوانی که در نتایج جستجوی گوگل دیده می‌شود.",
        },
        {
          key: "metaDescription",
          label: "توضیح گوگل",
          type: "textarea",
          hint: "یک یا دو جمله کوتاه برای نتایج جستجو.",
        },
        {
          key: "keywords",
          label: "کلمات کلیدی",
          type: "lines",
          hint: "هر کلمه یا عبارت را در یک خط بنویسید.",
        },
        {
          key: "intro",
          label: "مقدمه (پاراگراف‌ها)",
          type: "lines",
          hint: "هر پاراگراف را در یک خط بنویسید.",
        },
        { key: "features", label: "ویژگی‌ها", type: "features" },
        { key: "specs", label: "مشخصات فنی", type: "specs" },
        {
          key: "useCases",
          label: "کاربردها",
          type: "lines",
          hint: "هر کاربرد در یک خط.",
        },
        { key: "faq", label: "سوالات پرتکرار", type: "faq" },
      ]}
    />
  );
}
