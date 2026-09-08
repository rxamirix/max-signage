import Link from "next/link";
import type { ReactNode } from "react";
import { site } from "@/lib/site";

export function cn(...values: (string | false | null | undefined)[]) {
  return values.filter(Boolean).join(" ");
}

/** Keeps phone digits LTR so RTL layout doesn't reverse them. */
export function PhoneText({
  className,
  value = site.phoneDisplay,
}: {
  className?: string;
  value?: string;
}) {
  return (
    <bdi dir="ltr" className={cn("inline-block tabular-nums", className)}>
      {value}
    </bdi>
  );
}

export function Section({
  children,
  className,
  id,
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  id?: string;
  tone?: "light" | "muted" | "navy" | "dark";
}) {
  const tones = {
    light: "bg-brand-white text-navy-900",
    muted: "bg-navy-50 text-navy-900",
    navy: "bg-navy-600 text-brand-white",
    dark: "bg-navy-950 text-brand-white",
  };

  return (
    <section id={id} className={cn("py-16 md:py-24", tones[tone], className)}>
      <div className="container-page">{children}</div>
    </section>
  );
}

export function Eyebrow({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-medium",
        tone === "light"
          ? "bg-navy-100 text-navy-700"
          : "bg-brand-white/10 text-brand-yellow",
      )}
    >
      <span className="size-1.5 rounded-full bg-brand-yellow" />
      {children}
    </span>
  );
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  tone = "light",
  align = "center",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: "light" | "dark";
  align?: "center" | "start";
  as?: "h1" | "h2" | "h3";
}) {
  return (
    <div
      className={cn(
        "flex flex-col gap-4",
        align === "center" ? "items-center text-center" : "items-start text-start",
        align === "center" && "mx-auto max-w-3xl",
      )}
    >
      {eyebrow ? <Eyebrow tone={tone}>{eyebrow}</Eyebrow> : null}
      <Tag
        className={cn(
          "text-3xl md:text-4xl lg:text-[2.75rem]",
          tone === "light" ? "text-navy-900" : "text-brand-white",
        )}
      >
        {title}
      </Tag>
      {description ? (
        <p
          className={cn(
            "text-base md:text-lg",
            tone === "light" ? "text-navy-700/80" : "text-brand-white/75",
          )}
        >
          {description}
        </p>
      ) : null}
    </div>
  );
}

type ButtonProps = {
  href: string;
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "md" | "lg";
  className?: string;
  external?: boolean;
  ariaLabel?: string;
};

export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
  external,
  ariaLabel,
}: ButtonProps) {
  const variants = {
    primary:
      "bg-brand-yellow text-navy-900 hover:bg-brand-yellow-dark shadow-lg shadow-brand-yellow/20",
    secondary:
      "bg-navy-600 text-brand-white hover:bg-navy-700 shadow-lg shadow-navy-600/20",
    outline:
      "border-2 border-current text-current hover:bg-current/10 backdrop-blur-sm",
    ghost: "text-current hover:bg-current/10",
  };

  const sizes = {
    md: "px-5 py-2.5 text-sm md:text-base",
    lg: "px-7 py-3.5 text-base md:text-lg",
  };

  const classes = cn(
    "inline-flex items-center justify-center gap-2 rounded-full font-bold transition-all duration-200 hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-yellow",
    variants[variant],
    sizes[size],
    className,
  );

  if (external) {
    return (
      <a
        href={href}
        className={classes}
        aria-label={ariaLabel}
        target="_blank"
        rel="noopener noreferrer"
      >
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={classes} aria-label={ariaLabel}>
      {children}
    </Link>
  );
}

export function Card({
  children,
  className,
  tone = "light",
}: {
  children: ReactNode;
  className?: string;
  tone?: "light" | "dark";
}) {
  return (
    <div
      className={cn(
        "rounded-card p-6 transition-all duration-300 md:p-7",
        tone === "light"
          ? "border border-navy-100 bg-brand-white hover:border-navy-300 hover:shadow-xl hover:shadow-navy-900/5"
          : "border border-brand-white/10 bg-brand-white/5 hover:border-brand-yellow/40 hover:bg-brand-white/10",
        className,
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  children,
  tone = "light",
}: {
  children: ReactNode;
  tone?: "light" | "dark" | "yellow";
}) {
  const tones = {
    light: "bg-navy-100 text-navy-700",
    dark: "bg-brand-white/10 text-brand-white",
    yellow: "bg-brand-yellow text-navy-900",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium md:text-sm",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}

export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
    >
      <path
        d="m5 10.5 3.2 3.2L15 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ArrowIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden="true"
      className={cn("size-4 shrink-0", className)}
    >
      <path
        d="M12 4 6 10l6 6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function PhoneIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
    >
      <path
        d="M6.5 3h3l1.5 4-2 1.5a12 12 0 0 0 6.5 6.5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A17 17 0 0 1 4.5 5.2 2 2 0 0 1 6.5 3Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
    >
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.4a9.9 9.9 0 0 0 4.68 1.18h.01c5.43 0 9.84-4.4 9.84-9.84A9.78 9.78 0 0 0 12.04 2Zm5.76 14.06c-.24.68-1.4 1.3-1.94 1.34-.5.05-.98.23-3.3-.69-2.78-1.1-4.54-3.94-4.68-4.12-.13-.18-1.11-1.48-1.11-2.82 0-1.34.7-2 .95-2.27.24-.27.53-.34.7-.34l.5.01c.16 0 .38-.06.6.46.22.54.76 1.87.83 2 .07.14.11.3.02.48-.09.18-.13.29-.27.45l-.4.46c-.13.13-.27.28-.11.55.15.27.68 1.13 1.47 1.83 1.01.9 1.86 1.18 2.13 1.31.27.14.42.11.58-.07.16-.18.67-.78.85-1.05.18-.27.36-.22.6-.13.25.09 1.57.74 1.84.87.27.14.45.2.51.31.07.11.07.64-.17 1.32Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
    >
      <rect
        x="3"
        y="3"
        width="18"
        height="18"
        rx="5"
        stroke="currentColor"
        strokeWidth="1.8"
      />
      <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.2" cy="6.8" r="1.2" fill="currentColor" />
    </svg>
  );
}

export function PinIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
    >
      <path
        d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

export function ClockIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn("size-5 shrink-0", className)}
    >
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.8" />
      <path
        d="M12 7.5V12l3 1.8"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}
