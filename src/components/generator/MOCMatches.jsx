import { ExternalLink, Loader2, Info, Star } from "lucide-react";
import { useMOCMatches } from "../../hooks/useMOCMatches.js";
import { useInventory } from "../../hooks/useInventory.jsx";

function PctBar({ pct }) {
  const color = pct === 100 ? "var(--green)" : pct >= 75 ? "var(--amber)" : "var(--red)";
  return (
    <div className="moc-bar-track">
      <div className="moc-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function MOCCard({ moc }) {
  const pct    = moc._pct ?? 0;
  const canBuild = pct >= 100;

  return (
    <a
      href={moc.moc_url}
      target="_blank"
      rel="noreferrer"
      className={`moc-card ${canBuild ? "moc-buildable" : ""}`}
    >
      <div className="moc-thumb">
        {moc.moc_img_url
          ? <img src={moc.moc_img_url} alt={moc.name} />
          : <span className="moc-thumb-placeholder">🧱</span>}
      </div>

      <div className="moc-info">
        <div className="moc-name-row">
          <span className="moc-name">{moc.name}</span>
          {canBuild && <Star size={12} className="moc-star" />}
        </div>
        <span className="moc-meta">by {moc.designer_username} · {moc.num_parts} parts</span>
        <PctBar pct={pct} />
        <span className="moc-pct">{pct}% of pieces available</span>
      </div>

      <ExternalLink size={14} className="moc-link-icon" />
    </a>
  );
}

export default function MOCMatches() {
  const { flatInventory, totalPieces } = useInventory();
  const { mocs, loading, error, isDemo } = useMOCMatches(flatInventory);

  if (totalPieces < 10) return null;

  return (
    <div className="panel moc-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Star size={18} />
          <h2>Community Builds</h2>
        </div>
        {isDemo && (
          <span className="demo-badge" title="Add a Rebrickable API key for real results">
            Demo
          </span>
        )}
      </div>

      <p className="moc-desc">
        Existing community MOC designs you can build with your pieces.
      </p>

      {loading && (
        <div className="moc-loading">
          <Loader2 size={18} className="spin" />
          <span>Checking Rebrickable…</span>
        </div>
      )}

      {!loading && mocs.length === 0 && (
        <div className="empty-state" style={{ padding: "20px" }}>
          <p>No close matches found yet.</p>
          <p className="hint">Add more bricks to unlock community designs.</p>
        </div>
      )}

      {!loading && mocs.length > 0 && (
        <div className="moc-list">
          {mocs.map(moc => <MOCCard key={moc.moc_id} moc={moc} />)}
        </div>
      )}

      {isDemo && !loading && (
        <div className="moc-demo-note">
          <Info size={12} />
          Demo results. Add a{" "}
          <a href="https://rebrickable.com/api/" target="_blank" rel="noreferrer">
            Rebrickable API key
          </a>{" "}
          for real MOC matching.
        </div>
      )}
    </div>
  );
}
