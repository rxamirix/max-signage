"use client";

import { useMemo, useState } from "react";
import { services } from "@/lib/services";
import { locations } from "@/lib/locations";
import { site } from "@/lib/site";
import { cn, WhatsAppIcon } from "./ui";

const inputClass =
  "w-full rounded-xl border border-navy-200 bg-brand-white px-4 py-3 text-navy-900 outline-none transition-colors placeholder:text-navy-400 focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20";

const labelClass = "mb-2 block text-sm font-bold text-navy-800";

export function QuoteForm({ defaultService }: { defaultService?: string }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [service, setService] = useState(defaultService ?? "");
  const [size, setSize] = useState("");
  const [note, setNote] = useState("");
  const [touched, setTouched] = useState(false);

  const phoneValid = /^09\d{9}$/.test(phone.replace(/[^\d]/g, ""));
  const valid = name.trim().length > 1 && phoneValid;

  const message = useMemo(() => {
    const lines = [
      "سلام، درخواست استعلام قیمت رایگان دارم.",
      `نام: ${name || "-"}`,
      `شماره تماس: ${phone || "-"}`,
      `شهر: ${city || "-"}`,
      `نوع تابلو: ${service || "-"}`,
      `ابعاد تقریبی سردر: ${size || "-"}`,
      note ? `توضیحات: ${note}` : "",
      "",
      "ارسال‌شده از سایت maxtablo.ir",
    ].filter(Boolean);
    return lines.join("\n");
  }, [name, phone, city, service, size, note]);

  const whatsappUrl = `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <form
      className="flex flex-col gap-5"
      onSubmit={(event) => {
        event.preventDefault();
        setTouched(true);
        if (valid) {
          window.open(whatsappUrl, "_blank", "noopener,noreferrer");
        }
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
            onChange={(event) => setName(event.target.value)}
            placeholder="مثلاً علی محمدی"
            autoComplete="name"
            required
          />
        </div>

        <div>
          <label className={labelClass} htmlFor="quote-phone">
            شماره تماس <span className="text-red-500">*</span>
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
            onChange={(event) => setPhone(event.target.value)}
            placeholder="09xxxxxxxxx"
            autoComplete="tel"
            required
          />
          {touched && !phoneValid ? (
            <p className="mt-2 text-sm text-red-500">
              شماره موبایل را به شکل ۱۱ رقمی وارد کنید.
            </p>
          ) : null}
        </div>

        <div>
          <label className={labelClass} htmlFor="quote-city">
            شهر
          </label>
          <select
            id="quote-city"
            name="city"
            className={inputClass}
            value={city}
            onChange={(event) => setCity(event.target.value)}
          >
            <option value="">انتخاب کنید</option>
            {locations.map((location) => (
              <option key={location.slug} value={location.city}>
                {location.city}
              </option>
            ))}
            <option value="سایر شهرهای مازندران">سایر شهرهای مازندران</option>
          </select>
        </div>

        <div>
          <label className={labelClass} htmlFor="quote-service">
            نوع تابلو
          </label>
          <select
            id="quote-service"
            name="service"
            className={inputClass}
            value={service}
            onChange={(event) => setService(event.target.value)}
          >
            <option value="">هنوز مطمئن نیستم</option>
            {services.map((item) => (
              <option key={item.slug} value={item.shortTitle}>
                {item.shortTitle}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="quote-size">
            ابعاد تقریبی سردر (اختیاری)
          </label>
          <input
            id="quote-size"
            name="size"
            className={inputClass}
            value={size}
            onChange={(event) => setSize(event.target.value)}
            placeholder="مثلاً ۴ متر عرض در ۱ متر ارتفاع"
          />
        </div>

        <div className="sm:col-span-2">
          <label className={labelClass} htmlFor="quote-note">
            توضیحات
          </label>
          <textarea
            id="quote-note"
            name="note"
            rows={4}
            className={cn(inputClass, "resize-y")}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="نام کسب‌وکار، رنگ مورد نظر یا هر نکته‌ای که به ما کمک می‌کند."
          />
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="submit"
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-lg font-extrabold text-white transition-transform hover:-translate-y-0.5"
        >
          <WhatsAppIcon />
          ارسال درخواست در واتساپ
        </button>
        <a
          href={`tel:${site.phone}`}
          className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-navy-600 px-6 py-4 text-lg font-extrabold text-navy-700 transition-colors hover:bg-navy-600 hover:text-brand-white"
        >
          تماس مستقیم
        </a>
      </div>

      <p className="text-sm leading-7 text-navy-700/70">
        با زدن دکمه بالا، اطلاعات وارد شده به‌صورت یک پیام آماده در واتساپ باز
        می‌شود و شما آن را ارسال می‌کنید. بازدید، طراحی و استعلام قیمت کاملاً
        رایگان است.
      </p>
    </form>
  );
}
