import { useState, useCallback, useRef } from "react";

const BASE = "https://rebrickable.com/api/v3/lego";
const API_KEY = import.meta.env.VITE_REBRICKABLE_API_KEY ?? "";

// Simple in-memory cache so we don't burn rate limit
const cache = new Map();

async function rbFetch(path, params = {}) {
  const url = new URL(`${BASE}${path}/`);
  url.searchParams.set("key", API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  const key = url.toString();
  if (cache.has(key)) return cache.get(key);

  const res = await fetch(key);
  if (!res.ok) throw new Error(`Rebrickable ${res.status}: ${res.statusText}`);
  const data = await res.json();
  cache.set(key, data);
  return data;
}

/**
 * Search Rebrickable parts by keyword.
 * Returns array of { part_num, name, part_img_url, part_url }
 */
export function usePartSearch() {
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);
  const timerRef = useRef(null);

  const search = useCallback((query) => {
    clearTimeout(timerRef.current);
    if (!query || query.trim().length < 2) { setResults([]); return; }

    timerRef.current = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        if (!API_KEY) {
          // Demo mode — return mocked results for common bricks
          setResults(getMockParts(query));
          return;
        }
        const data = await rbFetch("/parts", { search: query.trim(), page_size: 12 });
        setResults(data.results ?? []);
      } catch (e) {
        setError(e.message);
        setResults(getMockParts(query));
      } finally {
        setLoading(false);
      }
    }, 350);
  }, []);

  return { results, loading, error, search };
}

/**
 * Fetch MOC sets that match the user's inventory via Rebrickable.
 * Falls back to empty array if no API key.
 */
export async function fetchMatchingMOCs(partList) {
  if (!API_KEY || partList.length === 0) return [];
  try {
    const body = partList.map(p => `${p.brickId}:${p.quantity}`).join(",");
    const data = await rbFetch("/mocs/build", { parts: body, page_size: 6 });
    return data.results ?? [];
  } catch {
    return [];
  }
}

// ─── Mock data (used when no API key is set) ────────────────────────────────

const MOCK_PARTS = [
  // Standard bricks
  { part_num: "3005", name: "Brick 1x1",        part_img_url: null },
  { part_num: "3004", name: "Brick 1x2",        part_img_url: null },
  { part_num: "3622", name: "Brick 1x3",        part_img_url: null },
  { part_num: "3010", name: "Brick 1x4",        part_img_url: null },
  { part_num: "3009", name: "Brick 1x6",        part_img_url: null },
  { part_num: "3008", name: "Brick 1x8",        part_img_url: null },
  { part_num: "3003", name: "Brick 2x2",        part_img_url: null },
  { part_num: "3002", name: "Brick 2x3",        part_img_url: null },
  { part_num: "3001", name: "Brick 2x4",        part_img_url: null },
  { part_num: "2456", name: "Brick 2x6",        part_img_url: null },
  { part_num: "3007", name: "Brick 2x8",        part_img_url: null },
  // Plates
  { part_num: "3024", name: "Plate 1x1",        part_img_url: null },
  { part_num: "3023", name: "Plate 1x2",        part_img_url: null },
  { part_num: "3710", name: "Plate 1x4",        part_img_url: null },
  { part_num: "3666", name: "Plate 1x6",        part_img_url: null },
  { part_num: "3022", name: "Plate 2x2",        part_img_url: null },
  { part_num: "3020", name: "Plate 2x4",        part_img_url: null },
  { part_num: "3795", name: "Plate 2x6",        part_img_url: null },
  { part_num: "3034", name: "Plate 2x8",        part_img_url: null },
  // Slopes
  { part_num: "3040", name: "Slope 1x2 45°",    part_img_url: null },
  { part_num: "3039", name: "Slope 2x2 45°",    part_img_url: null },
  { part_num: "3037", name: "Slope 2x4 45°",    part_img_url: null },
  { part_num: "3665", name: "Inv Slope 1x2",    part_img_url: null },
  // Special
  { part_num: "3062", name: "Round Brick 1x1",  part_img_url: null },
  { part_num: "3941", name: "Round Brick 2x2",  part_img_url: null },
  { part_num: "98283",name: "Masonry Brick 1x2",part_img_url: null },
  { part_num: "2877", name: "Grille Brick 1x2", part_img_url: null },
  { part_num: "4070", name: "Headlight Brick",  part_img_url: null },
];

function getMockParts(query) {
  const q = query.toLowerCase();
  return MOCK_PARTS.filter(
    p => p.name.toLowerCase().includes(q) || p.part_num.includes(q)
  );
}