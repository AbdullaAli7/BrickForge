import { BRICK_TYPES } from "../data/templates.js";

/**
 * Piece Fitting Engine v3
 *
 * Full substitution table covering all brick families:
 *   - Standard bricks can swap within their width class
 *   - Plates can swap within their width class
 *   - Masonry/grille bricks fall back to standard 1×2
 *   - Slopes fall back to standard bricks of same footprint
 *   - Round bricks fall back to standard equivalents
 */

export function countParts(template) {
  const bricks = template.build();
  const counts = {};
  for (const b of bricks) counts[b.id] = (counts[b.id] ?? 0) + 1;
  return counts;
}

/**
 * Substitution table — ordered by preference (closest match first).
 * Cross-family subs go standard brick → plate → round as last resort.
 */
const SUBS = {
  // ── 1-wide bricks ──
  "3005": ["3004","3062"],            // 1×1 → 1×2, round 1×1
  "3004": ["3622","3005","98283","2877"],  // 1×2 → 1×3, 1×1, masonry, grille
  "3622": ["3010","3004"],            // 1×3 → 1×4, 1×2
  "3010": ["3622","3009","3004"],     // 1×4 → 1×3, 1×6, 1×2
  "3009": ["3010","3008","3004"],     // 1×6 → 1×4, 1×8, 1×2
  "3008": ["3009","3010","6111"],     // 1×8 → 1×6, 1×4, 1×10
  "6111": ["3008","3009"],            // 1×10 → 1×8, 1×6

  // ── 2-wide bricks ──
  "3003": ["3001","3005"],            // 2×2 → 2×4, 1×1
  "3002": ["3001","3003","3622"],     // 2×3 → 2×4, 2×2, 1×3
  "3001": ["2456","3003","3010"],     // 2×4 → 2×6, 2×2, 1×4
  "2456": ["3001","3007","3009"],     // 2×6 → 2×4, 2×8, 1×6
  "3007": ["2456","3001"],            // 2×8 → 2×6, 2×4
  "3006": ["3007","2456"],            // 2×10 → 2×8, 2×6

  // ── 1-wide plates ──
  "3024": ["3023","3005"],            // plate 1×1 → plate 1×2, brick 1×1
  "3023": ["3710","3024","3004"],     // plate 1×2 → plate 1×4, plate 1×1, brick 1×2
  "3623": ["3710","3023"],            // plate 1×3 → plate 1×4, plate 1×2
  "3710": ["3666","3623","3023","3010"],  // plate 1×4 → plate 1×6, 1×3, 1×2, brick 1×4
  "3666": ["3710","3460","3009"],     // plate 1×6 → plate 1×4, 1×8, brick 1×6
  "3460": ["3666","3710"],            // plate 1×8 → plate 1×6, plate 1×4

  // ── 2-wide plates ──
  "3022": ["3020","3024","3003"],     // plate 2×2 → plate 2×4, plate 1×1, brick 2×2
  "3021": ["3020","3022"],            // plate 2×3 → plate 2×4, plate 2×2
  "3020": ["3795","3022","3001"],     // plate 2×4 → plate 2×6, plate 2×2, brick 2×4
  "3795": ["3020","3034","2456"],     // plate 2×6 → plate 2×4, plate 2×8, brick 2×6
  "3034": ["3795","3020"],            // plate 2×8 → plate 2×6, plate 2×4
  "4477": ["3034","3795"],            // plate 2×10 → plate 2×8, plate 2×6

  // ── Slopes ──
  "3040": ["3004","3023"],            // slope 1×2 → brick 1×2, plate 1×2
  "3039": ["3003","3022"],            // slope 2×2 → brick 2×2, plate 2×2
  "3037": ["3001","3020","3298"],     // slope 2×4 → brick 2×4, plate 2×4, slope 2×3
  "3298": ["3002","3037","3039"],     // slope 2×3 → brick 2×3, slope 2×4, slope 2×2
  "3665": ["3004","3040"],            // inv slope 1×2 → brick 1×2, slope 1×2
  "3660": ["3003","3039"],            // inv slope 2×2 → brick 2×2, slope 2×2

  // ── Round ──
  "3062": ["3005"],                   // round 1×1 → brick 1×1
  "3941": ["3003"],                   // round 2×2 → brick 2×2

  // ── Modified ──
  "98283":["3004","2877"],            // masonry 1×2 → brick 1×2, grille
  "2877": ["3004","98283"],           // grille 1×2 → brick 1×2, masonry
  "4070": ["3005"],                   // headlight → 1×1
  "87087":["3004"],                   // side stud → 1×2
  "3245": ["3004"],                   // double height → 1×2
  "2357": ["3001"],                   // corner → 2×4
};

export function fitTemplate(template, inventory) {
  const needed    = countParts(template);
  const remaining = { ...inventory };
  const fulfilled = {};
  const missing   = [];

  for (const [brickId, count] of Object.entries(needed)) {
    const have = remaining[brickId] ?? 0;

    if (have >= count) {
      remaining[brickId] = have - count;
      fulfilled[brickId] = (fulfilled[brickId] ?? 0) + count;
    } else {
      let deficit = count - have;
      fulfilled[brickId] = (fulfilled[brickId] ?? 0) + have;
      remaining[brickId] = 0;

      const subs = SUBS[brickId] ?? [];
      for (const sub of subs) {
        if (deficit <= 0) break;
        const subHave = remaining[sub] ?? 0;
        const use = Math.min(subHave, deficit);
        if (use > 0) {
          remaining[sub] -= use;
          fulfilled[sub] = (fulfilled[sub] ?? 0) + use;
          deficit -= use;
        }
      }

      if (deficit > 0) {
        missing.push({
          brickId,
          brickLabel: BRICK_TYPES[brickId]?.label ?? brickId,
          needed: count,
          have: count - deficit,
          shortfall: deficit,
        });
      }
    }
  }

  const totalNeeded    = Object.values(needed).reduce((s, v) => s + v, 0);
  const totalFulfilled = Object.values(fulfilled).reduce((s, v) => s + v, 0);
  const completeness   = totalNeeded === 0 ? 0 : Math.round((totalFulfilled / totalNeeded) * 100);

  return {
    templateId: template.id,
    canBuild: missing.length === 0,
    completeness: Math.min(completeness, 100),
    needed, fulfilled, missing,
    totalBricksUsed: totalFulfilled,
    totalBricksNeeded: totalNeeded,
    remainingInventory: remaining,
  };
}

export function scoreAllTemplates(templates, inventory) {
  return templates
    .map(template => ({ template, result: fitTemplate(template, inventory) }))
    .sort((a, b) => b.result.completeness - a.result.completeness);
}

export function generateBuildSteps(template, fitResult) {
  const bricks     = template.build();
  const stepMap    = {};
  const stepLabels = template.stepLabels ?? [];

  for (const b of bricks) {
    if (!stepMap[b.step]) stepMap[b.step] = { bricks: [], partCounts: {} };
    stepMap[b.step].bricks.push(b);
    stepMap[b.step].partCounts[b.id] = (stepMap[b.step].partCounts[b.id] ?? 0) + 1;
  }

  return Object.keys(stepMap).map(Number).sort((a, b) => a - b).map((num, index) => {
    const data        = stepMap[num];
    const partCounts  = data.partCounts;
    const totalPieces = Object.values(partCounts).reduce((s, v) => s + v, 0);
    const mainBrick   = Object.entries(partCounts).sort((a, b) => b[1] - a[1])[0];
    const mainLabel   = mainBrick ? (BRICK_TYPES[mainBrick[0]]?.label ?? mainBrick[0]) : "Bricks";

    return {
      stepNumber: num,
      label: stepLabels[index] ?? `Step ${num}`,
      instruction: stepLabels[index] ?? `Build step ${num}`,
      brickCount: totalPieces,
      brickLabel: `${totalPieces} bricks (mostly ${mainLabel})`,
      partCounts, bricks: data.bricks, completed: false,
    };
  });
}