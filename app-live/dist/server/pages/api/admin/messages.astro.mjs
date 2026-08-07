import { Y as unreadForTeam, Z as markClientMessagesRead, _ as listClientMessages, v as getClient, $ as addClientMessage } from '../../../chunks/db_xJ927fmw.mjs';
import { g as getSession } from '../../../chunks/auth_bfH86Az4.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = async ({ url }) => {
  const cid = Number(url.searchParams.get("client_id"));
  if (!cid) return json({ ok: true, unread: unreadForTeam() });
  markClientMessagesRead(cid, "team");
  return json({ ok: true, items: listClientMessages(cid) });
};
const POST = async ({ request, cookies }) => {
  const sess = await getSession(cookies);
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const cid = Number(b.client_id);
  const body = String(b.body || "").trim();
  if (!cid || !getClient(cid)) return json({ error: "Client not found" }, 404);
  if (!body) return json({ error: "Message is empty" }, 400);
  addClientMessage({ client_id: cid, sender: "team", author: sess?.name || "Inovision Studios", body });
  return json({ ok: true, items: listClientMessages(cid) });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
