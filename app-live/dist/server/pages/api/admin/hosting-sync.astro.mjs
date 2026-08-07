import { K as db, L as addLedger } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const POST = async () => {
  const token = process.env.HOSTINGER_API_TOKEN;
  if (!token) return json({ needsKey: true, env: "HOSTINGER_API_TOKEN" });
  let subs;
  try {
    const res = await fetch("https://developers.hostinger.com/api/billing/v1/subscriptions", {
      headers: { Authorization: "Bearer " + token, "User-Agent": UA, Accept: "application/json" },
      signal: AbortSignal.timeout(15e3)
    });
    subs = await res.json();
  } catch (e) {
    return json({ error: String(e) }, 502);
  }
  const list = Array.isArray(subs) ? subs : subs?.data || [];
  db().prepare(`DELETE FROM ledger WHERE note LIKE 'hzsync:%'`).run();
  const posted = [];
  for (const s of list) {
    const name = String(s.name || s.title || s.id || "Hostinger");
    const raw = Number(s.total_price ?? s.price ?? s.amount ?? s.next_billing_amount ?? 0);
    if (!raw) continue;
    let monthly = raw > 1e3 ? raw / 100 : raw;
    const period = String(s.billing_period || s.period || "").toLowerCase();
    if (period.includes("year") || period.includes("annual")) monthly = monthly / 12;
    monthly = Math.round(monthly * 100) / 100;
    addLedger({ kind: "expense", category: "Hosting (Hostinger)", amount: monthly, note: `hzsync:${s.id} ${name}` });
    posted.push({ name, monthly });
  }
  return json({ ok: true, posted, total: posted.reduce((a, b) => a + b.monthly, 0) });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
