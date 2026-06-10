/**
 * Layout Engine v2 — Brick-by-brick positions
 *
 * Full brick catalog with accurate stud dimensions for all supported types.
 */

export const BRICK_H   = 0.96;
export const PLATE_H   = 0.32;
export const STUD_R    = 0.22;
export const STUD_H    = 0.16;
export const BRICK_GAP = 0.03;

export const BRICK_SIZES = {
  // ── Standard bricks (height = 1 layer) ──
  "3005": { x: 1, z: 1 }, // 1×1
  "3004": { x: 2, z: 1 }, // 1×2
  "3622": { x: 3, z: 1 }, // 1×3
  "3010": { x: 4, z: 1 }, // 1×4
  "3009": { x: 6, z: 1 }, // 1×6
  "3008": { x: 8, z: 1 }, // 1×8
  "6111": { x: 10,z: 1 }, // 1×10
  "3003": { x: 2, z: 2 }, // 2×2
  "3002": { x: 3, z: 2 }, // 2×3
  "3001": { x: 4, z: 2 }, // 2×4
  "2456": { x: 6, z: 2 }, // 2×6
  "3007": { x: 8, z: 2 }, // 2×8
  "3006": { x: 10,z: 2 }, // 2×10

  // ── Plates (height = 1/3 brick) ──
  "3024": { x: 1, z: 1, plate: true }, // 1×1
  "3023": { x: 2, z: 1, plate: true }, // 1×2
  "3623": { x: 3, z: 1, plate: true }, // 1×3
  "3710": { x: 4, z: 1, plate: true }, // 1×4
  "3666": { x: 6, z: 1, plate: true }, // 1×6
  "3460": { x: 8, z: 1, plate: true }, // 1×8
  "3022": { x: 2, z: 2, plate: true }, // 2×2
  "3021": { x: 3, z: 2, plate: true }, // 2×3
  "3020": { x: 4, z: 2, plate: true }, // 2×4
  "3795": { x: 6, z: 2, plate: true }, // 2×6
  "3034": { x: 8, z: 2, plate: true }, // 2×8
  "4477": { x: 10,z: 2, plate: true }, // 2×10

  // ── Slopes (height = 1 layer, angled top) ──
  "3040": { x: 2, z: 1, slope: true }, // Slope 1×2 (45°)
  "3298": { x: 3, z: 2, slope: true }, // Slope 2×3 (33°)
  "3037": { x: 4, z: 2, slope: true }, // Slope 2×4 (45°)
  "3039": { x: 2, z: 2, slope: true }, // Slope 2×2 (45°)
  "3665": { x: 2, z: 1, slope: true, inverted: true }, // Inv slope 1×2
  "3660": { x: 2, z: 2, slope: true, inverted: true }, // Inv slope 2×2

  // ── Round bricks ──
  "3062": { x: 1, z: 1, round: true }, // Round 1×1
  "3941": { x: 2, z: 2, round: true }, // Round 2×2

  // ── Modified / special ──
  "2877": { x: 2, z: 1 }, // Brick 1×2 with grille
  "98283":{ x: 2, z: 1 }, // Brick 1×2 with masonry profile
  "4070": { x: 1, z: 1 }, // Brick 1×1 with headlight / side stud
  "87087":{ x: 2, z: 1 }, // Brick 1×2 with side stud
  "3245": { x: 2, z: 1 }, // Brick 1×2×2 (double height)
  "2357": { x: 4, z: 2 }, // Brick 2×4 corner
};

/**
 * Convert a template brick placement to Three.js position + size.
 */
export function brickTo3D(brick) {
  const size = BRICK_SIZES[brick.id] ?? { x: 1, z: 1 };
  const isRotated = brick.rot === 90;
  const isPlate = size.plate;

  const w = isRotated ? size.z : size.x;
  const d = isRotated ? size.x : size.z;
  const h = isPlate ? PLATE_H : BRICK_H;

  return {
    x: brick.x + w / 2,
    y: brick.y * BRICK_H + h / 2,
    z: brick.z + d / 2,
    w, h, d,
    color: brick.color,
    step: brick.step,
    isSlope: !!size.slope,
    isRound: !!size.round,
    isPlate: !!isPlate,
  };
}

/**
 * Compute bounding box center for camera framing.
 */
export function computeCenter(bricks3D) {
  if (bricks3D.length === 0) return { cx: 0, cy: 0, cz: 0, span: 10 };

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