"use client";

import { useEffect, useState } from "react";
import type { SiteSettings } from "@/lib/content-store";
import type { Branch } from "@/lib/site";
import { LinesEditor } from "@/components/admin/form-helpers";
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

  return (
    <div>
      {toast}
      <AdminPageHeader
        title="تنظیمات سایت"
        description="اطلاعات تماس، شعب، آمار، نشان‌های اعتماد و منو — بدون کد."
        actions={
          <AdminButton onClick={save} disabled={saving}>
            {saving ? "در حال ذخیره…" : "ذخیره تنظیمات"}
          </AdminButton>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <AdminCard className="space-y-3">
          <h2 className="font-extrabold text-navy-950">هویت برند</h2>
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
          <AdminInput
            label="سال تأسیس"
            type="number"
            value={String(site.foundingYear)}
            onChange={(e) => set("foundingYear", Number(e.target.value) || 0)}
          />
          <AdminInput
            label="سابقه (عدد)"
            type="number"
            value={String(site.experienceYears)}
            onChange={(e) => set("experienceYears", Number(e.target.value) || 0)}
          />
          <AdminInput
            label="سابقه (نمایش فارسی)"
            value={site.experienceYearsFa}
            onChange={(e) => set("experienceYearsFa", e.target.value)}
          />
          <LinesEditor
            label="بنیان‌گذاران"
            hint="هر نام در یک خط."
            value={site.founders}
            onChange={(founders) => set("founders", founders)}
          />
        </AdminCard>

        <AdminCard className="space-y-3">
          <h2 className="font-extrabold text-navy-950">تماس</h2>
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
          <div className="flex items-center justify-between gap-2">
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
          <div className="flex items-center justify-between gap-2">
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
          <LinesEditor
            label="نشان‌های اعتماد"
            hint="مثلاً طراحی رایگان — هر مورد در یک خط."
            value={site.trustBadges}
            onChange={(trustBadges) => set("trustBadges", trustBadges)}
          />
        </AdminCard>

        <AdminCard className="space-y-4 lg:col-span-2">
          <div className="flex items-center justify-between gap-2">
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
    </div>
  );
}
