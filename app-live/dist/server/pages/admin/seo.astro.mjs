import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState } from 'react';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
export { renderers } from '../../renderers.mjs';

function SeoPage() {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [res, setRes] = useState(null);
  const [seed, setSeed] = useState("");
  const [kwLoading, setKwLoading] = useState(false);
  const [kw, setKw] = useState(null);
  async function findKeywords() {
    if (!seed.trim()) return;
    setKwLoading(true);
    setKw(null);
    try {
      const d = await (await fetch("/api/admin/keywords", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ seed }) })).json();
      setKw(d.ideas || []);
    } catch {
      setKw([]);
    }
    setKwLoading(false);
  }
  async function run() {
    if (!url.trim()) return;
    setLoading(true);
    setErr("");
    setRes(null);
    try {
      const r = await fetch("/api/admin/seo-audit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url })
      });
      const d = await r.json();
      if (d.error) setErr(d.error);
      else setRes(d);
    } catch (e) {
      setErr(String(e));
    }
    setLoading(false);
  }
  return /* @__PURE__ */ jsx(AdminShell, { active: "seo", title: "SEO Tools", subtitle: "On-page audit + keyword research — live, no keys required.", children: /* @__PURE__ */ jsxs("div", { className: "tool", children: [
    /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
      /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Keyword research — real Google search suggestions" }),
      /* @__PURE__ */ jsxs("div", { className: "tool-row", children: [
        /* @__PURE__ */ jsx("input", { className: "tool-input", style: { flex: 1, minWidth: "220px" }, value: seed, placeholder: "Seed keyword — e.g. web design michigan", onChange: (e) => setSeed(e.target.value), onKeyDown: (e) => e.key === "Enter" && findKeywords() }),
        /* @__PURE__ */ jsx("button", { className: "tool-btn", disabled: kwLoading || !seed.trim(), onClick: findKeywords, children: kwLoading ? "Finding…" : "Find keywords" })
      ] }),
      kw && /* @__PURE__ */ jsx("div", { style: { marginTop: "1rem" }, children: kw.length === 0 ? /* @__PURE__ */ jsx("p", { className: "tool-label", children: "No suggestions found — try a broader seed." }) : /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsxs("div", { className: "tool-row", style: { justifyContent: "space-between", marginBottom: "0.6rem" }, children: [
          /* @__PURE__ */ jsxs("span", { className: "tool-label", style: { margin: 0 }, children: [
            kw.length,
            " ideas"
          ] }),
          /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => navigator.clipboard?.writeText(kw.join("\n")), children: "Copy all" })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "kw-list", children: kw.map((k, i) => /* @__PURE__ */ jsx("span", { className: "kw-chip", children: k }, i)) })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
      /* @__PURE__ */ jsxs("div", { className: "tool-row", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            className: "tool-input",
            style: { flex: 1, minWidth: "220px" },
            value: url,
            onChange: (e) => setUrl(e.target.value),
            placeholder: "https://example.com",
            onKeyDown: (e) => e.key === "Enter" && run()
          }
        ),
        /* @__PURE__ */ jsx("button", { className: "tool-btn", disabled: loading || !url.trim(), onClick: run, children: loading ? "Auditing…" : "Run audit" })
      ] }),
      err && /* @__PURE__ */ jsx("p", { className: "tool-err", style: { marginTop: "0.8rem" }, children: err })
    ] }),
    res && /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
      /* @__PURE__ */ jsxs("div", { className: "seo-score", children: [
        /* @__PURE__ */ jsx("b", { children: res.score }),
        /* @__PURE__ */ jsxs("span", { children: [
          "/100 · ",
          res.url
        ] })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "seo-checks", children: res.checks.map((c, i) => /* @__PURE__ */ jsxs("div", { className: "seo-check", "data-st": c.status, children: [
        /* @__PURE__ */ jsx("span", { className: "seo-dot" }),
        /* @__PURE__ */ jsx("span", { className: "seo-clabel", children: c.label }),
        /* @__PURE__ */ jsx("span", { className: "seo-cdetail", children: c.detail })
      ] }, i)) })
    ] })
  ] }) });
}

const prerender = false;
const $$Seo = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "SEO Audit \xB7 Inovision Studio OS", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SeoPage", SeoPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/SeoPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/seo.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/seo.astro";
const $$url = "/admin/seo";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Seo,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
