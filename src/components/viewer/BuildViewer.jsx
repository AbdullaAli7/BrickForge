import { useState } from "react";
import {
  ChevronLeft, ChevronRight, FileDown, CheckSquare,
  Square, X, AlertTriangle, List, Loader2
} from "lucide-react";
import { generateBuildSteps } from "../../engine/fitter.js";
import { BRICK_TYPES } from "../../data/templates.js";
import { exportInstructionPDF } from "../../utils/exportPDF.js";
import ThreeDViewer from "./ThreeDViewer.jsx";

function MissingWarning({ missing }) {
  if (!missing?.length) return null;
  return (
    <div className="missing-banner">
      <AlertTriangle size={15} />
      <div>
        <strong>Missing pieces for this build:</strong>
        <ul className="missing-list">
          {missing.map(m => (
            <li key={m.brickId}>
              {m.brickLabel}: need {m.shortfall} more (have {m.have}/{m.needed})
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function PartsList({ fitResult }) {
  const rows = Object.entries(fitResult.needed)
    .map(([brickId, count]) => ({
      brickId,
      brickLabel: BRICK_TYPES[brickId]?.label ?? brickId,
      needed: count,
      fulfilled: fitResult.fulfilled[brickId] ?? 0,
      missing: (fitResult.missing ?? []).find(m => m.brickId === brickId),
    }))
    .sort((a, b) => b.needed - a.needed);

  return (
    <div className="parts-list">
      <div className="parts-list-header">
        <span>Brick type</span>
        <span>Need</span>
        <span>Status</span>
      </div>
      {rows.map(({ brickId, brickLabel, needed, missing }) => (
        <div key={brickId} className={`parts-row ${missing ? "parts-row-missing" : ""}`}>
          <div className="parts-brick-info">
            <span className="parts-brick-label">{brickLabel}</span>
            <span className="parts-brick-id">#{brickId}</span>
          </div>
          <span className="parts-qty">{needed}×</span>
          <span className={`parts-status ${missing ? "status-missing" : "status-ok"}`}>
            {missing ? `Need ${missing.shortfall} more` : "✓ Have enough"}
          </span>
        </div>
      ))}
      <div className="parts-total-row">
        <span>Total pieces</span>
        <span className="parts-total-count">{fitResult.totalBricksNeeded}</span>
        <span />
      </div>
    </div>
  );
}

export default function BuildViewer({ template, fitResult, onClose }) {
  const steps = generateBuildSteps(template, fitResult);
  const [currentStep, setCurrentStep] = useState(0);
  const [checked, setChecked]         = useState(() => new Array(steps.length).fill(false));
  const [activeTab, setActiveTab]     = useState("build");
  const [exporting, setExporting]     = useState(false);

  const step    = steps[currentStep];
  const allDone = checked.every(Boolean);

  const toggleCheck = (i) => {
    const next = [...checked];
    next[i] = !next[i];
    setChecked(next);
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try { await exportInstructionPDF(template, fitResult, steps); }
    finally { setExporting(false); }
  };

  return (
    <div className="build-viewer">
      <div className="bv-header">
        <div className="bv-title">
          <span className="bv-thumb">{template.thumbnail}</span>
          <div>
            <h2>{template.name}</h2>
            <span className="bv-sub">
              {fitResult.totalBricksNeeded} pieces · {steps.length} steps
              {!fitResult.canBuild && ` · ${fitResult.completeness}% parts available`}
            </span>
          </div>
        </div>
        <div className="bv-actions">
          <div className="bv-tabs">
            <button className={`bv-tab ${activeTab === "build" ? "active" : ""}`} onClick={() => setActiveTab("build")}>Build</button>
            <button className={`bv-tab ${activeTab === "parts" ? "active" : ""}`} onClick={() => setActiveTab("parts")}><List size={13} /> Parts</button>
          </div>
          <button className="icon-btn" onClick={handleExportPDF} disabled={exporting} title="Download PDF">
            {exporting ? <Loader2 size={16} className="spin" /> : <FileDown size={18} />}
          </button>
          <button className="icon-btn" onClick={onClose} title="Close"><X size={18} /></button>
        </div>
      </div>

      {!fitResult.canBuild && <MissingWarning missing={fitResult.missing} />}

      {activeTab === "parts" && <PartsList fitResult={fitResult} />}

      {activeTab === "build" && (
        <>
          <div className="progress-track">
            {steps.map((_, i) => (
              <button key={i} className={`progress-dot ${i === currentStep ? "active" : ""} ${checked[i] ? "done" : ""}`}
                onClick={() => setCurrentStep(i)} title={`Step ${i + 1}`} />
            ))}
          </div>

          <div className="step-card">
            <div className="step-visual-3d">
              <ThreeDViewer template={template} steps={steps} currentStep={currentStep} />
            </div>

            <div className="step-info">
              <div className="step-num">Step {currentStep + 1} of {steps.length}</div>
              <div className="step-zone">{step.label}</div>
              <p className="step-instruction">{step.instruction}</p>

              <div className="step-bricks">
                <span className="step-brick-count">{step.brickCount}</span>
                <span className="step-brick-label"> pieces in this step</span>
              </div>

              {/* Per-step parts breakdown */}
              <div className="step-parts-mini">
                {Object.entries(step.partCounts).map(([id, count]) => (
                  <span key={id} className="step-part-chip">
                    {count}× {BRICK_TYPES[id]?.label ?? id}
                  </span>
                ))}
              </div>

              <button className={`check-btn ${checked[currentStep] ? "checked" : ""}`}
                onClick={() => toggleCheck(currentStep)}>
                {checked[currentStep]
                  ? <><CheckSquare size={16} /> Done</>
                  : <><Square size={16} /> Mark complete</>}
              </button>
            </div>
          </div>

          <div className="step-nav">
            <button className="nav-btn" onClick={() => setCurrentStep(s => Math.max(0, s - 1))} disabled={currentStep === 0}>
              <ChevronLeft size={18} /> Previous
            </button>
            {allDone && <div className="all-done">🎉 Build complete!</div>}
            <button className="nav-btn primary" onClick={() => setCurrentStep(s => Math.min(steps.length - 1, s + 1))}
              disabled={currentStep === steps.length - 1}>
              Next <ChevronRight size={18} />
            </button>
          </div>

          <details className="steps-overview">
            <summary>All steps</summary>
            <div className="overview-list">
              {steps.map((s, i) => (
                <button key={i} className={`overview-row ${i === currentStep ? "active" : ""}`} onClick={() => setCurrentStep(i)}>
                  <button className={`mini-check ${checked[i] ? "checked" : ""}`}
                    onClick={e => { e.stopPropagation(); toggleCheck(i); }}>
                    {checked[i] ? <CheckSquare size={13} /> : <Square size={13} />}
                  </button>
                  <span className="ov-num">{i + 1}.</span>
                  <span className="ov-zone">{s.label}</span>
                  <span className="ov-count">{s.brickCount} pieces</span>
                </button>
              ))}
            </div>
          </details>
        </>
      )}
    </div>
  );
}
