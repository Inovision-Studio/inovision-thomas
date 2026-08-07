import { v as getClient, A as clientMonthly, M as getInvoice, aj as setInvoicePayUrl } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
async function stripe(key, path, form) {
  const body = new URLSearchParams(form);
  const res = await fetch("https://api.stripe.com/v1" + path, {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/x-www-form-urlencoded" },
    body,
    signal: AbortSignal.timeout(2e4)
  });
  return { ok: res.ok, data: await res.json() };
}
const POST = async ({ request, url }) => {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return json({ needsKey: true, env: "STRIPE_SECRET_KEY" });
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const origin = url.origin;
  if (b.action === "subscribe" && b.client_id) {
    const c = getClient(b.client_id);
    if (!c) return json({ error: "Client not found" }, 404);
    const cents2 = Math.round(clientMonthly(c) * 100);
    if (cents2 <= 0) return json({ error: "Client has no monthly charge" }, 400);
    const { ok: ok2, data: data2 } = await stripe(key, "/checkout/sessions", {
      mode: "subscription",
      success_url: origin + "/admin/business?sub=1",
      cancel_url: origin + "/admin/business",
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][product_data][name]": `Inovision — ${c.name} monthly`,
      "line_items[0][price_data][unit_amount]": String(cents2),
      "line_items[0][price_data][recurring][interval]": "month",
      "line_items[0][quantity]": "1",
      ...c.email ? { customer_email: c.email } : {}
    });
    if (!ok2) return json({ error: data2?.error?.message || "Stripe error" }, 502);
    return json({ ok: true, url: data2.url });
  }
  if (!b.invoice_id) return json({ error: "invoice_id required" }, 400);
  const inv = getInvoice(b.invoice_id);
  if (!inv) return json({ error: "Invoice not found" }, 404);
  const cents = Math.round(inv.amount * 100);
  const { ok, data } = await stripe(key, "/checkout/sessions", {
    mode: "payment",
    success_url: origin + "/admin/business?paid=1",
    cancel_url: origin + "/admin/business",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][product_data][name]": `Inovision Invoice — ${inv.client_name || ""} ${inv.period}`,
    "line_items[0][price_data][unit_amount]": String(cents),
    "line_items[0][quantity]": "1",
    ...inv.client_email ? { customer_email: inv.client_email } : {}
  });
  if (!ok) return json({ error: data?.error?.message || "Stripe error" }, 502);
  setInvoicePayUrl(b.invoice_id, data.url);
  return json({ ok: true, url: data.url });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
