"use client";

import { Header } from "./Header";
import { Provably } from "@/components/ui/provably";
import type { SiteSettings } from "@/lib/content-store";
import { defaultHeroContent } from "@/lib/home-content";

export function WaveDivider({
  fill = "#fefff9",
}: {
  fill?: string;
}) {
  return (
    <div
      className="pointer-events-none absolute inset-x-0 bottom-0 z-20 leading-none md:hidden"
      aria-hidden="true"
    >
      <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-b from-transparent via-[#fefff9]/25 to-[#fefff9]/80" />
      <svg
        viewBox="0 0 1440 160"
        preserveAspectRatio="none"
        className="relative block h-24 w-full sm:h-28"
      >
        <path
          fill={fill}
          opacity="0.55"
          d="M0 72C160 28 280 118 420 78C560 38 680 8 820 48C960 88 1100 128 1260 88C1340 68 1400 52 1440 60V160H0V72Z"
        />
        <path
          fill={fill}
          d="M0 96C200 48 320 128 480 100C640 72 760 24 920 64C1080 104 1220 140 1360 100C1400 88 1420 84 1440 88V160H0V96Z"
        />
      </svg>
    </div>
  );
}

export function Hero({ settings: site }: { settings: SiteSettings }) {
  const { branches, trustBadges } = site;
  const content = site.heroContent ?? defaultHeroContent;
  return (
    <section id="hero" className="relative bg-white">
      <Provably
        className="max-hero"
        copy={{
          eyebrow: "",
          lines: ["تابلو تبلیغاتی", "در مازندران"],
          lastWord: site.motto,
          showWordmark: true,
          wordmarkImage: site.brandImages?.hero,
          showToggle: false,
          subtext: content.subtext || `${site.brandPromise}؛ طراحی و اجرای تابلوهای تبلیغاتی، با ${site.experienceYearsFa} سال تجربه.`,
        }}
        links={{
          explore: { label: content.primaryLabel, href: "/contact#quote" },
          howItWorks: { label: content.secondaryLabel, href: "/portfolio" },
        }}
        toggle={{ label: "تغییر رنگ هیرو بین آبی و خاکستری", hint: { pointer: "کلیک کنید", touch: "لمس کنید" } }}
        stats={{ value: branches.length, suffix: " شعبه", word: content.branchLabel, states: { off: "", on: "" }, note: branches.map(branch => branch.city).join(" • "), mapLinks: branches.map(branch => ({ label: `نقشه ${branch.title}`, href: branch.mapUrl })) }}
        credentials={content.cards.map((card, index) => ({ ...card, accent: ["#5a4ff0", "#4639d4", "#6d60f4"][index % 3], icon: (["pen", "chart", "type"] as const)[index % 3] }))}
        certificate={{
          kicker: content.cardLabel, type: "جزئیات طراحی", sampleLabel: "اصول طراحی", demoNote: "این کارت اصول طراحی تابلوسازی مکث را معرفی می‌کند.",
          recipientLabel: "تمرکز ما", recipientNote: "تابلوسازی مکث", status: { on: "روشن", off: "خاموش" },
          statusDetail: { on: "نمایش رنگی", off: "نمایش اولیه" }, hover: "", share: { idle: "کپی لینک", done: "کپی شد", locked: "ابتدا روشن کنید" },
          tilt: { rest: 9, verified: 4, hover: 0 },
        }}
        statusBadge={{ off: "MAX", on: "MAX", tail: "SIGNAGE", stampTilt: -6, hint: content.warrantyTitle, back: { title: content.warrantyTitle, text: content.warrantyText, action: "بازگشت" } }}
        trust={{ label: "", logos: [], badges: trustBadges }}
        autoplay={{ initialVerified: true, toggleEvery: 0, verifyAfter: 0, cycleAfter: 4.2, cycleEvery: 4 }}
      />
      <div className="absolute inset-x-0 top-0 z-50">
        <Header variant="hero" lightHero />
      </div>
    </section>
  );
}
