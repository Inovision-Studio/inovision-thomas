import { v as getClient, P as PIPELINE, x as setClientStage } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const POST = async ({ request }) => {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }
  const id = Number(b.id);
  const stage = String(b.stage || "");
  if (!getClient(id)) return json({ error: "Client not found" }, 404);
  if (!PIPELINE.some((s) => s.key === stage)) return json({ error: "Unknown stage" }, 400);
  setClientStage(id, stage);
  return json({ ok: true, stage });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
