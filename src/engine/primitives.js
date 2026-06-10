/**
 * Building Primitives
 *
 * These expand high-level structural commands into individual brick placements.
 * Each placement is: { id, x, y, z, rot, color, step }
 *
 * Coordinate system:
 *   x = left-right (stud units), z = front-back (stud units)
 *   y = vertical layer index (0 = ground, 1 = one brick up, etc.)
 *   rot = rotation in degrees (0 = along X axis, 90 = along Z axis)
 *
 * The fitter checks the aggregate parts list against inventory.
 */

// ── Fill a rectangular area with bricks at a given layer ──────────

/**
 * Fill a rectangular region at layer `y` with rows of a given brick.
 * Handles odd widths by mixing in 1-wide bricks.
 *
 * @param {object} opts
 * @param {number} opts.x0 - left start (stud units)
 * @param {number} opts.z0 - front start
 * @param {number} opts.width  - width in studs (X direction)
 * @param {number} opts.depth  - depth in studs (Z direction)
 * @param {number} opts.y      - layer index
 * @param {string} opts.color  - hex color
 * @param {number} opts.step   - build step number
 * @param {string} [opts.brickId="3001"] - default brick to fill with
 * @param {object[]} [opts.cutouts=[]]   - array of {x, z, w, d} to leave empty
 * @returns {object[]} brick placements
 */
export function fillRect({
  x0, z0, width, depth, y, color, step, brickId = "3001", cutouts = [],
}) {
  const bricks = [];
  const brickW = getBrickStudsX(brickId);
  const brickD = getBrickStudsZ(brickId);

  for (let z = z0; z < z0 + depth; z += brickD) {
    for (let x = x0; x < x0 + width; ) {
      const remaining = (x0 + width) - x;

      // Skip if inside a cutout
      if (isInCutout(x, z, brickW, brickD, cutouts)) {
        x += 1;
        continue;
      }

      // Choose best fitting brick
      const { id, w } = pickBrick(remaining, brickId);
      if (w <= 0) { x += 1; continue; }

      // Check cutout overlap for this specific brick
      if (!isInCutout(x, z, w, brickD, cutouts)) {
        bricks.push({ id, x, y, z, rot: 0, color, step });
      }
      x += w;
    }
  }

  return bricks;
}

// ── Wall (thin, 1-stud deep, with optional openings) ──────────────

/**
 * Build a wall along the X axis.
 *
 * @param {object} opts
 * @param {number} opts.x0      - left start
 * @param {number} opts.z       - z position
 * @param {number} opts.width   - wall length in studs
 * @param {number} opts.yStart  - bottom layer
 * @param {number} opts.height  - number of layers
 * @param {string} opts.color
 * @param {number} opts.step
 * @param {object[]} [opts.openings=[]] - {x, yStart, w, h} window/door holes
 * @param {boolean} [opts.stagger=true] - offset every other row for strength
 */
export function wallX({
  x0, z, width, yStart, height, color, step, openings = [], stagger = true,
}) {
  const bricks = [];
  for (let layer = 0; layer < height; layer++) {
    const y = yStart + layer;
    const offset = stagger && layer % 2 === 1 ? 1 : 0;

    for (let x = x0 + offset; x < x0 + width; ) {
      const remaining = (x0 + width) - x;

      // Check if position is inside an opening
      if (isInOpening(x, y, openings, x0)) {
        x += 1;
        continue;
      }

      // Fill gap at start if staggered
      if (x === x0 + offset && offset > 0) {
        if (!isInOpening(x0, y, openings, x0)) {
          bricks.push({ id: "3005", x: x0, y, z, rot: 0, color, step });
        }
      }

      const avail = clampToNextOpening(x, y, remaining, openings, x0);
      const { id, w } = pickBrick(avail);
      if (w <= 0) { x += 1; continue; }

      bricks.push({ id, x, y, z, rot: 0, color, step });
      x += w;
    }
  }
  return bricks;
}

/**
 * Build a wall along the Z axis.
 */
export function wallZ({
  x, z0, depth, yStart, height, color, step, openings = [], stagger = true,
}) {
  const bricks = [];
  for (let layer = 0; layer < height; layer++) {
    const y = yStart + layer;
    const offset = stagger && layer % 2 === 1 ? 1 : 0;

    for (let z = z0 + offset; z < z0 + depth; ) {
      const remaining = (z0 + depth) - z;

      if (isInOpeningZ(z, y, openings, z0)) {
        z += 1;
        continue;
      }

      if (z === z0 + offset && offset > 0) {
        if (!isInOpeningZ(z0, y, openings, z0)) {
          bricks.push({ id: "3005", x, y, z: z0, rot: 90, color, step });
        }
      }

      const avail = clampToNextOpeningZ(z, y, remaining, openings, z0);
      const { id, w } = pickBrick(avail);
      if (w <= 0) { z += 1; continue; }

      bricks.push({ id, x, y, z, rot: 90, color, step });
      z += w;
    }
  }
  return bricks;
}

// ── Battlement (alternating merlon/crenel pattern) ────────────────

export function battlements({
  x0, z0, width, depth, y, merlonH = 2, color, step,
}) {
  const bricks = [];

  // North and south edges
  for (let x = x0; x < x0 + width; x += 2) {
    // Merlon (raised block)
    for (let h = 0; h < merlonH; h++) {
      bricks.push({ id: "3005", x, y: y + h, z: z0, rot: 0, color, step });
      bricks.push({ id: "3005", x, y: y + h, z: z0 + depth - 1, rot: 0, color, step });
    }
    // Crenel (gap) — skip x+1
  }

  // East and west edges
  for (let z = z0 + 1; z < z0 + depth - 1; z += 2) {
    for (let h = 0; h < merlonH; h++) {
      bricks.push({ id: "3005", x: x0, y: y + h, z, rot: 0, color, step });
      bricks.push({ id: "3005", x: x0 + width - 1, y: y + h, z, rot: 0, color, step });
    }
  }

  return bricks;
}

// ── Column / pillar ───────────────────────────────────────────────

export function column({ x, z, yStart, height, color, step }) {
  const bricks = [];
  for (let h = 0; h < height; h++) {
    bricks.push({ id: "3005", x, y: yStart + h, z, rot: 0, color, step });
  }
  return bricks;
}

// ── Stairs (stepping up in one direction) ─────────────────────────

export function stairs({ x0, z0, direction, stepCount, stepWidth, color, step }) {
  const bricks = [];
  for (let i = 0; i < stepCount; i++) {
    const y = i;
    const x = direction === "x" ? x0 + i : x0;
    const z = direction === "z" ? z0 + i : z0;

    for (let w = 0; w < stepWidth; w++) {
      const bx = direction === "x" ? x : x0 + w;
      const bz = direction === "z" ? z : z0 + w;
      bricks.push({ id: "3005", x: bx, y, z: bz, rot: 0, color, step });
    }
  }
  return bricks;
}

// ── Roof slope (triangular stepped wedge) ──────────────────────────

export function slopedRoof({ x0, z0, width, depth, yStart, color, step }) {
  const bricks = [];
  const layers = Math.ceil(depth / 2);

  for (let layer = 0; layer < layers; layer++) {
    const y = yStart + layer;
    const inset = layer;
    const currentDepth = depth - inset * 2;
    if (currentDepth <= 0) break;

    // Full-width row, narrowing in Z
    const rowZ = z0 + inset;
    for (let zz = rowZ; zz < rowZ + currentDepth; zz++) {
      // Use 2x4s along the width, with overhang on bottom layer
      const overhang = layer === 0 ? 1 : 0;
      for (let x = x0 - overhang; x < x0 + width + overhang; ) {
        const rem = (x0 + width + overhang) - x;
        const { id, w } = pickBrick(Math.min(rem, 4));
        bricks.push({ id, x, y, z: zz, rot: 0, color, step });
        x += w;
      }
    }
  }

  return bricks;
}

// ── Arch (simple stepped arch shape) ──────────────────────────────

export function arch({ x0, y0, z, width, height, color, step }) {
  const bricks = [];
  const halfW = Math.floor(width / 2);

  // Columns on each side
  for (let h = 0; h < height - 1; h++) {
    bricks.push({ id: "3005", x: x0, y: y0 + h, z, rot: 0, color, step });
    bricks.push({ id: "3005", x: x0 + width - 1, y: y0 + h, z, rot: 0, color, step });
  }

  // Stepped inward for arch shape
  if (width >= 4) {
    bricks.push({ id: "3005", x: x0 + 1, y: y0 + height - 2, z, rot: 0, color, step });
    bricks.push({ id: "3005", x: x0 + width - 2, y: y0 + height - 2, z, rot: 0, color, step });
  }

  // Keystone row across the top
  for (let x = x0; x < x0 + width; ) {
    const rem = (x0 + width) - x;
    const { id, w } = pickBrick(Math.min(rem, 4));
    bricks.push({ id, x, y: y0 + height - 1, z, rot: 0, color, step });
    x += w;
  }

  return bricks;
}


// ── Utility functions ─────────────────────────────────────────────

const BRICK_SIZES = {
  "3005": { x: 1, z: 1 }, // 1x1
  "3004": { x: 2, z: 1 }, // 1x2
  "3010": { x: 4, z: 1 }, // 1x4
  "3009": { x: 6, z: 1 }, // 1x6
  "3008": { x: 8, z: 1 }, // 1x8
  "3003": { x: 2, z: 2 }, // 2x2
  "3001": { x: 4, z: 2 }, // 2x4
  "2456": { x: 6, z: 2 }, // 2x6
};

function getBrickStudsX(id) { return BRICK_SIZES[id]?.x ?? 4; }
function getBrickStudsZ(id) { return BRICK_SIZES[id]?.z ?? 2; }

/** Pick the best brick that fits in `available` studs */
function pickBrick(available, preferredId) {
  // Try preferred first
  if (preferredId) {
    const pw = getBrickStudsX(preferredId);
    if (pw <= available) return { id: preferredId, w: pw };
  }

  // Descending by size
  if (available >= 4) return { id: "3010", w: 4 };
  if (available >= 2) return { id: "3004", w: 2 };
  if (available >= 1) return { id: "3005", w: 1 };
  return { id: "3005", w: 0 };
}

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
    const oz = wallZ0 + op.x; // openings use 'x' as offset along wall axis
    if (z >= oz && z < oz + op.w && y >= op.yStart && y < op.yStart + op.h) return true;
  }
  return false;
}

function clampToNextOpening(x, y, available, openings, wallX0) {
  let maxW = available;
  for (const op of openings) {
    const ox = wallX0 + op.x;
    if (y >= op.yStart && y < op.yStart + op.h && ox > x && ox < x + maxW) {
      maxW = ox - x;
    }
  }
  return maxW;
}

function clampToNextOpeningZ(z, y, available, openings, wallZ0) {
  let maxW = available;
  for (const op of openings) {
    const oz = wallZ0 + op.x;
    if (y >= op.yStart && y < op.yStart + op.h && oz > z && oz < z + maxW) {
      maxW = oz - z;
    }
  }
  return maxW;
}
