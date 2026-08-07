import { E as deleteDeployment, F as listDeployments, G as addDeployment } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = ({ url }) => {
  const cid = url.searchParams.get("client_id");
  return json({ ok: true, items: listDeployments(cid ? Number(cid) : void 0) });
};
const POST = async ({ request }) => {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  if (!b.client_id || !b.summary?.trim()) return json({ error: "client_id + summary required" }, 400);
  const id = addDeployment({ client_id: b.client_id, summary: b.summary.trim(), url: b.url });
  return json({ ok: true, id });
};
const DELETE = ({ url }) => {
  const id = url.searchParams.get("id");
  if (id) deleteDeployment(Number(id));
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
