"use client";

import { useState } from "react";
import { site } from "@/lib/site";
import { cn } from "./ui";

const inputClass =
  "w-full rounded-xl border border-navy-200 bg-brand-white px-4 py-3 text-navy-900 outline-none transition-colors placeholder:text-navy-400 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20";

const labelClass = "mb-2 block text-sm font-bold text-navy-800";

export function QuoteForm() {
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

  async function submitVerified() {
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
          source: "quote",
        }),
      });
      const registerData = await registerRes.json();
      if (!registerRes.ok) {
        throw new Error(registerData.error || "ثبت کاربر ناموفق بود");
      }

      const leadRes = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim().slice(0, 80),
          phone: digits,
          city: "",
          service: "",
          size: "",
          note: "ثبت‌نام با تأیید پیامکی",
          verified: true,
        }),
      });
      const leadData = await leadRes.json();
      if (!leadRes.ok) {
        throw new Error(leadData.error || "ثبت درخواست ناموفق بود");
      }

      setStep("done");
    } catch (e) {
      setError(e instanceof Error ? e.message : "خطا در ثبت");
    } finally {
      setVerifying(false);
    }
  }

  if (step === "done") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <p className="text-lg font-extrabold text-emerald-900">ثبت شد</p>
        <p className="mt-2 text-sm leading-7 text-emerald-800/90">
          درخواست شما ثبت شد. به‌زودی با شما تماس می‌گیریم.
        </p>
        <a
          href={`tel:${site.phone}`}
          className="mt-5 inline-flex rounded-full bg-navy-600 px-6 py-3 text-sm font-bold text-brand-white"
        >
          تماس مستقیم
        </a>
      </div>
    );
  }

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        if (step === "form") sendCode();
        else submitVerified();
      }}
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={labelClass} htmlFor="quote-name">
            نام و نام خانوادگی <span className="text-red-500">*</span>
          </label>
          <input
            id="quote-name"
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
          <label className={labelClass} htmlFor="quote-phone">
            شماره موبایل <span className="text-red-500">*</span>
          </label>
          <input
            id="quote-phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            dir="ltr"
            className={cn(
              inputClass,
              "text-right",
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
      </div>

      {step === "code" ? (
        <div>
          <label className={labelClass} htmlFor="quote-code">
            کد پیامک <span className="text-red-500">*</span>
          </label>
          <input
            id="quote-code"
            name="code"
            inputMode="numeric"
            dir="ltr"
            className={cn(inputClass, "text-center tracking-[0.35em]")}
            value={code}
            onChange={(event) =>
              setCode(event.target.value.replace(/[^\d]/g, "").slice(0, 6))
            }
            placeholder="-----"
            maxLength={6}
            required
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
        className="inline-flex flex-1 items-center justify-center rounded-full bg-navy-600 px-6 py-4 text-lg font-extrabold text-brand-white transition-transform hover:-translate-y-0.5 disabled:opacity-60"
      >
        {step === "form"
          ? sending
            ? "در حال ارسال کد…"
            : "ارسال کد پیامکی"
          : verifying
            ? "در حال تأیید…"
            : "تأیید و ثبت درخواست"}
      </button>

      <p className="text-sm leading-7 text-navy-700/70">
        فقط نام و شماره موبایل کافی است. پس از تأیید کد پیامک، درخواست شما ثبت
        می‌شود و تیم مکث با شما تماس می‌گیرد.
      </p>
    </form>
  );
}
