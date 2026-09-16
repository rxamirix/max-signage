export default function Loading() {
  return (
    <div className="container-page py-16" aria-busy="true" aria-live="polite">
      <div className="mx-auto max-w-3xl animate-pulse space-y-4">
        <div className="mx-auto h-4 w-32 rounded-full bg-navy-100" />
        <div className="mx-auto h-10 w-3/4 rounded-2xl bg-navy-100" />
        <div className="mx-auto h-4 w-2/3 rounded-full bg-navy-50" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2">
          <div className="h-40 rounded-card bg-navy-50" />
          <div className="h-40 rounded-card bg-navy-50" />
        </div>
      </div>
      <span className="sr-only">در حال بارگذاری صفحه…</span>
    </div>
  );
}
