import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState } from 'react';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
export { renderers } from '../../renderers.mjs';

const TYPES = [
  { k: "headline", l: "Headlines" },
  { k: "meta description", l: "Meta description" },
  { k: "hero section", l: "Hero copy" },
  { k: "blog intro", l: "Blog intro" }
];
function CopyPage() {
  const [type, setType] = useState("headline");
  const [brief, setBrief] = useState("");
  const [out, setOut] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [needsKey, setNeedsKey] = useState(null);
  async function gen() {
    if (!brief.trim()) return;
    setLoading(true);
    setErr("");
    setNeedsKey(null);
    setOut("");
    try {
      const r = await fetch("/api/admin/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mode: "copy", engine: "fast", prompt: `Write ${type} copy for: ${brief}` })
      });
      const d = await r.json();
      if (d.needsKey) setNeedsKey(d.env);
      else if (d.error) setErr(d.error);
      else setOut(d.output);
    } catch (e) {
      setErr(String(e));
    }
    setLoading(false);
  }
  return /* @__PURE__ */ jsx(AdminShell, { active: "copy", title: "Copy Engine", subtitle: "Mercury 2 — headlines, meta, hero copy, blog drafts.", children: /* @__PURE__ */ jsxs("div", { className: "tool", children: [
    needsKey && /* @__PURE__ */ jsxs("div", { className: "tool-note", children: [
      "Add ",
      /* @__PURE__ */ jsx("code", { children: needsKey }),
      " + ",
      /* @__PURE__ */ jsx("code", { children: "MERCURY_BASE_URL" }),
      " to the server ",
      /* @__PURE__ */ jsx("code", { children: ".env" }),
      " to activate."
    ] }),
    /* @__PURE__ */ jsx("div", { className: "tool-row", children: TYPES.map((t) => /* @__PURE__ */ jsx("button", { className: `tool-chip${type === t.k ? " on" : ""}`, onClick: () => setType(t.k), children: t.l }, t.k)) }),
    /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
      /* @__PURE__ */ jsx(
        "textarea",
        {
          className: "tool-textarea",
          value: brief,
          onChange: (e) => setBrief(e.target.value),
          placeholder: "A premium smoke shop in Fenton, MI — boutique, modern, art-gallery feel, high-quality glass."
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "tool-row", style: { marginTop: "1rem" }, children: /* @__PURE__ */ jsx("button", { className: "tool-btn", disabled: loading || !brief.trim(), onClick: gen, children: loading ? "Writing…" : "Generate" }) }),
      err && /* @__PURE__ */ jsx("p", { className: "tool-err", children: err })
    ] }),
    out && /* @__PURE__ */ jsx("div", { className: "tool-panel", style: { whiteSpace: "pre-wrap", lineHeight: 1.6, color: "#e7e9ef" }, children: out })
  ] }) });
}

const prerender = false;
const $$Copy = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Copy Engine \xB7 Inovision Studio OS", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "CopyPage", CopyPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/CopyPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/copy.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/copy.astro";
const $$url = "/admin/copy";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Copy,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
