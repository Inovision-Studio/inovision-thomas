import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/Base_-4rjFWta.mjs';
/* empty css                                   */
import { N as Nav, F as Footer } from '../chunks/Footer_CTcSx4kn.mjs';
import { L as LEGAL_EFFECTIVE, C as COMPANY, T as TERMS } from '../chunks/legal_DA6HfMMm.mjs';
export { renderers } from '../renderers.mjs';

const prerender = false;
const $$Terms = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Terms of Service \u2014 Inovision Studios", "description": "The terms that govern Inovision Studios' web design, development, hosting, and AI services \u2014 including payment, ownership, Michigan governing law, and arbitration." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="studio"> <div class="studio-grain"></div> ${renderComponent($$result2, "Nav", Nav, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Nav", "client:component-export": "default" })} <section class="s-section page-hero-top"> <div class="s-wrap legal-wrap"> <nav class="iv-crumb" aria-label="Breadcrumb"><a href="/">Home</a><span class="sep">/</span><span class="cur">Terms of Service</span></nav> <h1 class="s-display">Terms of Service</h1> <p class="legal-eff">Effective ${LEGAL_EFFECTIVE} · ${COMPANY.name}</p> <div class="legal-doc"> ${TERMS.map((s) => renderTemplate`<section class="legal-sec"> <h2>${s.h}</h2> ${s.p.map((para) => renderTemplate`<p>${para}</p>`)} </section>`)} <p class="legal-note">If any conflict exists between these Terms and a signed written proposal for a specific engagement, the proposal controls for that engagement. Read alongside our <a href="/privacy">Privacy Policy</a>.</p> </div> </div> </section> ${renderComponent($$result2, "Footer", Footer, {})} </div> ` })}`;
}, "D:/wix/Inovision/web/src/pages/terms.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/terms.astro";
const $$url = "/terms";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Terms,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
