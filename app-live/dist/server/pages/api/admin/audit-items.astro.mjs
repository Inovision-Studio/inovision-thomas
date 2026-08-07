import { h as deleteAuditItem, i as listAuditItems, j as toggleAuditItem, k as addAuditItem } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = ({ url }) => {
  const aid = Number(url.searchParams.get("audit_id"));
  return json({ ok: true, items: aid ? listAuditItems(aid) : [] });
};
const POST = async ({ request }) => {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const aid = Number(b.audit_id);
  const finding = String(b.finding || "").trim();
  if (!aid) return json({ error: "audit_id required" }, 400);
  if (!finding) return json({ error: "Finding required" }, 400);
  addAuditItem({ audit_id: aid, area: b.area?.trim(), finding, recommendation: b.recommendation?.trim(), impact: b.impact, effort: b.effort });
  return json({ ok: true, items: listAuditItems(aid) });
};
const PATCH = ({ url }) => {
  const id = Number(url.searchParams.get("id"));
  if (id) toggleAuditItem(id, url.searchParams.get("done") === "1");
  return json({ ok: true });
};
const DELETE = ({ url }) => {
  const id = Number(url.searchParams.get("id"));
  if (id) deleteAuditItem(id);
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  PATCH,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
