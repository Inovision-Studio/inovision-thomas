import crypto from 'node:crypto';
import { M as getInvoice, Q as setInvoiceStatus, v as getClient, ay as setClientSubscribed } from '../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../renderers.mjs';

const prerender = false;
function verifySig(raw, header, secret) {
  if (!header) return false;
  const parts = {};
  for (const kv of header.split(",")) {
    const i = kv.indexOf("=");
    if (i > 0) parts[kv.slice(0, i).trim()] = kv.slice(i + 1).trim();
  }
  if (!parts.t || !parts.v1) return false;
  const expected = crypto.createHmac("sha256", secret).update(parts.t + "." + raw).digest("hex");
  try {
    return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(parts.v1));
  } catch {
    return false;
  }
}
const POST = async ({ request }) => {
  const raw = await request.text();
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    console.error("[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set - refusing to process. Set it in the server environment.");
    return new Response("webhook secret not configured", { status: 503 });
  }
  if (!verifySig(raw, request.headers.get("stripe-signature"), secret)) {
    return new Response("invalid signature", { status: 400 });
  }
  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response("invalid json", { status: 400 });
  }
  try {
    const type = event.type || "";
    const obj = event.data?.object || {};
    if (type === "checkout.session.completed" || type === "checkout.session.async_payment_succeeded") {
      const paid = obj.payment_status === "paid" || obj.status === "complete";
      const meta = obj.metadata || {};
      const invId = Number(meta.invoice_id);
      if (paid && invId && getInvoice(invId)) setInvoiceStatus(invId, "paid");
      if (obj.mode === "subscription" && meta.client_id) {
        const cid = Number(meta.client_id);
        if (cid && getClient(cid)) setClientSubscribed(cid, obj.subscription ? String(obj.subscription) : null);
      }
    }
  } catch (err) {
    console.error("[stripe-webhook] handler failed for event", event && event.id, event && event.type, err);
    return new Response(JSON.stringify({ error: "handler failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
  return new Response(JSON.stringify({ received: true }), { status: 200, headers: { "Content-Type": "application/json" } });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
