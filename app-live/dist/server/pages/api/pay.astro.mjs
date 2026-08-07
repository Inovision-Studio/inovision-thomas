import { aw as getInvoiceByToken } from '../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const POST = async ({ request, url }) => {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const inv = b.token ? getInvoiceByToken(String(b.token)) : void 0;
  if (!inv) return json({ error: "Invoice not found" }, 404);
  if (inv.status === "paid") return json({ paid: true });
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return json({ needsKey: true, env: "STRIPE_SECRET_KEY" }, 503);
  const cents = Math.round(Number(inv.amount) * 100);
  if (cents < 50) return json({ error: "Invoice amount is below the minimum charge." }, 400);
  const origin = url.origin;
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      mode: "payment",
      success_url: origin + "/invoice/" + inv.token + "?session_id={CHECKOUT_SESSION_ID}",
      cancel_url: origin + "/invoice/" + inv.token,
      "line_items[0][price_data][currency]": "usd",
      "line_items[0][price_data][product_data][name]": `Inovision Studios — Invoice #${String(inv.id).padStart(4, "0")}`,
      "line_items[0][price_data][product_data][description]": `Web services${inv.client_name ? " for " + inv.client_name : ""} · billing period ${inv.period}`,
      "line_items[0][price_data][unit_amount]": String(cents),
      "line_items[0][quantity]": "1",
      "payment_intent_data[description]": `Inovision Studios invoice #${String(inv.id).padStart(4, "0")} (${inv.period})`,
      "metadata[invoice_id]": String(inv.id),
      "metadata[invoice_token]": inv.token
    }),
    signal: AbortSignal.timeout(2e4)
  });
  const data = await res.json();
  if (!res.ok) return json({ error: data?.error?.message || "Stripe error" }, 502);
  return json({ ok: true, url: data.url });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
