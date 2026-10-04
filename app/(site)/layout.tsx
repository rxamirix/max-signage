import { Suspense } from "react";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatingActions } from "@/components/FloatingActions";
import { HomeScroll } from "@/components/HomeScroll";
import { JsonLd } from "@/components/JsonLd";
import { PageLoader } from "@/components/PageLoader";
import { RouteLoader } from "@/components/RouteLoader";
import { localBusinessJsonLd, organizationJsonLd } from "@/lib/seo";
import {
  getFeaturedProjects,
  getServices,
  getSiteSettings,
} from "@/lib/content-store";

async function SiteMain({ children }: { children: React.ReactNode }) {
  const [site, services, recentProjects] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getFeaturedProjects(6),
  ]);

  return (
    <>
      <main id="main">{children}</main>
      <Footer site={site} services={services} recentProjects={recentProjects} />
    </>
  );
}

export default function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <>
      <JsonLd data={[organizationJsonLd(), ...localBusinessJsonLd()]} />
      <Header />
      <HomeScroll />
      <Suspense fallback={<PageLoader />}>
        <SiteMain>{children}</SiteMain>
      </Suspense>
      <Suspense fallback={null}>
        <RouteLoader />
      </Suspense>
      <FloatingActions />
    </>
  );
}
