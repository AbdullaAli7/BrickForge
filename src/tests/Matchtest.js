/**
 * BrickForge — Match Logic Tests
 *
 * Run with: node src/tests/matchTest.js
 *
 * Part 1: Pure logic tests (no API, always runnable)
 * Part 2: Live API integration test (requires VITE_REBRICKABLE_API_KEY in .env)
 */

// ═══════════════════════════════════════════════════════════════════
// PART 1: Pure logic unit tests
// ═══════════════════════════════════════════════════════════════════

// Inline the match function so we can test without bundler
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

let passed = 0;
let failed = 0;

function assert(name, condition, detail = "") {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name} ${detail}`);
    failed++;
  }
}

console.log("\n══ PART 1: computeMatch unit tests ══\n");

// ── Test 1: Empty inventory → 0% ─────────────────────────────────
{
  console.log("Test 1: Empty inventory");
  const parts = [
    { part: { part_num: "3001" }, quantity: 10 },
    { part: { part_num: "3005" }, quantity: 5 },
  ];
  const inv = {};
  const r = computeMatch(parts, inv);
  assert("pct = 0", r.pct === 0, `got ${r.pct}`);
  assert("matched = 0", r.matched === 0, `got ${r.matched}`);
  assert("total = 15", r.total === 15, `got ${r.total}`);
  assert("matchedTypes = 0", r.matchedTypes === 0, `got ${r.matchedTypes}`);
  assert("totalTypes = 2", r.totalTypes === 2, `got ${r.totalTypes}`);
}

// ── Test 2: Exact full match → 100% ──────────────────────────────
{
  console.log("\nTest 2: Exact full match");
  const parts = [
    { part: { part_num: "3001" }, quantity: 10 },
    { part: { part_num: "3005" }, quantity: 5 },
  ];
  const inv = { "3001": 10, "3005": 5 };
  const r = computeMatch(parts, inv);
  assert("pct = 100", r.pct === 100, `got ${r.pct}`);
  assert("matched = 15", r.matched === 15, `got ${r.matched}`);
  assert("matchedTypes = 2", r.matchedTypes === 2, `got ${r.matchedTypes}`);
}

// ── Test 3: Oversupply → still 100% (capped at needed) ──────────
{
  console.log("\nTest 3: Oversupply");
  const parts = [
    { part: { part_num: "3001" }, quantity: 5 },
    { part: { part_num: "3005" }, quantity: 3 },
  ];
  const inv = { "3001": 999, "3005": 999 };
  const r = computeMatch(parts, inv);
  assert("pct = 100", r.pct === 100, `got ${r.pct}`);
  assert("matched = 8 (not 1998)", r.matched === 8, `got ${r.matched}`);
  assert("total = 8", r.total === 8, `got ${r.total}`);
}

// ── Test 4: Partial match ────────────────────────────────────────
{
  console.log("\nTest 4: Partial match — have one type, not the other");
  const parts = [
    { part: { part_num: "3001" }, quantity: 10 },
    { part: { part_num: "3005" }, quantity: 10 },
  ];
  const inv = { "3001": 10 }; // have all 3001, zero 3005
  const r = computeMatch(parts, inv);
  assert("pct = 50", r.pct === 50, `got ${r.pct}`);
  assert("matched = 10", r.matched === 10, `got ${r.matched}`);
  assert("total = 20", r.total === 20, `got ${r.total}`);
  assert("matchedTypes = 1", r.matchedTypes === 1, `got ${r.matchedTypes}`);
  assert("totalTypes = 2", r.totalTypes === 2, `got ${r.totalTypes}`);
}

// ── Test 5: Partial quantity per type ────────────────────────────
{
  console.log("\nTest 5: Partial quantity — have some of each type");
  const parts = [
    { part: { part_num: "3001" }, quantity: 10 },
    { part: { part_num: "3005" }, quantity: 10 },
    { part: { part_num: "3010" }, quantity: 10 },
  ];
  const inv = { "3001": 3, "3005": 7, "3010": 10 };
  const r = computeMatch(parts, inv);
  // 3+7+10 = 20 out of 30
  assert("pct = 67", r.pct === 67, `got ${r.pct}`);
  assert("matched = 20", r.matched === 20, `got ${r.matched}`);
  assert("total = 30", r.total === 30, `got ${r.total}`);
  assert("matchedTypes = 3", r.matchedTypes === 3, `got ${r.matchedTypes}`);
}

// ── Test 6: Unrecognized parts in inventory don't affect score ───
{
  console.log("\nTest 6: Extra inventory parts don't inflate score");
  const parts = [
    { part: { part_num: "3001" }, quantity: 10 },
  ];
  const inv = { "3001": 5, "9999": 1000, "8888": 500 };
  const r = computeMatch(parts, inv);
  assert("pct = 50", r.pct === 50, `got ${r.pct}`);
  assert("matched = 5", r.matched === 5, `got ${r.matched}`);
}

// ── Test 7: Empty parts list → 0% ───────────────────────────────
{
  console.log("\nTest 7: Empty parts list");
  const r = computeMatch([], { "3001": 50 });
  assert("pct = 0", r.pct === 0, `got ${r.pct}`);
  assert("total = 0", r.total === 0, `got ${r.total}`);
}

// ── Test 8: Parts with null/missing part_num are skipped ─────────
{
  console.log("\nTest 8: Malformed parts entries are skipped");
  const parts = [
    { part: { part_num: "3001" }, quantity: 10 },
    { part: null, quantity: 5 },                     // null part
    { part: { part_num: null }, quantity: 5 },       // null part_num
    { part: { part_num: "3005" }, quantity: 0 },     // zero quantity
    { quantity: 3 },                                 // no part field
  ];
  const inv = { "3001": 10, "3005": 100 };
  const r = computeMatch(parts, inv);
  assert("total = 10 (only valid entry counted)", r.total === 10, `got ${r.total}`);
  assert("matched = 10", r.matched === 10, `got ${r.matched}`);
  assert("pct = 100", r.pct === 100, `got ${r.pct}`);
  assert("totalTypes = 1", r.totalTypes === 1, `got ${r.totalTypes}`);
}

// ── Test 9: Rounding ─────────────────────────────────────────────
{
  console.log("\nTest 9: Rounding edge cases");
  const parts = [
    { part: { part_num: "3001" }, quantity: 3 },
  ];
  const inv = { "3001": 1 };
  const r = computeMatch(parts, inv);
  // 1/3 = 33.33... → should round to 33
  assert("pct = 33 (rounds down)", r.pct === 33, `got ${r.pct}`);
}

// ── Test 10: Realistic set-like data ─────────────────────────────
{
  console.log("\nTest 10: Realistic mock set (50 unique types, ~200 pieces)");
  const parts = [];
  for (let i = 0; i < 50; i++) {
    parts.push({ part: { part_num: `part_${i}` }, quantity: 3 + (i % 5) });
  }
  // Total: 50 entries, quantities: 3,4,5,6,7,3,4,5,6,7... = avg 5, total = 250
  const totalPieces = parts.reduce((s, p) => s + p.quantity, 0);

  // User has 10 of the types with full quantity, 5 with partial
  const inv = {};
  for (let i = 0; i < 10; i++) inv[`part_${i}`] = 100; // full
  for (let i = 10; i < 15; i++) inv[`part_${i}`] = 1;  // partial

  const r = computeMatch(parts, inv);
  const expectedFullMatch = parts.slice(0, 10).reduce((s, p) => s + p.quantity, 0);
  const expectedPartial = 5; // 1 each for parts 10-14
  const expectedTotal = expectedFullMatch + expectedPartial;

  assert(`matched = ${expectedTotal}`, r.matched === expectedTotal, `got ${r.matched}`);
  assert(`total = ${totalPieces}`, r.total === totalPieces, `got ${r.total}`);
  assert("matchedTypes = 15", r.matchedTypes === 15, `got ${r.matchedTypes}`);
  assert("totalTypes = 50", r.totalTypes === 50, `got ${r.totalTypes}`);
  assert(`pct = ${Math.round(expectedTotal/totalPieces*100)}`, r.pct === Math.round(expectedTotal / totalPieces * 100), `got ${r.pct}`);
}

console.log(`\n══ Results: ${passed} passed, ${failed} failed ══\n`);

// ═══════════════════════════════════════════════════════════════════
// PART 2: Live API integration test
//
// Run with: VITE_REBRICKABLE_API_KEY=your_key node src/tests/matchTest.js --live
// ═══════════════════════════════════════════════════════════════════

const isLive = process.argv.includes("--live");
const API_KEY = process.env.VITE_REBRICKABLE_API_KEY || "";

if (isLive) {
  if (!API_KEY) {
    console.log("❌ Set VITE_REBRICKABLE_API_KEY env var to run live tests");
    process.exit(1);
  }

  (async () => {
    console.log("\n══ PART 2: Live API integration tests ══\n");

    const BASE = "https://rebrickable.com/api/v3/lego";

    async function rbFetch(path, params = {}) {
      const url = new URL(`${BASE}${path}`);
      url.searchParams.set("key", API_KEY);
      Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`${res.status}: ${await res.text()}`);
      return res.json();
    }

    // Test A: Verify /sets/ endpoint returns data
    {
      console.log("Test A: GET /sets/ returns results");
      try {
        const data = await rbFetch("/sets/", { min_parts: 20, max_parts: 50, page_size: 3 });
        assert("returns results array", Array.isArray(data.results), `got ${typeof data.results}`);
        assert("results not empty", data.results.length > 0, `got ${data.results.length}`);
        const set = data.results[0];
        assert("set has set_num", !!set.set_num, `got ${set.set_num}`);
        assert("set has name", !!set.name, `got ${set.name}`);
        assert("set has num_parts", typeof set.num_parts === "number", `got ${set.num_parts}`);
        assert("set has set_img_url", set.set_img_url !== undefined);
        console.log(`   Sample: ${set.set_num} — ${set.name} (${set.num_parts} parts)`);
      } catch (e) {
        console.log(`  ❌ Failed: ${e.message}`);
        failed++;
      }
    }

    await new Promise(r => setTimeout(r, 1200));

    // Test B: Verify /sets/{num}/parts/ returns parts with correct shape
    {
      console.log("\nTest B: GET /sets/{num}/parts/ returns properly shaped data");
      try {
        // Use a well-known small set
        const data = await rbFetch("/sets/", { min_parts: 20, max_parts: 30, page_size: 1 });
        const setNum = data.results[0].set_num;
        console.log(`   Fetching parts for ${setNum}...`);

        await new Promise(r => setTimeout(r, 1200));
        const partsData = await rbFetch(`/sets/${setNum}/parts/`, { page_size: 100 });

        assert("returns results array", Array.isArray(partsData.results));
        assert("results not empty", partsData.results.length > 0, `got ${partsData.results.length}`);

        const entry = partsData.results[0];
        assert("entry has part.part_num", !!entry.part?.part_num, `got ${JSON.stringify(entry.part)}`);
        assert("entry has quantity", typeof entry.quantity === "number", `got ${entry.quantity}`);

        console.log(`   Sample part: ${entry.part.part_num} × ${entry.quantity}`);

        // Run computeMatch with a fake inventory that has one of this part
        const fakeInv = { [entry.part.part_num]: 1 };
        const r = computeMatch(partsData.results, fakeInv);
        assert("computeMatch runs without error", r.pct >= 0);
        assert("at least 1 type matched", r.matchedTypes >= 1, `got ${r.matchedTypes}`);
        console.log(`   Match with 1×${entry.part.part_num}: ${r.pct}% (${r.matched}/${r.total} pieces, ${r.matchedTypes}/${r.totalTypes} types)`);
      } catch (e) {
        console.log(`  ❌ Failed: ${e.message}`);
        failed++;
      }
    }

    await new Promise(r => setTimeout(r, 1200));

    // Test C: Verify /sets/{num}/alternates/ endpoint works
    {
      console.log("\nTest C: GET /sets/{num}/alternates/ works (may be empty)");
      try {
        // Try a popular set that likely has alternates
        const data = await rbFetch("/sets/", { search: "creator", min_parts: 100, page_size: 3 });
        let foundAlts = false;
        for (const set of data.results) {
          await new Promise(r => setTimeout(r, 1200));
          try {
            const altData = await rbFetch(`/sets/${set.set_num}/alternates/`, { page_size: 3 });
            if (altData.results?.length > 0) {
              const alt = altData.results[0];
              assert("alternate has set_num", !!alt.set_num, `got ${JSON.stringify(alt)}`);
              assert("alternate has name", !!alt.name);
              assert("alternate has moc_url", !!alt.moc_url, `got ${alt.moc_url}`);
              console.log(`   Found alt for ${set.set_num}: ${alt.set_num} — ${alt.name}`);
              console.log(`   URL: ${alt.moc_url}`);
              foundAlts = true;
              break;
            }
          } catch { /* some sets won't have alternates */ }
        }
        if (!foundAlts) {
          console.log("   ⚠️ No alternates found (endpoint works but no results for tested sets)");
        }
      } catch (e) {
        console.log(`  ❌ Failed: ${e.message}`);
        failed++;
      }
    }

    await new Promise(r => setTimeout(r, 1200));

    // Test D: Verify /mocs/{num}/parts/ endpoint works
    {
      console.log("\nTest D: GET /mocs/{num}/parts/ works");
      try {
        // First find a MOC via alternates
        const data = await rbFetch("/sets/", { search: "creator", min_parts: 100, page_size: 5 });
        let mocNum = null;
        for (const set of data.results) {
          await new Promise(r => setTimeout(r, 1200));
          try {
            const altData = await rbFetch(`/sets/${set.set_num}/alternates/`, { page_size: 1 });
            if (altData.results?.length > 0) {
              mocNum = altData.results[0].set_num;
              break;
            }
          } catch {}
        }

        if (mocNum) {
          await new Promise(r => setTimeout(r, 1200));
          const mocParts = await rbFetch(`/mocs/${mocNum}/parts/`, { page_size: 50 });
          assert("returns results", Array.isArray(mocParts.results));
          assert("results not empty", mocParts.results.length > 0, `got ${mocParts.results.length}`);
          const entry = mocParts.results[0];
          assert("entry has part.part_num", !!entry.part?.part_num);
          assert("entry has quantity", typeof entry.quantity === "number");
          console.log(`   MOC ${mocNum}: ${mocParts.results.length} part entries`);
          console.log(`   Sample: ${entry.part.part_num} × ${entry.quantity}`);
        } else {
          console.log("   ⚠️ No MOC found to test parts endpoint");
        }
      } catch (e) {
        console.log(`  ❌ Failed: ${e.message}`);
        failed++;
      }
    }

    await new Promise(r => setTimeout(r, 1200));

    // ══════════════════════════════════════════════════════════════
    // Tests E–J: Real set inventory matching
    // Fetch a real set's parts, build an exact inventory, verify 100%,
    // then systematically modify inventory and verify correct %.
    // ══════════════════════════════════════════════════════════════
    {
      console.log("\n── Set Inventory Match Tests ──\n");

      let setParts = [];
      let setNum = "";
      let setName = "";

      try {
        const setsData = await rbFetch("/sets/", { min_parts: 30, max_parts: 80, page_size: 5, ordering: "-year" });
        for (const s of setsData.results) {
          await new Promise(r => setTimeout(r, 1200));
          const partsData = await rbFetch(`/sets/${s.set_num}/parts/`, { page_size: 500 });
          if (partsData.results?.length >= 10) {
            setParts = partsData.results;
            setNum = s.set_num;
            setName = s.name;
            break;
          }
        }
      } catch (e) {
        console.log(`  ❌ Failed to fetch test set: ${e.message}`);
        failed++;
      }

      if (setParts.length === 0) {
        console.log("  ⚠️ Could not find a suitable test set, skipping E-J");
      } else {
        console.log(`Using set: ${setNum} — ${setName}`);
        console.log(`   ${setParts.length} part entries\n`);

        const exactInv = {};
        let totalPieces = 0;
        for (const entry of setParts) {
          const pn = entry.part?.part_num;
          const qty = entry.quantity ?? 0;
          if (!pn || qty === 0) continue;
          exactInv[pn] = (exactInv[pn] ?? 0) + qty;
          totalPieces += qty;
        }
        const totalTypes = Object.keys(exactInv).length;

        // Test E: Exact inventory → 100%
        {
          console.log("Test E: Exact inventory of a real set → must be 100%");
          const r = computeMatch(setParts, exactInv);
          assert("pct = 100", r.pct === 100, `got ${r.pct}`);
          assert(`matched = total (${r.total})`, r.matched === r.total, `matched ${r.matched} vs total ${r.total}`);
          assert(`matchedTypes = totalTypes (${r.totalTypes})`, r.matchedTypes === r.totalTypes, `${r.matchedTypes} vs ${r.totalTypes}`);
          console.log(`   ${r.matched}/${r.total} pieces, ${r.matchedTypes}/${r.totalTypes} types\n`);
        }

        // Test F: Double every part → still 100%
        {
          console.log("Test F: Double every part quantity → still 100%");
          const overInv = {};
          for (const [pn, qty] of Object.entries(exactInv)) overInv[pn] = qty * 2;
          const r = computeMatch(setParts, overInv);
          assert("pct = 100", r.pct === 100, `got ${r.pct}`);
          assert("matched = total (not double)", r.matched === r.total, `matched ${r.matched} vs total ${r.total}`);
          console.log(`   ${r.matched}/${r.total} pieces — oversupply correctly capped\n`);
        }

        // Test G: Remove one type entirely → drops below 100%
        {
          console.log("Test G: Remove one part type entirely → below 100%");
          const partialInv = { ...exactInv };
          const removedType = Object.keys(partialInv)[0];
          const removedQty = partialInv[removedType];
          delete partialInv[removedType];

          const r = computeMatch(setParts, partialInv);
          const expectedMatched = totalPieces - removedQty;
          const expectedPct = Math.round((expectedMatched / totalPieces) * 100);

          assert("pct < 100", r.pct < 100, `got ${r.pct}`);
          assert(`pct = ${expectedPct}`, r.pct === expectedPct, `got ${r.pct}`);
          assert(`matched = ${expectedMatched}`, r.matched === expectedMatched, `got ${r.matched}`);
          assert("matchedTypes = totalTypes - 1", r.matchedTypes === r.totalTypes - 1, `${r.matchedTypes} vs ${r.totalTypes - 1}`);
          console.log(`   Removed ${removedType} (×${removedQty}) → ${r.pct}% (${r.matched}/${r.total})\n`);
        }

        // Test H: Half quantity of every type → ~50%
        {
          console.log("Test H: Half quantity of every type → ~50%");
          const halfInv = {};
          let expectedMatched = 0;
          for (const [pn, qty] of Object.entries(exactInv)) {
            const h = Math.floor(qty / 2);
            halfInv[pn] = h;
            expectedMatched += h;
          }
          const r = computeMatch(setParts, halfInv);
          const expectedPct = Math.round((expectedMatched / totalPieces) * 100);
          assert(`pct = ${expectedPct}`, r.pct === expectedPct, `got ${r.pct}`);
          assert(`matched = ${expectedMatched}`, r.matched === expectedMatched, `got ${r.matched}`);
          const typesWithHalf = Object.values(halfInv).filter(q => q > 0).length;
          assert(`matchedTypes = ${typesWithHalf}`, r.matchedTypes === typesWithHalf, `got ${r.matchedTypes}`);
          console.log(`   Half inventory → ${r.pct}% (${r.matched}/${r.total})\n`);
        }

        // Test I: Completely wrong inventory → 0%
        {
          console.log("Test I: Completely unrelated inventory → 0%");
          const wrongInv = { "FAKE_001": 9999, "FAKE_002": 9999 };
          const r = computeMatch(setParts, wrongInv);
          assert("pct = 0", r.pct === 0, `got ${r.pct}`);
          assert("matched = 0", r.matched === 0, `got ${r.matched}`);
          assert("matchedTypes = 0", r.matchedTypes === 0, `got ${r.matchedTypes}`);
          console.log(`   0 matching parts → 0%\n`);
        }

        // Test J: One brick short on every type → correct %
        {
          console.log("Test J: One brick short on every type");
          const almostInv = {};
          let expectedMatched = 0;
          for (const [pn, qty] of Object.entries(exactInv)) {
            const shortQty = Math.max(0, qty - 1);
            almostInv[pn] = shortQty;
            expectedMatched += shortQty;
          }
          const r = computeMatch(setParts, almostInv);
          const expectedPct = Math.round((expectedMatched / totalPieces) * 100);
          assert(`pct = ${expectedPct}`, r.pct === expectedPct, `got ${r.pct}`);
          assert(`matched = ${expectedMatched}`, r.matched === expectedMatched, `got ${r.matched}`);
          const typesWithAny = Object.entries(almostInv).filter(([, q]) => q > 0).length;
          assert(`matchedTypes = ${typesWithAny}`, r.matchedTypes === typesWithAny, `got ${r.matchedTypes}`);
          console.log(`   One short per type → ${r.pct}% (${r.matched}/${r.total})\n`);
        }
      }
    }

    console.log(`\n══ Live test results: ${passed} passed, ${failed} failed ══\n`);
    process.exit(failed > 0 ? 1 : 0);
  })();
} else {
  if (failed > 0) process.exit(1);
  console.log("Run with --live flag and VITE_REBRICKABLE_API_KEY to test the API:\n");
  console.log("  VITE_REBRICKABLE_API_KEY=your_key node src/tests/matchTest.js --live\n");
}