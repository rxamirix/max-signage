"use client";

import { useEffect, useState, type ReactNode } from "react";
import { MeshGradient } from "@paper-design/shaders-react";
import { cn } from "@/lib/utils";

/** Navy-only mesh — yellow stays on CTA / wordmark, not in the backdrop */
const meshColors = ["#05060f", "#0b0c26", "#2d3192", "#14163f", "#1d2060"];

export default function ShaderShowcase({
  children,
  className,
}: {
  children?: ReactNode;
  className?: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  return (
    <div className={cn("relative min-h-[78svh] overflow-hidden bg-navy-950 md:min-h-svh", className)}>
      {ready ? (
        <MeshGradient
          className="absolute inset-0 size-full"
          colors={meshColors}
          speed={0.18}
          minPixelRatio={1}
          maxPixelCount={1280 * 720}
        />
      ) : (
        <div className="absolute inset-0 bg-navy-950" />
      )}

      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-navy-950/90 to-transparent md:h-36"
      />

      {/* Full-viewport layer so absolute hero copy can center correctly */}
      <div className="absolute inset-0 z-10">{children}</div>
    </div>
  );
}
