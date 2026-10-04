import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import type { MediaItem } from "@/lib/content-store";
import { getMedia, writeCollection } from "@/lib/content-store";

const IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/svg+xml",
];

const VIDEO_TYPES = [
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "video/x-m4v",
];

const PDF_TYPES = ["application/pdf"];

export async function GET() {
  const media = await getMedia();
  return NextResponse.json({ data: media });
}

export async function POST(request: Request) {
  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "فایل ارسال نشد" }, { status: 400 });
  }

  const isVideo = VIDEO_TYPES.includes(file.type) || file.type.startsWith("video/");
  const isImage = IMAGE_TYPES.includes(file.type);
  const isPdf =
    PDF_TYPES.includes(file.type) ||
    file.name.toLowerCase().endsWith(".pdf");

  if (!isImage && !isVideo && !isPdf) {
    return NextResponse.json(
      { error: "فرمت مجاز نیست (عکس، ویدیو یا PDF)" },
      { status: 400 },
    );
  }

  const maxBytes = isVideo
    ? 80 * 1024 * 1024
    : isPdf
      ? 20 * 1024 * 1024
      : 8 * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      {
        error: isVideo
          ? "حداکثر حجم ویدیو ۸۰ مگابایت"
          : isPdf
            ? "حداکثر حجم PDF ۲۰ مگابایت"
            : "حداکثر حجم عکس ۸ مگابایت",
      },
      { status: 400 },
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const safeExt = ext.replace(/[^a-z0-9]/g, "") || "bin";
  const id = `media-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const filename = `${id}.${safeExt}`;
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  await fs.mkdir(uploadsDir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(uploadsDir, filename), buffer);

  const item: MediaItem = {
    id,
    filename,
    url: `/uploads/${filename}`,
    size: file.size,
    uploadedAt: new Date().toISOString(),
  };
  const media = await getMedia();
  media.unshift(item);
  await writeCollection("media", media);

  return NextResponse.json({ ok: true, data: item });
}

export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null);
  const id = String(body?.id || "");
  if (!id) {
    return NextResponse.json({ error: "id required" }, { status: 400 });
  }
  const media = await getMedia();
  const item = media.find((m) => m.id === id);
  if (!item) {
    return NextResponse.json({ error: "not found" }, { status: 404 });
  }
  try {
    await fs.unlink(path.join(process.cwd(), "public", "uploads", item.filename));
  } catch {
    // ignore missing file
  }
  await writeCollection(
    "media",
    media.filter((m) => m.id !== id),
  );
  return NextResponse.json({ ok: true });
}
