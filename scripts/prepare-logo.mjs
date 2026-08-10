// Turns the white-on-black source logo into transparent brand assets.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SOURCE = process.argv[2];
if (!SOURCE) {
  console.error("usage: node scripts/prepare-logo.mjs <source.png>");
  process.exit(1);
}

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const PUBLIC_DIR = path.join(ROOT, "public");
const APP_DIR = path.join(ROOT, "app");

const NAVY = { r: 0x2d, g: 0x31, b: 0x92 };
const YELLOW = { r: 0xea, g: 0xea, b: 0x35 };

const { data, info } = await sharp(SOURCE)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const { width, height, channels } = info;

// The artwork is pure white on pure black, so brightness maps directly to opacity.
const alpha = new Uint8Array(width * height);
for (let i = 0; i < width * height; i += 1) {
  const offset = i * channels;
  alpha[i] = Math.max(data[offset], data[offset + 1], data[offset + 2]);
}

const THRESHOLD = 12;
const columnHasInk = new Array(width).fill(false);
let minX = width;
let maxX = -1;
let minY = height;
let maxY = -1;

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    if (alpha[y * width + x] > THRESHOLD) {
      columnHasInk[x] = true;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const box = {
  left: minX,
  top: minY,
  width: maxX - minX + 1,
  height: maxY - minY + 1,
};

// Largest empty column run inside the artwork separates the hexagon mark from the wordmark.
let bestGap = { start: -1, end: -1, length: 0 };
let runStart = -1;
for (let x = minX; x <= maxX; x += 1) {
  if (!columnHasInk[x]) {
    if (runStart === -1) runStart = x;
  } else if (runStart !== -1) {
    const length = x - runStart;
    if (length > bestGap.length) bestGap = { start: runStart, end: x - 1, length };
    runStart = -1;
  }
}

const markRight = bestGap.length > 0 ? bestGap.start - 1 : maxX;
const markBox = {
  left: minX,
  top: minY,
  width: markRight - minX + 1,
  height: box.height,
};

function tint({ r, g, b }) {
  const out = Buffer.alloc(width * height * 4);
  for (let i = 0; i < width * height; i += 1) {
    const offset = i * 4;
    out[offset] = r;
    out[offset + 1] = g;
    out[offset + 2] = b;
    out[offset + 3] = alpha[i];
  }
  return sharp(out, { raw: { width, height, channels: 4 } }).png();
}

await mkdir(PUBLIC_DIR, { recursive: true });

await tint({ r: 255, g: 255, b: 255 })
  .extract(box)
  .toFile(path.join(PUBLIC_DIR, "logo-max-white.png"));

await tint(NAVY).extract(box).toFile(path.join(PUBLIC_DIR, "logo-max-navy.png"));

const markWhite = await tint({ r: 255, g: 255, b: 255 })
  .extract(markBox)
  .toBuffer();
await writeFile(path.join(PUBLIC_DIR, "logo-mark-white.png"), markWhite);

await tint(YELLOW)
  .extract(markBox)
  .toFile(path.join(PUBLIC_DIR, "logo-mark-yellow.png"));

async function squareIcon(size, radius) {
  const inner = Math.round(size * 0.62);
  const mark = await sharp(markWhite)
    .resize({ width: inner, height: inner, fit: "inside" })
    .toBuffer();
  const background = Buffer.from(
    `<svg width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${radius}" fill="#2D3192"/></svg>`,
  );
  return sharp(background)
    .composite([{ input: mark, gravity: "center" }])
    .png()
    .toBuffer();
}

await writeFile(path.join(APP_DIR, "icon.png"), await squareIcon(512, 96));
await writeFile(path.join(APP_DIR, "apple-icon.png"), await squareIcon(180, 34));

const OG_WIDTH = 1200;
const OG_HEIGHT = 630;
const ogLogo = await sharp(
  await tint({ r: 255, g: 255, b: 255 }).extract(box).toBuffer(),
)
  .resize({ width: 640, fit: "inside" })
  .toBuffer();

const ogBackground = Buffer.from(
  `<svg width="${OG_WIDTH}" height="${OG_HEIGHT}" xmlns="http://www.w3.org/2000/svg">
    <rect width="${OG_WIDTH}" height="${OG_HEIGHT}" fill="#2D3192"/>
    <circle cx="1080" cy="90" r="260" fill="#3A3FB0" opacity="0.55"/>
    <circle cx="120" cy="580" r="220" fill="#242873" opacity="0.7"/>
    <rect y="${OG_HEIGHT - 16}" width="${OG_WIDTH}" height="16" fill="#EAEA35"/>
    <text x="600" y="470" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="46" font-weight="700" fill="#EAEA35" letter-spacing="6">MAX FOR SEE</text>
    <text x="600" y="530" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="30" fill="#FEFFF9" letter-spacing="2">SIGNAGE - MAZANDARAN - IRAN</text>
  </svg>`,
);

await sharp(ogBackground)
  .composite([{ input: ogLogo, top: 130, left: Math.round((OG_WIDTH - 640) / 2) }])
  .png()
  .toFile(path.join(APP_DIR, "opengraph-image.png"));

console.log("artwork bounds", box);
console.log("mark bounds", markBox);
console.log("wrote logo, icon, apple-icon and opengraph-image");
