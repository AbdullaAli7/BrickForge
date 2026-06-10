import { useState } from "react";
import { Search, Plus, Trash2, Package, X } from "lucide-react";
import { usePartSearch } from "../../hooks/useRebrickable.js";
import { useInventory } from "../../hooks/useInventory.jsx";
import { BRICK_TYPES } from "../../data/templates.js";

function BrickIcon({ label }) {
  const short = label?.replace("Brick ", "").replace("Plate ", "P ") ?? "?";
  return (
    <div className="brick-icon" title={label}>
      <span>{short}</span>
    </div>
  );
}

function SearchResult({ part, onAdd }) {
  return (
    <button className="search-result" onClick={() => onAdd(part)}>
      {part.part_img_url
        ? <img src={part.part_img_url} alt={part.name} className="part-img" />
        : <BrickIcon label={part.name} />}
      <div className="search-result-info">
        <span className="part-name">{part.name}</span>
        <span className="part-num">#{part.part_num}</span>
      </div>
      <Plus size={16} className="add-icon" />
    </button>
  );
}

export default function InventoryPanel() {
  const { inventory, totalPieces, addBrick, setQty, removeBrick, clearInventory } = useInventory();
  const { results, loading, search } = usePartSearch();
  const [query, setQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  const handleQuery = (e) => {
    setQuery(e.target.value);
    search(e.target.value);
    setShowSearch(e.target.value.length > 0);
  };

  const handleAdd = (part) => {
    addBrick(part.part_num, part.name, part.part_img_url ?? null, 1);
    setQuery("");
    setShowSearch(false);
  };

  const handleQuickAdd = (brickId) => {
    const brick = BRICK_TYPES[brickId];
    addBrick(brickId, brick.label, null, 10);
  };

  const inventoryEntries = Object.entries(inventory);

  return (
    <div className="panel inventory-panel">
      <div className="panel-header">
        <div className="panel-title">
          <Package size={18} />
          <h2>My Bricks</h2>
        </div>
        <span className="badge">{totalPieces} pieces</span>
      </div>

      {/* Search */}
      <div className="search-wrap">
        <div className="search-box">
          <Search size={15} className="search-icon" />
          <input
            type="text"
            placeholder="Search bricks (e.g. 2x4, plate)…"
            value={query}
            onChange={handleQuery}
            onFocus={() => query.length > 0 && setShowSearch(true)}
            className="search-input"
          />
          {query && (
            <button className="clear-btn" onClick={() => { setQuery(""); setShowSearch(false); }}>
              <X size={14} />
            </button>
          )}
        </div>

        {showSearch && (
          <div className="search-dropdown">
            {loading && <div className="search-hint">Searching…</div>}
            {!loading && results.length === 0 && query.length > 1 && (
              <div className="search-hint">No parts found</div>
            )}
            {results.map(p => (
              <SearchResult key={p.part_num} part={p} onAdd={handleAdd} />
            ))}
          </div>
        )}
      </div>

      {/* Quick-add common bricks */}
      <div className="quick-add">
        <span className="quick-label">Quick add</span>
        <div className="quick-grid">
          {Object.entries(BRICK_TYPES).slice(0, 8).map(([id, brick]) => (
            <button key={id} className="quick-btn" onClick={() => handleQuickAdd(id)} title={`Add 10× ${brick.label}`}>
              {brick.label.replace("Brick ","").replace("Plate ","P")}
            </button>
          ))}
        </div>
      </div>

      {/* Inventory list */}
      {inventoryEntries.length === 0 ? (
        <div className="empty-state">
          <Package size={32} strokeWidth={1.2} />
          <p>No bricks yet.</p>
          <p className="hint">Search above or use Quick Add to get started.</p>
        </div>
      ) : (
        <div className="inventory-list">
          {inventoryEntries.map(([brickId, item]) => (
            <div key={brickId} className="inventory-row">
              <BrickIcon label={item.label} />
              <div className="inv-label">
                <span className="inv-name">{item.label}</span>
                <span className="inv-num">#{brickId}</span>
              </div>
              <div className="qty-control">
                <button onClick={() => setQty(brickId, item.quantity - 1)} className="qty-btn">−</button>
                <input
                  type="number"
                  min="0"
                  value={item.quantity}
                  onChange={e => setQty(brickId, parseInt(e.target.value) || 0)}
                  className="qty-input"
                />
                <button onClick={() => setQty(brickId, item.quantity + 1)} className="qty-btn">+</button>
              </div>
              <button className="remove-btn" onClick={() => removeBrick(brickId)}>
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {inventoryEntries.length > 0 && (
        <button className="clear-all-btn" onClick={clearInventory}>
          Clear all bricks
        </button>
      )}
    </div>
  );
}
