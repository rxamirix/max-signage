import Link from "next/link";
import { AdminCard, AdminPageHeader } from "@/components/admin/ui";
import { getDashboardStats } from "@/lib/content-store";

const links = [
  { href: "/admin/projects", label: "نمونه کارها", key: "projects" as const },
  { href: "/admin/posts", label: "مقالات", key: "posts" as const },
  { href: "/admin/services", label: "خدمات", key: "services" as const },
  { href: "/admin/locations", label: "شهرها", key: "locations" as const },
  { href: "/admin/materials", label: "متریال", key: "materials" as const },
  { href: "/admin/users", label: "کاربران", key: "users" as const },
  { href: "/admin/jobs", label: "رهگیری", key: "jobs" as const },
  { href: "/admin/leads", label: "لیدها", key: "leads" as const },
];

export default async function AdminDashboardPage() {
  const stats = await getDashboardStats();

  return (
    <div>
      <AdminPageHeader
        title="داشبورد"
        description="خلاصه وضعیت محتوا و میانبرهای مدیریت تابلوسازی مکث."
      />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {links.map((item) => (
          <Link key={item.href} href={item.href} className="group block">
            <AdminCard className="h-full transition group-hover:-translate-y-0.5 group-hover:border-navy-300">
              <div className="flex items-start justify-between gap-3">
                <p className="text-sm font-bold text-navy-500">{item.label}</p>
                <span className="text-xs font-extrabold text-navy-400 transition group-hover:text-navy-700">
                  مشاهده
                </span>
              </div>
              <p className="mt-3 text-3xl font-extrabold text-navy-950">
                {Number(stats[item.key] || 0).toLocaleString("fa-IR")}
              </p>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
