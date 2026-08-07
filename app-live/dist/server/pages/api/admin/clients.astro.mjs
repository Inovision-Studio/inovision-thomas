import { y as deleteClient, z as listClients, A as clientMonthly, B as saveClient, v as getClient, C as setClientLaunched, D as PRICING } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = () => json({ ok: true, pricing: PRICING, items: listClients().map((c) => ({ ...c, monthly: clientMonthly(c) })) });
const POST = async ({ request }) => {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  if (!b.name?.trim()) return json({ error: "Name required" }, 400);
  const id = saveClient({ id: b.id, name: b.name.trim(), email: b.email, site: b.site, hosting: b.hosting ? 1 : 0, ai: b.ai ? 1 : 0, extra: b.extra, notes: b.notes });
  let launched = false;
  if (b.site && b.site.trim()) {
    const c = getClient(id);
    if (c && c.portal_token && c.deposit_paid && !c.launched_at) {
      setClientLaunched(id);
      launched = true;
    }
  }
  return json({ ok: true, id, launched });
};
const DELETE = ({ url }) => {
  const id = url.searchParams.get("id");
  if (id) deleteClient(Number(id));
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
