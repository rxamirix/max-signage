"use client";

import { ArrayCollectionPage } from "@/components/admin/ArrayCollectionPage";

export default function AdminDifferentiatorsPage() {
  return <ArrayCollectionPage title="مزیت‌های مکث" description="کارت‌های بخش تفاوت مکث در صفحه اصلی" collection="differentiators" itemLabel="مزیت" idKey="title" getItemTitle={(item) => String(item.title || "مزیت")} createEmpty={() => ({ title: "", description: "" })} fields={[
    { key: "title", label: "عنوان" },
    { key: "description", label: "توضیح", type: "textarea" },
  ]} />;
}
