import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminSession } from "@/lib/admin-auth";

export const metadata: Metadata = {
  title: "پنل مدیریت | تابلوسازی مکث",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Login page has its own minimal layout via route segment — check path via children only
  // Session check for non-login is handled in middleware; shell wraps all admin pages except login
  const session = await getAdminSession();

  // When on login, middleware allows without session — render children bare
  // We detect by checking session: login page is the only unauthenticated admin page
  if (!session) {
    return <>{children}</>;
  }

  return <AdminShell username={session.username}>{children}</AdminShell>;
}
