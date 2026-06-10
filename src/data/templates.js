/**
 * BrickForge Template Schema v2 — Brick-by-brick placement
 *
 * Each template defines a `build()` function that returns an array of
 * individual brick placements using the primitives engine.
 *
 * Placement: { id, x, y, z, rot, color, step }
 *   id    = brick part number (e.g. "3001" = 2×4 brick)
 *   x, z  = position in stud units (bottom-left corner)
 *   y     = layer index (0 = ground)
 *   rot   = 0 (along X) or 90 (along Z)
 *   color = hex string
 *   step  = which build step this brick belongs to (1-indexed)
 */

import {
  fillRect, wallX, wallZ, battlements, column,
  stairs, slopedRoof, arch,
} from "../engine/primitives.js";

// ── Color palettes ─────────────────────────────────────────────

const STONE     = "#9A8C7C";
const STONE_DK  = "#6E6356";
const STONE_LT  = "#C4B9A8";
const RED       = "#C1392B";
const RED_DK    = "#962C21";
const BLUE      = "#0057A8";
const BLUE_DK   = "#003D75";
const WHITE     = "#F4F4F0";
const YELLOW    = "#F5C518";
const GREEN     = "#1E8C2A";
const GREEN_DK  = "#156620";
const BROWN     = "#6D3A1E";
const BROWN_DK  = "#4A270F";
const BLACK     = "#1A1A18";
const GRAY      = "#7A7A7A";
const GRAY_LT   = "#AAAAAA";
const ORANGE    = "#F07D00";
const TAN       = "#D4C89A";

// ── Common brick types for reference ───────────────────────────

export const BRICK_TYPES = {
  "3001": { label: "Brick 2×4",   studsX: 4, studsZ: 2 },
  "3003": { label: "Brick 2×2",   studsX: 2, studsZ: 2 },
  "3004": { label: "Brick 1×2",   studsX: 2, studsZ: 1 },
  "3005": { label: "Brick 1×1",   studsX: 1, studsZ: 1 },
  "3010": { label: "Brick 1×4",   studsX: 4, studsZ: 1 },
  "3009": { label: "Brick 1×6",   studsX: 6, studsZ: 1 },
  "3008": { label: "Brick 1×8",   studsX: 8, studsZ: 1 },
  "3023": { label: "Plate 1×2",   studsX: 2, studsZ: 1 },
  "3024": { label: "Plate 1×1",   studsX: 1, studsZ: 1 },
  "3020": { label: "Plate 2×4",   studsX: 4, studsZ: 2 },
  "3022": { label: "Plate 2×2",   studsX: 2, studsZ: 2 },
  "2456": { label: "Brick 2×6",   studsX: 6, studsZ: 2 },
};

// ════════════════════════════════════════════════════════════════
// TEMPLATES
// ════════════════════════════════════════════════════════════════

export const TEMPLATES = [

  // ──────────────────────────────────────────────────────────────
  // 1. MEDIEVAL WATCHTOWER
  // ──────────────────────────────────────────────────────────────
  {
    id: "medieval_tower",
    name: "Medieval Watchtower",
    theme: "buildings",
    description: "A tall stone watchtower with arched windows, a reinforced door, an interior staircase, and classic crenellated battlements.",
    difficulty: "advanced",
    thumbnail: "🏰",
    stepLabels: [
      "Foundation slab",
      "Lower walls with door arch",
      "Mid walls with arrow slits",
      "Upper walls with arched windows",
      "Interior staircase",
      "Walkway floor",
      "Battlements & merlons",
      "Corner turret columns",
    ],
    build() {
      const b = [];
      const S = STONE, SD = STONE_DK, SL = STONE_LT;

      // Step 1 — Foundation: thick 10×10 base, 2 layers
      b.push(...fillRect({ x0: 0, z0: 0, width: 10, depth: 10, y: 0, color: SD, step: 1, brickId: "3001" }));
      b.push(...fillRect({ x0: 0, z0: 0, width: 10, depth: 10, y: 1, color: SD, step: 1, brickId: "3001" }));

      // Step 2 — Lower walls (layers 2–6) with door on front (south, z=0)
      const doorOpening = [{ x: 3, yStart: 2, w: 4, h: 5 }]; // wide door
      b.push(...wallX({ x0: 0, z: 0, width: 10, yStart: 2, height: 5, color: S, step: 2, openings: doorOpening }));
      b.push(...wallX({ x0: 0, z: 9, width: 10, yStart: 2, height: 5, color: S, step: 2 }));
      b.push(...wallZ({ x: 0, z0: 1, depth: 8, yStart: 2, height: 5, color: S, step: 2 }));
      b.push(...wallZ({ x: 9, z0: 1, depth: 8, yStart: 2, height: 5, color: S, step: 2 }));

      // Door arch
      b.push(...arch({ x0: 3, y0: 2, z: 0, width: 4, height: 5, color: SD, step: 2 }));

      // Step 3 — Mid walls (layers 7–11) with arrow slits (narrow windows)
      const arrowSlit1 = [{ x: 4, yStart: 8, w: 1, h: 3 }];
      const arrowSlit2 = [{ x: 4, yStart: 8, w: 1, h: 3 }];
      b.push(...wallX({ x0: 0, z: 0, width: 10, yStart: 7, height: 5, color: S, step: 3, openings: arrowSlit1 }));
      b.push(...wallX({ x0: 0, z: 9, width: 10, yStart: 7, height: 5, color: S, step: 3, openings: arrowSlit2 }));
      b.push(...wallZ({ x: 0, z0: 1, depth: 8, yStart: 7, height: 5, color: S, step: 3, openings: arrowSlit1 }));
      b.push(...wallZ({ x: 9, z0: 1, depth: 8, yStart: 7, height: 5, color: S, step: 3, openings: arrowSlit2 }));

      // Step 4 — Upper walls (layers 12–15) with arched windows
      const window1 = [{ x: 2, yStart: 13, w: 2, h: 3 }, { x: 6, yStart: 13, w: 2, h: 3 }];
      b.push(...wallX({ x0: 0, z: 0, width: 10, yStart: 12, height: 4, color: SL, step: 4, openings: window1 }));
      b.push(...wallX({ x0: 0, z: 9, width: 10, yStart: 12, height: 4, color: SL, step: 4, openings: window1 }));
      b.push(...wallZ({ x: 0, z0: 1, depth: 8, yStart: 12, height: 4, color: SL, step: 4 }));
      b.push(...wallZ({ x: 9, z0: 1, depth: 8, yStart: 12, height: 4, color: SL, step: 4 }));

      // Window arches
      b.push(...arch({ x0: 2, y0: 13, z: 0, width: 2, height: 3, color: SD, step: 4 }));
      b.push(...arch({ x0: 6, y0: 13, z: 0, width: 2, height: 3, color: SD, step: 4 }));
      b.push(...arch({ x0: 2, y0: 13, z: 9, width: 2, height: 3, color: SD, step: 4 }));
      b.push(...arch({ x0: 6, y0: 13, z: 9, width: 2, height: 3, color: SD, step: 4 }));

      // Step 5 — Interior spiral staircase
      b.push(...stairs({ x0: 1, z0: 1, direction: "x", stepCount: 4, stepWidth: 2, color: BROWN, step: 5 }));
      b.push(...stairs({ x0: 5, z0: 3, direction: "z", stepCount: 4, stepWidth: 2, color: BROWN, step: 5 }));
      b.push(...stairs({ x0: 2, z0: 7, direction: "x", stepCount: 3, stepWidth: 2, color: BROWN, step: 5 }));

      // Step 6 — Walkway floor at top of walls
      b.push(...fillRect({ x0: 0, z0: 0, width: 10, depth: 10, y: 16, color: SD, step: 6 }));

      // Step 7 — Battlements
      b.push(...battlements({ x0: 0, z0: 0, width: 10, depth: 10, y: 17, merlonH: 2, color: SL, step: 7 }));

      // Step 8 — Corner turret pillars (taller than battlements)
      b.push(...column({ x: 0, z: 0, yStart: 17, height: 4, color: SD, step: 8 }));
      b.push(...column({ x: 9, z: 0, yStart: 17, height: 4, color: SD, step: 8 }));
      b.push(...column({ x: 0, z: 9, yStart: 17, height: 4, color: SD, step: 8 }));
      b.push(...column({ x: 9, z: 9, yStart: 17, height: 4, color: SD, step: 8 }));

      return b;
    },
  },

  // ──────────────────────────────────────────────────────────────
  // 2. COUNTRY COTTAGE
  // ──────────────────────────────────────────────────────────────
  {
    id: "country_cottage",
    name: "Country Cottage",
    theme: "buildings",
    description: "A charming cottage with white walls, red door, flower boxes under the windows, a brick chimney, and a peaked roof.",
    difficulty: "intermediate",
    thumbnail: "🏡",
    stepLabels: [
      "Green base plate",
      "Foundation & floor",
      "Front wall with door & windows",
      "Back wall with windows",
      "Side walls",
      "Window sills & flower boxes",
      "Roof structure",
      "Chimney",
    ],
    build() {
      const b = [];
      // Step 1 — Green base (lawn)
      b.push(...fillRect({ x0: -1, z0: -1, width: 14, depth: 10, y: 0, color: GREEN, step: 1, brickId: "3001" }));

      // Step 2 — Foundation
      b.push(...fillRect({ x0: 0, z0: 0, width: 12, depth: 8, y: 1, color: GRAY, step: 2, brickId: "3001" }));
      b.push(...fillRect({ x0: 1, z0: 1, width: 10, depth: 6, y: 2, color: BROWN, step: 2, brickId: "3001" })); // floor

      // Step 3 — Front wall (z=0) with door and 2 windows
      const frontOpenings = [
        { x: 2, yStart: 3, w: 2, h: 3 },  // left window
        { x: 5, yStart: 3, w: 2, h: 4 },  // door (taller)
        { x: 8, yStart: 3, w: 2, h: 3 },  // right window
      ];
      b.push(...wallX({ x0: 0, z: 0, width: 12, yStart: 3, height: 6, color: WHITE, step: 3, openings: frontOpenings }));

      // Door frame (red)
      b.push({ id: "3005", x: 5, y: 3, z: 0, rot: 0, color: RED, step: 3 });
      b.push({ id: "3005", x: 6, y: 3, z: 0, rot: 0, color: RED, step: 3 });
      b.push({ id: "3004", x: 5, y: 7, z: 0, rot: 0, color: RED, step: 3 }); // lintel

      // Step 4 — Back wall with 2 windows
      const backOpenings = [
        { x: 3, yStart: 4, w: 2, h: 3 },
        { x: 7, yStart: 4, w: 2, h: 3 },
      ];
      b.push(...wallX({ x0: 0, z: 7, width: 12, yStart: 3, height: 6, color: WHITE, step: 4, openings: backOpenings }));

      // Step 5 — Side walls (solid)
      b.push(...wallZ({ x: 0, z0: 1, depth: 6, yStart: 3, height: 6, color: WHITE, step: 5 }));
      b.push(...wallZ({ x: 11, z0: 1, depth: 6, yStart: 3, height: 6, color: WHITE, step: 5 }));

      // Step 6 — Window sills (small plates sticking out) and flower boxes
      const windowSills = [
        [2, 3, 0], [3, 3, 0], [8, 3, 0], [9, 3, 0],  // front
        [3, 4, 7], [4, 4, 7], [7, 4, 7], [8, 4, 7],  // back
      ];
      for (const [x, y, z] of windowSills) {
        b.push({ id: "3005", x, y, z, rot: 0, color: BROWN, step: 6 });
      }
      // Flower boxes (colored blocks under front windows)
      b.push({ id: "3004", x: 2, y: 2, z: -1, rot: 0, color: RED, step: 6 });
      b.push({ id: "3004", x: 8, y: 2, z: -1, rot: 0, color: RED, step: 6 });
      b.push({ id: "3005", x: 2, y: 3, z: -1, rot: 0, color: GREEN, step: 6 });
      b.push({ id: "3005", x: 3, y: 3, z: -1, rot: 0, color: YELLOW, step: 6 });
      b.push({ id: "3005", x: 8, y: 3, z: -1, rot: 0, color: YELLOW, step: 6 });
      b.push({ id: "3005", x: 9, y: 3, z: -1, rot: 0, color: GREEN, step: 6 });

      // Step 7 — Peaked roof (red, sloping from sides toward center)
      b.push(...slopedRoof({ x0: 0, z0: 0, width: 12, depth: 8, yStart: 9, color: RED, step: 7 }));

      // Step 8 — Chimney (right side, rises above roof)
      for (let h = 5; h < 14; h++) {
        b.push({ id: "3003", x: 10, y: h, z: 5, rot: 0, color: RED_DK, step: 8 });
      }
      // Chimney cap
      b.push({ id: "3001", x: 9, y: 14, z: 5, rot: 0, color: GRAY, step: 8 });

      return b;
    },
  },

  // ──────────────────────────────────────────────────────────────
  // 3. SPORTS CAR
  // ──────────────────────────────────────────────────────────────
  {
    id: "sports_car",
    name: "Sports Car",
    theme: "vehicles",
    description: "A sleek low-profile sports car with a sculpted hood, angled windshield, rear spoiler, and four wheel wells.",
    difficulty: "intermediate",
    thumbnail: "🏎️",
    stepLabels: [
      "Chassis base",
      "Wheel wells & axle blocks",
      "Lower body panels",
      "Hood slope & front",
      "Cockpit walls",
      "Windshield angle",
      "Rear deck & spoiler",
      "Details & headlights",
    ],
    build() {
      const b = [];
      // Step 1 — Chassis: flat 14×6 base, 1 layer
      b.push(...fillRect({ x0: 0, z0: 0, width: 14, depth: 6, y: 0, color: BLACK, step: 1, brickId: "3010" }));
      b.push(...fillRect({ x0: 0, z0: 0, width: 14, depth: 6, y: 1, color: BLACK, step: 1, brickId: "3010" }));

      // Step 2 — Wheel wells (gaps at corners + axle blocks)
      // Front wheels (studs 1-2, z 0 and z 5)
      for (const z of [0, 5]) {
        b.push({ id: "3003", x: 1, y: 0, z, rot: 0, color: GRAY, step: 2 });
        b.push({ id: "3005", x: 1, y: 1, z, rot: 0, color: BLACK, step: 2 });
        b.push({ id: "3005", x: 2, y: 1, z, rot: 0, color: BLACK, step: 2 });
      }
      // Rear wheels (studs 11-12, z 0 and z 5)
      for (const z of [0, 5]) {
        b.push({ id: "3003", x: 11, y: 0, z, rot: 0, color: GRAY, step: 2 });
        b.push({ id: "3005", x: 11, y: 1, z, rot: 0, color: BLACK, step: 2 });
        b.push({ id: "3005", x: 12, y: 1, z, rot: 0, color: BLACK, step: 2 });
      }

      // Step 3 — Lower body panels (layer 2, wrap around sides)
      b.push(...wallX({ x0: 0, z: 0, width: 14, yStart: 2, height: 2, color: RED, step: 3 }));
      b.push(...wallX({ x0: 0, z: 5, width: 14, yStart: 2, height: 2, color: RED, step: 3 }));
      b.push(...wallZ({ x: 0, z0: 1, depth: 4, yStart: 2, height: 2, color: RED, step: 3 }));  // front
      b.push(...wallZ({ x: 13, z0: 1, depth: 4, yStart: 2, height: 2, color: RED, step: 3 })); // rear

      // Step 4 — Hood (front 0-5, sloping up with one step)
      b.push(...fillRect({ x0: 1, z0: 1, width: 4, depth: 4, y: 2, color: RED, step: 4 }));
      b.push(...fillRect({ x0: 1, z0: 1, width: 5, depth: 4, y: 3, color: RED, step: 4 }));
      // Nose slope
      b.push({ id: "3010", x: 0, y: 2, z: 1, rot: 0, color: RED_DK, step: 4 });
      b.push({ id: "3010", x: 0, y: 2, z: 3, rot: 0, color: RED_DK, step: 4 });

      // Step 5 — Cockpit side walls (studs 5-9)
      b.push(...wallX({ x0: 5, z: 0, width: 5, yStart: 4, height: 2, color: RED, step: 5 }));
      b.push(...wallX({ x0: 5, z: 5, width: 5, yStart: 4, height: 2, color: RED, step: 5 }));

      // Step 6 — Windshield (angled forward face at cockpit front)
      for (const z of [1, 2, 3, 4]) {
        b.push({ id: "3005", x: 5, y: 4, z, rot: 0, color: BLUE, step: 6 });
        b.push({ id: "3005", x: 5, y: 5, z, rot: 0, color: BLUE, step: 6 });
      }
      // Rear windshield
      for (const z of [1, 2, 3, 4]) {
        b.push({ id: "3005", x: 9, y: 4, z, rot: 0, color: BLUE, step: 6 });
        b.push({ id: "3005", x: 9, y: 5, z, rot: 0, color: BLUE, step: 6 });
      }
      // Roof bar
      b.push(...fillRect({ x0: 5, z0: 0, width: 5, depth: 6, y: 6, color: RED, step: 6 }));

      // Step 7 — Rear deck and spoiler
      b.push(...fillRect({ x0: 10, z0: 1, width: 3, depth: 4, y: 2, color: RED, step: 7 }));
      b.push(...fillRect({ x0: 10, z0: 1, width: 3, depth: 4, y: 3, color: RED, step: 7 }));
      // Spoiler columns
      b.push(...column({ x: 10, z: 0, yStart: 4, height: 2, color: BLACK, step: 7 }));
      b.push(...column({ x: 10, z: 5, yStart: 4, height: 2, color: BLACK, step: 7 }));
      // Spoiler wing
      b.push({ id: "3010", x: 10, y: 6, z: 0, rot: 0, color: BLACK, step: 7 });
      b.push({ id: "3010", x: 10, y: 6, z: 5, rot: 0, color: BLACK, step: 7 });
      b.push({ id: "3010", x: 10, y: 6, z: 2, rot: 0, color: RED_DK, step: 7 });
      b.push({ id: "3010", x: 10, y: 6, z: 3, rot: 0, color: RED_DK, step: 7 });

      // Step 8 — Headlights and taillights
      // Headlights (front corners, yellow)
      b.push({ id: "3005", x: 0, y: 3, z: 0, rot: 0, color: YELLOW, step: 8 });
      b.push({ id: "3005", x: 0, y: 3, z: 5, rot: 0, color: YELLOW, step: 8 });
      // Taillights (rear, red)
      b.push({ id: "3005", x: 13, y: 3, z: 0, rot: 0, color: ORANGE, step: 8 });
      b.push({ id: "3005", x: 13, y: 3, z: 5, rot: 0, color: ORANGE, step: 8 });
      // Grille
      b.push({ id: "3010", x: 0, y: 3, z: 1, rot: 0, color: GRAY, step: 8 });

      return b;
    },
  },

  // ──────────────────────────────────────────────────────────────
  // 4. JAPANESE TEMPLE
  // ──────────────────────────────────────────────────────────────
  {
    id: "japanese_temple",
    name: "Japanese Temple",
    theme: "buildings",
    description: "A traditional temple with a raised platform, pillars, tiered pagoda-style roof with wide eaves, and stone steps.",
    difficulty: "advanced",
    thumbnail: "⛩️",
    stepLabels: [
      "Stone platform base",
      "Platform steps",
      "Floor & interior",
      "Pillar columns",
      "Inner walls",
      "First roof tier (wide eaves)",
      "Second roof tier",
      "Roof finial & details",
    ],
    build() {
      const b = [];
      // Step 1 — Stone platform (14×10, 2 layers)
      b.push(...fillRect({ x0: 0, z0: 0, width: 14, depth: 10, y: 0, color: STONE, step: 1, brickId: "3001" }));
      b.push(...fillRect({ x0: 0, z0: 0, width: 14, depth: 10, y: 1, color: STONE, step: 1, brickId: "3001" }));

      // Step 2 — Front steps (3 steps wide, centered)
      b.push(...stairs({ x0: 4, z0: -3, direction: "z", stepCount: 3, stepWidth: 6, color: STONE_DK, step: 2 }));
      // Side accent blocks
      b.push({ id: "3003", x: 3, y: 0, z: -1, rot: 0, color: STONE_DK, step: 2 });
      b.push({ id: "3003", x: 10, y: 0, z: -1, rot: 0, color: STONE_DK, step: 2 });

      // Step 3 — Floor
      b.push(...fillRect({ x0: 1, z0: 1, width: 12, depth: 8, y: 2, color: BROWN, step: 3, brickId: "3001" }));

      // Step 4 — Pillars (red columns, 6 studs tall)
      const pillarPositions = [
        [1, 1], [1, 4], [1, 8],
        [12, 1], [12, 4], [12, 8],
        [6, 1], [6, 8],
      ];
      for (const [px, pz] of pillarPositions) {
        b.push(...column({ x: px, z: pz, yStart: 3, height: 6, color: RED_DK, step: 4 }));
      }

      // Step 5 — Inner walls (partial, back and sides, 4 layers)
      b.push(...wallX({ x0: 2, z: 8, width: 10, yStart: 3, height: 4, color: WHITE, step: 5 }));
      b.push(...wallZ({ x: 2, z0: 3, depth: 5, yStart: 3, height: 4, color: WHITE, step: 5 }));
      b.push(...wallZ({ x: 11, z0: 3, depth: 5, yStart: 3, height: 4, color: WHITE, step: 5 }));

      // Step 6 — First roof tier (wide eaves, overhangs 2 studs each side)
      b.push(...fillRect({ x0: -2, z0: -2, width: 18, depth: 14, y: 9, color: BLUE_DK, step: 6 }));
      b.push(...fillRect({ x0: -1, z0: -1, width: 16, depth: 12, y: 10, color: BLUE_DK, step: 6 }));
      // Eave edge accents
      for (let x = -2; x < 16; x++) {
        b.push({ id: "3005", x, y: 9, z: -2, rot: 0, color: BLUE, step: 6 });
        b.push({ id: "3005", x, y: 9, z: 11, rot: 0, color: BLUE, step: 6 });
      }

      // Step 7 — Second roof tier (narrower)
      b.push(...fillRect({ x0: 2, z0: 1, width: 10, depth: 8, y: 11, color: BLUE_DK, step: 7 }));
      b.push(...fillRect({ x0: 3, z0: 2, width: 8, depth: 6, y: 12, color: BLUE, step: 7 }));
      b.push(...fillRect({ x0: 4, z0: 3, width: 6, depth: 4, y: 13, color: BLUE, step: 7 }));

      // Step 8 — Finial (central spike/ornament)
      b.push(...column({ x: 7, z: 5, yStart: 14, height: 3, color: YELLOW, step: 8 }));
      // Ridge ornaments
      b.push({ id: "3005", x: 5, y: 13, z: 5, rot: 0, color: YELLOW, step: 8 });
      b.push({ id: "3005", x: 9, y: 13, z: 5, rot: 0, color: YELLOW, step: 8 });

      return b;
    },
  },

  // ──────────────────────────────────────────────────────────────
  // 5. PIRATE SHIP
  // ──────────────────────────────────────────────────────────────
  {
    id: "pirate_ship",
    name: "Pirate Ship",
    theme: "vehicles",
    description: "A classic galleon with a curved hull, raised stern castle, bowsprit, cannon ports, and a tall mast.",
    difficulty: "advanced",
    thumbnail: "🏴‍☠️",
    stepLabels: [
      "Keel & hull bottom",
      "Hull walls (port & starboard)",
      "Bow taper & bowsprit",
      "Stern castle base",
      "Stern castle walls & railing",
      "Main deck",
      "Mast & crow's nest",
      "Cannon ports & details",
    ],
    build() {
      const b = [];

      // Step 1 — Keel: long narrow base 16×4, 2 layers
      b.push(...fillRect({ x0: 0, z0: 1, width: 16, depth: 4, y: 0, color: BROWN_DK, step: 1 }));
      b.push(...fillRect({ x0: 1, z0: 1, width: 14, depth: 4, y: 1, color: BROWN_DK, step: 1 }));

      // Step 2 — Hull walls, 4 layers
      b.push(...wallZ({ x: 0, z0: 1, depth: 4, yStart: 2, height: 4, color: BROWN, step: 2 }));
      b.push(...wallZ({ x: 15, z0: 1, depth: 4, yStart: 2, height: 4, color: BROWN, step: 2 }));
      b.push(...wallX({ x0: 1, z: 0, width: 14, yStart: 2, height: 4, color: BROWN, step: 2 }));
      b.push(...wallX({ x0: 1, z: 5, width: 14, yStart: 2, height: 4, color: BROWN, step: 2 }));

      // Step 3 — Bow taper (front narrows)
      for (let layer = 0; layer < 3; layer++) {
        const inset = layer;
        b.push({ id: "3005", x: -1 - inset, y: 2 + layer, z: 2, rot: 0, color: BROWN_DK, step: 3 });
        b.push({ id: "3005", x: -1 - inset, y: 2 + layer, z: 3, rot: 0, color: BROWN_DK, step: 3 });
      }
      // Bowsprit (horizontal pole)
      for (let i = 0; i < 4; i++) {
        b.push({ id: "3005", x: -2 - i, y: 5, z: 2, rot: 0, color: TAN, step: 3 });
        b.push({ id: "3005", x: -2 - i, y: 5, z: 3, rot: 0, color: TAN, step: 3 });
      }

      // Step 4 — Stern castle base (raised rear platform)
      b.push(...fillRect({ x0: 11, z0: 0, width: 5, depth: 6, y: 6, color: BROWN, step: 4 }));
      b.push(...fillRect({ x0: 11, z0: 0, width: 5, depth: 6, y: 7, color: BROWN, step: 4 }));

      // Step 5 — Stern castle walls and railing
      b.push(...wallX({ x0: 11, z: 0, width: 5, yStart: 8, height: 3, color: BROWN, step: 5 }));
      b.push(...wallX({ x0: 11, z: 5, width: 5, yStart: 8, height: 3, color: BROWN, step: 5 }));
      b.push(...wallZ({ x: 15, z0: 1, depth: 4, yStart: 8, height: 3, color: BROWN, step: 5 }));
      // Railing posts
      for (const z of [0, 2, 4, 5]) {
        b.push({ id: "3005", x: 11, y: 8, z, rot: 0, color: TAN, step: 5 });
        b.push({ id: "3005", x: 11, y: 9, z, rot: 0, color: TAN, step: 5 });
      }

      // Step 6 — Main deck floor
      b.push(...fillRect({ x0: 1, z0: 1, width: 10, depth: 4, y: 6, color: TAN, step: 6 }));

      // Step 7 — Mast (central column, tall)
      b.push(...column({ x: 6, z: 2, yStart: 7, height: 10, color: TAN, step: 7 }));
      b.push(...column({ x: 6, z: 3, yStart: 7, height: 10, color: TAN, step: 7 }));
      // Cross beam (yard arm)
      for (let z = 0; z < 6; z++) {
        b.push({ id: "3005", x: 6, y: 14, z, rot: 0, color: TAN, step: 7 });
      }
      // Crow's nest platform
      b.push({ id: "3003", x: 5, y: 16, z: 2, rot: 0, color: BROWN, step: 7 });
      b.push({ id: "3003", x: 7, y: 16, z: 2, rot: 0, color: BROWN, step: 7 });
      // Nest walls
      for (const [cx, cz] of [[5, 2], [5, 3], [8, 2], [8, 3]]) {
        b.push({ id: "3005", x: cx, y: 17, z: cz, rot: 0, color: BROWN, step: 7 });
      }

      // Step 8 — Cannon ports (yellow accents in hull) and flag
      const cannonY = 3;
      for (const x of [3, 5, 7, 9]) {
        b.push({ id: "3005", x, y: cannonY, z: 0, rot: 0, color: YELLOW, step: 8 });
        b.push({ id: "3005", x, y: cannonY, z: 5, rot: 0, color: YELLOW, step: 8 });
      }
      // Flag at top of mast
      b.push({ id: "3005", x: 6, y: 17, z: 2, rot: 0, color: BLACK, step: 8 });
      b.push({ id: "3004", x: 6, y: 17, z: 0, rot: 0, color: RED, step: 8 });
      b.push({ id: "3004", x: 6, y: 18, z: 0, rot: 0, color: RED, step: 8 });

      return b;
    },
  },

  // ──────────────────────────────────────────────────────────────
  // 6. ROCKET LAUNCHPAD
  // ──────────────────────────────────────────────────────────────
  {
    id: "rocket_launchpad",
    name: "Rocket & Launchpad",
    theme: "space",
    description: "A multi-stage rocket on a launch tower with gantry arm, exhaust trench, and service platform.",
    difficulty: "advanced",
    thumbnail: "🚀",
    stepLabels: [
      "Launch pad base",
      "Exhaust trench",
      "Rocket first stage",
      "Rocket second stage & nose",
      "Launch tower structure",
      "Gantry arm bridge",
      "Service platform",
      "Flames & countdown details",
    ],
    build() {
      const b = [];
      // Step 1 — Pad base (12×10, concrete gray)
      b.push(...fillRect({ x0: 0, z0: 0, width: 12, depth: 10, y: 0, color: GRAY_LT, step: 1 }));

      // Step 2 — Exhaust trench (dug-out center)
      b.push(...wallX({ x0: 3, z: 3, width: 6, yStart: 1, height: 1, color: GRAY, step: 2 }));
      b.push(...wallX({ x0: 3, z: 6, width: 6, yStart: 1, height: 1, color: GRAY, step: 2 }));
      b.push(...wallZ({ x: 3, z0: 3, depth: 4, yStart: 1, height: 1, color: GRAY, step: 2 }));
      b.push(...wallZ({ x: 8, z0: 3, depth: 4, yStart: 1, height: 1, color: GRAY, step: 2 }));

      // Step 3 — Rocket first stage (2×2 cylinder approximation, white, 8 layers)
      const rocketX = 5, rocketZ = 4;
      for (let h = 1; h < 9; h++) {
        b.push({ id: "3003", x: rocketX, y: h, z: rocketZ, rot: 0, color: WHITE, step: 3 });
        b.push({ id: "3003", x: rocketX, y: h, z: rocketZ + 2, rot: 0, color: WHITE, step: 3 });
      }
      // Engine nozzles
      b.push({ id: "3005", x: rocketX, y: 1, z: rocketZ, rot: 0, color: GRAY, step: 3 });
      b.push({ id: "3005", x: rocketX + 1, y: 1, z: rocketZ, rot: 0, color: GRAY, step: 3 });
      b.push({ id: "3005", x: rocketX, y: 1, z: rocketZ + 3, rot: 0, color: GRAY, step: 3 });
      b.push({ id: "3005", x: rocketX + 1, y: 1, z: rocketZ + 3, rot: 0, color: GRAY, step: 3 });

      // Stripe band
      b.push({ id: "3003", x: rocketX, y: 5, z: rocketZ, rot: 0, color: RED, step: 3 });
      b.push({ id: "3003", x: rocketX, y: 5, z: rocketZ + 2, rot: 0, color: RED, step: 3 });

      // Step 4 — Second stage & nose cone (narrower)
      for (let h = 9; h < 14; h++) {
        b.push({ id: "3003", x: rocketX, y: h, z: rocketZ + 1, rot: 0, color: WHITE, step: 4 });
      }
      // Blue stripe
      b.push({ id: "3003", x: rocketX, y: 11, z: rocketZ + 1, rot: 0, color: BLUE, step: 4 });
      // Nose cone (tapering 1×1)
      b.push({ id: "3005", x: rocketX, y: 14, z: rocketZ + 1, rot: 0, color: WHITE, step: 4 });
      b.push({ id: "3005", x: rocketX + 1, y: 14, z: rocketZ + 1, rot: 0, color: WHITE, step: 4 });
      b.push({ id: "3005", x: rocketX, y: 15, z: rocketZ + 2, rot: 0, color: RED, step: 4 });
      b.push({ id: "3005", x: rocketX + 1, y: 15, z: rocketZ + 2, rot: 0, color: RED, step: 4 });

      // Step 5 — Launch tower (right side, lattice-style column)
      const towerX = 10;
      for (let h = 0; h < 16; h++) {
        b.push({ id: "3005", x: towerX, y: h, z: 3, rot: 0, color: ORANGE, step: 5 });
        b.push({ id: "3005", x: towerX, y: h, z: 7, rot: 0, color: ORANGE, step: 5 });
        b.push({ id: "3005", x: towerX + 1, y: h, z: 3, rot: 0, color: ORANGE, step: 5 });
        b.push({ id: "3005", x: towerX + 1, y: h, z: 7, rot: 0, color: ORANGE, step: 5 });
        // Cross bracing (alternating)
        if (h % 3 === 0) {
          b.push({ id: "3010", x: towerX, y: h, z: 4, rot: 90, color: ORANGE, step: 5 });
        }
      }

      // Step 6 — Gantry arm (horizontal bridge from tower to rocket, 2 heights)
      for (const gy of [7, 12]) {
        for (let x = rocketX + 2; x <= towerX; x++) {
          b.push({ id: "3005", x, y: gy, z: 5, rot: 0, color: GRAY_LT, step: 6 });
        }
      }

      // Step 7 — Service platform at tower
      b.push(...fillRect({ x0: 10, z0: 2, width: 2, depth: 7, y: 8, color: GRAY_LT, step: 7 }));
      // Railing
      for (let z = 2; z < 9; z += 2) {
        b.push({ id: "3005", x: 10, y: 9, z, rot: 0, color: YELLOW, step: 7 });
      }

      // Step 8 — Flames and countdown clock
      // Exhaust flames (orange/yellow under engines)
      for (const [fx, fz] of [[5,4],[6,4],[5,7],[6,7]]) {
        b.push({ id: "3005", x: fx, y: 0, z: fz, rot: 0, color: ORANGE, step: 8 });
        b.push({ id: "3005", x: fx, y: 0, z: fz + 1, rot: 0, color: YELLOW, step: 8 });
      }
      // Countdown display (small box on pad)
      b.push({ id: "3003", x: 0, y: 1, z: 0, rot: 0, color: BLACK, step: 8 });
      b.push({ id: "3005", x: 0, y: 2, z: 0, rot: 0, color: GREEN, step: 8 });

      return b;
    },
  },

  // ──────────────────────────────────────────────────────────────
  // 7. FOREST TREEHOUSE
  // ──────────────────────────────────────────────────────────────
  {
    id: "treehouse",
    name: "Forest Treehouse",
    theme: "buildings",
    description: "A tree with a thick trunk, leafy canopy, and a cozy elevated cabin with a rope ladder and balcony.",
    difficulty: "intermediate",
    thumbnail: "🌳",
    stepLabels: [
      "Ground & roots",
      "Tree trunk",
      "Trunk fork & branches",
      "Treehouse floor platform",
      "Cabin walls with window",
      "Cabin roof",
      "Leaf canopy",
      "Rope ladder & details",
    ],
    build() {
      const b = [];
      // Step 1 — Ground
      b.push(...fillRect({ x0: -2, z0: -2, width: 14, depth: 14, y: 0, color: GREEN_DK, step: 1, brickId: "3001" }));
      // Roots (brown accents around base)
      for (const [rx, rz] of [[-1,3],[4,9],[8,-1],[10,4]]) {
        b.push({ id: "3004", x: rx, y: 0, z: rz, rot: 0, color: BROWN_DK, step: 1 });
        b.push({ id: "3005", x: rx, y: 1, z: rz, rot: 0, color: BROWN_DK, step: 1 });
      }

      // Step 2 — Trunk (3×3 column, 8 layers)
      for (let h = 1; h < 9; h++) {
        for (let tx = 3; tx <= 5; tx++) {
          for (let tz = 3; tz <= 5; tz++) {
            b.push({ id: "3005", x: tx, y: h, z: tz, rot: 0, color: BROWN, step: 2 });
          }
        }
      }

      // Step 3 — Fork and branches (extend outward at y=9)
      for (let h = 9; h < 11; h++) {
        for (let tx = 3; tx <= 5; tx++) {
          for (let tz = 3; tz <= 5; tz++) {
            b.push({ id: "3005", x: tx, y: h, z: tz, rot: 0, color: BROWN, step: 3 });
          }
        }
      }
      // Branch arms
      for (const [bx, bz] of [[1,4],[2,4],[6,4],[7,4],[4,1],[4,2],[4,6],[4,7]]) {
        b.push({ id: "3005", x: bx, y: 10, z: bz, rot: 0, color: BROWN, step: 3 });
        b.push({ id: "3005", x: bx, y: 11, z: bz, rot: 0, color: BROWN, step: 3 });
      }

      // Step 4 — Treehouse floor (platform on the fork)
      b.push(...fillRect({ x0: 1, z0: 1, width: 8, depth: 8, y: 9, color: TAN, step: 4 }));

      // Step 5 — Cabin walls (4 layers, with window on front)
      const cabinWindow = [{ x: 2, yStart: 11, w: 2, h: 2 }];
      b.push(...wallX({ x0: 2, z: 2, width: 6, yStart: 10, height: 4, color: BROWN, step: 5, openings: cabinWindow }));
      b.push(...wallX({ x0: 2, z: 7, width: 6, yStart: 10, height: 4, color: BROWN, step: 5 }));
      b.push(...wallZ({ x: 2, z0: 3, depth: 4, yStart: 10, height: 4, color: BROWN, step: 5 }));
      b.push(...wallZ({ x: 7, z0: 3, depth: 4, yStart: 10, height: 4, color: BROWN, step: 5 }));

      // Step 6 — Cabin roof
      b.push(...slopedRoof({ x0: 2, z0: 2, width: 6, depth: 6, yStart: 14, color: RED, step: 6 }));

      // Step 7 — Leaf canopy (large green cloud around upper trunk)
      const leafPositions = [
        // Lower canopy ring
        [0,12,0],[2,12,0],[4,12,0],[6,12,0],[8,12,0],
        [0,12,2],[0,12,4],[0,12,6],[0,12,8],
        [8,12,2],[8,12,4],[8,12,6],[8,12,8],
        [2,12,8],[4,12,8],[6,12,8],
        // Upper canopy
        [1,13,1],[3,13,1],[5,13,1],[7,13,1],
        [1,13,7],[3,13,7],[5,13,7],[7,13,7],
        [1,13,3],[1,13,5],[7,13,3],[7,13,5],
        // Top
        [2,14,2],[4,14,2],[6,14,2],
        [2,14,6],[4,14,6],[6,14,6],
        [3,14,4],[5,14,4],
        [4,15,3],[4,15,5],[3,15,4],[5,15,4],
      ];
      for (const [lx, ly, lz] of leafPositions) {
        b.push({ id: "3005", x: lx, y: ly, z: lz, rot: 0, color: GREEN, step: 7 });
      }

      // Step 8 — Rope ladder (vertical line of small bricks from ground to platform)
      for (let h = 1; h < 9; h++) {
        b.push({ id: "3005", x: 1, y: h, z: 2, rot: 0, color: TAN, step: 8 });
        if (h % 2 === 0) {
          b.push({ id: "3004", x: 0, y: h, z: 2, rot: 0, color: TAN, step: 8 }); // rung
        }
      }
      // Balcony railing
      for (let x = 1; x < 8; x += 2) {
        b.push({ id: "3005", x, y: 10, z: 1, rot: 0, color: BROWN, step: 8 });
      }

      return b;
    },
  },

  // ──────────────────────────────────────────────────────────────
  // 8. DRAGON
  // ──────────────────────────────────────────────────────────────
  {
    id: "dragon",
    name: "Fire Dragon",
    theme: "creatures",
    description: "A fearsome dragon with a spiked back, outstretched wings, long tail, clawed legs, and an open jaw.",
    difficulty: "advanced",
    thumbnail: "🐉",
    stepLabels: [
      "Hind legs & tail base",
      "Body core",
      "Front legs & chest",
      "Neck & head",
      "Jaw & horns",
      "Left wing",
      "Right wing",
      "Spines & fire breath",
    ],
    build() {
      const b = [];
      const G = GREEN_DK, GL = GREEN, Y = YELLOW;

      // Step 1 — Hind legs and tail base
      // Tail (extends along X axis, getting thinner)
      for (let i = 0; i < 6; i++) {
        const w = i < 3 ? 2 : 1;
        for (let z = 2; z < 2 + w; z++) {
          b.push({ id: "3005", x: 12 + i, y: 1, z, rot: 0, color: G, step: 1 });
        }
        if (i < 4) b.push({ id: "3005", x: 12 + i, y: 2, z: 2, rot: 0, color: G, step: 1 });
      }
      // Hind legs
      for (const [lx, lz] of [[10, 1], [10, 4]]) {
        b.push(...column({ x: lx, z: lz, yStart: 0, height: 2, color: G, step: 1 }));
        b.push({ id: "3004", x: lx, y: 0, z: lz, rot: 0, color: G, step: 1 }); // foot
      }

      // Step 2 — Body core (chunky torso, 4 wide, 3 tall, 6 long)
      for (let h = 1; h < 4; h++) {
        for (let x = 5; x < 12; x++) {
          for (let z = 1; z < 5; z++) {
            // Skip interior for hollow body
            if (h === 2 && x > 5 && x < 11 && z > 1 && z < 4) continue;
            b.push({ id: "3005", x, y: h, z, rot: 0, color: G, step: 2 });
          }
        }
      }
      // Belly (yellow underside)
      for (let x = 6; x < 11; x++) {
        b.push({ id: "3005", x, y: 1, z: 2, rot: 0, color: Y, step: 2 });
        b.push({ id: "3005", x, y: 1, z: 3, rot: 0, color: Y, step: 2 });
      }

      // Step 3 — Front legs and chest
      for (const [lx, lz] of [[4, 1], [4, 4]]) {
        b.push(...column({ x: lx, z: lz, yStart: 0, height: 2, color: G, step: 3 }));
        b.push({ id: "3004", x: lx - 1, y: 0, z: lz, rot: 0, color: G, step: 3 }); // claws forward
      }
      // Chest (wider)
      for (let z = 1; z < 5; z++) {
        b.push({ id: "3005", x: 4, y: 2, z, rot: 0, color: G, step: 3 });
        b.push({ id: "3005", x: 4, y: 3, z, rot: 0, color: G, step: 3 });
      }

      // Step 4 — Neck (curves upward)
      for (let i = 0; i < 4; i++) {
        const nx = 3 - i;
        const ny = 3 + i;
        b.push({ id: "3005", x: nx, y: ny, z: 2, rot: 0, color: G, step: 4 });
        b.push({ id: "3005", x: nx, y: ny, z: 3, rot: 0, color: G, step: 4 });
      }

      // Step 5 — Head and jaw
      // Head block
      for (let z = 1; z < 5; z++) {
        b.push({ id: "3005", x: -1, y: 7, z, rot: 0, color: G, step: 5 });
        b.push({ id: "3005", x: 0, y: 7, z, rot: 0, color: G, step: 5 });
        b.push({ id: "3005", x: -1, y: 8, z, rot: 0, color: G, step: 5 });
      }
      // Snout
      b.push({ id: "3004", x: -3, y: 7, z: 2, rot: 0, color: G, step: 5 });
      b.push({ id: "3004", x: -3, y: 7, z: 3, rot: 0, color: G, step: 5 });
      // Lower jaw
      b.push({ id: "3004", x: -3, y: 6, z: 2, rot: 0, color: G, step: 5 });
      b.push({ id: "3004", x: -3, y: 6, z: 3, rot: 0, color: G, step: 5 });
      // Eyes
      b.push({ id: "3005", x: -1, y: 8, z: 1, rot: 0, color: YELLOW, step: 5 });
      b.push({ id: "3005", x: -1, y: 8, z: 4, rot: 0, color: YELLOW, step: 5 });
      // Horns
      b.push({ id: "3005", x: 0, y: 9, z: 1, rot: 0, color: ORANGE, step: 5 });
      b.push({ id: "3005", x: 0, y: 9, z: 4, rot: 0, color: ORANGE, step: 5 });
      b.push({ id: "3005", x: 0, y: 10, z: 1, rot: 0, color: ORANGE, step: 5 });
      b.push({ id: "3005", x: 0, y: 10, z: 4, rot: 0, color: ORANGE, step: 5 });

      // Step 6 — Left wing (extends in -Z direction)
      const wingY = 4;
      for (let i = 0; i < 5; i++) {
        const wz = -i;
        const span = 5 - i;
        for (let x = 6; x < 6 + span; x++) {
          b.push({ id: "3005", x, y: wingY, z: wz, rot: 0, color: GL, step: 6 });
        }
        // Wing membrane (thinner)
        if (i > 0 && i < 4) {
          b.push({ id: "3005", x: 6, y: wingY + 1, z: wz, rot: 0, color: GL, step: 6 });
        }
      }
      // Wing arm (bone)
      b.push({ id: "3005", x: 6, y: wingY + 1, z: 0, rot: 0, color: G, step: 6 });
      b.push({ id: "3005", x: 6, y: wingY + 2, z: 0, rot: 0, color: G, step: 6 });

      // Step 7 — Right wing (mirror, +Z direction)
      for (let i = 0; i < 5; i++) {
        const wz = 5 + i;
        const span = 5 - i;
        for (let x = 6; x < 6 + span; x++) {
          b.push({ id: "3005", x, y: wingY, z: wz, rot: 0, color: GL, step: 7 });
        }
        if (i > 0 && i < 4) {
          b.push({ id: "3005", x: 6, y: wingY + 1, z: wz, rot: 0, color: GL, step: 7 });
        }
      }
      b.push({ id: "3005", x: 6, y: wingY + 1, z: 5, rot: 0, color: G, step: 7 });
      b.push({ id: "3005", x: 6, y: wingY + 2, z: 5, rot: 0, color: G, step: 7 });

      // Step 8 — Spines and fire
      // Dorsal spines along the back
      for (let x = 6; x < 13; x += 2) {
        b.push({ id: "3005", x, y: 4, z: 2, rot: 0, color: ORANGE, step: 8 });
        b.push({ id: "3005", x, y: 5, z: 2, rot: 0, color: ORANGE, step: 8 });
      }
      // Tail spines
      b.push({ id: "3005", x: 14, y: 3, z: 2, rot: 0, color: ORANGE, step: 8 });
      b.push({ id: "3005", x: 16, y: 2, z: 2, rot: 0, color: ORANGE, step: 8 });

      // Fire breath
      for (let i = 0; i < 3; i++) {
        b.push({ id: "3005", x: -4 - i, y: 7, z: 2, rot: 0, color: ORANGE, step: 8 });
        b.push({ id: "3005", x: -4 - i, y: 7, z: 3, rot: 0, color: i === 0 ? RED : YELLOW, step: 8 });
      }
      b.push({ id: "3005", x: -5, y: 6, z: 2, rot: 0, color: YELLOW, step: 8 });
      b.push({ id: "3005", x: -5, y: 6, z: 3, rot: 0, color: YELLOW, step: 8 });

      return b;
    },
  },
];

export const THEMES = [
  { id: "all",        label: "All themes" },
  { id: "buildings",  label: "Buildings" },
  { id: "vehicles",   label: "Vehicles" },
  { id: "space",      label: "Space" },
  { id: "creatures",  label: "Creatures" },
];
