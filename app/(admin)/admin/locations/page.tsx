"use client";

import { ArrayCollectionPage } from "@/components/admin/ArrayCollectionPage";

export default function AdminLocationsPage() {
  return (
    <ArrayCollectionPage
      title="شهرها / سئو محلی"
      description="صفحات تابلو تبلیغاتی هر شهر را با فرم فارسی ویرایش کنید."
      collection="locations"
      itemLabel="شهر"
      idKey="slug"
      idLabel="شناسه لینک"
      getItemTitle={(item) => String(item.city || item.title || item.slug)}
      createEmpty={() => ({
        slug: "tablo-tabligati-",
        city: "",
        title: "",
        metaTitle: "",
        metaDescription: "",
        keywords: [],
        intro: [],
        localContext: "",
        neighborhoods: [],
        nearestBranch: "",
        travelNote: "",
        faq: [],
      })}
      fields={[
        {
          key: "slug",
          label: "شناسه لینک (انگلیسی)",
          hint: "مثلاً tablo-tabligati-sari",
          dir: "ltr",
        },
        { key: "city", label: "شهر" },
        { key: "title", label: "عنوان صفحه" },
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
        { key: "localContext", label: "بافت محلی", type: "textarea" },
        {
          key: "neighborhoods",
          label: "محله‌ها و خیابان‌ها",
          type: "lines",
          hint: "هر محله یا خیابان در یک خط.",
        },
        { key: "nearestBranch", label: "نزدیک‌ترین شعبه" },
        { key: "travelNote", label: "توضیح رفت‌وآمد", type: "textarea" },
        { key: "faq", label: "سوالات پرتکرار", type: "faq" },
      ]}
    />
  );
}
