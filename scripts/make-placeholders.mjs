// Generates branded SVG placeholders for portfolio imagery until real photos arrive.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const OUT_DIR = path.join(ROOT, "public", "images", "portfolio");

const items = [
  ["hyper-behshahr-1", "هایپرمارکت بهشهر", "چلنیوم و کامپوزیت"],
  ["hyper-behshahr-2", "هایپرمارکت بهشهر", "جزئیات حروف چلنیوم"],
  ["gold-gallery-sari-1", "گالری طلا ساری", "حروف استیل طلایی"],
  ["gold-gallery-sari-2", "گالری طلا ساری", "نورپردازی هالو"],
  ["pharmacy-neka-1", "داروخانه نکا", "لایت باکس فریم‌لس"],
  ["pharmacy-neka-2", "داروخانه نکا", "تابلو روان اطلاع‌رسانی"],
  ["cafe-babolsar-1", "کافه بابلسر", "نئون فلکسی"],
  ["cafe-babolsar-2", "کافه بابلسر", "نورپردازی پیشانی"],
  ["commercial-complex-ghaemshahr-1", "مجتمع تجاری قائم‌شهر", "نمای کامپوزیت"],
  ["commercial-complex-ghaemshahr-2", "مجتمع تجاری قائم‌شهر", "قاب استاندارد واحدها"],
  ["exchange-amol-1", "صرافی آمل", "نمایشگر LED فول‌کالر"],
  ["exchange-amol-2", "صرافی آمل", "حروف چلنیوم نام صرافی"],
  ["restaurant-behshahr-1", "رستوران سنتی بهشهر", "ترموود و چلنیوم"],
  ["restaurant-behshahr-2", "رستوران سنتی بهشهر", "نورپردازی مخفی"],
  ["clinic-sari-1", "کلینیک ساری", "حروف استیل مات"],
  ["clinic-sari-2", "کلینیک ساری", "تابلو راهنمای داخلی"],
];

const W = 1200;
const H = 800;

function svg(index, title, subtitle) {
  const hue = index % 2 === 0 ? "#2D3192" : "#242873";
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${title} - ${subtitle}">
  <defs>
    <linearGradient id="g${index}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${hue}"/>
      <stop offset="100%" stop-color="#14163f"/>
    </linearGradient>
    <pattern id="p${index}" width="48" height="48" patternUnits="userSpaceOnUse">
      <path d="M48 0H0v48" fill="none" stroke="#FEFFF9" stroke-opacity="0.06" stroke-width="1"/>
    </pattern>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#g${index})"/>
  <rect width="${W}" height="${H}" fill="url(#p${index})"/>
  <circle cx="${W - 160}" cy="140" r="220" fill="#EAEA35" opacity="0.08"/>
  <g transform="translate(${W / 2}, ${H / 2 - 70})">
    <polygon points="0,-92 96,-38 96,58 46,28 46,-6 0,-32 -46,-6 -46,28 -96,58 -96,-38" fill="#FEFFF9" opacity="0.92"/>
    <polygon points="0,6 40,30 40,74 0,98 -40,74 -40,30" fill="#EAEA35" opacity="0.92"/>
  </g>
  <rect x="${W / 2 - 260}" y="${H / 2 + 110}" width="520" height="4" fill="#EAEA35" opacity="0.8"/>
  <text x="${W / 2}" y="${H / 2 + 178}" text-anchor="middle" font-family="Tahoma, Arial, sans-serif" font-size="42" fill="#FEFFF9" direction="rtl">${title}</text>
  <text x="${W / 2}" y="${H / 2 + 232}" text-anchor="middle" font-family="Tahoma, Arial, sans-serif" font-size="28" fill="#EAEA35" direction="rtl">${subtitle}</text>
  <text x="${W / 2}" y="${H - 46}" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="22" fill="#FEFFF9" opacity="0.5" letter-spacing="6">MAX FOR SEE</text>
</svg>
`;
}

await mkdir(OUT_DIR, { recursive: true });

for (const [index, [name, title, subtitle]] of items.entries()) {
  await writeFile(path.join(OUT_DIR, `${name}.svg`), svg(index, title, subtitle), "utf8");
}

console.log(`wrote ${items.length} placeholder images to public/images/portfolio`);
