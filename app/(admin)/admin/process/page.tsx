"use client";

import { ArrayCollectionPage } from "@/components/admin/ArrayCollectionPage";

export default function AdminProcessPage() {
  return <ArrayCollectionPage title="مراحل سفارش" description="متن و تصویر مراحل از اولین تماس تا تحویل نهایی" collection="process" itemLabel="مرحله" idKey="step" getItemTitle={(item) => String(item.title || "مرحله")} createEmpty={() => ({ step: "", title: "", description: "", duration: "", note: "", image: "" })} fields={[
    { key: "step", label: "شماره مرحله" },
    { key: "title", label: "عنوان" },
    { key: "description", label: "توضیحات", type: "textarea" },
    { key: "duration", label: "زمان انجام" },
    { key: "note", label: "نکته" },
    { key: "image", label: "تصویر مرحله", type: "image" },
  ]} />;
}
