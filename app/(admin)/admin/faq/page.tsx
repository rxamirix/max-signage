"use client";

import { ArrayCollectionPage } from "@/components/admin/ArrayCollectionPage";

export default function AdminFaqPage() {
  return (
    <ArrayCollectionPage
      title="سوالات متداول"
      description="سوالات پرتکرار صفحه اصلی و بخش‌های مرتبط."
      collection="faq"
      itemLabel="سوال"
      idKey="question"
      getItemTitle={(item) => String(item.question || "سوال")}
      createEmpty={() => ({
        question: "",
        answer: "",
      })}
      fields={[
        { key: "question", label: "سوال", type: "textarea" },
        { key: "answer", label: "پاسخ", type: "textarea" },
      ]}
    />
  );
}
