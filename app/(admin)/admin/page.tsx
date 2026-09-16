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
          <Link key={item.href} href={item.href}>
            <AdminCard className="transition hover:-translate-y-0.5 hover:border-navy-300">
              <p className="text-sm font-bold text-navy-500">{item.label}</p>
              <p className="mt-3 text-3xl font-extrabold text-navy-950">
                {stats[item.key]}
              </p>
            </AdminCard>
          </Link>
        ))}
      </div>
    </div>
  );
}
