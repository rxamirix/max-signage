export const site = {
  name: "تابلوسازی مکس",
  nameEn: "MAX Signage",
  shortName: "مکس",
  motto: "مکس برای دیدن",
  mottoEn: "max for see",
  brandPromise: "نهایت وضوح، آغاز تسلط",
  tagline: "تولید تابلوهای تبلیغاتی چلنیوم و کامپوزیت",
  slogan: "طراحی و نصب رایگان | گارانتی کتبی | ۲۰ سال سابقه",
  url: "https://maxtablo.ir",
  locale: "fa_IR",
  description:
    "تابلو تبلیغاتی در مازندران با ۲۰ سال سابقه: چلنیوم، نمای کامپوزیت، حروف برجسته و لایت باکس. بازدید و طراحی رایگان، نصب رایگان و گارانتی کتبی — همین امروز استعلام قیمت بگیرید.",
  founders: ["درزیان", "فدایی‌پور"],
  foundingYear: 1385,
  experienceYears: 20,
  experienceYearsFa: "۲۰",
  phone: "09112588846",
  phoneDisplay: "۰۹۱۱ ۲۵۸ ۸۸۴۶",
  phoneIntl: "+989112588846",
  whatsapp: "989112588846",
  instagram: "https://www.instagram.com/maxtablo",
  instagramHandle: "maxtablo",
  email: "info@maxtablo.ir",
  workingHours: "شنبه تا پنجشنبه، ۸:۰۰ تا ۲۰:۰۰",
} as const;

export type Branch = {
  id: string;
  title: string;
  city: string;
  address: string;
  geo: { lat: number; lng: number };
  mapUrl: string;
};

export const branches: Branch[] = [
  {
    id: "behshahr",
    title: "شعبه بهشهر",
    city: "بهشهر",
    address: "بهشهر، میدان قدس",
    geo: { lat: 36.6923, lng: 53.5522 },
    mapUrl: "https://www.google.com/maps/search/?api=1&query=36.6923,53.5522",
  },
  {
    id: "neka",
    title: "شعبه نکا",
    city: "نکا",
    address: "نکا، مقابل اداره دارایی",
    geo: { lat: 36.6511, lng: 53.2989 },
    mapUrl: "https://www.google.com/maps/search/?api=1&query=36.6511,53.2989",
  },
];

export const stats = [
  { value: "۲۰", suffix: "سال", label: "سابقه اجرایی" },
  { value: "۳٬۵۰۰", suffix: "+", label: "تابلو اجرا شده" },
  { value: "۱۲", suffix: "شهر", label: "پوشش استانی" },
  { value: "۱۰۰", suffix: "٪", label: "گارانتی کتبی" },
];

export const trustBadges = [
  "طراحی رایگان",
  "نصب رایگان",
  "گارانتی کتبی",
  "بازدید و استعلام رایگان",
];

export const navigation = [
  { href: "/", label: "صفحه اصلی" },
  { href: "/services", label: "خدمات" },
  { href: "/portfolio", label: "نمونه کارها" },
  { href: "/materials", label: "متریال" },
  { href: "/process", label: "نحوه کار" },
  { href: "/about", label: "درباره ما" },
  { href: "/blog", label: "مقالات" },
  { href: "/contact", label: "ارتباط با ما" },
];
