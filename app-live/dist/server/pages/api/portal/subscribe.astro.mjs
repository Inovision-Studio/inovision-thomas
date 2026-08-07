import { at as getClientByEmail } from '../../../chunks/db_xJ927fmw.mjs';
import { g as getClientSession } from '../../../chunks/clientauth_C72sOTMC.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const GET = async ({ cookies, url, redirect }) => {
  const session = await getClientSession(cookies);
  if (!session) return redirect("/portal", 302);
  const c = getClientByEmail(session.email);
  if (!c) return redirect("/portal", 302);
  if (!c.launched_at) return redirect("/portal", 302);
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return redirect("/portal", 302);
  const form = {
    mode: "subscription",
    customer_email: c.email || "",
    success_url: url.origin + "/portal?sub=1",
    cancel_url: url.origin + "/portal",
    "line_items[0][price_data][currency]": "usd",
    "line_items[0][price_data][product_data][name]": "Inovision Studios — Hosting",
    "line_items[0][price_data][product_data][description]": "Managed hosting & maintenance",
    "line_items[0][price_data][unit_amount]": "2000",
    "line_items[0][price_data][recurring][interval]": "month",
    "line_items[0][quantity]": "1",
    "metadata[client_id]": String(c.id),
    "metadata[kind]": "recurring",
    "subscription_data[metadata][client_id]": String(c.id)
  };
  if (Number(c.ai) > 0) {
    form["line_items[1][price_data][currency]"] = "usd";
    form["line_items[1][price_data][product_data][name]"] = "Inovision Studios — AI Integration (DAIEJA 2.0)";
    form["line_items[1][price_data][product_data][description]"] = "AI features, hosting & support";
    form["line_items[1][price_data][unit_amount]"] = "7000";
    form["line_items[1][price_data][recurring][interval]"] = "month";
    form["line_items[1][quantity]"] = "1";
  }
  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(form),
    signal: AbortSignal.timeout(2e4)
  });
  const data = await res.json();
  if (!res.ok || !data.url) return redirect("/portal", 302);
  return redirect(data.url, 302);
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  GET,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
