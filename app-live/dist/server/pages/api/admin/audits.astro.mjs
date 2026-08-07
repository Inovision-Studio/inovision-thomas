import { n as deleteAudit, o as listAudits, s as setAuditStatus, q as createAudit } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = () => json({ ok: true, items: listAudits() });
const POST = async ({ request }) => {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const company = String(b.company || "").trim();
  if (!company) return json({ error: "Company name required" }, 400);
  const id = createAudit({ company, contact: b.contact?.trim(), email: b.email?.trim(), summary: b.summary?.trim() });
  return json({ ok: true, id });
};
const PATCH = ({ url }) => {
  const id = Number(url.searchParams.get("id"));
  const status = url.searchParams.get("status") || "in_progress";
  if (id) setAuditStatus(id, status);
  return json({ ok: true });
};
const DELETE = ({ url }) => {
  const id = Number(url.searchParams.get("id"));
  if (id) deleteAudit(id);
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
