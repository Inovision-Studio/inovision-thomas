import { B as saveClient } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const BASE = "https://api.hubapi.com";
function hasHubspot() {
  return !!(process.env.HUBSPOT_TOKEN && process.env.HUBSPOT_TOKEN.length > 20);
}
async function hs(path) {
  const token = process.env.HUBSPOT_TOKEN;
  if (!token) throw new Error("HUBSPOT_TOKEN not configured");
  const r = await fetch(BASE + path, {
    headers: { Authorization: "Bearer " + token, "Content-Type": "application/json" },
    signal: AbortSignal.timeout(2e4)
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw Object.assign(new Error("HubSpot " + r.status), { status: r.status, data });
  return data;
}
async function accountInfo() {
  return hs("/account-info/v3/details");
}
async function listContacts(limit = 30) {
  const d = await hs(`/crm/v3/objects/contacts?limit=${limit}&properties=firstname,lastname,email,phone,company,lifecyclestage,createdate`);
  return (d.results || []).map((r) => ({
    id: r.id,
    name: [r.properties.firstname, r.properties.lastname].filter(Boolean).join(" ").trim(),
    email: r.properties.email || "",
    phone: r.properties.phone || "",
    company: r.properties.company || "",
    stage: r.properties.lifecyclestage || ""
  }));
}
async function listCompanies(limit = 30) {
  const d = await hs(`/crm/v3/objects/companies?limit=${limit}&properties=name,domain,city,state,phone,industry,lifecyclestage`);
  return (d.results || []).map((r) => ({
    id: r.id,
    name: r.properties.name || "",
    domain: r.properties.domain || "",
    city: [r.properties.city, r.properties.state].filter(Boolean).join(", "),
    phone: r.properties.phone || "",
    industry: r.properties.industry || ""
  }));
}
async function listDeals(limit = 20) {
  const d = await hs(`/crm/v3/objects/deals?limit=${limit}&properties=dealname,amount,dealstage,closedate,pipeline`);
  return (d.results || []).map((r) => ({
    id: r.id,
    name: r.properties.dealname || "",
    amount: Number(r.properties.amount || 0),
    stage: r.properties.dealstage || "",
    closedate: r.properties.closedate || ""
  }));
}

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = async () => {
  if (!hasHubspot()) return json({ needsKey: true, env: "HUBSPOT_TOKEN" });
  const [acct, contacts, companies, deals] = await Promise.allSettled([accountInfo(), listContacts(), listCompanies(), listDeals()]);
  const val = (r, f) => r.status === "fulfilled" ? r.value : f;
  const err = (r) => r.status === "rejected" ? String(r.reason?.status || r.reason) : null;
  return json({
    ok: true,
    account: val(acct, null),
    contacts: val(contacts, []),
    companies: val(companies, []),
    deals: val(deals, []),
    errors: { account: err(acct), contacts: err(contacts), companies: err(companies), deals: err(deals) }
  });
};
const POST = async ({ request }) => {
  if (!hasHubspot()) return json({ needsKey: true }, 400);
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  if (!b.name) return json({ error: "Name required" }, 400);
  const id = saveClient({ name: b.name, email: b.email || "", site: b.site || "", hosting: 0, ai: 0, extra: 0, notes: "Imported from HubSpot" });
  return json({ ok: true, id });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
