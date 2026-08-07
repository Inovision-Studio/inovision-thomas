import { a0 as deleteMilestone, a1 as listMilestones, a2 as toggleMilestone, v as getClient, a3 as addMilestone } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = ({ url }) => {
  const cid = Number(url.searchParams.get("client_id"));
  return json({ ok: true, items: cid ? listMilestones(cid) : [] });
};
const POST = async ({ request }) => {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const cid = Number(b.client_id);
  const title = String(b.title || "").trim();
  if (!cid || !getClient(cid)) return json({ error: "Client not found" }, 404);
  if (!title) return json({ error: "Milestone title required" }, 400);
  addMilestone({ client_id: cid, title, due: b.due ? String(b.due) : void 0 });
  return json({ ok: true, items: listMilestones(cid) });
};
const PATCH = ({ url }) => {
  const id = Number(url.searchParams.get("id"));
  if (id) toggleMilestone(id, url.searchParams.get("done") === "1");
  return json({ ok: true });
};
const DELETE = ({ url }) => {
  const id = Number(url.searchParams.get("id"));
  if (id) deleteMilestone(id);
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
