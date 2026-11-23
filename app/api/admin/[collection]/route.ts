import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { readCollection, writeCollection } from "@/lib/content-store";

type CollectionName =
  | "projects"
  | "posts"
  | "services"
  | "locations"
  | "materials"
  | "process"
  | "differentiators"
  | "testimonials"
  | "faq"
  | "site"
  | "leads"
  | "users"
  | "jobs"
  | "media";

const ALLOWED = new Set<CollectionName>([
  "projects",
  "posts",
  "services",
  "locations",
  "materials",
  "process",
  "differentiators",
  "testimonials",
  "faq",
  "site",
  "leads",
  "users",
  "jobs",
  "media",
]);

export async function GET(
  _request: Request,
  context: { params: Promise<{ collection: string }> },
) {
  const { collection } = await context.params;
  if (!ALLOWED.has(collection as CollectionName)) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 });
  }
  const data = await readCollection(collection as CollectionName);
  return NextResponse.json({ data });
}

export async function PUT(
  request: Request,
  context: { params: Promise<{ collection: string }> },
) {
  const { collection } = await context.params;
  if (!ALLOWED.has(collection as CollectionName)) {
    return NextResponse.json({ error: "Collection not found" }, { status: 404 });
  }
  const body = await request.json().catch(() => null);
  if (!body || body.data === undefined) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }
  await writeCollection(collection as CollectionName, body.data);
  if (["projects", "posts", "services", "locations", "materials", "process", "differentiators", "testimonials", "faq", "site"].includes(collection)) {
    revalidatePath("/", "layout");
  }
  return NextResponse.json({ ok: true });
}
