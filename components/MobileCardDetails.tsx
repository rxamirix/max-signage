"use client";

import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { ArrowUpLeft, X } from "lucide-react";

/** Keep the full desktop content while offering a readable, compact mobile card. */
export function MobileCardDetails({ title, preview, children, label = "مشاهده جزئیات" }: {
  title: string;
  preview?: ReactNode;
  children: ReactNode;
  label?: string;
}) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);
  const headingId = useId();

  useEffect(() => {
    const element = dialog.current;
    if (open && element && !element.open) element.showModal();
  }, [open]);

  function close() {
    dialog.current?.close();
  }

  return (
    <>
      <div className="mobile-detail-desktop hidden flex-1 flex-col sm:flex">
        {children}
      </div>
      <div className="mobile-detail-preview flex flex-1 flex-col sm:hidden">
        {preview && <div className="mobile-detail-excerpt">{preview}</div>}
        <button ref={trigger} type="button" aria-haspopup="dialog" onClick={() => setOpen(true)} className="mobile-detail-trigger">
          <span>{label}</span><ArrowUpLeft className="size-3.5 shrink-0" aria-hidden="true" />
        </button>
      </div>
      <dialog ref={dialog} aria-labelledby={headingId} className="mobile-detail-sheet" onClose={() => { setOpen(false); trigger.current?.focus({ preventScroll: true }); }} onClick={(event) => { if (event.target === event.currentTarget) close(); }}>
        {open && <div className="mobile-detail-sheet-inner" dir="rtl">
          <div className="mobile-detail-sheet-header">
            <h2 id={headingId}>{title}</h2>
            <button type="button" aria-label="بستن جزئیات" onClick={close} className="mobile-detail-close"><X className="size-5" aria-hidden="true" /></button>
          </div>
          <div className="mobile-detail-sheet-copy">{children}</div>
        </div>}
      </dialog>
    </>
  );
}
