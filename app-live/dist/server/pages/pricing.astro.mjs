import { f as createComponent, k as renderComponent, r as renderTemplate, h as addAttribute, m as maybeRenderHead } from '../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/Base_-4rjFWta.mjs';
/* empty css                                   */
import { F as Footer, N as Nav } from '../chunks/Footer_CTcSx4kn.mjs';
export { renderers } from '../renderers.mjs';

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Pricing = createComponent(($$result, $$props, $$slots) => {
  const tiers = [
    {
      name: "Launch",
      price: "$500",
      unit: "one-time",
      hosting: "$20 / mo hosting",
      best: "Small businesses getting a real presence online.",
      featured: false,
      features: [
        "3-page custom website",
        "Mobile-first, responsive design",
        "Contact form + click-to-call",
        "Foundational SEO setup",
        "Initial consultation included",
        "Ongoing support"
      ]
    },
    {
      name: "Business",
      price: "$1,000",
      unit: "one-time",
      hosting: "$30 / mo hosting",
      best: "Growing brands that need content, gallery, and reach.",
      featured: true,
      features: [
        "Up to 10 pages",
        "About, FAQ & image gallery",
        "Blog / CMS publishing system",
        "Automated AI news feed",
        "On-page SEO across the site",
        "Initial consultation + ongoing support"
      ]
    },
    {
      name: "Full-Stack",
      price: "$3,000",
      unit: "starting",
      hosting: "$30 / mo hosting",
      best: "Custom apps, dashboards, and bespoke systems.",
      featured: false,
      features: [
        "Custom-built backend on a dedicated VPS",
        "Automatic backups + database management tools",
        "Authentication & security hardening",
        "24/7 monitoring + VPS support",
        "APIs, integrations & admin dashboards",
        "Initial consultation + ongoing support"
      ]
    }
  ];
  const ai = {
    setup: "$250",
    hosting: "$70 / mo",
    features: [
      "LLM features, copilots & automation",
      "AI chat assistants & RAG knowledge",
      "Wired into your product and operations",
      "Setup from $250 \u2014 project scope-based",
      "$70 / mo AI hosting & support"
    ]
  };
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Pricing \u2014 Inovision Studios", "description": "Clear, honest pricing for custom web design, full-stack development, and AI integration. From a $500 3-page launch to full custom systems \u2014 a 3-month timeline, consultation included, ongoing support." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="studio"> <div class="studio-aurora"></div> <div class="studio-grain"></div> ', ' <section class="s-section page-hero-top"> <div class="s-wrap"> <div class="s-head" style="margin-inline:auto;text-align:center;"> <nav class="iv-crumb" aria-label="Breadcrumb"><a href="/">Home</a><span class="sep">/</span><span class="cur">Pricing</span></nav> <p class="s-kicker reveal" style="justify-content:center;">Pricing</p> <h1 class="s-display reveal reveal-d1">Clear pricing, <span class="s-grad-text">real ownership.</span></h1> <p class="s-lead reveal reveal-d2" style="margin-inline:auto;">\nEvery engagement runs a <b>3-month timeline</b> from initial spec to completed deployment \u2014\n            consultation up front, support after launch. No lock-in, no surprises.\n</p> </div> <div class="price-grid reveal reveal-d2"> ', ' </div> <div class="price-ai reveal reveal-d2"> <div class="price-ai-head"> <span class="price-name">AI Integration</span> <span class="price-by">Powered by <a href="#" target="_blank" rel="noreferrer">DAIEJA 2.0</a></span> </div> <div class="price-ai-body"> <div class="price-ai-amt"> <div><b>', "</b><span>setup \xB7 scope-based</span></div> <div><b>", '</b><span>AI hosting & support</span></div> </div> <ul class="price-feats two"> ', ` </ul> </div> <a class="s-btn s-btn-ghost" href="/contact">Add AI to your build <span class="ico">\u2192</span></a> </div> <div class="price-ai reveal reveal-d2"> <div class="price-ai-head"> <span class="price-name">CRM Integration</span> <span class="price-by">Custom-built for your business</span> </div> <div class="price-ai-body"> <div class="price-ai-amt"> <div><b>$1,000</b><span>custom CRM build</span></div> </div> <ul class="price-feats two"> <li><span class="price-tick" aria-hidden="true">\u2713</span>Contact & deal pipeline tailored to your workflow</li> <li><span class="price-tick" aria-hidden="true">\u2713</span>Automated Stripe invoicing & online payments</li> <li><span class="price-tick" aria-hidden="true">\u2713</span>Custom invoices with a secure pay-by-link</li> <li><span class="price-tick" aria-hidden="true">\u2713</span>Client records synced to your dashboard</li> </ul> </div> <a class="s-btn s-btn-ghost" href="/contact">Add a CRM <span class="ico">\u2192</span></a> </div> <div class="price-trust reveal reveal-d3"> <b>Transparent pricing, no hidden fees.</b> <span>Any add-ons or additions are discussed and approved before commitment \u2014 we don't build what you don't need.</span> </div> <div class="price-note reveal reveal-d3"> <div><b>3-month timeline</b><span>Initial spec to deployment</span></div> <div><b>Consultation</b><span>Always included, up front</span></div> <div><b>Ongoing support</b><span>After every launch</span></div> </div> </div> </section> `, ' </div> <script>\n    (function () {\n      var io = new IntersectionObserver(function (es) {\n        es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });\n      }, { threshold: 0.08, rootMargin: "0px 0px -4% 0px" });\n      document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });\n    })();\n  <\/script> '])), maybeRenderHead(), renderComponent($$result2, "Nav", Nav, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Nav", "client:component-export": "default" }), tiers.map((t) => renderTemplate`<div${addAttribute(`price-card${t.featured ? " featured" : ""}`, "class")}> ${t.featured && renderTemplate`<span class="price-flag">Most popular</span>`} <span class="price-name">${t.name}</span> <div class="price-amt"><b>${t.price}</b><span>${t.unit}</span></div> <span class="price-host">${t.hosting}</span> <p class="price-best">${t.best}</p> <ul class="price-feats"> ${t.features.map((f) => renderTemplate`<li><span class="price-tick" aria-hidden="true">✓</span>${f}</li>`)} </ul> <a${addAttribute(`s-btn ${t.featured ? "s-btn-primary" : "s-btn-ghost"}`, "class")} href="/contact">Start a project <span class="ico">→</span></a> </div>`), ai.setup, ai.hosting, ai.features.map((f) => renderTemplate`<li><span class="price-tick" aria-hidden="true">✓</span>${f}</li>`), renderComponent($$result2, "Footer", Footer, {})) })}`;
}, "D:/wix/Inovision/web/src/pages/pricing.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/pricing.astro";
const $$url = "/pricing";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Pricing,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
