import { Z as markClientMessagesRead, _ as listClientMessages, $ as addClientMessage } from '../../../chunks/db_xJ927fmw.mjs';
import { g as getClientSession } from '../../../chunks/clientauth_C72sOTMC.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = async ({ cookies }) => {
  const s = await getClientSession(cookies);
  if (!s) return json({ error: "Not signed in" }, 401);
  markClientMessagesRead(s.id, "client");
  return json({ ok: true, items: listClientMessages(s.id) });
};
const POST = async ({ cookies, request }) => {
  const s = await getClientSession(cookies);
  if (!s) return json({ error: "Not signed in" }, 401);
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const body = String(b.body || "").trim();
  if (!body) return json({ error: "Message is empty" }, 400);
  addClientMessage({ client_id: s.id, sender: "client", author: s.name, body });
  return json({ ok: true, items: listClientMessages(s.id) });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
