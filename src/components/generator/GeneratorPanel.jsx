import { useState, useMemo } from "react";
import { Wand2, CheckCircle2, AlertCircle, ChevronRight, Filter } from "lucide-react";
import { TEMPLATES, THEMES } from "../../data/templates.js";
import { scoreAllTemplates } from "../../engine/fitter.js";
import { useInventory } from "../../hooks/useInventory.jsx";
import MOCMatches from "./MOCMatches.jsx";

function CompletionBar({ pct }) {
  const color = pct === 100 ? "var(--green)" : pct >= 60 ? "var(--amber)" : "var(--red)";
  return (
    <div className="completion-bar-track">
      <div className="completion-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function TemplateCard({ template, result, onSelect }) {
  const canBuild = result.canBuild;
  return (
    <button className={`template-card ${canBuild ? "buildable" : ""}`} onClick={() => onSelect(template, result)}>
      <div className="tc-thumb">{template.thumbnail}</div>
      <div className="tc-body">
        <div className="tc-top">
          <span className="tc-name">{template.name}</span>
          {canBuild
            ? <CheckCircle2 size={15} className="icon-green" />
            : <AlertCircle size={15} className="icon-dim" />}
        </div>
        <span className="tc-theme">{template.theme} · {template.difficulty}</span>
        <CompletionBar pct={result.completeness} />
        <span className="tc-pct">{result.completeness}% complete · {result.totalBricksNeeded} pieces</span>
      </div>
      <ChevronRight size={16} className="tc-arrow" />
    </button>
  );
}

export default function GeneratorPanel({ onBuild }) {
  const { flatInventory, totalPieces } = useInventory();
  const [theme, setTheme] = useState("all");

  const scored = useMemo(
    () => scoreAllTemplates(TEMPLATES, flatInventory),
    [flatInventory]
  );

  const filtered = theme === "all"
    ? scored
    : scored.filter(s => s.template.theme === theme);

  const buildableCount = scored.filter(s => s.result.canBuild).length;

  return (
    <div className="generate-col">
      {/* Template generator panel */}
      <div className="panel generator-panel">
        <div className="panel-header">
          <div className="panel-title">
            <Wand2 size={18} />
            <h2>Generate</h2>
          </div>
          {totalPieces > 0 && (
            <span className="badge badge-green">{buildableCount} buildable</span>
          )}
        </div>

        {totalPieces === 0 ? (
          <div className="empty-state">
            <Wand2 size={32} strokeWidth={1.2} />
            <p>Add bricks to your inventory first.</p>
            <p className="hint">Then we'll show you what you can build.</p>
          </div>
        ) : (
          <>
            <div className="theme-filter">
              <Filter size={14} />
              <div className="theme-pills">
                {THEMES.map(t => (
                  <button
                    key={t.id}
                    className={`theme-pill ${theme === t.id ? "active" : ""}`}
                    onClick={() => setTheme(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="template-list">
              {filtered.length === 0 && (
                <div className="empty-state"><p>No templates in this theme.</p></div>
              )}
              {filtered.map(({ template, result }) => (
                <TemplateCard
                  key={template.id}
                  template={template}
                  result={result}
                  onSelect={onBuild}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* MOC matches — shown below templates when inventory exists */}
      {totalPieces >= 10 && <MOCMatches />}
    </div>
  );
}
