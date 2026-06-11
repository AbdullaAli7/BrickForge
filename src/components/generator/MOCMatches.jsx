import { ExternalLink, Loader2, Star, Package, AlertCircle } from "lucide-react";
import { useMOCMatches, useSetMatches } from "../../hooks/useMOCMatches.js";
import { useInventory } from "../../hooks/useInventory.jsx";

const HAS_KEY = !!import.meta.env.VITE_REBRICKABLE_API_KEY;

// ── Shared ────────────────────────────────────────────────────────

function PctBar({ pct }) {
  if (pct === null || pct === undefined) return null;
  const color =
    pct >= 80 ? "var(--green)" :
    pct >= 40 ? "var(--amber)" : "var(--red)";
  return (
    <div className="moc-bar-track">
      <div className="moc-bar-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

function MatchLabel({ item }) {
  if (item._loading) {
    return (
      <span className="moc-pct moc-pct-loading">
        <Loader2 size={10} className="spin" /> Checking parts…
      </span>
    );
  }
  if (item._pct !== null && item._pct !== undefined) {
    const detail = item._matched != null
      ? `${item._matched}/${item._total} pieces · ${item._matchedTypes}/${item._totalTypes} types`
      : "";
    return (
      <>
        <PctBar pct={item._pct} />
        <span className="moc-pct">
          {item._pct}% match{detail && <span className="moc-pct-detail"> — {detail}</span>}
        </span>
      </>
    );
  }
  return <span className="moc-pct">{item.num_parts} pieces</span>;
}

function Thumbnail({ url, alt, placeholder = "🧱" }) {
  return (
    <div className="moc-thumb">
      {url
        ? <img src={url} alt={alt} onError={e => { e.target.style.display = "none"; }} />
        : <span className="moc-thumb-placeholder">{placeholder}</span>}
    </div>
  );
}

function LoadingRow() {
  return (
    <div className="moc-loading">
      <Loader2 size={16} className="spin" />
      <span>Searching Rebrickable…</span>
    </div>
  );
}

function ErrorRow({ message }) {
  return (
    <div className="moc-error">
      <AlertCircle size={14} />
      <span>{message}</span>
    </div>
  );
}

function EmptyRow({ message }) {
  return (
    <div className="empty-state" style={{ padding: "16px" }}>
      <p className="hint">{message}</p>
    </div>
  );
}

// ── Set card ──────────────────────────────────────────────────────

function SetCard({ set }) {
  const buildable = set._pct === 100;
  return (
    <a href={set._url} target="_blank" rel="noreferrer"
       className={`moc-card ${buildable ? "moc-buildable" : ""}`}>
      <Thumbnail url={set.img_url} alt={set.name} placeholder="🏗️" />
      <div className="moc-info">
        <div className="moc-name-row">
          <span className="moc-name">{set.name}</span>
          {buildable && <Star size={12} className="moc-star" />}
        </div>
        <span className="moc-meta">
          Set {set.set_num} · {set.year} · {set.num_parts} pieces
        </span>
        <MatchLabel item={set} />
      </div>
      <ExternalLink size={13} className="moc-link-icon" />
    </a>
  );
}

// ── MOC card ──────────────────────────────────────────────────────

function MOCCard({ moc }) {
  const buildable = moc._pct === 100;
  return (
    <a href={moc._url} target="_blank" rel="noreferrer"
       className={`moc-card ${buildable ? "moc-buildable" : ""}`}>
      <Thumbnail url={moc.moc_img_url} alt={moc.name} />
      <div className="moc-info">
        <div className="moc-name-row">
          <span className="moc-name">{moc.name}</span>
          {buildable && <Star size={12} className="moc-star" />}
        </div>
        <span className="moc-meta">
          by {moc.designer_username} · {moc.num_parts} pieces
        </span>
        {moc._fromSet && (
          <span className="moc-from-set">Alt build of {moc._fromSet}</span>
        )}
        <MatchLabel item={moc} />
      </div>
      <ExternalLink size={13} className="moc-link-icon" />
    </a>
  );
}

// ── Section ───────────────────────────────────────────────────────

function Section({ icon: Icon, title, badge, children }) {
  return (
    <div className="rb-section">
      <div className="rb-section-header">
        <div className="panel-title">
          <Icon size={15} />
          <span>{title}</span>
        </div>
        {badge && <span className="badge">{badge}</span>}
      </div>
      {children}
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────

export default function MOCMatches() {
  const { flatInventory, totalPieces } = useInventory();
  const { mocs, loading: mocLoading, error: mocError } = useMOCMatches(flatInventory);
  const { sets, loading: setLoading, error: setError } = useSetMatches(flatInventory);

  if (totalPieces < 5) return null;

  if (!HAS_KEY) {
    return (
      <div className="panel moc-panel">
        <div className="panel-header">
          <div className="panel-title"><Star size={18} /><h2>Rebrickable</h2></div>
        </div>
        <div className="moc-no-key">
          <p>Add your free Rebrickable API key to find community MOCs and official sets that match your inventory.</p>
          <code className="moc-key-hint">VITE_REBRICKABLE_API_KEY=your_key</code>
          <a href="https://rebrickable.com/api/" target="_blank" rel="noreferrer" className="moc-key-link">
            Get a free key → <ExternalLink size={12} />
          </a>
        </div>
      </div>
    );
  }

  const checkedSets = sets.filter(s => s._pct !== null);
  const checkedMocs = mocs.filter(m => m._pct !== null);

  return (
    <div className="panel moc-panel">
      <div className="panel-header">
        <div className="panel-title"><Star size={18} /><h2>Rebrickable</h2></div>
        <a href="https://rebrickable.com/build/" target="_blank" rel="noreferrer" className="rb-build-link">
          Full search <ExternalLink size={12} />
        </a>
      </div>

      <Section icon={Package} title="Official Sets"
               badge={checkedSets.length > 0
                 ? `${checkedSets.filter(s => s._pct > 0).length} with matching parts` : undefined}>
        {setLoading && <LoadingRow />}
        {!setLoading && setError && <ErrorRow message={setError} />}
        {!setLoading && !setError && sets.length === 0 && (
          <EmptyRow message="No sets found in your piece count range." />
        )}
        {sets.slice(0, 6).map(s => <SetCard key={s.set_num} set={s} />)}
      </Section>

      <Section icon={Star} title="Alternate MOC Builds"
               badge={checkedMocs.length > 0
                 ? `${checkedMocs.filter(m => m._pct > 0).length} with matching parts` : undefined}>
        {mocLoading && <LoadingRow />}
        {!mocLoading && mocError && <ErrorRow message={mocError} />}
        {!mocLoading && !mocError && mocs.length === 0 && (
          <EmptyRow message="No alternate MOC builds found for sets in your range." />
        )}
        {mocs.slice(0, 8).map(m => <MOCCard key={m.moc_id} moc={m} />)}
      </Section>
    </div>
  );
}