"use client";

import { useState } from "react";
import Link from "next/link";
import { MaxWordmark } from "@/components/MaxWordmark";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const inputClass =
  "w-full rounded-xl border border-navy-200 bg-brand-white px-4 py-3.5 text-navy-900 outline-none transition-colors placeholder:text-navy-400 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20";

export function LoginForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [code, setCode] = useState("");
  const [step, setStep] = useState<"form" | "code" | "done">("form");
  const [debugCode, setDebugCode] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [touched, setTouched] = useState(false);

  const digits = phone.replace(/[^\d]/g, "").slice(0, 11);
  const phoneValid = /^09\d{9}$/.test(digits);
  const nameOk = name.trim().length > 1;

  async function sendCode() {
    setTouched(true);
    setError(null);
    if (!nameOk || !phoneValid) return;
    setSending(true);
    try {
      const res = await fetch("/api/otp/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: digits }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "ارسال کد ناموفق بود");
      setDebugCode(data.debugCode || null);
      setStep("code");
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در ارسال کد");
    } finally {
      setSending(false);
    }
  }

  async function verifyAndLogin() {
    setError(null);
    if (!code.trim()) {
      setError("کد پیامک را وارد کنید");
      return;
    }
    setVerifying(true);
    try {
      const verifyRes = await fetch("/api/otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: digits, code: code.trim() }),
      });
      const verifyData = await verifyRes.json();
      if (!verifyRes.ok) {
        throw new Error(verifyData.error || "تأیید کد ناموفق بود");
      }

      const registerRes = await fetch("/api/users/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim().slice(0, 80),
          phone: digits,
          source: "login",
        }),
      });
      const registerData = await registerRes.json();
      if (!registerRes.ok) {
        throw new Error(registerData.error || "ثبت‌نام ناموفق بود");
      }

      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در ورود");
    } finally {
      setVerifying(false);
    }
  }

  if (step === "done") {
    return (
      <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <p className="text-xl font-extrabold text-emerald-900">ورود موفق</p>
        <p className="mt-3 text-sm leading-7 text-emerald-800/90">
          {name.trim()} عزیز، شماره شما تأیید شد. به‌زودی با شما تماس می‌گیریم.
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-navy-600 px-6 py-3 text-sm font-bold text-brand-white"
          >
            بازگشت به صفحه اصلی
          </Link>
          <a
            href={`tel:${site.phone}`}
            className="inline-flex items-center justify-center rounded-full border border-navy-200 bg-brand-white px-6 py-3 text-sm font-bold text-navy-800"
          >
            تماس مستقیم
          </a>
        </div>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (step === "form") sendCode();
        else verifyAndLogin();
      }}
    >
      <div>
        <label className="mb-2 block text-sm font-bold text-navy-800" htmlFor="login-name">
          نام و نام خانوادگی <span className="text-red-500">*</span>
        </label>
        <input
          id="login-name"
          name="name"
          className={inputClass}
          value={name}
          onChange={(event) => setName(event.target.value.slice(0, 80))}
          placeholder="مثلاً علی محمدی"
          autoComplete="name"
          maxLength={80}
          required
          disabled={step === "code"}
        />
        {touched && !nameOk ? (
          <p className="mt-2 text-sm text-red-500">نام را وارد کنید.</p>
        ) : null}
      </div>

      <div>
        <label className="mb-2 block text-sm font-bold text-navy-800" htmlFor="login-phone">
          شماره موبایل <span className="text-red-500">*</span>
        </label>
        <input
          id="login-phone"
          name="phone"
          type="tel"
          inputMode="numeric"
          dir="ltr"
          className={cn(
            inputClass,
            "text-left tracking-wide",
            touched && !phoneValid && "border-red-400 focus:border-red-500",
          )}
          value={phone}
          onChange={(event) =>
            setPhone(event.target.value.replace(/[^\d]/g, "").slice(0, 11))
          }
          placeholder="09xxxxxxxxx"
          autoComplete="tel"
          maxLength={11}
          required
          disabled={step === "code"}
        />
        {touched && !phoneValid ? (
          <p className="mt-2 text-sm text-red-500">
            شماره موبایل را ۱۱ رقمی وارد کنید.
          </p>
        ) : null}
      </div>

      {step === "code" ? (
        <div>
          <label className="mb-2 block text-sm font-bold text-navy-800" htmlFor="login-code">
            کد پیامک <span className="text-red-500">*</span>
          </label>
          <input
            id="login-code"
            name="code"
            inputMode="numeric"
            dir="ltr"
            className={cn(inputClass, "text-center tracking-[0.4em]")}
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/[^\d]/g, "").slice(0, 6))
            }
            placeholder="-----"
            maxLength={6}
            required
            autoFocus
          />
          {debugCode ? (
            <p className="mt-2 text-xs text-amber-700">
              حالت تست: کد شما {debugCode} است (پیامک واقعی هنوز تنظیم نشده).
            </p>
          ) : (
            <p className="mt-2 text-xs text-navy-500">
              کد ۵ رقمی به شماره {digits} ارسال شد.
            </p>
          )}
          <button
            type="button"
            className="mt-2 text-sm font-bold text-navy-600 underline"
            onClick={() => {
              setStep("form");
              setCode("");
              setDebugCode(null);
            }}
          >
            تغییر شماره
          </button>
        </div>
      ) : null}

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={sending || verifying}
        className="inline-flex w-full items-center justify-center rounded-full bg-navy-600 px-6 py-4 text-lg font-extrabold text-brand-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {step === "form"
          ? sending
            ? "در حال ارسال کد…"
            : "ارسال کد پیامکی"
          : verifying
            ? "در حال تأیید…"
            : "تأیید و ورود"}
      </button>

      <p className="text-center text-sm leading-7 text-navy-700/70">
        با وارد کردن شماره موبایل، کد تأیید پیامکی دریافت می‌کنید.
      </p>
    </form>
  );
}

export function LoginPageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-[70svh] overflow-hidden bg-[linear-gradient(160deg,#f7f8fc_0%,#eef0f8_45%,#fefff9_100%)] py-14 md:py-20">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[36rem] -translate-x-1/2 rounded-full bg-brand-yellow/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-28 right-0 h-64 w-64 rounded-full bg-navy-600/15 blur-3xl"
      />

      <div className="container-page relative z-10 mx-auto max-w-lg">
        <div className="mb-8 text-center">
          <Link href="/" aria-label={site.name}>
            <MaxWordmark
              className="mx-auto h-auto w-40 text-navy-950 md:w-48"
              forSeeClassName="fill-navy-600"
            />
          </Link>
          <h1 className="mt-6 text-2xl font-extrabold text-navy-950 md:text-3xl">
            ورود / ثبت‌نام
          </h1>
          <p className="mt-2 text-sm text-navy-700/80 md:text-base">
            نام و شماره موبایل را وارد کنید تا کد تأیید پیامک شود.
          </p>
        </div>

        <div className="rounded-3xl border border-navy-100 bg-brand-white p-6 shadow-[0_20px_50px_rgba(20,22,63,0.08)] md:p-8">
          {children}
        </div>
      </div>
    </div>
  );
}
