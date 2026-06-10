import {
  fillRect, wallX, wallZ, texturedWallX, texturedWallZ,
  battlements, column, thickColumn, roundColumn, ring, plateRing,
  stairs, slopedRoof, arch, hollowBox, scatter, line, diagonal,
  plateRect, grilleWallX,
} from "../engine/primitives.js";

const STONE     = "#9A8C7C";
const STONE_DK  = "#6E6356";
const STONE_LT  = "#C4B9A8";
const RED       = "#C1392B";
const RED_DK    = "#962C21";
const BLUE      = "#0057A8";
const BLUE_DK   = "#003D75";
const BLUE_LT   = "#3C8DD4";
const WHITE     = "#F4F4F0";
const YELLOW    = "#F5C518";
const GREEN     = "#1E8C2A";
const GREEN_DK  = "#156620";
const GREEN_LT  = "#4CAF50";
const BROWN     = "#6D3A1E";
const BROWN_DK  = "#4A270F";
const BROWN_LT  = "#8B5E3C";
const BLACK     = "#1A1A18";
const GRAY      = "#7A7A7A";
const GRAY_LT   = "#AAAAAA";
const GRAY_DK   = "#4A4A4A";
const ORANGE    = "#F07D00";
const TAN       = "#D4C89A";
const PINK      = "#E87EA1";
const PURPLE    = "#6B3FA0";

export const BRICK_TYPES = {
  // ── Standard bricks ──
  "3005": { label: "Brick 1×1",   studsX: 1, studsZ: 1 },
  "3004": { label: "Brick 1×2",   studsX: 2, studsZ: 1 },
  "3622": { label: "Brick 1×3",   studsX: 3, studsZ: 1 },
  "3010": { label: "Brick 1×4",   studsX: 4, studsZ: 1 },
  "3009": { label: "Brick 1×6",   studsX: 6, studsZ: 1 },
  "3008": { label: "Brick 1×8",   studsX: 8, studsZ: 1 },
  "6111": { label: "Brick 1×10",  studsX: 10,studsZ: 1 },
  "3003": { label: "Brick 2×2",   studsX: 2, studsZ: 2 },
  "3002": { label: "Brick 2×3",   studsX: 3, studsZ: 2 },
  "3001": { label: "Brick 2×4",   studsX: 4, studsZ: 2 },
  "2456": { label: "Brick 2×6",   studsX: 6, studsZ: 2 },
  "3007": { label: "Brick 2×8",   studsX: 8, studsZ: 2 },
  "3006": { label: "Brick 2×10",  studsX: 10,studsZ: 2 },
  // ── Plates ──
  "3024": { label: "Plate 1×1",   studsX: 1, studsZ: 1 },
  "3023": { label: "Plate 1×2",   studsX: 2, studsZ: 1 },
  "3623": { label: "Plate 1×3",   studsX: 3, studsZ: 1 },
  "3710": { label: "Plate 1×4",   studsX: 4, studsZ: 1 },
  "3666": { label: "Plate 1×6",   studsX: 6, studsZ: 1 },
  "3460": { label: "Plate 1×8",   studsX: 8, studsZ: 1 },
  "3022": { label: "Plate 2×2",   studsX: 2, studsZ: 2 },
  "3021": { label: "Plate 2×3",   studsX: 3, studsZ: 2 },
  "3020": { label: "Plate 2×4",   studsX: 4, studsZ: 2 },
  "3795": { label: "Plate 2×6",   studsX: 6, studsZ: 2 },
  "3034": { label: "Plate 2×8",   studsX: 8, studsZ: 2 },
  "4477": { label: "Plate 2×10",  studsX: 10,studsZ: 2 },
  // ── Slopes ──
  "3040": { label: "Slope 1×2 45°",   studsX: 2, studsZ: 1 },
  "3039": { label: "Slope 2×2 45°",   studsX: 2, studsZ: 2 },
  "3037": { label: "Slope 2×4 45°",   studsX: 4, studsZ: 2 },
  "3298": { label: "Slope 2×3 33°",   studsX: 3, studsZ: 2 },
  "3665": { label: "Inv Slope 1×2",   studsX: 2, studsZ: 1 },
  "3660": { label: "Inv Slope 2×2",   studsX: 2, studsZ: 2 },
  // ── Round ──
  "3062": { label: "Round Brick 1×1", studsX: 1, studsZ: 1 },
  "3941": { label: "Round Brick 2×2", studsX: 2, studsZ: 2 },
  // ── Modified / special ──
  "98283":{ label: "Masonry 1×2",     studsX: 2, studsZ: 1 },
  "2877": { label: "Grille 1×2",      studsX: 2, studsZ: 1 },
  "4070": { label: "Headlight 1×1",   studsX: 1, studsZ: 1 },
  "87087":{ label: "Side Stud 1×2",   studsX: 2, studsZ: 1 },
  "3245": { label: "Brick 1×2×2",     studsX: 2, studsZ: 1 },
  "2357": { label: "Corner 2×4",      studsX: 4, studsZ: 2 },
};

export const TEMPLATES = [

// ═══════════════════════════════════════════════════════════════
// 1. MEDIEVAL WATCHTOWER
// ═══════════════════════════════════════════════════════════════
{
  id: "medieval_tower",
  name: "Medieval Watchtower",
  theme: "buildings",
  description: "A formidable stone watchtower with textured walls, arched doorway, arrow slits, spiral staircase, interior floors, torch sconces, crenellated battlements, and a flag turret.",
  difficulty: "advanced",
  thumbnail: "🏰",
  stepLabels: [
    "Foundation & ground",
    "Lower walls with doorway",
    "Interior ground floor & stairwell",
    "Mid walls with arrow slits",
    "Second floor & stair continuation",
    "Upper walls with arched windows",
    "Walkway floor & battlements",
    "Corner turrets, flag & torches",
  ],
  build() {
    const b = [];
    const SC = [STONE, STONE_DK, STONE, STONE_LT]; // texture cycle

    // Step 1 — Foundation: 12×12, 3 layers (thick and imposing)
    b.push(...fillRect({ x0: -1, z0: -1, width: 14, depth: 14, y: 0, color: STONE_DK, step: 1 }));
    b.push(...fillRect({ x0: 0, z0: 0, width: 12, depth: 12, y: 1, color: STONE_DK, step: 1 }));
    b.push(...fillRect({ x0: 0, z0: 0, width: 12, depth: 12, y: 2, color: STONE, step: 1 }));
    // Ground detail — scattered cobblestones around base
    b.push(...scatter({ x0: -1, z0: -1, width: 14, depth: 14, y: 0, density: 0.12, color: GRAY, step: 1 }));

    // Step 2 — Lower walls (layers 3–8), thick 2-deep, with door arch on front
    const doorOp = [{ x: 4, yStart: 3, w: 4, h: 6 }];
    // Outer walls (textured masonry)
    b.push(...texturedWallX({ x0: 0, z: 0, width: 12, yStart: 3, height: 6, colors: SC, step: 2, openings: doorOp }));
    b.push(...texturedWallX({ x0: 0, z: 11, width: 12, yStart: 3, height: 6, colors: SC, step: 2 }));
    b.push(...texturedWallZ({ x: 0, z0: 1, depth: 10, yStart: 3, height: 6, colors: SC, step: 2 }));
    b.push(...texturedWallZ({ x: 11, z0: 1, depth: 10, yStart: 3, height: 6, colors: SC, step: 2 }));
    // Inner wall layer (2-wide bricks for thickness)
    b.push(...wallX({ x0: 1, z: 1, width: 10, yStart: 3, height: 6, color: STONE, step: 2 }));
    b.push(...wallX({ x0: 1, z: 10, width: 10, yStart: 3, height: 6, color: STONE, step: 2 }));
    b.push(...wallZ({ x: 1, z0: 2, depth: 8, yStart: 3, height: 6, color: STONE, step: 2 }));
    b.push(...wallZ({ x: 10, z0: 2, depth: 8, yStart: 3, height: 6, color: STONE, step: 2 }));
    // Door arch with grille portcullis
    b.push(...arch({ x0: 4, y0: 3, z: 0, width: 4, height: 6, color: STONE_DK, step: 2 }));
    // Portcullis (grille bricks)
    for (let dx = 5; dx <= 6; dx++) {
      b.push({ id: "2877", x: dx, y: 8, z: 0, rot: 0, color: GRAY_DK, step: 2 });
    }

    // Step 3 — Interior ground floor
    b.push(...fillRect({ x0: 2, z0: 2, width: 8, depth: 8, y: 3, color: BROWN, step: 3 }));
    // Stairwell column (spiral start)
    b.push(...thickColumn({ x: 8, z: 8, yStart: 3, height: 6, color: STONE_DK, step: 3 }));
    // Spiral stairs step 1 (ground to floor 2)
    b.push(...stairs({ x0: 7, z0: 6, direction: "z", stepCount: 3, stepWidth: 2, color: STONE_LT, step: 3 }));
    b.push(...stairs({ x0: 5, z0: 8, direction: "x", stepCount: 3, stepWidth: 2, color: STONE_LT, step: 3 }));
    // Weapon rack (decoration)
    for (let z = 3; z <= 5; z++) {
      b.push({ id: "3005", x: 2, y: 4, z, rot: 0, color: BROWN_DK, step: 3 });
      b.push({ id: "3005", x: 2, y: 5, z, rot: 0, color: GRAY_DK, step: 3 });
    }

    // Step 4 — Mid walls (layers 9–14) with arrow slits
    const slits = [{ x: 4, yStart: 10, w: 1, h: 3 }, { x: 7, yStart: 10, w: 1, h: 3 }];
    b.push(...texturedWallX({ x0: 0, z: 0, width: 12, yStart: 9, height: 6, colors: SC, step: 4, openings: slits }));
    b.push(...texturedWallX({ x0: 0, z: 11, width: 12, yStart: 9, height: 6, colors: SC, step: 4, openings: slits }));
    b.push(...texturedWallZ({ x: 0, z0: 1, depth: 10, yStart: 9, height: 6, colors: SC, step: 4, openings: slits }));
    b.push(...texturedWallZ({ x: 11, z0: 1, depth: 10, yStart: 9, height: 6, colors: SC, step: 4, openings: slits }));
    // Inner wall
    b.push(...wallX({ x0: 1, z: 1, width: 10, yStart: 9, height: 6, color: STONE, step: 4 }));
    b.push(...wallX({ x0: 1, z: 10, width: 10, yStart: 9, height: 6, color: STONE, step: 4 }));
    b.push(...wallZ({ x: 1, z0: 2, depth: 8, yStart: 9, height: 6, color: STONE, step: 4 }));
    b.push(...wallZ({ x: 10, z0: 2, depth: 8, yStart: 9, height: 6, color: STONE, step: 4 }));

    // Step 5 — Second floor + stair continuation
    b.push(...fillRect({ x0: 2, z0: 2, width: 8, depth: 8, y: 9, color: BROWN, step: 5 }));
    b.push(...thickColumn({ x: 8, z: 8, yStart: 9, height: 6, color: STONE_DK, step: 5 }));
    b.push(...stairs({ x0: 6, z0: 8, direction: "x", stepCount: 3, stepWidth: 2, color: STONE_LT, step: 5 }));
    b.push(...stairs({ x0: 8, z0: 5, direction: "z", stepCount: 3, stepWidth: 2, color: STONE_LT, step: 5 }));
    // Table and chair
    b.push({ id: "3003", x: 3, y: 10, z: 4, rot: 0, color: BROWN, step: 5 });
    b.push({ id: "3005", x: 3, y: 11, z: 4, rot: 0, color: BROWN_LT, step: 5 });
    b.push({ id: "3005", x: 5, y: 10, z: 4, rot: 0, color: BROWN, step: 5 });

    // Step 6 — Upper walls (layers 15–19) with arched windows
    const windows = [{ x: 3, yStart: 16, w: 2, h: 3 }, { x: 7, yStart: 16, w: 2, h: 3 }];
    b.push(...texturedWallX({ x0: 0, z: 0, width: 12, yStart: 15, height: 5, colors: SC, step: 6, openings: windows }));
    b.push(...texturedWallX({ x0: 0, z: 11, width: 12, yStart: 15, height: 5, colors: SC, step: 6, openings: windows }));
    b.push(...texturedWallZ({ x: 0, z0: 1, depth: 10, yStart: 15, height: 5, colors: SC, step: 6 }));
    b.push(...texturedWallZ({ x: 11, z0: 1, depth: 10, yStart: 15, height: 5, colors: SC, step: 6 }));
    // Arches above windows
    for (const wx of [3, 7]) {
      b.push(...arch({ x0: wx, y0: 16, z: 0, width: 2, height: 3, color: STONE_DK, step: 6 }));
      b.push(...arch({ x0: wx, y0: 16, z: 11, width: 2, height: 3, color: STONE_DK, step: 6 }));
    }

    // Step 7 — Walkway floor (plate layer) & battlements
    b.push(...fillRect({ x0: 0, z0: 0, width: 12, depth: 12, y: 20, color: STONE_DK, step: 7 }));
    b.push(...plateRect({ x0: 0, z0: 0, width: 12, depth: 12, y: 20, color: STONE, step: 7 }));
    b.push(...battlements({ x0: 0, z0: 0, width: 12, depth: 12, y: 21, merlonH: 2, color: STONE_LT, step: 7 }));
    // Walkway edge ring (plates)
    b.push(...plateRing({ x0: 0, z0: 0, width: 12, depth: 12, y: 20, color: STONE, step: 7 }));

    // Step 8 — Corner turrets (round columns), flag, torches
    for (const [cx, cz] of [[0,0],[11,0],[0,11],[11,11]]) {
      b.push(...roundColumn({ x: cx, z: cz, yStart: 21, height: 5, color: STONE_DK, step: 8 }));
      b.push({ id: "3024", x: cx, y: 26, z: cz, rot: 0, color: STONE_LT, step: 8 }); // plate cap
    }
    // Flag pole and flag on front-right turret
    b.push(...column({ x: 11, z: 0, yStart: 27, height: 3, color: BROWN, step: 8 }));
    b.push({ id: "3004", x: 11, y: 29, z: 1, rot: 0, color: RED, step: 8 });
    b.push({ id: "3004", x: 11, y: 30, z: 1, rot: 0, color: RED, step: 8 });
    // Torch sconces on walls
    for (const [tx, tz] of [[0, 5], [0, 7], [11, 5], [11, 7], [5, 0], [7, 0]]) {
      b.push({ id: "3005", x: tx, y: 6, z: tz, rot: 0, color: BROWN, step: 8 });
      b.push({ id: "3005", x: tx, y: 7, z: tz, rot: 0, color: ORANGE, step: 8 });
    }

    return b;
  },
},

// ═══════════════════════════════════════════════════════════════
// 2. COUNTRY COTTAGE
// ═══════════════════════════════════════════════════════════════
{
  id: "country_cottage",
  name: "Country Cottage",
  theme: "buildings",
  description: "A charming countryside cottage with a stone foundation, flower garden, picket fence, working door, shuttered windows, detailed interior, a peaked roof with dormers, and a brick chimney.",
  difficulty: "intermediate",
  thumbnail: "🏡",
  stepLabels: [
    "Garden grounds & fence",
    "Stone foundation & floor",
    "Front wall with door & windows",
    "Back & side walls",
    "Interior furnishings",
    "Window shutters & flower boxes",
    "Peaked roof with dormer",
    "Chimney & garden details",
  ],
  build() {
    const b = [];

    // Step 1 — Garden grounds
    b.push(...fillRect({ x0: -3, z0: -3, width: 20, depth: 14, y: 0, color: GREEN_DK, step: 1 }));
    // Garden path (stone)
    for (let z = -3; z < 0; z++) {
      b.push({ id: "3004", x: 5, y: 0, z, rot: 0, color: STONE, step: 1 });
      b.push({ id: "3004", x: 7, y: 0, z, rot: 0, color: STONE_LT, step: 1 });
    }
    // Picket fence (left and right of path)
    for (let x = -2; x < 4; x += 2) {
      b.push({ id: "3005", x, y: 1, z: -2, rot: 0, color: WHITE, step: 1 });
      b.push({ id: "3005", x, y: 2, z: -2, rot: 0, color: WHITE, step: 1 });
    }
    for (let x = 9; x < 15; x += 2) {
      b.push({ id: "3005", x, y: 1, z: -2, rot: 0, color: WHITE, step: 1 });
      b.push({ id: "3005", x, y: 2, z: -2, rot: 0, color: WHITE, step: 1 });
    }
    // Fence rails
    b.push(...line({ x0: -2, z0: -2, dx: 1, dz: 0, length: 6, y: 1, color: WHITE, step: 1 }));
    b.push(...line({ x0: 9, z0: -2, dx: 1, dz: 0, length: 6, y: 1, color: WHITE, step: 1 }));

    // Step 2 — Foundation
    b.push(...fillRect({ x0: 0, z0: 0, width: 14, depth: 8, y: 1, color: GRAY, step: 2 }));
    b.push(...fillRect({ x0: 0, z0: 0, width: 14, depth: 8, y: 2, color: STONE, step: 2 }));
    b.push(...fillRect({ x0: 1, z0: 1, width: 12, depth: 6, y: 3, color: BROWN, step: 2 })); // floor

    // Step 3 — Front wall (z=0)
    const frontOp = [
      { x: 2, yStart: 4, w: 2, h: 3 },   // left window
      { x: 6, yStart: 4, w: 2, h: 4 },   // door
      { x: 10, yStart: 4, w: 2, h: 3 },  // right window
    ];
    b.push(...wallX({ x0: 0, z: 0, width: 14, yStart: 4, height: 7, color: WHITE, step: 3, openings: frontOp }));
    // Door frame
    b.push({ id: "3005", x: 6, y: 4, z: 0, rot: 0, color: RED_DK, step: 3 });
    b.push({ id: "3005", x: 7, y: 4, z: 0, rot: 0, color: RED_DK, step: 3 });
    b.push({ id: "3004", x: 6, y: 8, z: 0, rot: 0, color: RED_DK, step: 3 }); // lintel
    // Window lintels (plates)
    b.push({ id: "3023", x: 2, y: 7, z: 0, rot: 0, color: STONE, step: 3 });
    b.push({ id: "3023", x: 10, y: 7, z: 0, rot: 0, color: STONE, step: 3 });
    // Window sills (plates protruding outward)
    b.push({ id: "3023", x: 2, y: 3, z: -1, rot: 0, color: STONE, step: 3 });
    b.push({ id: "3023", x: 10, y: 3, z: -1, rot: 0, color: STONE, step: 3 });

    // Step 4 — Back & side walls
    const backOp = [
      { x: 3, yStart: 5, w: 2, h: 3 },
      { x: 9, yStart: 5, w: 2, h: 3 },
    ];
    b.push(...wallX({ x0: 0, z: 7, width: 14, yStart: 4, height: 7, color: WHITE, step: 4, openings: backOp }));
    b.push(...wallZ({ x: 0, z0: 1, depth: 6, yStart: 4, height: 7, color: WHITE, step: 4 }));
    b.push(...wallZ({ x: 13, z0: 1, depth: 6, yStart: 4, height: 7, color: WHITE, step: 4 }));
    // Side window
    b.push({ id: "3005", x: 0, y: 6, z: 3, rot: 0, color: BLUE_LT, step: 4 });
    b.push({ id: "3005", x: 0, y: 6, z: 4, rot: 0, color: BLUE_LT, step: 4 });

    // Step 5 — Interior
    // Bed (right side)
    b.push({ id: "3001", x: 9, y: 4, z: 2, rot: 0, color: BROWN, step: 5 }); // frame
    b.push({ id: "3001", x: 9, y: 5, z: 2, rot: 0, color: WHITE, step: 5 }); // mattress
    b.push({ id: "3004", x: 9, y: 5, z: 2, rot: 0, color: RED, step: 5 }); // pillow
    // Table (center)
    b.push({ id: "3005", x: 5, y: 4, z: 4, rot: 0, color: BROWN, step: 5 }); // leg
    b.push({ id: "3005", x: 8, y: 4, z: 4, rot: 0, color: BROWN, step: 5 }); // leg
    b.push({ id: "3010", x: 5, y: 5, z: 4, rot: 0, color: BROWN_LT, step: 5 }); // top
    b.push({ id: "3005", x: 6, y: 6, z: 4, rot: 0, color: YELLOW, step: 5 }); // candle
    // Chair
    b.push({ id: "3005", x: 5, y: 4, z: 3, rot: 0, color: BROWN, step: 5 });
    b.push({ id: "3005", x: 5, y: 5, z: 3, rot: 0, color: BROWN_LT, step: 5 });
    // Fireplace (left wall)
    b.push({ id: "3003", x: 1, y: 4, z: 5, rot: 0, color: STONE_DK, step: 5 });
    b.push({ id: "3003", x: 1, y: 5, z: 5, rot: 0, color: STONE, step: 5 });
    b.push({ id: "3003", x: 1, y: 6, z: 5, rot: 0, color: STONE, step: 5 });
    b.push({ id: "3004", x: 1, y: 7, z: 5, rot: 0, color: STONE_DK, step: 5 }); // mantle
    b.push({ id: "3005", x: 1, y: 4, z: 5, rot: 0, color: ORANGE, step: 5 }); // fire glow

    // Step 6 — Shutters (slope bricks for angled look) & flower boxes
    // Green shutters flanking each front window
    for (const wx of [1, 4, 9, 12]) {
      b.push({ id: "3040", x: wx, y: 4, z: -1, rot: 0, color: GREEN_DK, step: 6 });
      b.push({ id: "3005", x: wx, y: 5, z: -1, rot: 0, color: GREEN_DK, step: 6 });
      b.push({ id: "3040", x: wx, y: 6, z: -1, rot: 0, color: GREEN_DK, step: 6 });
    }
    // Flower boxes (plates underneath, flowers on top)
    b.push({ id: "3023", x: 2, y: 3, z: -1, rot: 0, color: BROWN, step: 6 });
    b.push({ id: "3023", x: 10, y: 3, z: -1, rot: 0, color: BROWN, step: 6 });
    b.push({ id: "3062", x: 2, y: 4, z: -1, rot: 0, color: RED, step: 6 });
    b.push({ id: "3062", x: 3, y: 4, z: -1, rot: 0, color: YELLOW, step: 6 });
    b.push({ id: "3062", x: 10, y: 4, z: -1, rot: 0, color: PINK, step: 6 });
    b.push({ id: "3062", x: 11, y: 4, z: -1, rot: 0, color: RED, step: 6 });
    // Cross-panes in windows (light blue)
    for (const [wx, wz] of [[2,0],[3,0],[10,0],[11,0]]) {
      b.push({ id: "3005", x: wx, y: 5, z: wz, rot: 0, color: BLUE_LT, step: 6 });
    }

    // Step 7 — Peaked roof
    b.push(...slopedRoof({ x0: 0, z0: 0, width: 14, depth: 8, yStart: 11, color: RED_DK, step: 7 }));
    // Dormer window (front, centered)
    b.push({ id: "3003", x: 6, y: 12, z: -1, rot: 0, color: WHITE, step: 7 });
    b.push({ id: "3003", x: 6, y: 13, z: -1, rot: 0, color: WHITE, step: 7 });
    b.push({ id: "3004", x: 6, y: 14, z: -1, rot: 0, color: RED_DK, step: 7 }); // dormer roof
    b.push({ id: "3005", x: 6, y: 12, z: -1, rot: 0, color: BLUE_LT, step: 7 }); // glass
    b.push({ id: "3005", x: 7, y: 12, z: -1, rot: 0, color: BLUE_LT, step: 7 });

    // Step 8 — Chimney & garden details
    for (let h = 7; h < 17; h++) {
      b.push({ id: "3003", x: 12, y: h, z: 5, rot: 0, color: RED_DK, step: 8 });
    }
    b.push({ id: "3001", x: 11, y: 17, z: 5, rot: 0, color: STONE, step: 8 }); // chimney cap
    // Garden flowers
    b.push(...scatter({ x0: -2, z0: 1, width: 2, depth: 6, y: 1, density: 0.35, color: RED, step: 8, seed: 3 }));
    b.push(...scatter({ x0: -2, z0: 1, width: 2, depth: 6, y: 1, density: 0.25, color: YELLOW, step: 8, seed: 17 }));
    b.push(...scatter({ x0: 14, z0: 1, width: 2, depth: 6, y: 1, density: 0.3, color: PINK, step: 8, seed: 42 }));
    // Tree (back-right)
    b.push(...column({ x: 15, z: 8, yStart: 1, height: 5, color: BROWN, step: 8 }));
    b.push({ id: "3003", x: 14, y: 6, z: 7, rot: 0, color: GREEN, step: 8 });
    b.push({ id: "3003", x: 14, y: 6, z: 9, rot: 0, color: GREEN, step: 8 });
    b.push({ id: "3003", x: 14, y: 7, z: 8, rot: 0, color: GREEN, step: 8 });
    b.push({ id: "3003", x: 16, y: 6, z: 8, rot: 0, color: GREEN_LT, step: 8 });
    b.push({ id: "3003", x: 15, y: 7, z: 7, rot: 0, color: GREEN_LT, step: 8 });

    return b;
  },
},

// ═══════════════════════════════════════════════════════════════
// 3. SPORTS CAR
// ═══════════════════════════════════════════════════════════════
{
  id: "sports_car",
  name: "Sports Car",
  theme: "vehicles",
  description: "A sculpted sports car with a low-profile body, curved hood, detailed wheel wells with tires, cockpit with dashboard, side intakes, rear diffuser, and a racing spoiler.",
  difficulty: "intermediate",
  thumbnail: "🏎️",
  stepLabels: [
    "Chassis & floor pan",
    "Wheel wells & tires",
    "Lower body panels",
    "Hood & front fascia",
    "Cockpit & dashboard",
    "Windshield & roof",
    "Rear deck, diffuser & spoiler",
    "Headlights, mirrors & exhaust",
  ],
  build() {
    const b = [];

    // Step 1 — Chassis: 16×6, 2 layers
    b.push(...fillRect({ x0: 0, z0: 0, width: 16, depth: 6, y: 0, color: GRAY_DK, step: 1 }));
    b.push(...fillRect({ x0: 0, z0: 1, width: 16, depth: 4, y: 1, color: GRAY_DK, step: 1 }));

    // Step 2 — Wheel wells (recessed) & tires
    for (const [wx, wz] of [[1, -1], [1, 6], [12, -1], [12, 6]]) {
      // Tire (dark circle-ish)
      b.push({ id: "3003", x: wx, y: 0, z: wz, rot: 0, color: BLACK, step: 2 });
      // Hub cap
      b.push({ id: "3005", x: wx, y: 0, z: wz, rot: 0, color: GRAY_LT, step: 2 });
      b.push({ id: "3005", x: wx + 1, y: 0, z: wz, rot: 0, color: GRAY_LT, step: 2 });
      // Wheel arch (colored brick above)
      b.push({ id: "3004", x: wx, y: 2, z: wz, rot: 0, color: RED, step: 2 });
    }

    // Step 3 — Lower body panels (layers 2-3)
    b.push(...wallX({ x0: 0, z: 0, width: 16, yStart: 2, height: 2, color: RED, step: 3 }));
    b.push(...wallX({ x0: 0, z: 5, width: 16, yStart: 2, height: 2, color: RED, step: 3 }));
    b.push(...wallZ({ x: 0, z0: 1, depth: 4, yStart: 2, height: 2, color: RED, step: 3 }));
    b.push(...wallZ({ x: 15, z0: 1, depth: 4, yStart: 2, height: 2, color: RED_DK, step: 3 }));
    // Side air intakes (black recesses)
    for (const z of [0, 5]) {
      b.push({ id: "3005", x: 5, y: 2, z, rot: 0, color: BLACK, step: 3 });
      b.push({ id: "3005", x: 6, y: 2, z, rot: 0, color: BLACK, step: 3 });
    }

    // Step 4 — Hood (front, layers 2-3, sloping)
    b.push(...fillRect({ x0: 1, z0: 1, width: 5, depth: 4, y: 2, color: RED, step: 4 }));
    b.push(...fillRect({ x0: 2, z0: 1, width: 4, depth: 4, y: 3, color: RED, step: 4 }));
    // Nose slope
    b.push({ id: "3010", x: 0, y: 2, z: 1, rot: 0, color: RED_DK, step: 4 });
    b.push({ id: "3010", x: 0, y: 2, z: 3, rot: 0, color: RED_DK, step: 4 });
    // Hood vents
    b.push({ id: "3004", x: 3, y: 3, z: 2, rot: 0, color: BLACK, step: 4 });
    b.push({ id: "3004", x: 3, y: 3, z: 3, rot: 0, color: BLACK, step: 4 });
    // Front grille
    b.push({ id: "3010", x: 0, y: 3, z: 2, rot: 0, color: GRAY_DK, step: 4 });

    // Step 5 — Cockpit walls
    b.push(...wallX({ x0: 6, z: 0, width: 5, yStart: 4, height: 2, color: RED, step: 5 }));
    b.push(...wallX({ x0: 6, z: 5, width: 5, yStart: 4, height: 2, color: RED, step: 5 }));
    // Dashboard
    b.push({ id: "3010", x: 6, y: 4, z: 1, rot: 0, color: BLACK, step: 5 });
    b.push({ id: "3010", x: 6, y: 4, z: 4, rot: 0, color: BLACK, step: 5 });
    // Steering wheel
    b.push({ id: "3005", x: 7, y: 5, z: 2, rot: 0, color: BLACK, step: 5 });
    // Seats
    b.push({ id: "3004", x: 8, y: 4, z: 2, rot: 0, color: BLACK, step: 5 });
    b.push({ id: "3004", x: 8, y: 4, z: 3, rot: 0, color: BLACK, step: 5 });
    b.push({ id: "3005", x: 8, y: 5, z: 2, rot: 0, color: RED_DK, step: 5 }); // headrest
    b.push({ id: "3005", x: 8, y: 5, z: 3, rot: 0, color: RED_DK, step: 5 });

    // Step 6 — Windshield (slope bricks for angle) & roof
    for (let z = 1; z < 5; z++) {
      b.push({ id: "3040", x: 6, y: 4, z, rot: 0, color: BLUE_LT, step: 6 });
      b.push({ id: "3040", x: 6, y: 5, z, rot: 0, color: BLUE_LT, step: 6 });
    }
    b.push(...plateRect({ x0: 7, z0: 0, width: 3, depth: 6, y: 6, color: RED, step: 6 }));
    // Rear window (inv slopes)
    for (let z = 1; z < 5; z++) {
      b.push({ id: "3665", x: 10, y: 5, z, rot: 0, color: BLUE_LT, step: 6 });
    }

    // Step 7 — Rear deck, diffuser, spoiler
    b.push(...fillRect({ x0: 11, z0: 1, width: 4, depth: 4, y: 2, color: RED, step: 7 }));
    b.push(...fillRect({ x0: 11, z0: 1, width: 4, depth: 4, y: 3, color: RED, step: 7 }));
    // Diffuser (black underbody detail)
    b.push({ id: "3010", x: 11, y: 1, z: 1, rot: 0, color: BLACK, step: 7 });
    b.push({ id: "3010", x: 11, y: 1, z: 4, rot: 0, color: BLACK, step: 7 });
    // Spoiler columns
    b.push(...column({ x: 12, z: 0, yStart: 4, height: 3, color: BLACK, step: 7 }));
    b.push(...column({ x: 12, z: 5, yStart: 4, height: 3, color: BLACK, step: 7 }));
    // Spoiler wing
    b.push(...line({ x0: 12, z0: 0, dx: 0, dz: 1, length: 6, y: 7, color: BLACK, step: 7 }));
    b.push(...line({ x0: 13, z0: 0, dx: 0, dz: 1, length: 6, y: 7, color: RED_DK, step: 7 }));

    // Step 8 — Headlights (round), mirrors, exhaust
    b.push({ id: "3062", x: 0, y: 3, z: 0, rot: 0, color: YELLOW, step: 8 });
    b.push({ id: "3062", x: 0, y: 3, z: 5, rot: 0, color: YELLOW, step: 8 });
    b.push({ id: "3062", x: 0, y: 3, z: 1, rot: 0, color: YELLOW, step: 8 });
    b.push({ id: "3062", x: 0, y: 3, z: 4, rot: 0, color: YELLOW, step: 8 });
    // Taillights
    b.push({ id: "3062", x: 15, y: 3, z: 0, rot: 0, color: ORANGE, step: 8 });
    b.push({ id: "3062", x: 15, y: 3, z: 5, rot: 0, color: ORANGE, step: 8 });
    b.push({ id: "3024", x: 15, y: 3, z: 1, rot: 0, color: RED, step: 8 });
    b.push({ id: "3024", x: 15, y: 3, z: 4, rot: 0, color: RED, step: 8 });
    // Side mirrors (headlight bricks for side stud)
    b.push({ id: "4070", x: 7, y: 5, z: -1, rot: 0, color: RED, step: 8 });
    b.push({ id: "4070", x: 7, y: 5, z: 6, rot: 0, color: RED, step: 8 });
    // Exhaust pipes (round)
    b.push({ id: "3062", x: 15, y: 1, z: 2, rot: 0, color: GRAY_LT, step: 8 });
    b.push({ id: "3062", x: 15, y: 1, z: 3, rot: 0, color: GRAY_LT, step: 8 });

    return b;
  },
},

// ═══════════════════════════════════════════════════════════════
// 4. JAPANESE TEMPLE
// ═══════════════════════════════════════════════════════════════
{
  id: "japanese_temple",
  name: "Japanese Temple",
  theme: "buildings",
  description: "A traditional temple with a stone approach, torii gate, raised platform with wide steps, red pillars, inner shrine, three-tier pagoda roof with sweeping eaves, and stone lanterns.",
  difficulty: "advanced",
  thumbnail: "⛩️",
  stepLabels: [
    "Garden grounds & stone path",
    "Torii gate",
    "Raised platform & steps",
    "Red pillars & floor",
    "Inner shrine walls",
    "First roof tier with eaves",
    "Second & third roof tiers",
    "Lanterns, bell & finial",
  ],
  build() {
    const b = [];

    // Step 1 — Garden ground with path
    b.push(...fillRect({ x0: -4, z0: -6, width: 24, depth: 20, y: 0, color: GREEN_DK, step: 1 }));
    // Stone path
    for (let z = -6; z < 0; z++) {
      b.push({ id: "3004", x: 6, y: 0, z, rot: 0, color: STONE, step: 1 });
      b.push({ id: "3004", x: 8, y: 0, z, rot: 0, color: STONE_LT, step: 1 });
    }
    // Gravel patches
    b.push(...scatter({ x0: -3, z0: 0, width: 4, depth: 12, y: 0, density: 0.15, color: STONE_LT, step: 1, seed: 5 }));
    b.push(...scatter({ x0: 15, z0: 0, width: 4, depth: 12, y: 0, density: 0.15, color: STONE_LT, step: 1, seed: 11 }));

    // Step 2 — Torii gate
    b.push(...column({ x: 5, z: -4, yStart: 1, height: 7, color: RED, step: 2 }));
    b.push(...column({ x: 10, z: -4, yStart: 1, height: 7, color: RED, step: 2 }));
    b.push(...line({ x0: 4, z0: -4, dx: 1, dz: 0, length: 8, y: 8, color: RED_DK, step: 2 }));
    b.push(...line({ x0: 5, z0: -4, dx: 1, dz: 0, length: 6, y: 7, color: RED, step: 2 }));
    // Torii cap beam (wider)
    b.push(...line({ x0: 3, z0: -4, dx: 1, dz: 0, length: 10, y: 9, color: RED_DK, step: 2 }));

    // Step 3 — Raised platform (3 layers high, 16×12)
    b.push(...fillRect({ x0: 0, z0: 0, width: 16, depth: 12, y: 1, color: STONE, step: 3 }));
    b.push(...fillRect({ x0: 0, z0: 0, width: 16, depth: 12, y: 2, color: STONE, step: 3 }));
    b.push(...fillRect({ x0: 0, z0: 0, width: 16, depth: 12, y: 3, color: STONE_DK, step: 3 }));
    // Wide steps (centered)
    b.push(...fillRect({ x0: 4, z0: -1, width: 8, depth: 1, y: 2, color: STONE, step: 3 }));
    b.push(...fillRect({ x0: 4, z0: -2, width: 8, depth: 1, y: 1, color: STONE, step: 3 }));
    // Step accents
    b.push({ id: "3003", x: 3, y: 1, z: -1, rot: 0, color: STONE_DK, step: 3 });
    b.push({ id: "3003", x: 12, y: 1, z: -1, rot: 0, color: STONE_DK, step: 3 });

    // Step 4 — Red pillars & wood floor
    b.push(...fillRect({ x0: 1, z0: 1, width: 14, depth: 10, y: 4, color: BROWN, step: 4 }));
    const pillars = [
      [1,1],[1,5],[1,10],[7,1],[7,10],[14,1],[14,5],[14,10],[1,7],[14,7]
    ];
    for (const [px,pz] of pillars) {
      b.push(...roundColumn({ x: px, z: pz, yStart: 5, height: 7, color: RED_DK, step: 4 }));
    }

    // Step 5 — Inner shrine walls (partial enclosure)
    b.push(...wallX({ x0: 3, z: 10, width: 10, yStart: 5, height: 5, color: WHITE, step: 5 }));
    b.push(...wallZ({ x: 3, z0: 4, depth: 6, yStart: 5, height: 5, color: WHITE, step: 5 }));
    b.push(...wallZ({ x: 12, z0: 4, depth: 6, yStart: 5, height: 5, color: WHITE, step: 5 }));
    // Shrine entrance (open front)
    b.push({ id: "3004", x: 6, y: 9, z: 4, rot: 0, color: RED_DK, step: 5 });
    b.push({ id: "3004", x: 8, y: 9, z: 4, rot: 0, color: RED_DK, step: 5 });
    // Altar inside
    b.push({ id: "3003", x: 7, y: 5, z: 8, rot: 0, color: YELLOW, step: 5 });
    b.push({ id: "3005", x: 7, y: 6, z: 8, rot: 0, color: YELLOW, step: 5 }); // golden Buddha
    b.push({ id: "3005", x: 8, y: 6, z: 8, rot: 0, color: ORANGE, step: 5 });  // candle

    // Step 6 — First roof (wide plate eaves, overshooting by 3 studs)
    b.push(...fillRect({ x0: -3, z0: -3, width: 22, depth: 18, y: 12, color: BLUE_DK, step: 6 }));
    b.push(...plateRect({ x0: -2, z0: -2, width: 20, depth: 16, y: 13, color: BLUE_DK, step: 6 }));
    // Eave edge accents (plate rim)
    b.push(...plateRing({ x0: -3, z0: -3, width: 22, depth: 18, y: 12, color: BLUE, step: 6 }));
    // Upturned eave corners (little kicks)
    for (const [cx, cz] of [[-3,-3],[-3,14],[18,-3],[18,14]]) {
      b.push({ id: "3005", x: cx, y: 11, z: cz, rot: 0, color: BLUE, step: 6 });
    }

    // Step 7 — Second & third tiers
    b.push(...fillRect({ x0: 1, z0: 1, width: 14, depth: 10, y: 14, color: BLUE_DK, step: 7 }));
    b.push(...fillRect({ x0: 2, z0: 2, width: 12, depth: 8, y: 15, color: BLUE, step: 7 }));
    // Third tier
    b.push(...fillRect({ x0: 4, z0: 3, width: 8, depth: 6, y: 16, color: BLUE_DK, step: 7 }));
    b.push(...fillRect({ x0: 5, z0: 4, width: 6, depth: 4, y: 17, color: BLUE, step: 7 }));
    b.push(...fillRect({ x0: 6, z0: 5, width: 4, depth: 2, y: 18, color: BLUE_DK, step: 7 }));

    // Step 8 — Lanterns, bell, finial
    // Central finial (gold spire)
    b.push(...column({ x: 8, z: 6, yStart: 19, height: 4, color: YELLOW, step: 8 }));
    b.push({ id: "3005", x: 8, y: 23, z: 6, rot: 0, color: ORANGE, step: 8 });
    // Stone lanterns flanking path (round bricks for traditional shape)
    for (const lx of [3, 12]) {
      b.push({ id: "3062", x: lx, y: 1, z: -3, rot: 0, color: STONE, step: 8 });
      b.push({ id: "3062", x: lx, y: 2, z: -3, rot: 0, color: STONE_LT, step: 8 });
      b.push({ id: "3941", x: lx, y: 3, z: -3, rot: 0, color: STONE, step: 8 });
      b.push({ id: "3062", x: lx, y: 4, z: -3, rot: 0, color: YELLOW, step: 8 }); // light
      b.push({ id: "3039", x: lx, y: 5, z: -3, rot: 0, color: STONE_DK, step: 8 }); // slope cap
    }
    // Temple bell
    b.push({ id: "3005", x: 2, y: 11, z: 1, rot: 0, color: BROWN, step: 8 }); // rope
    b.push({ id: "3003", x: 2, y: 10, z: 1, rot: 0, color: GRAY_DK, step: 8 }); // bell

    return b;
  },
},

// ═══════════════════════════════════════════════════════════════
// 5. PIRATE SHIP
// ═══════════════════════════════════════════════════════════════
{
  id: "pirate_ship",
  name: "Pirate Galleon",
  theme: "vehicles",
  description: "A fearsome galleon with a curved hull, dual cannon decks, bowsprit, three masts with yardarms, captain's quarters with windows, anchor, and a Jolly Roger flag.",
  difficulty: "advanced",
  thumbnail: "🏴‍☠️",
  stepLabels: [
    "Keel & hull bottom",
    "Hull walls & planking",
    "Bow taper & bowsprit",
    "Main deck & hatches",
    "Stern castle & captain's quarters",
    "Three masts & yardarms",
    "Cannon ports & armaments",
    "Rigging, flag & anchor",
  ],
  build() {
    const b = [];

    // Step 1 — Keel: 18×6, 3 layers (thick hull)
    b.push(...fillRect({ x0: 0, z0: 1, width: 18, depth: 4, y: 0, color: BROWN_DK, step: 1 }));
    b.push(...fillRect({ x0: 1, z0: 0, width: 16, depth: 6, y: 1, color: BROWN_DK, step: 1 }));
    b.push(...fillRect({ x0: 1, z0: 0, width: 16, depth: 6, y: 2, color: BROWN, step: 1 }));

    // Step 2 — Hull walls (5 layers, textured planking with masonry)
    b.push(...texturedWallX({ x0: 1, z: 0, width: 16, yStart: 3, height: 5, colors: [BROWN, BROWN_DK, BROWN, BROWN_LT], step: 2 }));
    b.push(...texturedWallX({ x0: 1, z: 5, width: 16, yStart: 3, height: 5, colors: [BROWN, BROWN_DK, BROWN, BROWN_LT], step: 2 }));
    b.push(...wallZ({ x: 17, z0: 1, depth: 4, yStart: 3, height: 5, color: BROWN, step: 2, useMasonry: true }));
    // Waterline stripe
    b.push(...line({ x0: 1, z0: 0, dx: 1, dz: 0, length: 16, y: 3, color: RED_DK, step: 2 }));
    b.push(...line({ x0: 1, z0: 5, dx: 1, dz: 0, length: 16, y: 3, color: RED_DK, step: 2 }));

    // Step 3 — Bow taper & bowsprit
    for (let layer = 0; layer < 4; layer++) {
      const inset = layer;
      b.push({ id: "3005", x: -1 - inset, y: 3 + layer, z: 2, rot: 0, color: BROWN_DK, step: 3 });
      b.push({ id: "3005", x: -1 - inset, y: 3 + layer, z: 3, rot: 0, color: BROWN_DK, step: 3 });
    }
    // Bowsprit (long pole)
    for (let i = 0; i < 6; i++) {
      b.push({ id: "3005", x: -2 - i, y: 7, z: 2, rot: 0, color: TAN, step: 3 });
      b.push({ id: "3005", x: -2 - i, y: 7, z: 3, rot: 0, color: TAN, step: 3 });
    }
    // Figurehead
    b.push({ id: "3005", x: -7, y: 6, z: 2, rot: 0, color: YELLOW, step: 3 });
    b.push({ id: "3005", x: -7, y: 6, z: 3, rot: 0, color: YELLOW, step: 3 });

    // Step 4 — Main deck (plates for smooth surface) & hatches
    b.push(...plateRect({ x0: 1, z0: 1, width: 12, depth: 4, y: 8, color: TAN, step: 4 }));
    // Deck hatches
    b.push({ id: "3003", x: 4, y: 8, z: 2, rot: 0, color: BROWN_DK, step: 4 });
    b.push({ id: "3003", x: 8, y: 8, z: 2, rot: 0, color: BROWN_DK, step: 4 });
    // Railing posts along sides
    for (let x = 1; x < 13; x += 2) {
      b.push({ id: "3005", x, y: 9, z: 0, rot: 0, color: TAN, step: 4 });
      b.push({ id: "3005", x, y: 9, z: 5, rot: 0, color: TAN, step: 4 });
    }

    // Step 5 — Stern castle & captain's quarters
    b.push(...fillRect({ x0: 13, z0: 0, width: 5, depth: 6, y: 8, color: BROWN, step: 5 }));
    b.push(...fillRect({ x0: 13, z0: 0, width: 5, depth: 6, y: 9, color: BROWN, step: 5 }));
    // Stern castle walls
    const sternWindows = [{ x: 1, yStart: 11, w: 1, h: 2 }, { x: 3, yStart: 11, w: 1, h: 2 }];
    b.push(...wallX({ x0: 13, z: 0, width: 5, yStart: 10, height: 4, color: BROWN, step: 5, openings: sternWindows }));
    b.push(...wallX({ x0: 13, z: 5, width: 5, yStart: 10, height: 4, color: BROWN, step: 5, openings: sternWindows }));
    b.push(...wallZ({ x: 17, z0: 0, depth: 6, yStart: 10, height: 4, color: BROWN_DK, step: 5 }));
    // Stern windows (blue glass)
    for (const [sx, sz] of [[14, 0], [16, 0], [14, 5], [16, 5]]) {
      b.push({ id: "3005", x: sx, y: 11, z: sz, rot: 0, color: BLUE_LT, step: 5 });
    }
    // Stern lanterns (round bricks)
    b.push({ id: "3062", x: 17, y: 13, z: 0, rot: 0, color: YELLOW, step: 5 });
    b.push({ id: "3062", x: 17, y: 13, z: 5, rot: 0, color: YELLOW, step: 5 });
    // Captain's desk
    b.push({ id: "3004", x: 15, y: 10, z: 3, rot: 0, color: BROWN_LT, step: 5 });

    // Step 6 — Three masts
    // Foremast
    b.push(...column({ x: 4, z: 2, yStart: 9, height: 10, color: TAN, step: 6 }));
    b.push(...column({ x: 4, z: 3, yStart: 9, height: 10, color: TAN, step: 6 }));
    b.push(...line({ x0: 4, z0: 0, dx: 0, dz: 1, length: 6, y: 16, color: TAN, step: 6 }));

    // Mainmast (tallest)
    b.push(...column({ x: 8, z: 2, yStart: 9, height: 13, color: TAN, step: 6 }));
    b.push(...column({ x: 8, z: 3, yStart: 9, height: 13, color: TAN, step: 6 }));
    b.push(...line({ x0: 8, z0: -1, dx: 0, dz: 1, length: 8, y: 19, color: TAN, step: 6 }));
    b.push(...line({ x0: 8, z0: 0, dx: 0, dz: 1, length: 6, y: 15, color: TAN, step: 6 }));
    // Crow's nest
    b.push(...ring({ x0: 7, z0: 1, width: 4, depth: 4, y: 21, color: BROWN, step: 6 }));

    // Mizzenmast (stern)
    b.push(...column({ x: 14, z: 2, yStart: 14, height: 8, color: TAN, step: 6 }));
    b.push(...column({ x: 14, z: 3, yStart: 14, height: 8, color: TAN, step: 6 }));
    b.push(...line({ x0: 14, z0: 0, dx: 0, dz: 1, length: 6, y: 20, color: TAN, step: 6 }));

    // Step 7 — Cannon ports
    for (const x of [3, 5, 7, 9, 11]) {
      b.push({ id: "3005", x, y: 5, z: 0, rot: 0, color: YELLOW, step: 7 });
      b.push({ id: "3005", x, y: 5, z: 5, rot: 0, color: YELLOW, step: 7 });
      // Cannon barrels (inside)
      b.push({ id: "3005", x, y: 4, z: 0, rot: 0, color: GRAY_DK, step: 7 });
      b.push({ id: "3005", x, y: 4, z: 5, rot: 0, color: GRAY_DK, step: 7 });
    }
    // Bow cannon
    b.push({ id: "3005", x: 0, y: 7, z: 2, rot: 0, color: GRAY_DK, step: 7 });
    b.push({ id: "3005", x: 0, y: 7, z: 3, rot: 0, color: GRAY_DK, step: 7 });

    // Step 8 — Flag, anchor, rigging
    // Jolly Roger flag
    b.push(...column({ x: 8, z: 2, yStart: 22, height: 2, color: BROWN, step: 8 }));
    b.push({ id: "3004", x: 8, y: 23, z: 0, rot: 0, color: BLACK, step: 8 });
    b.push({ id: "3004", x: 8, y: 24, z: 0, rot: 0, color: BLACK, step: 8 });
    b.push({ id: "3005", x: 8, y: 23, z: 0, rot: 0, color: WHITE, step: 8 }); // skull
    // Anchor (hanging from bow)
    b.push({ id: "3005", x: 0, y: 4, z: 1, rot: 0, color: GRAY_DK, step: 8 });
    b.push({ id: "3005", x: 0, y: 3, z: 1, rot: 0, color: GRAY_DK, step: 8 });
    b.push({ id: "3004", x: -1, y: 2, z: 1, rot: 0, color: GRAY_DK, step: 8 });
    // Treasure chest on deck
    b.push({ id: "3003", x: 10, y: 9, z: 2, rot: 0, color: BROWN_DK, step: 8 });
    b.push({ id: "3005", x: 10, y: 10, z: 2, rot: 0, color: YELLOW, step: 8 }); // gold
    // Captain's wheel
    b.push({ id: "3005", x: 15, y: 11, z: 3, rot: 0, color: BROWN, step: 8 });
    b.push({ id: "3005", x: 15, y: 12, z: 3, rot: 0, color: BROWN_LT, step: 8 });

    return b;
  },
},

// ═══════════════════════════════════════════════════════════════
// 6. ROCKET & LAUNCHPAD
// ═══════════════════════════════════════════════════════════════
{
  id: "rocket_launchpad",
  name: "Rocket & Launchpad",
  theme: "space",
  description: "A multi-stage rocket with fuel tanks, payload fairing, and engine bells on a detailed launch complex with gantry tower, fuel lines, service platform, lightning rod, and control bunker.",
  difficulty: "advanced",
  thumbnail: "🚀",
  stepLabels: [
    "Launch pad & flame trench",
    "Control bunker & fuel tanks",
    "Rocket first stage & engines",
    "Rocket second stage & fairing",
    "Launch tower lattice",
    "Gantry arms & umbilicals",
    "Service platform & lightning rod",
    "Exhaust flames & details",
  ],
  build() {
    const b = [];

    // Step 1 — Pad base (14×12) and flame trench
    b.push(...fillRect({ x0: 0, z0: 0, width: 14, depth: 12, y: 0, color: GRAY_LT, step: 1 }));
    // Flame trench (dark channel)
    b.push(...fillRect({ x0: 4, z0: 4, width: 6, depth: 4, y: 0, color: GRAY_DK, step: 1 }));
    b.push(...wallX({ x0: 4, z: 4, width: 6, yStart: 1, height: 1, color: GRAY, step: 1 }));
    b.push(...wallX({ x0: 4, z: 7, width: 6, yStart: 1, height: 1, color: GRAY, step: 1 }));
    b.push(...wallZ({ x: 4, z0: 4, depth: 4, yStart: 1, height: 1, color: GRAY, step: 1 }));
    b.push(...wallZ({ x: 9, z0: 4, depth: 4, yStart: 1, height: 1, color: GRAY, step: 1 }));
    // Pad markings
    b.push(...line({ x0: 0, z0: 0, dx: 1, dz: 0, length: 14, y: 0, color: YELLOW, step: 1 }));
    b.push(...line({ x0: 0, z0: 11, dx: 1, dz: 0, length: 14, y: 0, color: YELLOW, step: 1 }));

    // Step 2 — Control bunker & fuel storage
    // Bunker (left side)
    b.push(...fillRect({ x0: 0, z0: 0, width: 3, depth: 3, y: 1, color: GRAY, step: 2 }));
    b.push(...hollowBox({ x0: 0, z0: 0, width: 3, depth: 3, yStart: 2, height: 3, color: GRAY, step: 2 }));
    b.push(...fillRect({ x0: 0, z0: 0, width: 3, depth: 3, y: 5, color: GRAY_DK, step: 2 })); // roof
    // Monitor screen
    b.push({ id: "3005", x: 1, y: 3, z: 0, rot: 0, color: GREEN, step: 2 });
    // Fuel tanks (right side)
    for (const tz of [9, 11]) {
      b.push(...thickColumn({ x: 1, z: tz, yStart: 1, height: 5, color: WHITE, step: 2 }));
      b.push({ id: "3003", x: 1, y: 6, z: tz, rot: 0, color: GRAY_LT, step: 2 }); // cap
      b.push({ id: "3005", x: 1, y: 3, z: tz, rot: 0, color: ORANGE, step: 2 }); // hazard
    }
    // Fuel line (orange pipe to pad)
    b.push(...line({ x0: 3, z0: 10, dx: 1, dz: 0, length: 4, y: 1, color: ORANGE, step: 2 }));

    // Step 3 — Rocket first stage (4×4 tower, 10 layers, white with stripes)
    const rx = 5, rz = 5;
    for (let h = 2; h < 12; h++) {
      b.push({ id: "3003", x: rx, y: h, z: rz, rot: 0, color: WHITE, step: 3 });
      b.push({ id: "3003", x: rx + 2, y: h, z: rz, rot: 0, color: WHITE, step: 3 });
      b.push({ id: "3003", x: rx, y: h, z: rz + 2, rot: 0, color: WHITE, step: 3 });
      b.push({ id: "3003", x: rx + 2, y: h, z: rz + 2, rot: 0, color: WHITE, step: 3 });
    }
    // Red stripe bands
    for (const h of [4, 8]) {
      b.push({ id: "3003", x: rx, y: h, z: rz, rot: 0, color: RED, step: 3 });
      b.push({ id: "3003", x: rx + 2, y: h, z: rz, rot: 0, color: RED, step: 3 });
      b.push({ id: "3003", x: rx, y: h, z: rz + 2, rot: 0, color: RED, step: 3 });
      b.push({ id: "3003", x: rx + 2, y: h, z: rz + 2, rot: 0, color: RED, step: 3 });
    }
    // Engine bells (wider base)
    for (const [ex, ez] of [[rx, rz], [rx+3, rz], [rx, rz+3], [rx+3, rz+3]]) {
      b.push({ id: "3005", x: ex, y: 2, z: ez, rot: 0, color: GRAY, step: 3 });
      b.push({ id: "3005", x: ex, y: 1, z: ez, rot: 0, color: GRAY_DK, step: 3 });
    }

    // Step 4 — Second stage & payload fairing
    for (let h = 12; h < 18; h++) {
      b.push({ id: "3003", x: rx + 1, y: h, z: rz + 1, rot: 0, color: WHITE, step: 4 });
    }
    // Blue NASA-style stripe
    b.push({ id: "3003", x: rx + 1, y: 14, z: rz + 1, rot: 0, color: BLUE, step: 4 });
    // Nose cone (tapering)
    b.push({ id: "3005", x: rx + 1, y: 18, z: rz + 1, rot: 0, color: WHITE, step: 4 });
    b.push({ id: "3005", x: rx + 2, y: 18, z: rz + 1, rot: 0, color: WHITE, step: 4 });
    b.push({ id: "3005", x: rx + 1, y: 18, z: rz + 2, rot: 0, color: WHITE, step: 4 });
    b.push({ id: "3005", x: rx + 1, y: 19, z: rz + 1, rot: 0, color: RED, step: 4 });
    b.push({ id: "3005", x: rx + 1, y: 20, z: rz + 2, rot: 0, color: RED, step: 4 });

    // Step 5 — Launch tower lattice
    const tx = 12;
    for (let h = 0; h < 20; h++) {
      b.push({ id: "3005", x: tx, y: h, z: 4, rot: 0, color: ORANGE, step: 5 });
      b.push({ id: "3005", x: tx, y: h, z: 8, rot: 0, color: ORANGE, step: 5 });
      b.push({ id: "3005", x: tx + 1, y: h, z: 4, rot: 0, color: ORANGE, step: 5 });
      b.push({ id: "3005", x: tx + 1, y: h, z: 8, rot: 0, color: ORANGE, step: 5 });
      // Cross braces
      if (h % 3 === 0) {
        b.push({ id: "3010", x: tx, y: h, z: 5, rot: 90, color: ORANGE, step: 5 });
      }
      if (h % 3 === 1) {
        b.push({ id: "3005", x: tx, y: h, z: 6, rot: 0, color: GRAY, step: 5 });
      }
    }

    // Step 6 — Gantry arms (3 levels)
    for (const gy of [5, 10, 15]) {
      for (let x = rx + 4; x <= tx; x++) {
        b.push({ id: "3005", x, y: gy, z: 6, rot: 0, color: GRAY_LT, step: 6 });
      }
      // Umbilical connectors
      b.push({ id: "3005", x: rx + 4, y: gy, z: 5, rot: 0, color: WHITE, step: 6 });
      b.push({ id: "3005", x: rx + 4, y: gy, z: 7, rot: 0, color: WHITE, step: 6 });
    }

    // Step 7 — Service platform & lightning rod
    b.push(...fillRect({ x0: 11, z0: 3, width: 3, depth: 6, y: 10, color: GRAY_LT, step: 7 }));
    // Railing
    for (let z = 3; z < 9; z += 2) {
      b.push({ id: "3005", x: 11, y: 11, z, rot: 0, color: YELLOW, step: 7 });
    }
    // Lightning rod (very tall, on tower)
    b.push(...column({ x: tx + 1, z: 6, yStart: 20, height: 6, color: GRAY, step: 7 }));
    b.push({ id: "3005", x: tx + 1, y: 26, z: 6, rot: 0, color: WHITE, step: 7 }); // tip

    // Step 8 — Exhaust flames & countdown
    for (const [fx, fz] of [[rx,rz],[rx+3,rz],[rx,rz+3],[rx+3,rz+3]]) {
      b.push({ id: "3005", x: fx, y: 0, z: fz, rot: 0, color: ORANGE, step: 8 });
      b.push({ id: "3005", x: fx, y: 0, z: fz + 1, rot: 0, color: YELLOW, step: 8 });
    }
    // Smoke cloud
    b.push(...scatter({ x0: 3, z0: 3, width: 8, depth: 6, y: 0, density: 0.25, color: WHITE, step: 8, seed: 99 }));
    // Countdown display on bunker
    b.push({ id: "3005", x: 0, y: 5, z: 0, rot: 0, color: GREEN, step: 8 });
    // American flag on pad
    b.push(...column({ x: 0, z: 6, yStart: 1, height: 4, color: GRAY, step: 8 }));
    b.push({ id: "3004", x: 0, y: 5, z: 7, rot: 0, color: RED, step: 8 });
    b.push({ id: "3004", x: 0, y: 6, z: 7, rot: 0, color: BLUE, step: 8 });

    return b;
  },
},

// ═══════════════════════════════════════════════════════════════
// 7. FOREST TREEHOUSE
// ═══════════════════════════════════════════════════════════════
{
  id: "treehouse",
  name: "Forest Treehouse",
  theme: "buildings",
  description: "A grand tree with textured bark, spreading branches, a spacious cabin with furnished interior, balcony with railing, rope ladder, tire swing, bird's nest, and a lush leaf canopy.",
  difficulty: "intermediate",
  thumbnail: "🌳",
  stepLabels: [
    "Forest floor & mushrooms",
    "Tree trunk with bark texture",
    "Branch fork & spreading limbs",
    "Treehouse platform & balcony",
    "Cabin walls, door & window",
    "Cabin roof & interior",
    "Leaf canopy (full coverage)",
    "Rope ladder, swing & wildlife",
  ],
  build() {
    const b = [];

    // Step 1 — Forest floor
    b.push(...fillRect({ x0: -3, z0: -3, width: 16, depth: 16, y: 0, color: GREEN_DK, step: 1 }));
    // Mossy patches
    b.push(...scatter({ x0: -3, z0: -3, width: 16, depth: 16, y: 0, density: 0.08, color: GREEN_LT, step: 1, seed: 3 }));
    // Mushrooms
    for (const [mx, mz] of [[-2, 2], [10, -1], [8, 10], [-1, 8]]) {
      b.push({ id: "3005", x: mx, y: 1, z: mz, rot: 0, color: WHITE, step: 1 }); // stem
      b.push({ id: "3005", x: mx, y: 2, z: mz, rot: 0, color: RED, step: 1 }); // cap
    }
    // Roots
    for (const [rx, rz] of [[-1,4],[5,10],[9,-1],[11,5]]) {
      b.push({ id: "3004", x: rx, y: 0, z: rz, rot: 0, color: BROWN_DK, step: 1 });
      b.push({ id: "3005", x: rx, y: 1, z: rz, rot: 0, color: BROWN_DK, step: 1 });
    }

    // Step 2 — Trunk (4×4, 10 layers, textured bark)
    for (let h = 1; h < 11; h++) {
      const c = h % 3 === 0 ? BROWN_DK : h % 3 === 1 ? BROWN : BROWN_LT;
      for (let tx = 3; tx <= 6; tx++) {
        for (let tz = 3; tz <= 6; tz++) {
          b.push({ id: "3005", x: tx, y: h, z: tz, rot: 0, color: c, step: 2 });
        }
      }
    }

    // Step 3 — Branch fork (trunk widens, branches extend)
    for (let h = 11; h < 13; h++) {
      for (let tx = 2; tx <= 7; tx++) {
        for (let tz = 2; tz <= 7; tz++) {
          if (tx >= 3 && tx <= 6 && tz >= 3 && tz <= 6) {
            b.push({ id: "3005", x: tx, y: h, z: tz, rot: 0, color: BROWN, step: 3 });
          }
        }
      }
    }
    // Branch arms (extend outward)
    const branches = [
      [[0,4],[1,4]], [[0,5],[1,5]],  // west
      [[8,4],[9,4]], [[8,5],[9,5]],  // east
      [[4,0],[4,1]], [[5,0],[5,1]],  // north
      [[4,8],[4,9]], [[5,8],[5,9]],  // south
    ];
    for (const pair of branches) {
      for (const [bx, bz] of pair) {
        b.push({ id: "3005", x: bx, y: 12, z: bz, rot: 0, color: BROWN, step: 3 });
        b.push({ id: "3005", x: bx, y: 13, z: bz, rot: 0, color: BROWN, step: 3 });
      }
    }

    // Step 4 — Treehouse platform with balcony
    b.push(...fillRect({ x0: 0, z0: 0, width: 10, depth: 10, y: 11, color: TAN, step: 4 }));
    // Balcony extension (front)
    b.push(...fillRect({ x0: 1, z0: -2, width: 8, depth: 2, y: 11, color: TAN, step: 4 }));
    // Railing posts
    for (let x = 0; x < 10; x += 2) {
      b.push({ id: "3005", x, y: 12, z: -2, rot: 0, color: BROWN, step: 4 });
      if (x < 3 || x > 6) { // gap for door
        b.push({ id: "3005", x, y: 12, z: 0, rot: 0, color: BROWN, step: 4 });
      }
    }
    // Side railing
    for (let z = -1; z < 0; z++) {
      b.push({ id: "3005", x: 0, y: 12, z, rot: 0, color: BROWN, step: 4 });
      b.push({ id: "3005", x: 9, y: 12, z, rot: 0, color: BROWN, step: 4 });
    }

    // Step 5 — Cabin walls (5 layers)
    const cabinDoor = [{ x: 3, yStart: 12, w: 2, h: 4 }];
    const cabinWin  = [{ x: 3, yStart: 13, w: 2, h: 2 }];
    b.push(...wallX({ x0: 1, z: 1, width: 8, yStart: 12, height: 5, color: BROWN, step: 5, openings: cabinDoor }));
    b.push(...wallX({ x0: 1, z: 8, width: 8, yStart: 12, height: 5, color: BROWN, step: 5, openings: cabinWin }));
    b.push(...wallZ({ x: 1, z0: 2, depth: 6, yStart: 12, height: 5, color: BROWN, step: 5 }));
    b.push(...wallZ({ x: 8, z0: 2, depth: 6, yStart: 12, height: 5, color: BROWN, step: 5 }));
    // Window glass
    b.push({ id: "3005", x: 4, y: 13, z: 8, rot: 0, color: BLUE_LT, step: 5 });
    b.push({ id: "3005", x: 5, y: 13, z: 8, rot: 0, color: BLUE_LT, step: 5 });

    // Step 6 — Roof & interior
    b.push(...slopedRoof({ x0: 1, z0: 1, width: 8, depth: 8, yStart: 17, color: RED_DK, step: 6 }));
    // Interior: bed
    b.push({ id: "3004", x: 6, y: 12, z: 6, rot: 0, color: BROWN, step: 6 });
    b.push({ id: "3004", x: 6, y: 12, z: 5, rot: 0, color: WHITE, step: 6 });
    // Shelf
    b.push({ id: "3010", x: 2, y: 15, z: 2, rot: 0, color: BROWN_LT, step: 6 });
    b.push({ id: "3005", x: 2, y: 16, z: 2, rot: 0, color: YELLOW, step: 6 }); // lantern

    // Step 7 — Leaf canopy (thick coverage)
    const leafY = [[14, 0.6], [15, 0.5], [16, 0.45], [17, 0.35], [18, 0.25], [19, 0.15]];
    for (const [ly, density] of leafY) {
      b.push(...scatter({ x0: -2, z0: -2, width: 14, depth: 14, y: ly, density, color: GREEN, step: 7, seed: ly * 7 }));
      b.push(...scatter({ x0: -1, z0: -1, width: 12, depth: 12, y: ly, density: density * 0.5, color: GREEN_LT, step: 7, seed: ly * 13 }));
    }

    // Step 8 — Ladder, swing, wildlife
    // Rope ladder
    for (let h = 1; h < 11; h++) {
      b.push({ id: "3005", x: 0, y: h, z: -1, rot: 0, color: TAN, step: 8 });
      if (h % 2 === 0) {
        b.push({ id: "3004", x: -1, y: h, z: -1, rot: 0, color: TAN, step: 8 });
      }
    }
    // Tire swing (hanging from branch)
    b.push(...column({ x: 9, z: 4, yStart: 8, height: 4, color: TAN, step: 8 })); // rope
    b.push({ id: "3003", x: 9, y: 7, z: 4, rot: 0, color: BLACK, step: 8 }); // tire
    // Bird's nest (on a branch)
    b.push({ id: "3003", x: 0, y: 14, z: 4, rot: 0, color: BROWN_LT, step: 8 });
    b.push({ id: "3005", x: 0, y: 15, z: 4, rot: 0, color: BLUE_LT, step: 8 }); // egg
    b.push({ id: "3005", x: 1, y: 15, z: 4, rot: 0, color: BLUE_LT, step: 8 });
    // Firepit on ground
    b.push({ id: "3003", x: -2, y: 1, z: -2, rot: 0, color: STONE_DK, step: 8 });
    b.push({ id: "3005", x: -2, y: 1, z: -2, rot: 0, color: ORANGE, step: 8 }); // fire

    return b;
  },
},

// ═══════════════════════════════════════════════════════════════
// 8. FIRE DRAGON
// ═══════════════════════════════════════════════════════════════
{
  id: "dragon",
  name: "Fire Dragon",
  theme: "creatures",
  description: "A massive dragon with an articulated spine, powerful hind legs, clawed forelegs, a long curving tail with spikes, two outstretched wings with finger bones and membrane, a horned head with open jaw, and a gout of fire breath over a treasure hoard.",
  difficulty: "advanced",
  thumbnail: "🐉",
  stepLabels: [
    "Treasure hoard & tail tip",
    "Tail with dorsal spines",
    "Hind legs & lower body",
    "Upper body & spine",
    "Front legs, chest & neck",
    "Head, jaw & horns",
    "Left wing (bone & membrane)",
    "Right wing & fire breath",
  ],
  build() {
    const b = [];
    const G = GREEN_DK, GL = GREEN, GD = "#0D4515", Y = YELLOW;

    // Step 1 — Treasure hoard (ground) & tail tip
    // Treasure pile (gold/jewels)
    b.push(...scatter({ x0: -6, z0: 1, width: 4, depth: 4, y: 0, density: 0.7, color: YELLOW, step: 1, seed: 3 }));
    b.push(...scatter({ x0: -6, z0: 1, width: 4, depth: 4, y: 0, density: 0.3, color: ORANGE, step: 1, seed: 7 }));
    b.push(...scatter({ x0: -6, z0: 1, width: 4, depth: 4, y: 1, density: 0.4, color: YELLOW, step: 1, seed: 11 }));
    b.push({ id: "3005", x: -5, y: 2, z: 2, rot: 0, color: RED, step: 1 }); // ruby
    b.push({ id: "3005", x: -4, y: 2, z: 3, rot: 0, color: BLUE, step: 1 }); // sapphire
    // Tail tip (far end)
    for (let i = 0; i < 3; i++) {
      b.push({ id: "3005", x: 18 + i, y: 2, z: 3, rot: 0, color: G, step: 1 });
    }
    b.push({ id: "3005", x: 20, y: 3, z: 3, rot: 0, color: ORANGE, step: 1 }); // tail barb

    // Step 2 — Tail body (curves along X axis, with dorsal spines)
    for (let i = 0; i < 6; i++) {
      const tx = 12 + i;
      const w = i < 3 ? 3 : 2;
      for (let z = 2; z < 2 + w; z++) {
        b.push({ id: "3005", x: tx, y: 1, z, rot: 0, color: G, step: 2 });
        b.push({ id: "3005", x: tx, y: 2, z, rot: 0, color: G, step: 2 });
      }
      // Belly
      if (i < 4) b.push({ id: "3005", x: tx, y: 1, z: 3, rot: 0, color: Y, step: 2 });
      // Dorsal spines
      if (i % 2 === 0) {
        b.push({ id: "3005", x: tx, y: 3, z: 3, rot: 0, color: ORANGE, step: 2 });
      }
    }

    // Step 3 — Hind legs & lower body
    // Hind legs (thick, powerful)
    for (const [lx, lz] of [[11, 1], [11, 5]]) {
      b.push(...column({ x: lx, z: lz, yStart: 0, height: 3, color: G, step: 3 }));
      b.push({ id: "3004", x: lx, y: 0, z: lz, rot: 0, color: GD, step: 3 }); // claws
      b.push({ id: "3005", x: lx + 1, y: 0, z: lz, rot: 0, color: GD, step: 3 });
    }
    // Lower body (wide pelvis area)
    for (let x = 9; x < 13; x++) {
      for (let z = 2; z < 5; z++) {
        b.push({ id: "3005", x, y: 1, z, rot: 0, color: G, step: 3 });
        b.push({ id: "3005", x, y: 2, z, rot: 0, color: G, step: 3 });
      }
    }
    // Yellow belly
    for (let x = 9; x < 12; x++) {
      b.push({ id: "3005", x, y: 1, z: 3, rot: 0, color: Y, step: 3 });
    }

    // Step 4 — Upper body & spine (main torso)
    for (let x = 4; x < 10; x++) {
      for (let z = 1; z < 6; z++) {
        // Outer shell
        if (z === 1 || z === 5 || x === 4 || x === 9) {
          b.push({ id: "3005", x, y: 3, z, rot: 0, color: G, step: 4 });
          b.push({ id: "3005", x, y: 4, z, rot: 0, color: G, step: 4 });
        }
      }
      // Top and bottom
      b.push({ id: "3005", x, y: 2, z: 3, rot: 0, color: Y, step: 4 }); // belly
      b.push({ id: "3005", x, y: 5, z: 3, rot: 0, color: G, step: 4 }); // back
    }
    // Dorsal spine ridge
    for (let x = 5; x < 12; x += 2) {
      b.push({ id: "3005", x, y: 5, z: 3, rot: 0, color: ORANGE, step: 4 });
      b.push({ id: "3005", x, y: 6, z: 3, rot: 0, color: ORANGE, step: 4 });
    }

    // Step 5 — Front legs, chest, neck
    for (const [lx, lz] of [[3, 1], [3, 5]]) {
      b.push(...column({ x: lx, z: lz, yStart: 0, height: 3, color: G, step: 5 }));
      b.push({ id: "3004", x: lx - 1, y: 0, z: lz, rot: 0, color: GD, step: 5 }); // claws
    }
    // Chest (wider front)
    for (let z = 1; z < 6; z++) {
      b.push({ id: "3005", x: 3, y: 3, z, rot: 0, color: G, step: 5 });
      b.push({ id: "3005", x: 3, y: 4, z, rot: 0, color: G, step: 5 });
    }
    // Neck (curves upward, 5 segments)
    for (let i = 0; i < 5; i++) {
      const nx = 2 - i;
      const ny = 4 + i;
      b.push({ id: "3005", x: nx, y: ny, z: 2, rot: 0, color: G, step: 5 });
      b.push({ id: "3005", x: nx, y: ny, z: 3, rot: 0, color: G, step: 5 });
      b.push({ id: "3005", x: nx, y: ny, z: 4, rot: 0, color: G, step: 5 });
      // Neck belly
      b.push({ id: "3005", x: nx, y: ny, z: 3, rot: 0, color: Y, step: 5 });
    }

    // Step 6 — Head, jaw & horns
    // Head block (3 wide, 2 deep, 2 tall)
    for (let z = 2; z < 5; z++) {
      b.push({ id: "3005", x: -3, y: 9, z, rot: 0, color: G, step: 6 });
      b.push({ id: "3005", x: -2, y: 9, z, rot: 0, color: G, step: 6 });
      b.push({ id: "3005", x: -3, y: 10, z, rot: 0, color: G, step: 6 });
      b.push({ id: "3005", x: -2, y: 10, z, rot: 0, color: G, step: 6 });
    }
    // Snout
    b.push({ id: "3004", x: -5, y: 9, z: 2, rot: 0, color: G, step: 6 });
    b.push({ id: "3004", x: -5, y: 9, z: 3, rot: 0, color: G, step: 6 });
    b.push({ id: "3004", x: -5, y: 9, z: 4, rot: 0, color: G, step: 6 });
    // Lower jaw (open)
    b.push({ id: "3004", x: -5, y: 8, z: 2, rot: 0, color: G, step: 6 });
    b.push({ id: "3004", x: -5, y: 8, z: 3, rot: 0, color: RED, step: 6 }); // mouth interior
    b.push({ id: "3004", x: -5, y: 8, z: 4, rot: 0, color: G, step: 6 });
    // Teeth
    b.push({ id: "3005", x: -5, y: 8, z: 2, rot: 0, color: WHITE, step: 6 });
    b.push({ id: "3005", x: -5, y: 8, z: 4, rot: 0, color: WHITE, step: 6 });
    b.push({ id: "3005", x: -5, y: 9, z: 2, rot: 0, color: WHITE, step: 6 });
    b.push({ id: "3005", x: -5, y: 9, z: 4, rot: 0, color: WHITE, step: 6 });
    // Eyes
    b.push({ id: "3005", x: -3, y: 11, z: 1, rot: 0, color: YELLOW, step: 6 });
    b.push({ id: "3005", x: -3, y: 11, z: 5, rot: 0, color: YELLOW, step: 6 });
    // Horns (2 pairs)
    b.push({ id: "3005", x: -2, y: 11, z: 1, rot: 0, color: ORANGE, step: 6 });
    b.push({ id: "3005", x: -2, y: 12, z: 1, rot: 0, color: ORANGE, step: 6 });
    b.push({ id: "3005", x: -2, y: 11, z: 5, rot: 0, color: ORANGE, step: 6 });
    b.push({ id: "3005", x: -2, y: 12, z: 5, rot: 0, color: ORANGE, step: 6 });
    b.push({ id: "3005", x: -1, y: 11, z: 1, rot: 0, color: ORANGE, step: 6 });
    b.push({ id: "3005", x: -1, y: 11, z: 5, rot: 0, color: ORANGE, step: 6 });
    // Crest ridge on head
    b.push({ id: "3005", x: -3, y: 11, z: 3, rot: 0, color: ORANGE, step: 6 });
    b.push({ id: "3005", x: -4, y: 10, z: 3, rot: 0, color: ORANGE, step: 6 });

    // Step 7 — Left wing (bone + membrane, large span)
    const wingY = 5;
    // Wing arm (bone extending from shoulder)
    b.push({ id: "3005", x: 6, y: wingY + 1, z: 0, rot: 0, color: G, step: 7 });
    b.push({ id: "3005", x: 6, y: wingY + 2, z: 0, rot: 0, color: G, step: 7 });
    b.push({ id: "3005", x: 6, y: wingY + 3, z: -1, rot: 0, color: G, step: 7 });
    // Finger bones
    b.push(...diagonal({ x0: 6, z0: -1, dx: 0, dz: -1, length: 6, yStart: wingY, dy: 0, color: G, step: 7 }));
    b.push(...diagonal({ x0: 8, z0: -1, dx: 0, dz: -1, length: 5, yStart: wingY, dy: 0, color: G, step: 7 }));
    b.push(...diagonal({ x0: 10, z0: 0, dx: 0, dz: -1, length: 4, yStart: wingY, dy: 0, color: G, step: 7 }));
    // Wing membrane
    for (let i = 0; i < 6; i++) {
      const wz = -i;
      const span = Math.max(1, 6 - i);
      for (let x = 6; x < 6 + span; x++) {
        b.push({ id: "3005", x, y: wingY, z: wz, rot: 0, color: GL, step: 7 });
      }
    }
    // Wing claw tips
    b.push({ id: "3005", x: 6, y: wingY, z: -6, rot: 0, color: GD, step: 7 });
    b.push({ id: "3005", x: 8, y: wingY, z: -5, rot: 0, color: GD, step: 7 });

    // Step 8 — Right wing & fire breath
    // Right wing (mirror)
    b.push({ id: "3005", x: 6, y: wingY + 1, z: 6, rot: 0, color: G, step: 8 });
    b.push({ id: "3005", x: 6, y: wingY + 2, z: 6, rot: 0, color: G, step: 8 });
    b.push({ id: "3005", x: 6, y: wingY + 3, z: 7, rot: 0, color: G, step: 8 });
    b.push(...diagonal({ x0: 6, z0: 7, dx: 0, dz: 1, length: 6, yStart: wingY, dy: 0, color: G, step: 8 }));
    b.push(...diagonal({ x0: 8, z0: 7, dx: 0, dz: 1, length: 5, yStart: wingY, dy: 0, color: G, step: 8 }));
    b.push(...diagonal({ x0: 10, z0: 6, dx: 0, dz: 1, length: 4, yStart: wingY, dy: 0, color: G, step: 8 }));
    for (let i = 0; i < 6; i++) {
      const wz = 6 + i;
      const span = Math.max(1, 6 - i);
      for (let x = 6; x < 6 + span; x++) {
        b.push({ id: "3005", x, y: wingY, z: wz, rot: 0, color: GL, step: 8 });
      }
    }
    b.push({ id: "3005", x: 6, y: wingY, z: 12, rot: 0, color: GD, step: 8 });
    b.push({ id: "3005", x: 8, y: wingY, z: 11, rot: 0, color: GD, step: 8 });

    // Fire breath (gout from mouth toward treasure)
    for (let i = 0; i < 5; i++) {
      const fx = -6 - i;
      b.push({ id: "3005", x: fx, y: 9, z: 3, rot: 0, color: i < 2 ? RED : ORANGE, step: 8 });
      if (i < 4) b.push({ id: "3005", x: fx, y: 8, z: 3, rot: 0, color: i < 1 ? ORANGE : YELLOW, step: 8 });
      if (i < 3) b.push({ id: "3005", x: fx, y: 9, z: 2, rot: 0, color: YELLOW, step: 8 });
      if (i < 3) b.push({ id: "3005", x: fx, y: 9, z: 4, rot: 0, color: YELLOW, step: 8 });
    }
    // Smoke wisps
    b.push({ id: "3005", x: -10, y: 10, z: 3, rot: 0, color: GRAY_LT, step: 8 });
    b.push({ id: "3005", x: -9, y: 10, z: 2, rot: 0, color: GRAY_LT, step: 8 });

    return b;
  },
},

]; // end TEMPLATES

export const THEMES = [
  { id: "all",        label: "All themes" },
  { id: "buildings",  label: "Buildings" },
  { id: "vehicles",   label: "Vehicles" },
  { id: "space",      label: "Space" },
  { id: "creatures",  label: "Creatures" },
];