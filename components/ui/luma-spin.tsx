"use client";

import { cn } from "@/lib/utils";

/** Luma-style dual-orbit loader — yellow / navy glow */
export function LumaSpin({ className }: { className?: string }) {
  return (
    <div
      className={cn("luma-spin relative aspect-square w-[65px]", className)}
      aria-hidden
    >
      <span className="luma-spin-ring absolute rounded-[50px]" />
      <span className="luma-spin-ring luma-spin-ring-delay absolute rounded-[50px]" />
    </div>
  );
}

export const Component = LumaSpin;
export default LumaSpin;
