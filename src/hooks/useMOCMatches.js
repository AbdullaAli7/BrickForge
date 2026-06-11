import { useState, useEffect, useRef } from "react";

const BASE    = "https://rebrickable.com/api/v3/lego";
const API_KEY = import.meta.env.VITE_REBRICKABLE_API_KEY ?? "";

// ── Rate-limited fetch (1 req/sec for free tier) ─────────────────

let lastCall = 0;
async function rbFetch(path, params = {}) {
  const now = Date.now();
  const wait = Math.max(0, 1100 - (now - lastCall));
  if (wait > 0) await new Promise(r => setTimeout(r, wait));
  lastCall = Date.now();

  const url = new URL(`${BASE}${path}`);
  url.searchParams.set("key", API_KEY);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));

  const res = await fetch(url.toString());
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Rebrickable ${res.status}: ${body.slice(0, 100)}`);
  }
  return res.json();
}

// ── Compute real match % between a part list and user inventory ──
// Returns { pct, matched, total, matchedTypes, totalTypes }

function computeMatch(parts, userInventory) {
  let totalNeeded = 0;
  let totalOwned  = 0;
  let typesNeeded = 0;
  let typesOwned  = 0;

  for (const entry of parts) {
    const partNum = entry.part?.part_num;
    const needed  = entry.quantity ?? 0;
    if (!partNum || needed === 0) continue;

    totalNeeded += needed;
    typesNeeded += 1;

    const have = userInventory[partNum] ?? 0;
    const used = Math.min(have, needed);
    totalOwned += used;
    if (used > 0) typesOwned += 1;
  }

  return {
    pct: totalNeeded === 0 ? 0 : Math.round((totalOwned / totalNeeded) * 100),
    matched: totalOwned,
    total: totalNeeded,
    matchedTypes: typesOwned,
    totalTypes: typesNeeded,
  };
}

// ── Part fetchers ────────────────────────────────────────────────

async function fetchSetParts(setNum) {
  try {
    const data = await rbFetch(`/sets/${setNum}/parts/`, { page_size: 500 });
    return data.results ?? [];
  } catch { return []; }
}

async function fetchMOCParts(mocNum) {
  try {
    const data = await rbFetch(`/mocs/${mocNum}/parts/`, { page_size: 500 });
    return data.results ?? [];
  } catch { return []; }
}

// ═══════════════════════════════════════════════════════════════════
// useSetMatches — Official LEGO sets with real inventory matching
// ═══════════════════════════════════════════════════════════════════

export function useSetMatches(flatInventory) {
  const [sets,    setSets]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const cancelRef = useRef(false);

  const totalPieces = Object.values(flatInventory).reduce((s, v) => s + v, 0);

  useEffect(() => {
    if (!API_KEY || totalPieces < 5) { setSets([]); return; }

    cancelRef.current = false;
    setLoading(true);
    setError(null);

    const run = async () => {
      try {
        // Search a range around user's piece count
        const minP = Math.max(5, Math.floor(totalPieces * 0.3));
        const maxP = Math.ceil(totalPieces * 1.5);

        const data = await rbFetch("/sets/", {
          min_parts: minP,
          max_parts: maxP,
          ordering: "-year",
          page_size: 12,
        });

        if (cancelRef.current) return;

        const candidates = (data.results ?? []).map(s => ({
          set_num:   s.set_num,
          name:      s.name,
          year:      s.year,
          num_parts: s.num_parts,
          img_url:   s.set_img_url ?? null,
          _url:      `https://rebrickable.com/sets/${s.set_num}/`,
          _pct:      null,
          _matched:  null,
          _total:    null,
          _loading:  true,
        }));

        setSets(candidates);
        setLoading(false);

        // Fetch parts for top 6 and compute real match
        const checkCount = Math.min(candidates.length, 6);
        for (let i = 0; i < checkCount; i++) {
          if (cancelRef.current) return;
          const s = candidates[i];
          const parts = await fetchSetParts(s.set_num);
          const match = computeMatch(parts, flatInventory);

          setSets(prev => prev.map(ps =>
            ps.set_num === s.set_num
              ? { ...ps, _pct: match.pct, _matched: match.matched, _total: match.total,
                  _matchedTypes: match.matchedTypes, _totalTypes: match.totalTypes, _loading: false }
              : ps
          ));
        }

        // Mark unchecked as done
        setSets(prev => prev.map(ps => ps._loading ? { ...ps, _loading: false } : ps));

        // Sort by match %, filter out 0% matches
        setSets(prev =>
          [...prev]
            .filter(s => s._pct === null || s._pct > 0)
            .sort((a, b) => (b._pct ?? -1) - (a._pct ?? -1))
        );

      } catch (e) {
        if (!cancelRef.current) { setError(e.message); setLoading(false); }
      }
    };

    run();
    return () => { cancelRef.current = true; };
  }, [totalPieces]);

  return { sets, loading, error };
}

// ═══════════════════════════════════════════════════════════════════
// useMOCMatches — Alternate MOC builds from matched sets,
// with real parts matching via GET /mocs/{set_num}/parts/
// ═══════════════════════════════════════════════════════════════════

export function useMOCMatches(flatInventory) {
  const [mocs,    setMocs]    = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);
  const cancelRef = useRef(false);

  const totalPieces = Object.values(flatInventory).reduce((s, v) => s + v, 0);

  useEffect(() => {
    if (!API_KEY || totalPieces < 5) { setMocs([]); return; }

    cancelRef.current = false;
    setLoading(true);
    setError(null);

    const run = async () => {
      try {
        // Step 1: Find sets in range
        const minP = Math.max(5, Math.floor(totalPieces * 0.4));
        const maxP = Math.ceil(totalPieces * 1.3);

        const setsData = await rbFetch("/sets/", {
          min_parts: minP,
          max_parts: maxP,
          ordering: "-year",
          page_size: 8,
        });

        if (cancelRef.current) return;
        const candidateSets = setsData.results ?? [];

        if (candidateSets.length === 0) {
          setMocs([]);
          setLoading(false);
          return;
        }

        // Step 2: Fetch alternate MOC builds for top 4 sets
        const allMocs = [];
        const checked = Math.min(candidateSets.length, 4);

        for (let i = 0; i < checked; i++) {
          if (cancelRef.current) return;
          const setNum = candidateSets[i].set_num;
          try {
            const altData = await rbFetch(`/sets/${setNum}/alternates/`, { page_size: 5 });
            const alts = (altData.results ?? []).map(m => ({
              moc_id:            m.set_num,
              name:              m.name,
              designer_username: m.designer_name ?? "unknown",
              num_parts:         m.num_parts,
              moc_img_url:       m.moc_img_url ?? null,
              _url:              m.moc_url ?? `https://rebrickable.com/mocs/${m.set_num}/`,
              _fromSet:          candidateSets[i].name,
              _fromSetNum:       setNum,
              _pct:              null,
              _matched:          null,
              _total:            null,
              _loading:          true,
            }));
            allMocs.push(...alts);
          } catch {
            // Some sets have no alternates
          }
        }

        if (cancelRef.current) return;

        // Deduplicate
        const seen = new Set();
        const unique = allMocs.filter(m => {
          if (seen.has(m.moc_id)) return false;
          seen.add(m.moc_id);
          return true;
        });

        setMocs(unique);
        setLoading(false);

        // Step 3: Fetch parts for each MOC and compute real match %
        const mocCheckCount = Math.min(unique.length, 6);
        for (let i = 0; i < mocCheckCount; i++) {
          if (cancelRef.current) return;
          const m = unique[i];
          const parts = await fetchMOCParts(m.moc_id);
          const match = computeMatch(parts, flatInventory);

          setMocs(prev => prev.map(pm =>
            pm.moc_id === m.moc_id
              ? { ...pm, _pct: match.pct, _matched: match.matched, _total: match.total,
                  _matchedTypes: match.matchedTypes, _totalTypes: match.totalTypes, _loading: false }
              : pm
          ));
        }

        // Mark unchecked as done
        setMocs(prev => prev.map(pm => pm._loading ? { ...pm, _loading: false } : pm));

        // Sort by match %, filter out 0%
        setMocs(prev =>
          [...prev]
            .filter(m => m._pct === null || m._pct > 0)
            .sort((a, b) => (b._pct ?? -1) - (a._pct ?? -1))
        );

      } catch (e) {
        if (!cancelRef.current) { setError(e.message); setLoading(false); }
      }
    };

    run();
    return () => { cancelRef.current = true; };
  }, [totalPieces]);

  return { mocs, loading, error };
}