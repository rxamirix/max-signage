"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  AdminButton,
  AdminCard,
  AdminPageHeader,
  useAdminToast,
} from "@/components/admin/ui";

export default function AdminProfilePage() {
  const router = useRouter();
  const { toast, showSuccess } = useAdminToast();
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    await fetch("/api/admin/logout", { method: "POST" });
    showSuccess("خارج شدید");
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div>
      {toast}
      <AdminPageHeader
        title="پروفایل"
        description="وضعیت نشست ادمین. تغییر رمز از طریق متغیرهای محیطی ADMIN_PASSWORD انجام می‌شود."
      />
      <AdminCard className="max-w-xl space-y-4">
        <p className="text-sm leading-7 text-navy-600">
          برای امنیت بیشتر، مقدار{" "}
          <code className="rounded bg-navy-50 px-1">ADMIN_SECRET</code> و{" "}
          <code className="rounded bg-navy-50 px-1">ADMIN_PASSWORD</code> را در{" "}
          <code className="rounded bg-navy-50 px-1">.env.local</code> عوض کنید و
          سرور را ری‌استارت کنید.
        </p>
        <AdminButton variant="danger" onClick={logout} disabled={loading}>
          {loading ? "خروج…" : "خروج از حساب"}
        </AdminButton>
      </AdminCard>

      <AdminCard className="mt-4 max-w-xl">
        <h2 className="font-extrabold text-navy-950">قفل طراحی</h2>
        <p className="mt-2 text-sm leading-7 text-navy-600">
          هیرو VolumetricStudio، انیمیشن نور، CoverFlow و سایر کامپوننت‌های
          بصری دست‌ساز فقط توسط توسعه‌دهنده قابل تغییرند و در این پنل فرم
          ویرایش ندارند.
        </p>
      </AdminCard>
    </div>
  );
}
