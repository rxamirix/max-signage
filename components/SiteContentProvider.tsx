"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { SiteSettings, Service } from "@/lib/content-store";

const SiteContent = createContext<{ site: SiteSettings; services: Service[] } | null>(null);

export function SiteContentProvider({ site, services, children }: { site: SiteSettings; services: Service[]; children: ReactNode }) {
  return <SiteContent.Provider value={{ site, services }}>{children}</SiteContent.Provider>;
}

export function useSiteContent() {
  return useContext(SiteContent);
}
