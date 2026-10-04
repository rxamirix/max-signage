import type { Metadata } from "next";
import { AccountDashboard } from "@/components/AccountDashboard";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata({
  title: "حساب کاربری | رهگیری پروژه و گارانتی — تابلوسازی مکث",
  description:
    "وضعیت مراحل ساخت تابلو و میزان گارانتی باقی‌مانده را در حساب کاربری مکث ببینید.",
  path: "/account",
  absoluteTitle: true,
});

export default function AccountPage() {
  return <AccountDashboard />;
}
