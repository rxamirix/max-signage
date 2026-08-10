/**
 * Traces the MAX letterforms out of the brand logo PNG into clean SVG paths,
 * so the hero wordmark is real vector art at exactly the logo's proportions.
 * The FOR SEE line below them is set as live text instead, in MaxWordmark.
 *
 * Run: node scripts/trace-wordmark.mjs
 * Writes: components/wordmark-paths.ts
 */
import { writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(root, "public", "logo-max-white.png");
const outFile = path.join(root, "components", "wordmark-paths.ts");

// Measured from the logo: the cap band and the column each MAX letter occupies.
const CAP_TOP = 97;
const CAP_BASE = 220;
const DESCENDER_BOTTOM = 259;
// Below the cap baseline the artwork holds three separate things: the point of
// the M, the FOR SEE line, and the tail of the X. These columns bracket the
// middle one, which is the only part that is not traced.
const SUBTITLE_LEFT_EDGE = 660;
const SUBTITLE_RIGHT_EDGE = 830;

const CAP_LETTERS = [
  { key: "m", left: 311, right: 535 },
  { key: "a", left: 559, right: 729 },
  { key: "x", left: 738, right: 902 },
];

const ORIGIN_X = CAP_LETTERS[0].left;
const ORIGIN_Y = CAP_TOP;
const VIEW_W = CAP_LETTERS[CAP_LETTERS.length - 1].right - ORIGIN_X + 1;
const VIEW_H = DESCENDER_BOTTOM - ORIGIN_Y + 1;

const { data, info } = await sharp(src)
  .ensureAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const alphaAt = (x, y) => {
  if (x < 0 || y < 0 || x >= info.width || y >= info.height) return 0;
  return data[(y * info.width + x) * 4 + 3];
};

const inSubtitleColumns = (x) =>
  x >= SUBTITLE_LEFT_EDGE && x <= SUBTITLE_RIGHT_EDGE;

/** Everything except the subtitle: the caps, the M point and the X tail. */
const isCapInk = (x, y) =>
  alphaAt(x, y) >= 128 && !(y > CAP_BASE && inSubtitleColumns(x));

/** Moore-neighbour boundary tracing over a flat 0/1 mask. */
function traceMask(mask, w, h) {
  const at = (x, y) =>
    x >= 0 && y >= 0 && x < w && y < h && mask[y * w + x] === 1;

  let start = null;
  for (let y = 0; y < h && !start; y++) {
    for (let x = 0; x < w; x++) {
      if (at(x, y)) {
        start = [x, y];
        break;
      }
    }
  }
  if (!start) return null;

  const ring = [
    [-1, -1],
    [0, -1],
    [1, -1],
    [1, 0],
    [1, 1],
    [0, 1],
    [-1, 1],
    [-1, 0],
  ];
  const ringIndex = (from, to) =>
    ring.findIndex(([rx, ry]) => rx === to[0] - from[0] && ry === to[1] - from[1]);

  const contour = [start];
  let current = start;
  let backtrack = [start[0] - 1, start[1]];

  for (let step = 0; step < w * h * 8; step++) {
    const startIdx = ringIndex(current, backtrack);
    let next = null;

    for (let i = 1; i <= 8; i++) {
      const [rx, ry] = ring[(startIdx + i) % 8];
      const candidate = [current[0] + rx, current[1] + ry];
      if (at(candidate[0], candidate[1])) {
        next = candidate;
        break;
      }
      backtrack = candidate;
    }

    if (!next) break;
    if (next[0] === start[0] && next[1] === start[1]) break;
    contour.push(next);
    current = next;
  }

  return contour;
}

/** Ramer–Douglas–Peucker: collapses pixel staircases back to straight edges. */
function simplify(points, epsilon) {
  if (points.length < 3) return points;

  const [ax, ay] = points[0];
  const [bx, by] = points[points.length - 1];
  const dx = bx - ax;
  const dy = by - ay;
  const len = Math.hypot(dx, dy) || 1;

  let maxDist = -1;
  let index = 0;
  for (let i = 1; i < points.length - 1; i++) {
    const [px, py] = points[i];
    const dist = Math.abs(dy * px - dx * py + bx * ay - by * ax) / len;
    if (dist > maxDist) {
      maxDist = dist;
      index = i;
    }
  }

  if (maxDist <= epsilon) return [points[0], points[points.length - 1]];

  const head = simplify(points.slice(0, index + 1), epsilon);
  const tail = simplify(points.slice(index), epsilon);
  return [...head.slice(0, -1), ...tail];
}

/** RDP needs two open runs, otherwise a closed ring collapses to a line. */
function simplifyRing(points, epsilon) {
  if (points.length < 4) return points;

  let pivot = 0;
  let farthest = -1;
  for (let i = 1; i < points.length; i++) {
    const dist = Math.hypot(
      points[i][0] - points[0][0],
      points[i][1] - points[0][1],
    );
    if (dist > farthest) {
      farthest = dist;
      pivot = i;
    }
  }

  const head = simplify(points.slice(0, pivot + 1), epsilon);
  const tail = simplify([...points.slice(pivot), points[0]], epsilon);
  return [...head.slice(0, -1), ...tail.slice(0, -1)];
}

/**
 * Traces one glyph into an outer contour plus a contour per enclosed counter,
 * so letters such as O and R keep their holes under the even-odd fill rule.
 */
function traceGlyph({ left, right, top, bottom }, inkTest, epsilon) {
  const w = right - left + 1;
  const h = bottom - top + 1;

  const ink = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      ink[y * w + x] = inkTest(left + x, top + y) ? 1 : 0;
    }
  }

  const rings = [];
  const outer = traceMask(ink, w, h);
  if (!outer) return rings;
  rings.push(outer);

  // Background reachable from the border is outside the glyph; whatever is
  // left over is an enclosed counter.
  const reachable = new Uint8Array(w * h);
  const queue = [];
  for (let x = 0; x < w; x++) {
    queue.push([x, 0], [x, h - 1]);
  }
  for (let y = 0; y < h; y++) {
    queue.push([0, y], [w - 1, y]);
  }

  while (queue.length) {
    const [x, y] = queue.pop();
    if (x < 0 || y < 0 || x >= w || y >= h) continue;
    const i = y * w + x;
    if (reachable[i] || ink[i]) continue;
    reachable[i] = 1;
    queue.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]);
  }

  const claimed = new Uint8Array(w * h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = y * w + x;
      if (ink[i] || reachable[i] || claimed[i]) continue;

      const hole = new Uint8Array(w * h);
      const stack = [[x, y]];
      while (stack.length) {
        const [hx, hy] = stack.pop();
        if (hx < 0 || hy < 0 || hx >= w || hy >= h) continue;
        const hi = hy * w + hx;
        if (ink[hi] || reachable[hi] || claimed[hi]) continue;
        claimed[hi] = 1;
        hole[hi] = 1;
        stack.push([hx + 1, hy], [hx - 1, hy], [hx, hy + 1], [hx, hy - 1]);
      }

      const ring = traceMask(hole, w, h);
      if (ring && ring.length > 6) rings.push(ring);
    }
  }

  const round = (n) => Math.round(n * 10) / 10;

  return rings.map((ring) =>
    simplifyRing(ring, epsilon).map(([x, y]) => [
      round(left + x - ORIGIN_X),
      round(top + y - ORIGIN_Y),
    ]),
  );
}

const toPath = (rings) =>
  rings
    .map(
      (ring) =>
        ring.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x} ${y}`).join("") + "Z",
    )
    .join("");

const capPaths = CAP_LETTERS.map((letter) => ({
  key: letter.key,
  d: toPath(
    traceGlyph(
      { ...letter, top: CAP_TOP, bottom: DESCENDER_BOTTOM },
      isCapInk,
      1.1,
    ),
  ),
}));

const file = `// Generated by scripts/trace-wordmark.mjs from public/logo-max-white.png.
// Do not edit by hand; re-run the script if the logo changes.

export const MAX_VIEWBOX = "0 0 ${VIEW_W} ${VIEW_H}";

export const MAX_PATHS = {
${capPaths.map((p) => `  ${p.key}: "${p.d}",`).join("\n")}
} as const;
`;

await writeFile(outFile, file, "utf8");

// Prove the vector version matches the letterforms it came from.
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW_W} ${VIEW_H}" width="${VIEW_W}" height="${VIEW_H}">
<rect width="100%" height="100%" fill="#000"/>
${capPaths.map((p) => `<path d="${p.d}" fill="#fff"/>`).join("")}
</svg>`;

const traced = await sharp(Buffer.from(svg)).greyscale().raw().toBuffer();

let intersection = 0;
let union = 0;
for (let y = 0; y < VIEW_H; y++) {
  for (let x = 0; x < VIEW_W; x++) {
    const a = traced[y * VIEW_W + x] > 127;
    const b = isCapInk(ORIGIN_X + x, ORIGIN_Y + y);
    if (a && b) intersection++;
    if (a || b) union++;
  }
}

console.log(`match with logo: ${((intersection / union) * 100).toFixed(2)}%`);
console.log(`viewBox 0 0 ${VIEW_W} ${VIEW_H} -> ${outFile}`);
