"use client";

export function SlideDots({ count, active, onSelect }: { count: number; active: number; onSelect: (index: number) => void }) {
  if (count < 2) return null;
  return (
    <div className="slide-dots" role="group" aria-label="انتخاب اسلاید">
      {Array.from({ length: count }, (_, index) => (
        <button key={index} type="button" className="slide-dot" aria-current={index === active ? "true" : undefined} aria-label={`رفتن به اسلاید ${index + 1}`} onClick={() => onSelect(index)} />
      ))}
    </div>
  );
}
