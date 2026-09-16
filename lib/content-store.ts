import { promises as fs } from "fs";
import path from "path";
import { projects as projectsSeed, type Project } from "@/lib/projects";
import { posts as postsSeed, type Post } from "@/lib/posts";
import { services as servicesSeed, type Service } from "@/lib/services";
import { locations as locationsSeed, type Location } from "@/lib/locations";
import {
  materials as materialsSeed,
  processSteps as processSeed,
  differentiators as differentiatorsSeed,
  testimonials as testimonialsSeed,
  homeFaq as homeFaqSeed,
} from "@/lib/content";
import {
  site as siteSeed,
  branches as branchesSeed,
  stats as statsSeed,
  trustBadges as trustBadgesSeed,
  navigation as navigationSeed,
  type Branch,
} from "@/lib/site";

const DATA_DIR = path.join(process.cwd(), "data");

export type Material = (typeof materialsSeed)[number];
export type ProcessStep = (typeof processSeed)[number];
export type Differentiator = (typeof differentiatorsSeed)[number];
export type Testimonial = (typeof testimonialsSeed)[number];
export type FaqItem = (typeof homeFaqSeed)[number];
export type NavItem = (typeof navigationSeed)[number];
export type StatItem = (typeof statsSeed)[number];

export type SiteSettings = {
  name: string;
  nameEn: string;
  shortName: string;
  motto: string;
  mottoEn: string;
  brandPromise: string;
  tagline: string;
  slogan: string;
  url: string;
  locale: string;
  description: string;
  founders: string[];
  foundingYear: number;
  experienceYears: number;
  experienceYearsFa: string;
  phone: string;
  phoneDisplay: string;
  phoneIntl: string;
  whatsapp: string;
  instagram: string;
  instagramHandle: string;
  email: string;
  workingHours: string;
  branches: Branch[];
  stats: StatItem[];
  trustBadges: string[];
  navigation: NavItem[];
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  city: string;
  service: string;
  size: string;
  note: string;
  createdAt: string;
};

export type User = {
  id: string;
  name: string;
  phone: string;
  createdAt: string;
  lastLoginAt: string;
  loginCount: number;
  source: "login" | "quote" | "other";
};

export type MediaItem = {
  id: string;
  filename: string;
  url: string;
  size: number;
  uploadedAt: string;
};

type Collections = {
  projects: Project[];
  posts: Post[];
  services: Service[];
  locations: Location[];
  materials: Material[];
  process: ProcessStep[];
  differentiators: Differentiator[];
  testimonials: Testimonial[];
  faq: FaqItem[];
  site: SiteSettings;
  leads: Lead[];
  users: User[];
  media: MediaItem[];
};

const SEEDS: { [K in keyof Collections]: Collections[K] } = {
  projects: projectsSeed.map((p) => ({ ...p })),
  posts: postsSeed.map((p) => ({ ...p })),
  services: servicesSeed.map((s) => ({ ...s })),
  locations: locationsSeed.map((l) => ({ ...l })),
  materials: materialsSeed.map((m) => ({ ...m })),
  process: processSeed.map((p) => ({ ...p })),
  differentiators: differentiatorsSeed.map((d) => ({ ...d })),
  testimonials: testimonialsSeed.map((t) => ({ ...t })),
  faq: homeFaqSeed.map((f) => ({ ...f })),
  site: {
    ...siteSeed,
    founders: [...siteSeed.founders],
    branches: branchesSeed.map((b) => ({ ...b })),
    stats: statsSeed.map((s) => ({ ...s })),
    trustBadges: [...trustBadgesSeed],
    navigation: navigationSeed.map((n) => ({ ...n })),
  },
  leads: [],
  users: [],
  media: [],
};

let seeded = false;

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

function filePath(name: keyof Collections) {
  return path.join(DATA_DIR, `${name}.json`);
}

async function ensureSeeded() {
  if (seeded) return;
  await ensureDataDir();
  for (const key of Object.keys(SEEDS) as (keyof Collections)[]) {
    try {
      await fs.access(filePath(key));
    } catch {
      await fs.writeFile(filePath(key), JSON.stringify(SEEDS[key], null, 2), "utf8");
    }
  }
  seeded = true;
}

export async function readCollection<K extends keyof Collections>(
  name: K,
): Promise<Collections[K]> {
  await ensureSeeded();
  const raw = await fs.readFile(filePath(name), "utf8");
  return JSON.parse(raw) as Collections[K];
}

export async function writeCollection<K extends keyof Collections>(
  name: K,
  data: Collections[K],
): Promise<void> {
  await ensureSeeded();
  await fs.writeFile(filePath(name), JSON.stringify(data, null, 2), "utf8");
}

export async function getProjects() {
  return readCollection("projects");
}
export async function getProject(slug: string) {
  return (await getProjects()).find((p) => p.slug === slug);
}
export async function getFeaturedProjects(limit = 6) {
  return (await getProjects()).filter((p) => p.featured).slice(0, limit);
}

export async function getPosts() {
  return readCollection("posts");
}
export async function getPost(slug: string) {
  return (await getPosts()).find((p) => p.slug === slug);
}

export async function getServices() {
  return readCollection("services");
}
export async function getService(slug: string) {
  return (await getServices()).find((s) => s.slug === slug);
}

export async function getLocations() {
  return readCollection("locations");
}
export async function getLocation(slug: string) {
  return (await getLocations()).find((l) => l.slug === slug);
}

export async function getMaterials() {
  return readCollection("materials");
}
export async function getProcessSteps() {
  return readCollection("process");
}
export async function getDifferentiators() {
  return readCollection("differentiators");
}
export async function getTestimonials() {
  return readCollection("testimonials");
}
export async function getFaq() {
  return readCollection("faq");
}
export async function getSiteSettings() {
  return readCollection("site");
}
export async function getLeads() {
  return readCollection("leads");
}
export async function getUsers() {
  return readCollection("users");
}
export async function getMedia() {
  return readCollection("media");
}

export async function upsertUser(input: {
  name: string;
  phone: string;
  source?: User["source"];
}) {
  const users = await getUsers();
  const now = new Date().toISOString();
  const existingIndex = users.findIndex((u) => u.phone === input.phone);

  if (existingIndex >= 0) {
    const current = users[existingIndex];
    const updated: User = {
      ...current,
      name: input.name || current.name,
      lastLoginAt: now,
      loginCount: (current.loginCount || 1) + 1,
      source: current.source || input.source || "login",
    };
    users[existingIndex] = updated;
    await writeCollection("users", users);
    return { user: updated, isNew: false };
  }

  const user: User = {
    id: `user-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    name: input.name,
    phone: input.phone,
    createdAt: now,
    lastLoginAt: now,
    loginCount: 1,
    source: input.source || "login",
  };
  users.unshift(user);
  await writeCollection("users", users.slice(0, 2000));
  return { user, isNew: true };
}

export async function getDashboardStats() {
  const [projects, posts, services, locations, leads, materials, users] =
    await Promise.all([
      getProjects(),
      getPosts(),
      getServices(),
      getLocations(),
      getLeads(),
      getMaterials(),
      getUsers(),
    ]);
  return {
    projects: projects.length,
    posts: posts.length,
    services: services.length,
    locations: locations.length,
    leads: leads.length,
    materials: materials.length,
    users: users.length,
    unreadLeads: leads.length,
  };
}

export type { Project, Post, Service, Location };
