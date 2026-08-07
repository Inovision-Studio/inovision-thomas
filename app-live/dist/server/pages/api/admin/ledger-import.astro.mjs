import { L as addLedger } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
function parseCSV(text) {
  const rows = [];
  for (const line of text.split(/\r?\n/)) {
    if (!line.trim()) continue;
    const cells = [];
    let cur = "", q = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (q) {
        if (c === '"') {
          if (line[i + 1] === '"') {
            cur += '"';
            i++;
          } else q = false;
        } else cur += c;
      } else if (c === ",") {
        cells.push(cur);
        cur = "";
      } else if (c === '"') q = true;
      else cur += c;
    }
    cells.push(cur);
    rows.push(cells.map((c) => c.trim()));
  }
  return rows;
}
const find = (header, names) => header.findIndex((h) => names.some((n) => h.toLowerCase().includes(n)));
const POST = async ({ request }) => {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const rows = parseCSV(body.csv || "");
  if (rows.length < 2) return json({ error: "CSV needs a header row and at least one row." }, 400);
  const header = rows[0];
  const iDate = find(header, ["date", "posted", "when"]);
  const iAmt = find(header, ["amount", "amt", "total", "value", "debit", "credit"]);
  const iType = find(header, ["type", "kind"]);
  const iCat = find(header, ["category", "cat"]);
  const iNote = find(header, ["note", "description", "memo", "desc", "name", "payee"]);
  if (iAmt < 0) return json({ error: "No amount column found in the CSV." }, 400);
  let imported = 0, skipped = 0;
  for (const r of rows.slice(0, 5e3).slice(1)) {
    const rawAmt = (r[iAmt] || "").replace(/[$,()]/g, (m) => m === "(" || m === ")" ? "" : "");
    const neg = /^\(.*\)$/.test(r[iAmt] || "") || (r[iAmt] || "").includes("-");
    const num = Math.abs(parseFloat(rawAmt));
    if (!num || isNaN(num)) {
      skipped++;
      continue;
    }
    let kind = "expense";
    const t = (iType >= 0 ? r[iType] : "").toLowerCase();
    if (t.includes("income") || t.includes("credit") || t.includes("deposit")) kind = "income";
    else if (t.includes("expense") || t.includes("debit")) kind = "expense";
    else kind = neg ? "expense" : "income";
    const ts = iDate >= 0 && Date.parse(r[iDate]) ? Date.parse(r[iDate]) : Date.now();
    addLedger({ ts, kind, category: iCat >= 0 ? r[iCat] : "Imported", amount: num, note: iNote >= 0 ? r[iNote] : null });
    imported++;
  }
  return json({ ok: true, imported, skipped });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
