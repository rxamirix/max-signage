"use client";

import { useCallback, useState } from "react";
import { cn } from "@/lib/utils";

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
      <div>
        <h1 className="text-2xl font-extrabold text-navy-950 md:text-3xl">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 max-w-2xl text-sm leading-7 text-navy-600">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function AdminCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "rounded-2xl border border-navy-100 bg-white p-5 shadow-sm shadow-navy-950/5",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function AdminButton({
  children,
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const styles = {
    primary: "bg-navy-600 text-brand-white hover:bg-navy-700",
    secondary:
      "border border-navy-200 bg-brand-white text-navy-800 hover:bg-navy-50",
    danger: "bg-red-600 text-white hover:bg-red-700",
    ghost: "text-navy-700 hover:bg-navy-50",
  }[variant];

  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center justify-center rounded-xl px-4 py-2.5 text-sm font-bold transition disabled:opacity-50",
        styles,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function AdminInput({
  label,
  hint,
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-bold text-navy-800">
          {label}
        </span>
      ) : null}
      {hint ? (
        <span className="mb-1.5 block text-xs text-navy-500">{hint}</span>
      ) : null}
      <input
        className={cn(
          "w-full rounded-xl border border-navy-200 bg-brand-white px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20",
          className,
        )}
        {...props}
      />
    </label>
  );
}

export function AdminTextarea({
  label,
  hint,
  className,
  ...props
}: React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label?: string;
  hint?: string;
}) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-bold text-navy-800">
          {label}
        </span>
      ) : null}
      {hint ? (
        <span className="mb-1.5 block text-xs text-navy-500">{hint}</span>
      ) : null}
      <textarea
        className={cn(
          "min-h-28 w-full rounded-xl border border-navy-200 bg-brand-white px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20",
          className,
        )}
        {...props}
      />
    </label>
  );
}

export function AdminSelect({
  label,
  children,
  className,
  ...props
}: React.SelectHTMLAttributes<HTMLSelectElement> & { label?: string }) {
  return (
    <label className="block">
      {label ? (
        <span className="mb-1.5 block text-sm font-bold text-navy-800">
          {label}
        </span>
      ) : null}
      <select
        className={cn(
          "w-full rounded-xl border border-navy-200 bg-brand-white px-3 py-2.5 text-sm text-navy-900 outline-none focus:border-navy-600 focus:ring-2 focus:ring-navy-600/20",
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}

export function useAdminToast() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const showSuccess = useCallback((msg: string) => {
    setError(null);
    setMessage(msg);
    setTimeout(() => setMessage(null), 2500);
  }, []);

  const showError = useCallback((msg: string) => {
    setMessage(null);
    setError(msg);
    setTimeout(() => setError(null), 3500);
  }, []);

  const toast = (
    <>
      {message ? (
        <div className="fixed bottom-6 left-6 z-50 rounded-xl bg-navy-800 px-4 py-3 text-sm font-bold text-brand-white shadow-lg">
          {message}
        </div>
      ) : null}
      {error ? (
        <div className="fixed bottom-6 left-6 z-50 rounded-xl bg-red-600 px-4 py-3 text-sm font-bold text-white shadow-lg">
          {error}
        </div>
      ) : null}
    </>
  );

  return { toast, showSuccess, showError };
}

export async function adminFetch(url: string, init?: RequestInit) {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || "خطا در ارتباط با سرور");
  }
  return data;
}
