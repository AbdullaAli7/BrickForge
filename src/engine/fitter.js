import { BRICK_TYPES } from "../data/templates.js";

/**
 * Piece Fitting Engine v2 — Brick-by-brick
 *
 * Templates now have a build() function that returns individual placements.
 * The fitter counts needed parts, checks against inventory, and handles substitutions.
 */

/**
 * Count bricks needed by a template.
 * @returns {{ [brickId]: count }}
 */
export function countParts(template) {
  const bricks = template.build();
  const counts = {};
  for (const b of bricks) {
    counts[b.id] = (counts[b.id] ?? 0) + 1;
  }
  return counts;
}

/**
 * Substitution table: which bricks can replace which.
 * Key = needed brick, Values = ordered list of alternatives.
 */
const SUBSTITUTIONS = {
  "3001": ["2456", "3010", "3004", "3003"], // 2x4 → 2x6, 1x4, 1x2, 2x2
  "3010": ["3001", "3009", "3004"],          // 1x4 → 2x4, 1x6, 1x2
  "3004": ["3010", "3001", "3005"],          // 1x2 → 1x4, 2x4, 1x1
  "3005": ["3004", "3003"],                  // 1x1 → 1x2, 2x2
  "3003": ["3001", "3005"],                  // 2x2 → 2x4, 1x1
  "3009": ["3010", "3001", "3008"],          // 1x6 → 1x4, 2x4, 1x8
  "3008": ["3009", "3010"],                  // 1x8 → 1x6, 1x4
  "2456": ["3001", "3010"],                  // 2x6 → 2x4, 1x4
};

/**
 * Fit a template against the user's inventory.
 *
 * @param {object} template
 * @param {object} inventory - { [brickId]: quantity }
 * @returns {FitResult}
 */
export function fitTemplate(template, inventory) {
  const needed    = countParts(template);
  const remaining = { ...inventory };
  const fulfilled = {};
  const missing   = [];

  for (const [brickId, count] of Object.entries(needed)) {
    const have = remaining[brickId] ?? 0;

    if (have >= count) {
      // Exact match
      remaining[brickId] = have - count;
      fulfilled[brickId] = count;
    } else {
      // Try to fill the gap with the primary brick first, then substitutes
      let deficit = count - have;
      fulfilled[brickId] = have;
      remaining[brickId] = 0;

      // Try substitutions
      const subs = SUBSTITUTIONS[brickId] ?? [];
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
    templateId:   template.id,
    canBuild:     missing.length === 0,
    completeness: Math.min(completeness, 100),
    needed,
    fulfilled,
    missing,
    totalBricksUsed: totalFulfilled,
    totalBricksNeeded: totalNeeded,
    remainingInventory: remaining,
  };
}

/**
 * Score all templates and return sorted by completeness.
 */
export function scoreAllTemplates(templates, inventory) {
  return templates
    .map(template => ({
      template,
      result: fitTemplate(template, inventory),
    }))
    .sort((a, b) => b.result.completeness - a.result.completeness);
}

/**
 * Generate ordered build steps from the template.
 *
 * Groups bricks by step number and counts parts per step.
 */
export function generateBuildSteps(template, fitResult) {
  const bricks    = template.build();
  const stepMap   = {};
  const stepLabels = template.stepLabels ?? [];

  for (const b of bricks) {
    if (!stepMap[b.step]) {
      stepMap[b.step] = { bricks: [], partCounts: {} };
    }
    stepMap[b.step].bricks.push(b);
    stepMap[b.step].partCounts[b.id] = (stepMap[b.step].partCounts[b.id] ?? 0) + 1;
  }

  const stepNumbers = Object.keys(stepMap).map(Number).sort((a, b) => a - b);

  return stepNumbers.map((num, index) => {
    const data       = stepMap[num];
    const partCounts = data.partCounts;
    const totalPieces = Object.values(partCounts).reduce((s, v) => s + v, 0);

    // Find the most-used brick in this step for the label
    const mainBrick  = Object.entries(partCounts).sort((a, b) => b[1] - a[1])[0];
    const mainLabel  = mainBrick ? (BRICK_TYPES[mainBrick[0]]?.label ?? mainBrick[0]) : "Bricks";

    return {
      stepNumber:   num,
      label:        stepLabels[index] ?? `Step ${num}`,
      instruction:  stepLabels[index] ?? `Build step ${num}`,
      brickCount:   totalPieces,
      brickLabel:   `${totalPieces} bricks (mostly ${mainLabel})`,
      partCounts,
      bricks:       data.bricks,
      completed:    false,
    };
  });
}
