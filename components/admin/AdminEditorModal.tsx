"use client";

import type { ReactNode } from "react";
import { AdminButton } from "@/components/admin/ui";

export function AdminEditorModal({
  title,
  onClose,
  children,
  footer,
  wide,
}: {
  title: string;
  onClose: () => void;
  children: ReactNode;
  footer?: ReactNode;
  wide?: boolean;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/45 p-3 sm:items-center sm:p-4">
      <div
        className={`flex max-h-[94svh] w-full flex-col overflow-hidden rounded-3xl bg-brand-white shadow-2xl ${
          wide ? "max-w-4xl" : "max-w-3xl"
        }`}
      >
        <div className="flex shrink-0 items-start justify-between gap-3 border-b border-navy-100 px-5 py-4 md:px-6">
          <h2 className="text-xl font-extrabold text-navy-950">{title}</h2>
          <AdminButton variant="ghost" onClick={onClose}>
            بستن
          </AdminButton>
        </div>
        <div className="admin-scroll admin-scroll--main min-h-0 flex-1">
          <div className="admin-scroll-inner px-5 py-5 md:px-6">{children}</div>
        </div>
        {footer ? (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-2 border-t border-navy-100 bg-navy-50/50 px-5 py-4 md:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
