export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
async function suggest(q) {
  try {
    const r = await fetch("https://suggestqueries.google.com/complete/search?client=firefox&hl=en&q=" + encodeURIComponent(q), {
      headers: { "User-Agent": UA },
      signal: AbortSignal.timeout(8e3)
    });
    const data = await r.json();
    return Array.isArray(data?.[1]) ? data[1] : [];
  } catch {
    return [];
  }
}
const POST = async ({ request }) => {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const seed = (b.seed || "").trim().slice(0, 80);
  if (!seed) return json({ error: "Enter a seed keyword or phrase" }, 400);
  const queries = /* @__PURE__ */ new Set([seed]);
  for (const m of ["best ", "how to ", "why ", "what is ", "top "]) queries.add(m + seed);
  for (const m of [" services", " company", " near me", " cost", " for", " vs", " ideas", " examples", " michigan", " agency"]) queries.add(seed + m);
  for (const c of "abcdefgh") queries.add(seed + " " + c);
  const results = await Promise.allSettled([...queries].slice(0, 24).map((q) => suggest(q)));
  const set = /* @__PURE__ */ new Set();
  for (const r of results) if (r.status === "fulfilled") {
    for (const s of r.value) if (s && s.toLowerCase() !== seed.toLowerCase()) set.add(s);
  }
  const ideas = [...set].sort().slice(0, 150);
  return json({ ok: true, seed, count: ideas.length, ideas });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
