import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
export { renderers } from '../../renderers.mjs';

const tools = [
  { n: "01", t: "Visual Editor", href: "/admin/posts", d: "Edit text, swap images, reorder sections, and modify any section with AI — across every page.", s: "Building" },
  { n: "02", t: "AI Image Studio", href: "/admin/image", d: "fal Seedream 4.5 — prompt to image, aspect-ratio options, capped at 2K.", s: "Ready" },
  { n: "03", t: "Mockup Studio", href: "/admin/mockup", d: "Chat + live preview. Fast (Mercury 2) / High (OpenAI). Download, save as client progress.", s: "Ready" },
  { n: "04", t: "SEO Audit", href: "/admin/seo", d: "Paste a URL — on-page audit with prioritized fixes. Works now.", s: "Live" },
  { n: "05", t: "Copy Engine", href: "/admin/copy", d: "Mercury 2 — headings, meta, hero copy, blog drafts.", s: "Ready" },
  { n: "06", t: "Inbox", href: "/admin/inbox", d: "Contact-form messages from the site.", s: "Live" },
  { n: "07", t: "Journal / Posts", href: "/admin/posts", d: "Write and publish SEO blog posts.", s: "Live" },
  { n: "08", t: "Analytics", href: "/admin/analytics", d: "Traffic and engagement signals.", s: "Live" }
];
function StudioHome() {
  return /* @__PURE__ */ jsx(AdminShell, { active: "studio", title: "Studio OS", subtitle: "The agency platform. Add API keys to light up the AI tools.", children: /* @__PURE__ */ jsx("div", { className: "sos-tools", children: tools.map((tool) => /* @__PURE__ */ jsxs("a", { className: "sos-tool", href: tool.href, children: [
    /* @__PURE__ */ jsx("span", { className: "sos-n", children: tool.n }),
    /* @__PURE__ */ jsxs("div", { className: "sos-tool-body", children: [
      /* @__PURE__ */ jsxs("h3", { children: [
        tool.t,
        " ",
        /* @__PURE__ */ jsx("em", { "data-s": tool.s, children: tool.s })
      ] }),
      /* @__PURE__ */ jsx("p", { children: tool.d })
    ] })
  ] }, tool.n)) }) });
}

const prerender = false;
const $$Studio = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Studio OS \xB7 Inovision Studios", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "StudioHome", StudioHome, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/StudioHome", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/studio.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/studio.astro";
const $$url = "/admin/studio";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Studio,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
