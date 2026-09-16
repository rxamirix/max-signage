import { NextResponse } from "next/server";
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
  return NextResponse.json({ ok: true });
}
