/**
 * Layout Engine v2 — Brick-by-brick positions
 *
 * Coordinate mapping from template to Three.js:
 *   Template x (studs)  → Three.js X (1 stud = 1 unit)
 *   Template y (layers) → Three.js Y (1 layer = BRICK_H)
 *   Template z (studs)  → Three.js Z (1 stud = 1 unit)
 *
 * Each brick knows its own size from BRICK_SIZES.
 */

export const BRICK_H  = 0.96;  // height of one brick layer
export const STUD_R   = 0.22;
export const STUD_H   = 0.16;
export const BRICK_GAP = 0.03;

export const BRICK_SIZES = {
  "3005": { x: 1, z: 1 },
  "3004": { x: 2, z: 1 },
  "3010": { x: 4, z: 1 },
  "3009": { x: 6, z: 1 },
  "3008": { x: 8, z: 1 },
  "3003": { x: 2, z: 2 },
  "3001": { x: 4, z: 2 },
  "2456": { x: 6, z: 2 },
  "3023": { x: 2, z: 1 },
  "3024": { x: 1, z: 1 },
  "3020": { x: 4, z: 2 },
  "3022": { x: 2, z: 2 },
};

/**
 * Convert a template brick placement to a Three.js position and size.
 */
export function brickTo3D(brick) {
  const size = BRICK_SIZES[brick.id] ?? { x: 1, z: 1 };
  const isRotated = brick.rot === 90;

  const w = isRotated ? size.z : size.x;
  const d = isRotated ? size.x : size.z;
  const h = BRICK_H;

  return {
    x: brick.x + w / 2,
    y: brick.y * BRICK_H + h / 2,
    z: brick.z + d / 2,
    w,
    h,
    d,
    color: brick.color,
    step: brick.step,
  };
}

/**
 * Compute the bounding box center of all bricks to center the model.
 */
export function computeCenter(bricks3D) {
  if (bricks3D.length === 0) return { cx: 0, cy: 0, cz: 0 };

  let minX = Infinity, maxX = -Infinity;
  let minY = Infinity, maxY = -Infinity;
  let minZ = Infinity, maxZ = -Infinity;

  for (const b of bricks3D) {
    minX = Math.min(minX, b.x - b.w / 2);
    maxX = Math.max(maxX, b.x + b.w / 2);
    minY = Math.min(minY, b.y - b.h / 2);
    maxY = Math.max(maxY, b.y + b.h / 2);
    minZ = Math.min(minZ, b.z - b.d / 2);
    maxZ = Math.max(maxZ, b.z + b.d / 2);
  }

  return {
    cx: (minX + maxX) / 2,
    cy: (minY + maxY) / 2,
    cz: (minZ + maxZ) / 2,
    span: Math.max(maxX - minX, maxY - minY, maxZ - minZ),
  };
}
