"use client";

import { ArrayCollectionPage } from "@/components/admin/ArrayCollectionPage";

export default function AdminMaterialsPage() {
  return (
    <ArrayCollectionPage
      title="متریال"
      description="افزودن و ویرایش متریال با فیلدهای ساده. برای لیست ویژگی‌ها هر مورد را در یک خط بنویسید."
      collection="materials"
      itemLabel="متریال"
      idKey="name"
      getItemTitle={(item) => String(item.name || "متریال")}
      createEmpty={() => ({
        name: "",
        category: "",
        description: "",
        properties: [],
        grades: "",
      })}
      fields={[
        { key: "name", label: "نام" },
        { key: "category", label: "دسته" },
        { key: "description", label: "توضیح", type: "textarea" },
        {
          key: "properties",
          label: "ویژگی‌ها (هر خط یک مورد)",
          type: "lines",
        },
        { key: "grades", label: "درجات / مدل‌ها" },
      ]}
    />
  );
}
