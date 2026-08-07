import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
/* empty css                                      */
import { aw as getInvoiceByToken, Q as setInvoiceStatus } from '../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://inovisionstudios.com");
const prerender = false;
const $$token = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$token;
  const { token } = Astro2.params;
  const inv = token ? getInvoiceByToken(token) : void 0;
  let justPaid = false;
  const sessionId = Astro2.url.searchParams.get("session_id");
  if (inv && sessionId && inv.status !== "paid") {
    const key = process.env.STRIPE_SECRET_KEY;
    if (key) {
      try {
        const r = await fetch("https://api.stripe.com/v1/checkout/sessions/" + encodeURIComponent(sessionId), {
          headers: { Authorization: "Bearer " + key },
          signal: AbortSignal.timeout(15e3)
        });
        const s = await r.json();
        if (r.ok && s.payment_status === "paid") {
          setInvoiceStatus(inv.id, "paid");
          inv.status = "paid";
          justPaid = true;
        }
      } catch {
      }
    }
  }
  const money = (n) => "$" + Number(n || 0).toFixed(2);
  const paid = !!inv && inv.status === "paid";
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": inv ? `Invoice ${inv.period} \u2014 Inovision Studios` : "Invoice \u2014 Inovision Studios", "description": "Securely view and pay your Inovision Studios invoice online." }, { "default": async ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="studio"> <div class="studio-aurora"></div> <div class="studio-grain"></div> <section class="s-section page-hero-top"> <div class="s-wrap inv-wrap"> ', " ", ' </div> </section> </div> <script>\n    (function () {\n      var btn = document.getElementById("payBtn");\n      if (!btn) return;\n      btn.addEventListener("click", async function () {\n        var original = btn.innerHTML;\n        btn.disabled = true;\n        btn.textContent = "Opening secure checkout\u2026";\n        try {\n          var r = await fetch("/api/pay", {\n            method: "POST",\n            headers: { "Content-Type": "application/json" },\n            body: JSON.stringify({ token: btn.getAttribute("data-token") }),\n          });\n          var d = await r.json();\n          if (d.url) { window.location.href = d.url; return; }\n          if (d.paid) { window.location.reload(); return; }\n          btn.innerHTML = original; btn.disabled = false;\n          if (d.needsKey) { alert("Online payments are being finalized \u2014 please check back shortly or contact us to pay."); }\n          else { alert(d.error || "Could not start checkout. Please try again."); }\n        } catch (e) {\n          btn.innerHTML = original; btn.disabled = false;\n          alert("Network error \u2014 please try again.");\n        }\n      });\n    })();\n  <\/script> '])), maybeRenderHead(), !inv && renderTemplate`<div class="inv-card"> <a href="/" class="inv-brand">INOVISION <span>STUDIOS</span></a> <h1 class="inv-lost">Invoice not found</h1> <p class="inv-lostp">This payment link is invalid or has expired. If you believe this is a mistake, reach out and we'll send a fresh link.</p> <a class="s-btn s-btn-ghost" href="/contact">Contact us <span class="ico">→</span></a> </div>`, inv && renderTemplate`<div class="inv-card"> <div class="inv-head"> <a href="/" class="inv-brand">INOVISION <span>STUDIOS</span></a> <span${addAttribute(`inv-status ${paid ? "paid" : "due"}`, "class")}>${paid ? "Paid" : "Payment due"}</span> </div> <div class="inv-amt"> <span>${paid ? "Amount paid" : "Amount due"}</span> <b>${money(inv.amount)}</b> </div> <ul class="inv-rows"> <li><span>Billed to</span><b>${inv.recipient || inv.client_name || "\u2014"}</b></li> ${inv.description ? renderTemplate`<li><span>For</span><b>${inv.description}</b></li>` : renderTemplate`<li><span>Billing period</span><b>${inv.period}</b></li>`} <li><span>Invoice no.</span><b>#${String(inv.id).padStart(4, "0")}</b></li> </ul> ${justPaid && renderTemplate`<div class="inv-thanks">Payment received — thank you. A receipt is on its way from Stripe.</div>`} ${paid && !justPaid && renderTemplate`<div class="inv-thanks">This invoice has already been paid. Thank you.</div>`} ${!paid && renderTemplate`<button id="payBtn" class="s-btn s-btn-primary inv-pay"${addAttribute(inv.token, "data-token")}>
Pay ${money(inv.amount)} securely <span class="ico">→</span> </button>`} <p class="inv-secure">Secure payment via Stripe · Inovision Studios LLC</p> </div>`) })}`;
}, "D:/wix/Inovision/web/src/pages/invoice/[token].astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/invoice/[token].astro";
const $$url = "/invoice/[token]";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$token,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
