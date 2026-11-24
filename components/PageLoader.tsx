"use client";

/** Full-viewport loader while pages resolve together (content + footer). */
export function PageLoader() {
  return (
    <div
      className="fixed inset-0 z-[200] grid place-items-center bg-white"
      aria-busy="true"
      aria-live="polite"
      role="status"
    >
      <img src="/logo-mark-navy.png" alt="" width={96} height={96} className="max-loading-mark" aria-hidden="true" />
      <span className="sr-only">در حال بارگذاری…</span>
    </div>
  );
}
