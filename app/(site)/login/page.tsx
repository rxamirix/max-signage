import type { Metadata } from "next";
import { LoginForm, LoginPageShell } from "@/components/LoginForm";
import { pageMetadata } from "@/lib/metadata";
import { getSiteSettings } from "@/lib/content-store";

export const metadata: Metadata = pageMetadata({
  title: "ورود | تأیید شماره موبایل — تابلوسازی مکث",
  description:
    "ورود به تابلوسازی مکث با نام و شماره موبایل. کد تأیید پیامکی دریافت کنید و درخواست خود را ثبت کنید.",
  path: "/login",
  absoluteTitle: true,
});

export default async function LoginPage() {
  const site = await getSiteSettings();
  return (
    <LoginPageShell logo={site.brandImages?.light || "/logo-mark-navy.png"}>
      <LoginForm />
    </LoginPageShell>
  );
}
