/**
 * Building Primitives v3 — Smart brick selection
 *
 * Now picks contextually appropriate bricks:
 *   - 2-wide bricks (2×4, 2×6) for floors and thick walls
 *   - 1-wide bricks (1×4, 1×6) for thin walls
 *   - Plates for thin layers, caps, and details
 *   - Slopes for roofs and angled surfaces
 *   - Masonry bricks for textured stone walls
 */

// ── Brick dimensions lookup ─────────────────────────────────────

const B = {
  // 1-wide standard bricks
  "3005": { x: 1, z: 1 },
  "3004": { x: 2, z: 1 },
  "3622": { x: 3, z: 1 },
  "3010": { x: 4, z: 1 },
  "3009": { x: 6, z: 1 },
  "3008": { x: 8, z: 1 },
  // 2-wide standard bricks
  "3003": { x: 2, z: 2 },
  "3002": { x: 3, z: 2 },
  "3001": { x: 4, z: 2 },
  "2456": { x: 6, z: 2 },
  "3007": { x: 8, z: 2 },
  // 1-wide plates
  "3024": { x: 1, z: 1 },
  "3023": { x: 2, z: 1 },
  "3623": { x: 3, z: 1 },
  "3710": { x: 4, z: 1 },
  "3666": { x: 6, z: 1 },
  // 2-wide plates
  "3022": { x: 2, z: 2 },
  "3021": { x: 3, z: 2 },
  "3020": { x: 4, z: 2 },
  "3795": { x: 6, z: 2 },
  "3034": { x: 8, z: 2 },
  // Slopes
  "3040": { x: 2, z: 1 },
  "3039": { x: 2, z: 2 },
  "3037": { x: 4, z: 2 },
  "3298": { x: 3, z: 2 },
  // Masonry / grille
  "98283":{ x: 2, z: 1 },
  "2877": { x: 2, z: 1 },
};

function brickW(id) { return B[id]?.x ?? 1; }

// ── Smart brick pickers ─────────────────────────────────────────

/** Pick best 1-wide brick for a given available width */
function pick1Wide(available) {
  if (available >= 8) return { id: "3008", w: 8 };
  if (available >= 6) return { id: "3009", w: 6 };
  if (available >= 4) return { id: "3010", w: 4 };
  if (available >= 3) return { id: "3622", w: 3 };
  if (available >= 2) return { id: "3004", w: 2 };
  if (available >= 1) return { id: "3005", w: 1 };
  return { id: "3005", w: 0 };
}

/** Pick best 2-wide brick for a given available width */
function pick2Wide(available) {
  if (available >= 8) return { id: "3007", w: 8 };
  if (available >= 6) return { id: "2456", w: 6 };
  if (available >= 4) return { id: "3001", w: 4 };
  if (available >= 3) return { id: "3002", w: 3 };
  if (available >= 2) return { id: "3003", w: 2 };
  if (available >= 1) return { id: "3005", w: 1 };
  return { id: "3005", w: 0 };
}

/** Pick best 1-wide plate */
function pick1WidePlate(available) {
  if (available >= 6) return { id: "3666", w: 6 };
  if (available >= 4) return { id: "3710", w: 4 };
  if (available >= 3) return { id: "3623", w: 3 };
  if (available >= 2) return { id: "3023", w: 2 };
  if (available >= 1) return { id: "3024", w: 1 };
  return { id: "3024", w: 0 };
}

/** Pick best 2-wide plate */
function pick2WidePlate(available) {
  if (available >= 8) return { id: "3034", w: 8 };
  if (available >= 6) return { id: "3795", w: 6 };
  if (available >= 4) return { id: "3020", w: 4 };
  if (available >= 3) return { id: "3021", w: 3 };
  if (available >= 2) return { id: "3022", w: 2 };
  if (available >= 1) return { id: "3024", w: 1 };
  return { id: "3024", w: 0 };
}

/** Pick slope brick */
function pickSlope(available, depth) {
  if (depth >= 2) {
    if (available >= 4) return { id: "3037", w: 4, d: 2 };
    if (available >= 3) return { id: "3298", w: 3, d: 2 };
    if (available >= 2) return { id: "3039", w: 2, d: 2 };
  }
  if (available >= 2) return { id: "3040", w: 2, d: 1 };
  return { id: "3005", w: 1, d: 1 };
}

/** Pick masonry-textured brick */
function pickMasonry(available) {
  if (available >= 2) return { id: "98283", w: 2 };
  return { id: "3005", w: 1 };
}

// Legacy fallback used by some callers
function pickBrick(available) { return pick1Wide(available); }

// ── Fill a rectangle ────────────────────────────────────────────

export function fillRect({
  x0, z0, width, depth, y, color, step, brickId, cutouts = [],
  usePlates = false, use2Wide = true,
}) {
  const bricks = [];
  const rowD = use2Wide ? 2 : 1;
  const picker = usePlates
    ? (use2Wide ? pick2WidePlate : pick1WidePlate)
    : (use2Wide ? pick2Wide : pick1Wide);

  for (let z = z0; z < z0 + depth; z += rowD) {
    const actualD = Math.min(rowD, z0 + depth - z);
    const rowPicker = actualD >= 2 ? picker : (usePlates ? pick1WidePlate : pick1Wide);

    for (let x = x0; x < x0 + width; ) {
      const remaining = (x0 + width) - x;
      if (isInCutout(x, z, 1, 1, cutouts)) { x += 1; continue; }
      const { id, w } = brickId ? { id: brickId, w: brickW(brickId) } : rowPicker(remaining);
      if (w <= 0) { x += 1; continue; }
      if (!isInCutout(x, z, w, actualD, cutouts)) {
        bricks.push({ id, x, y, z, rot: 0, color, step });
      }
      x += w;
    }
  }
  return bricks;
}

// ── Wall along X axis ───────────────────────────────────────────

export function wallX({
  x0, z, width, yStart, height, color, step, openings = [], stagger = true,
  useMasonry = false,
}) {
  const bricks = [];
  for (let layer = 0; layer < height; layer++) {
    const y = yStart + layer;
    const offset = stagger && layer % 2 === 1 ? 1 : 0;
    const pick = useMasonry && layer % 2 === 0 ? pickMasonry : pick1Wide;

    if (offset > 0 && !isInOpening(x0, y, openings, x0)) {
      bricks.push({ id: "3005", x: x0, y, z, rot: 0, color, step });
    }

    for (let x = x0 + offset; x < x0 + width; ) {
      const remaining = (x0 + width) - x;
      if (isInOpening(x, y, openings, x0)) { x += 1; continue; }
      const avail = clampToNextOpening(x, y, remaining, openings, x0);
      const { id, w } = pick(avail);
      if (w <= 0) { x += 1; continue; }
      bricks.push({ id, x, y, z, rot: 0, color, step });
      x += w;
    }
  }
  return bricks;
}

// ── Wall along Z axis ───────────────────────────────────────────

export function wallZ({
  x, z0, depth, yStart, height, color, step, openings = [], stagger = true,
  useMasonry = false,
}) {
  const bricks = [];
  for (let layer = 0; layer < height; layer++) {
    const y = yStart + layer;
    const offset = stagger && layer % 2 === 1 ? 1 : 0;
    const pick = useMasonry && layer % 2 === 0 ? pickMasonry : pick1Wide;

    if (offset > 0 && !isInOpeningZ(z0, y, openings, z0)) {
      bricks.push({ id: "3005", x, y, z: z0, rot: 90, color, step });
    }

    for (let z = z0 + offset; z < z0 + depth; ) {
      const remaining = (z0 + depth) - z;
      if (isInOpeningZ(z, y, openings, z0)) { z += 1; continue; }
      const avail = clampToNextOpeningZ(z, y, remaining, openings, z0);
      const { id, w } = pick(avail);
      if (w <= 0) { z += 1; continue; }
      bricks.push({ id, x, y, z, rot: 90, color, step });
      z += w;
    }
  }
  return bricks;
}

// ── Textured walls (alternating colors) ─────────────────────────

export function texturedWallX({
  x0, z, width, yStart, height, colors, step, openings = [],
}) {
  const bricks = [];
  for (let layer = 0; layer < height; layer++) {
    const color = colors[layer % colors.length];
    const y = yStart + layer;
    const offset = layer % 2 === 1 ? 1 : 0;
    // Alternate between masonry and regular bricks per layer
    const pick = layer % 3 === 0 ? pickMasonry : pick1Wide;

    if (offset > 0 && !isInOpening(x0, y, openings, x0)) {
      bricks.push({ id: "3005", x: x0, y, z, rot: 0, color, step });
    }

    for (let x = x0 + offset; x < x0 + width; ) {
      const remaining = (x0 + width) - x;
      if (isInOpening(x, y, openings, x0)) { x += 1; continue; }
      const avail = clampToNextOpening(x, y, remaining, openings, x0);
      const { id, w } = pick(avail);
      if (w <= 0) { x += 1; continue; }
      bricks.push({ id, x, y, z, rot: 0, color, step });
      x += w;
    }
  }
  return bricks;
}

export function texturedWallZ({
  x, z0, depth, yStart, height, colors, step, openings = [],
}) {
  const bricks = [];
  for (let layer = 0; layer < height; layer++) {
    const color = colors[layer % colors.length];
    const y = yStart + layer;
    const offset = layer % 2 === 1 ? 1 : 0;
    const pick = layer % 3 === 0 ? pickMasonry : pick1Wide;

    if (offset > 0 && !isInOpeningZ(z0, y, openings, z0)) {
      bricks.push({ id: "3005", x, y, z: z0, rot: 90, color, step });
    }

    for (let z = z0 + offset; z < z0 + depth; ) {
      const remaining = (z0 + depth) - z;
      if (isInOpeningZ(z, y, openings, z0)) { z += 1; continue; }
      const avail = clampToNextOpeningZ(z, y, remaining, openings, z0);
      const { id, w } = pick(avail);
      if (w <= 0) { z += 1; continue; }
      bricks.push({ id, x, y, z, rot: 90, color, step });
      z += w;
    }
  }
  return bricks;
}

// ── Plate layer fill ─────────────────────────────────────────────

export function plateRect({ x0, z0, width, depth, y, color, step }) {
  return fillRect({ x0, z0, width, depth, y, color, step, usePlates: true, use2Wide: true });
}

// ── Sloped roof ──────────────────────────────────────────────────

export function slopedRoof({ x0, z0, width, depth, yStart, color, step, useSlopes = true }) {
  const bricks = [];
  const layers = Math.ceil(depth / 2);
  for (let layer = 0; layer < layers; layer++) {
    const y = yStart + layer;
    const inset = layer;
    const currentDepth = depth - inset * 2;
    if (currentDepth <= 0) break;
    const rowZ = z0 + inset;
    const isEdge = layer === 0;
    const isTop = layer === layers - 1 || depth - (inset + 1) * 2 <= 0;

    for (let zz = rowZ; zz < rowZ + currentDepth; zz++) {
      const overhang = isEdge ? 1 : 0;

      // Use slopes on the outer edges of each stepped layer
      if (useSlopes && (zz === rowZ || zz === rowZ + currentDepth - 1) && !isTop) {
        for (let x = x0 - overhang; x < x0 + width + overhang; ) {
          const rem = (x0 + width + overhang) - x;
          const { id, w, d } = pickSlope(Math.min(rem, 4), 1);
          bricks.push({ id, x, y, z: zz, rot: 0, color, step });
          x += w;
        }
      } else {
        for (let x = x0 - overhang; x < x0 + width + overhang; ) {
          const rem = (x0 + width + overhang) - x;
          const { id, w } = pick1Wide(Math.min(rem, 4));
          bricks.push({ id, x, y, z: zz, rot: 0, color, step });
          x += w;
        }
      }
    }
  }
  return bricks;
}

// ── Battlements ──────────────────────────────────────────────────

export function battlements({ x0, z0, width, depth, y, merlonH = 2, color, step }) {
  const bricks = [];
  for (let x = x0; x < x0 + width; x += 2) {
    for (let h = 0; h < merlonH; h++) {
      bricks.push({ id: "3005", x, y: y + h, z: z0, rot: 0, color, step });
      bricks.push({ id: "3005", x, y: y + h, z: z0 + depth - 1, rot: 0, color, step });
    }
  }
  for (let z = z0 + 1; z < z0 + depth - 1; z += 2) {
    for (let h = 0; h < merlonH; h++) {
      bricks.push({ id: "3005", x: x0, y: y + h, z, rot: 0, color, step });
      bricks.push({ id: "3005", x: x0 + width - 1, y: y + h, z, rot: 0, color, step });
    }
  }
  return bricks;
}

// ── Column (1×1) ─────────────────────────────────────────────────

export function column({ x, z, yStart, height, color, step }) {
  return Array.from({ length: height }, (_, h) =>
    ({ id: "3005", x, y: yStart + h, z, rot: 0, color, step })
  );
}

// ── Thick column (2×2) ───────────────────────────────────────────

export function thickColumn({ x, z, yStart, height, color, step }) {
  return Array.from({ length: height }, (_, h) =>
    ({ id: "3003", x, y: yStart + h, z, rot: 0, color, step })
  );
}

// ── Round column ─────────────────────────────────────────────────

export function roundColumn({ x, z, yStart, height, color, step }) {
  return Array.from({ length: height }, (_, h) =>
    ({ id: "3062", x, y: yStart + h, z, rot: 0, color, step })
  );
}

// ── Ring (perimeter at one layer) ────────────────────────────────

export function ring({ x0, z0, width, depth, y, color, step }) {
  const bricks = [];
  for (let x = x0; x < x0 + width; x++) {
    bricks.push({ id: "3005", x, y, z: z0, rot: 0, color, step });
    bricks.push({ id: "3005", x, y, z: z0 + depth - 1, rot: 0, color, step });
  }
  for (let z = z0 + 1; z < z0 + depth - 1; z++) {
    bricks.push({ id: "3005", x: x0, y, z, rot: 0, color, step });
    bricks.push({ id: "3005", x: x0 + width - 1, y, z, rot: 0, color, step });
  }
  return bricks;
}

// ── Plate ring (perimeter, using plates) ─────────────────────────

export function plateRing({ x0, z0, width, depth, y, color, step }) {
  const bricks = [];
  for (let x = x0; x < x0 + width; x++) {
    bricks.push({ id: "3024", x, y, z: z0, rot: 0, color, step });
    bricks.push({ id: "3024", x, y, z: z0 + depth - 1, rot: 0, color, step });
  }
  for (let z = z0 + 1; z < z0 + depth - 1; z++) {
    bricks.push({ id: "3024", x: x0, y, z, rot: 0, color, step });
    bricks.push({ id: "3024", x: x0 + width - 1, y, z, rot: 0, color, step });
  }
  return bricks;
}

// ── Stairs ───────────────────────────────────────────────────────

export function stairs({ x0, z0, direction, stepCount, stepWidth, color, step }) {
  const bricks = [];
  for (let i = 0; i < stepCount; i++) {
    for (let w = 0; w < stepWidth; w++) {
      const bx = direction === "x" ? x0 + i : x0 + w;
      const bz = direction === "z" ? z0 + i : z0 + w;
      bricks.push({ id: "3005", x: bx, y: i, z: bz, rot: 0, color, step });
    }
  }
  return bricks;
}

// ── Arch ─────────────────────────────────────────────────────────

export function arch({ x0, y0, z, width, height, color, step }) {
  const bricks = [];
  for (let h = 0; h < height - 1; h++) {
    bricks.push({ id: "3005", x: x0, y: y0 + h, z, rot: 0, color, step });
    bricks.push({ id: "3005", x: x0 + width - 1, y: y0 + h, z, rot: 0, color, step });
  }
  if (width >= 4) {
    bricks.push({ id: "3005", x: x0 + 1, y: y0 + height - 2, z, rot: 0, color, step });
    bricks.push({ id: "3005", x: x0 + width - 2, y: y0 + height - 2, z, rot: 0, color, step });
  }
  for (let x = x0; x < x0 + width; ) {
    const rem = (x0 + width) - x;
    const { id, w } = pick1Wide(Math.min(rem, 4));
    bricks.push({ id, x, y: y0 + height - 1, z, rot: 0, color, step });
    x += w;
  }
  return bricks;
}

// ── Diagonal line ────────────────────────────────────────────────

export function diagonal({ x0, z0, dx, dz, length, yStart, dy, color, step }) {
  return Array.from({ length }, (_, i) =>
    ({ id: "3005", x: x0 + i * dx, y: yStart + i * dy, z: z0 + i * dz, rot: 0, color, step })
  );
}

// ── Hollow box ───────────────────────────────────────────────────

export function hollowBox({ x0, z0, width, depth, yStart, height, color, step, openings = [] }) {
  return [
    ...wallX({ x0, z: z0, width, yStart, height, color, step, openings }),
    ...wallX({ x0, z: z0 + depth - 1, width, yStart, height, color, step }),
    ...wallZ({ x: x0, z0: z0 + 1, depth: depth - 2, yStart, height, color, step }),
    ...wallZ({ x: x0 + width - 1, z0: z0 + 1, depth: depth - 2, yStart, height, color, step }),
  ];
}

// ── Scatter ──────────────────────────────────────────────────────

export function scatter({ x0, z0, width, depth, y, density, color, step, seed = 7 }) {
  const bricks = [];
  let s = seed;
  const rng = () => { s = (s * 1103515245 + 12345) & 0x7fffffff; return (s >> 16) / 32768; };
  for (let x = x0; x < x0 + width; x++) {
    for (let z = z0; z < z0 + depth; z++) {
      if (rng() < density) {
        bricks.push({ id: "3005", x, y, z, rot: 0, color, step });
      }
    }
  }
  return bricks;
}

// ── Line of bricks ───────────────────────────────────────────────

export function line({ x0, z0, dx, dz, length, y, color, step }) {
  return Array.from({ length }, (_, i) =>
    ({ id: "3005", x: x0 + i * dx, y, z: z0 + i * dz, rot: 0, color, step })
  );
}

// ── Grille wall (alternating grille and normal bricks) ───────────

export function grilleWallX({ x0, z, width, yStart, height, color, step, openings = [] }) {
  const bricks = [];
  for (let layer = 0; layer < height; layer++) {
    const y = yStart + layer;
    const useGrille = layer % 2 === 0;
    for (let x = x0; x < x0 + width; ) {
      const remaining = (x0 + width) - x;
      if (isInOpening(x, y, openings, x0)) { x += 1; continue; }
      const avail = clampToNextOpening(x, y, remaining, openings, x0);
      if (useGrille && avail >= 2) {
        bricks.push({ id: "2877", x, y, z, rot: 0, color, step });
        x += 2;
      } else {
        const { id, w } = pick1Wide(avail);
        if (w <= 0) { x += 1; continue; }
        bricks.push({ id, x, y, z, rot: 0, color, step });
        x += w;
      }
    }
  }
  return bricks;
}

// ── Utility ──────────────────────────────────────────────────────

function isInCutout(x, z, w, d, cutouts) {
  for (const c of cutouts) {
    if (x >= c.x && x < c.x + c.w && z >= c.z && z < c.z + c.d) return true;
  }
  return false;
}

function isInOpening(x, y, openings, wallX0) {
  for (const op of openings) {
    const ox = wallX0 + op.x;
    if (x >= ox && x < ox + op.w && y >= op.yStart && y < op.yStart + op.h) return true;
  }
  return false;
}

function isInOpeningZ(z, y, openings, wallZ0) {
  for (const op of openings) {
    const oz = wallZ0 + op.x;
    if (z >= oz && z < oz + op.w && y >= op.yStart && y < op.yStart + op.h) return true;
  }
  return false;
}

function clampToNextOpening(x, y, available, openings, wallX0) {
  let maxW = available;
  for (const op of openings) {
    const ox = wallX0 + op.x;
    if (y >= op.yStart && y < op.yStart + op.h && ox > x && ox < x + maxW) maxW = ox - x;
  }
  return maxW;
}

function clampToNextOpeningZ(z, y, available, openings, wallZ0) {
  let maxW = available;
  for (const op of openings) {
    const oz = wallZ0 + op.x;
    if (y >= op.yStart && y < op.yStart + op.h && oz > z && oz < z + maxW) maxW = oz - z;
  }
  return maxW;
}