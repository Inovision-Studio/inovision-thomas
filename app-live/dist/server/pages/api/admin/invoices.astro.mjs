import { N as deleteInvoice, O as listInvoices, Q as setInvoiceStatus, R as createCustomInvoice, z as listClients, A as clientMonthly, S as createInvoice } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = () => json({ ok: true, items: listInvoices() });
const POST = async ({ request }) => {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  if (b.custom) {
    const description = String(b.description || "").trim();
    const amount = Number(b.amount || 0);
    if (!description) return json({ error: "Add a description for the invoice." }, 400);
    if (!(amount > 0)) return json({ error: "Enter an amount greater than $0." }, 400);
    const { id: id2, token } = createCustomInvoice({ client_id: b.client_id ? Number(b.client_id) : 0, recipient: b.recipient?.trim(), description, amount });
    return json({ ok: true, id: id2, token });
  }
  const period = (b.period || "").trim();
  if (!period) return json({ error: "Period required (e.g. 2026-06)" }, 400);
  if (b.generateAll) {
    let n = 0;
    for (const c of listClients()) {
      const amt = clientMonthly(c);
      if (amt > 0) {
        createInvoice({ client_id: c.id, period, amount: amt });
        n++;
      }
    }
    return json({ ok: true, created: n });
  }
  if (!b.client_id) return json({ error: "client_id required" }, 400);
  const id = createInvoice({ client_id: b.client_id, period, amount: Number(b.amount || 0) });
  return json({ ok: true, id });
};
const PATCH = ({ url }) => {
  const id = url.searchParams.get("id");
  const status = url.searchParams.get("status") || "paid";
  if (id) setInvoiceStatus(Number(id), status);
  return json({ ok: true });
};
const DELETE = ({ url }) => {
  const id = url.searchParams.get("id");
  if (id) deleteInvoice(Number(id));
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
