import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FloatingActions } from "@/components/FloatingActions";
import { HomeScroll } from "@/components/HomeScroll";
import { JsonLd } from "@/components/JsonLd";
import { localBusinessJsonLd, organizationJsonLd } from "@/lib/seo";
import {
  getLocations,
  getServices,
  getSiteSettings,
} from "@/lib/content-store";

export default async function SiteLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [site, services, locations] = await Promise.all([
    getSiteSettings(),
    getServices(),
    getLocations(),
  ]);

  return (
    <>
      <JsonLd data={[organizationJsonLd(), ...localBusinessJsonLd()]} />
      <Header />
      <HomeScroll />
      <main id="main">{children}</main>
      <Footer site={site} services={services} locations={locations} />
      <FloatingActions />
    </>
  );
}
