import { jsPDF } from "jspdf";
import { BRICK_TYPES } from "../data/templates.js";

// ── Design constants ─────────────────────────────────────────────
const C = {
  yellow:  [245, 197, 24],
  yellowD: [212, 167, 10],
  red:     [230, 59,  46],
  blue:    [0,   87,  168],
  green:   [30,  140, 42],
  black:   [26,  26,  24],
  gray:    [92,  92,  88],
  lightGray:[220,218,214],
  bg:      [242, 242, 240],
  white:   [255, 255, 255],
};

const PAGE_W = 210; // A4 mm
const PAGE_H = 297;
const M      = 14;  // margin

// ── Helpers ──────────────────────────────────────────────────────
function setFont(doc, size, style = "normal", color = C.black) {
  doc.setFontSize(size);
  doc.setFont("helvetica", style);
  doc.setTextColor(...color);
}

function rect(doc, x, y, w, h, fill, stroke) {
  if (fill) { doc.setFillColor(...fill); doc.rect(x, y, w, h, "F"); }
  if (stroke) { doc.setDrawColor(...stroke); doc.rect(x, y, w, h, "S"); }
}

function roundRect(doc, x, y, w, h, r, fill, stroke) {
  if (fill) { doc.setFillColor(...fill); doc.roundedRect(x, y, w, h, r, r, "F"); }
  if (stroke) { doc.setDrawColor(...stroke); doc.roundedRect(x, y, w, h, r, r, "S"); }
}

function hline(doc, x1, x2, y, color = C.lightGray, w = 0.3) {
  doc.setDrawColor(...color);
  doc.setLineWidth(w);
  doc.line(x1, y, x2, y);
}

// ── Bill of materials ─────────────────────────────────────────────
function buildBOM(fitResult) {
  const totals = fitResult.needed ?? {};
  return Object.entries(totals)
    .map(([id, qty]) => ({ id, label: BRICK_TYPES[id]?.label ?? id, qty }))
    .sort((a, b) => b.qty - a.qty);
}

// ── Cover page ────────────────────────────────────────────────────
function drawCover(doc, template, fitResult) {
  // Yellow header band
  rect(doc, 0, 0, PAGE_W, 52, C.yellow);

  // BrickForge wordmark
  setFont(doc, 11, "bold", C.yellowD);
  doc.text("BRICKFORGE", M, 14);

  // Divider
  hline(doc, M, PAGE_W - M, 18, C.yellowD, 0.6);

  // Model name — large
  setFont(doc, 32, "bold", C.black);
  const nameLines = doc.splitTextToSize(template.name.toUpperCase(), PAGE_W - M * 2);
  doc.text(nameLines, M, 35);

  // Emoji circle
  const emojiX = PAGE_W - M - 22;
  roundRect(doc, emojiX, 6, 28, 28, 5, C.white);
  setFont(doc, 18, "normal", C.black);
  doc.text(template.thumbnail, emojiX + 14, 24, { align: "center" });

  // Stats row
  const statsY = 62;
  const stats = [
    { label: "Difficulty", value: template.difficulty },
    { label: "Steps",      value: String(template.steps.length) },
    { label: "Bricks",     value: String(fitResult.totalBricksNeeded) },
    { label: "Complete",   value: fitResult.canBuild ? "100%" : `${fitResult.completeness}%` },
  ];

  const cellW = (PAGE_W - M * 2) / stats.length;
  stats.forEach(({ label, value }, i) => {
    const cx = M + i * cellW;
    roundRect(doc, cx, statsY, cellW - 3, 22, 3, C.bg);
    setFont(doc, 7, "normal", C.gray);
    doc.text(label.toUpperCase(), cx + (cellW - 3) / 2, statsY + 7, { align: "center" });
    setFont(doc, 13, "bold", C.black);
    doc.text(value, cx + (cellW - 3) / 2, statsY + 17, { align: "center" });
  });

  // Description
  setFont(doc, 10, "normal", C.gray);
  const descLines = doc.splitTextToSize(template.description, PAGE_W - M * 2);
  doc.text(descLines, M, 96);

  // Parts needed header
  const bomY = 112;
  setFont(doc, 9, "bold", C.black);
  doc.text("PARTS NEEDED", M, bomY);
  hline(doc, M, PAGE_W - M, bomY + 2, C.yellow, 1.5);

  const bom = buildBOM(fitResult);
  let bomCurY = bomY + 10;
  const colW  = (PAGE_W - M * 2) / 3;

  bom.forEach(({ id, label, qty }, i) => {
    const col = i % 3;
    const row = Math.floor(i / 3);
    const bx  = M + col * colW;
    const by  = bomCurY + row * 10;

    if (by > PAGE_H - 30) return; // overflow guard

    roundRect(doc, bx, by - 4, colW - 4, 9, 2, C.bg);

    // Qty badge
    roundRect(doc, bx + 1, by - 3, 12, 7, 2, C.yellow);
    setFont(doc, 7, "bold", C.black);
    doc.text(`${qty}×`, bx + 7, by + 1, { align: "center" });

    setFont(doc, 8, "normal", C.black);
    doc.text(label, bx + 16, by + 1);
  });

  // Missing pieces warning
  if (!fitResult.canBuild && fitResult.missing.length > 0) {
    const warnY = PAGE_H - 60;
    rect(doc, M, warnY, PAGE_W - M * 2, fitResult.missing.length * 9 + 18, [255, 248, 230]);
    doc.setDrawColor(...C.yellowD);
    doc.setLineWidth(0.3);
    doc.rect(M, warnY, PAGE_W - M * 2, fitResult.missing.length * 9 + 18);

    setFont(doc, 8, "bold", [124, 90, 0]);
    doc.text("⚠  Missing pieces — buy or substitute:", M + 4, warnY + 9);
    fitResult.missing.forEach((m, i) => {
      setFont(doc, 8, "normal", [124, 90, 0]);
      doc.text(
        `${m.brickLabel}: need ${m.shortfall} more (have ${m.have}/${m.needed})`,
        M + 8, warnY + 18 + i * 9
      );
    });
  }

  // Footer
  setFont(doc, 7, "normal", C.lightGray);
  doc.text("brickforge.app  ·  Free & open source", PAGE_W / 2, PAGE_H - 6, { align: "center" });
}

// ── Step pages ───────────────────────────────────────────────────
function drawStepsPage(doc, steps, pageIndex, totalPages) {
  const STEPS_PER_PAGE = 4;
  const start = pageIndex * STEPS_PER_PAGE;
  const pageSteps = steps.slice(start, start + STEPS_PER_PAGE);

  // Page header
  rect(doc, 0, 0, PAGE_W, 12, C.yellow);
  setFont(doc, 7, "bold", C.black);
  doc.text("BUILDING INSTRUCTIONS", M, 8);
  setFont(doc, 7, "normal", C.gray);
  doc.text(`Page ${pageIndex + 2} of ${totalPages + 1}`, PAGE_W - M, 8, { align: "right" });

  const stepH   = (PAGE_H - 22 - M) / STEPS_PER_PAGE;
  const numW    = 14;
  const badgeW  = 52;
  const infoX   = M + numW + 6;
  const contentW = PAGE_W - infoX - M;

  pageSteps.forEach((step, i) => {
    const sy = 16 + i * stepH;

    // Step container
    roundRect(doc, M, sy, PAGE_W - M * 2, stepH - 4, 3, C.bg);

    // Step number circle
    roundRect(doc, M + 2, sy + 4, numW - 4, numW - 4, (numW - 4) / 2, C.yellow);
    setFont(doc, 10, "bold", C.black);
    doc.text(String(step.stepNumber), M + 2 + (numW - 4) / 2, sy + 4 + (numW - 4) / 2 + 1, { align: "center" });

    // Zone name
    setFont(doc, 11, "bold", C.black);
    doc.text(step.label ?? `Step ${step.stepNumber}`, infoX, sy + 10);

    // Instruction text
    setFont(doc, 9, "normal", C.gray);
    const instrLines = doc.splitTextToSize(step.instruction, contentW - badgeW - 8);
    doc.text(instrLines, infoX, sy + 18);

    // Brick badge — right side
    const bx = PAGE_W - M - badgeW - 2;
    const by = sy + 5;
    roundRect(doc, bx, by, badgeW, stepH - 14, 3, C.white, C.lightGray);

    setFont(doc, 16, "bold", C.yellowD);
    doc.text(`${step.brickCount}`, bx + badgeW / 2, by + 14, { align: "center" });

    setFont(doc, 7, "normal", C.gray);
    doc.text("pieces", bx + badgeW / 2, by + 21, { align: "center" });

    // Checkbox
    roundRect(doc, bx + 8, by + stepH - 21, badgeW - 16, 8, 2, null, C.lightGray);
    setFont(doc, 7, "normal", C.gray);
    doc.text("□  Mark complete", bx + badgeW / 2, by + stepH - 15, { align: "center" });
  });
}

// ── Main export function ──────────────────────────────────────────
export async function exportInstructionPDF(template, fitResult, steps) {
  const doc = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait" });

  // Cover
  drawCover(doc, template, fitResult);

  // Step pages
  const STEPS_PER_PAGE = 4;
  const stepPageCount  = Math.ceil(steps.length / STEPS_PER_PAGE);
  const totalPages     = stepPageCount;

  for (let p = 0; p < stepPageCount; p++) {
    doc.addPage();
    drawStepsPage(doc, steps, p, totalPages);
  }

  const filename = `${template.name.toLowerCase().replace(/\s+/g, "-")}-instructions.pdf`;
  doc.save(filename);
}
