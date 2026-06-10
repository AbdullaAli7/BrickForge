import { useState, useEffect } from "react";

const BASE    = "https://rebrickable.com/api/v3/lego";
const API_KEY = import.meta.env.VITE_REBRICKABLE_API_KEY ?? "";

// Demo MOCs shown when there's no API key — realistic-looking placeholders
const DEMO_MOCS = [
  {
    moc_id: "MOC-12345",
    name: "Classic Red Truck",
    designer_username: "brickmaster99",
    num_parts: 48,
    moc_img_url: null,
    moc_url: "https://rebrickable.com/mocs/",
    _pct: 88,
  },
  {
    moc_id: "MOC-23456",
    name: "Mini City House",
    designer_username: "legoarchitect",
    num_parts: 62,
    moc_img_url: null,
    moc_url: "https://rebrickable.com/mocs/",
    _pct: 75,
  },
  {
    moc_id: "MOC-34567",
    name: "Space Rover Mk II",
    designer_username: "cosmicbuilder",
    num_parts: 35,
    moc_img_url: null,
    moc_url: "https://rebrickable.com/mocs/",
    _pct: 94,
  },
  {
    moc_id: "MOC-45678",
    name: "Brick Dog Figurine",
    designer_username: "animalbrick",
    num_parts: 22,
    moc_img_url: null,
    moc_url: "https://rebrickable.com/mocs/",
    _pct: 100,
  },
  {
    moc_id: "MOC-56789",
    name: "Modular Bridge",
    designer_username: "civilbricks",
    num_parts: 110,
    moc_img_url: null,
    moc_url: "https://rebrickable.com/mocs/",
    _pct: 61,
  },
];

/**
 * Fetch MOCs from Rebrickable that match the user's inventory.
 * Falls back to curated demo list when no API key is set.
 *
 * @param {object} flatInventory - { [brickId]: quantity }
 */
export function useMOCMatches(flatInventory) {
  const [mocs,    setMocs]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const [isDemo,  setIsDemo]  = useState(false);

  const totalPieces = Object.values(flatInventory).reduce((s, v) => s + v, 0);

  useEffect(() => {
    if (totalPieces < 10) { setMocs([]); return; }

    let cancelled = false;
    setLoading(true);
    setError(null);

    const run = async () => {
      try {
        if (!API_KEY) {
          // Demo mode — filter demo list by rough inventory size
          await new Promise(r => setTimeout(r, 600)); // simulate network
          if (cancelled) return;
          setIsDemo(true);
          // Scale demo completeness based on actual inventory size
          const scale = Math.min(totalPieces / 80, 1);
          setMocs(
            DEMO_MOCS
              .map(m => ({ ...m, _pct: Math.min(100, Math.round(m._pct * scale + scale * 15)) }))
              .sort((a, b) => b._pct - a._pct)
          );
          return;
        }

        // Build the parts string: "PART_NUM:QTY,..."
        const partsStr = Object.entries(flatInventory)
          .map(([id, qty]) => `${id}:${qty}`)
          .join(",");

        const url = new URL(`${BASE}/mocs/build/`);
        url.searchParams.set("key", API_KEY);
        url.searchParams.set("parts", partsStr);
        url.searchParams.set("page_size", 6);

        const res  = await fetch(url.toString());
        if (!res.ok) throw new Error(`Rebrickable ${res.status}`);
        const data = await res.json();

        if (cancelled) return;
        setIsDemo(false);

        // Attach completeness pct from API or estimate
        const results = (data.results ?? []).map(m => ({
          ...m,
          _pct: m.num_owned_parts != null && m.num_parts
            ? Math.round((m.num_owned_parts / m.num_parts) * 100)
            : 85,
        }));

        setMocs(results.sort((a, b) => b._pct - a._pct));
      } catch (e) {
        if (!cancelled) {
          setError(e.message);
          setIsDemo(true);
          setMocs(DEMO_MOCS.slice(0, 3));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    run();
    return () => { cancelled = true; };
  }, [totalPieces]); // re-run when total pieces changes (not every keystroke)

  return { mocs, loading, error, isDemo };
}
