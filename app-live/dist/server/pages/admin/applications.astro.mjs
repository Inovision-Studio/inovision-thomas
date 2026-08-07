import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
export { renderers } from '../../renderers.mjs';

function ApplicationsPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetch("/api/admin/applications").then((r) => r.json()).then((d) => setItems(d.items || []));
  }, []);
  const dt = (t) => new Date(t).toLocaleString();
  const del = async (id) => {
    await fetch("/api/admin/applications?id=" + id, { method: "DELETE" });
    setItems((i) => i.filter((x) => x.id !== id));
  };
  return /* @__PURE__ */ jsx(AdminShell, { active: "applications", title: "Applications", subtitle: "Job applications + résumés, straight from the careers page.", children: /* @__PURE__ */ jsxs("div", { className: "tool", children: [
    items.length === 0 && /* @__PURE__ */ jsx("p", { className: "tool-label", children: "No applications yet." }),
    items.map((a) => /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
      /* @__PURE__ */ jsxs("div", { className: "tool-row", style: { justifyContent: "space-between" }, children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsx("b", { style: { color: "#fff" }, children: a.name }),
          " ",
          /* @__PURE__ */ jsxs("span", { style: { color: "var(--ad-silver-2)" }, children: [
            "· ",
            a.role
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "0.7rem" }, children: [
          /* @__PURE__ */ jsx("span", { className: "tool-label", style: { margin: 0 }, children: dt(a.created_at) }),
          /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => del(a.id), title: "Delete", children: "✕" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("p", { className: "tool-label", style: { margin: "0.5rem 0", textTransform: "none", letterSpacing: 0 }, children: [
        /* @__PURE__ */ jsx("a", { href: `mailto:${a.email}`, style: { color: "var(--ad-gold)" }, children: a.email }),
        a.phone ? " · " + a.phone : ""
      ] }),
      a.message && /* @__PURE__ */ jsx("p", { style: { color: "#cdd0d8", fontSize: "0.92rem", lineHeight: 1.5, margin: "0 0 0.6rem" }, children: a.message }),
      /* @__PURE__ */ jsxs("p", { className: "tool-label", style: { margin: "0.4rem 0" }, children: [
        "Work auth: ",
        a.work_auth || "—",
        " · Veteran: ",
        a.veteran || "—",
        " · Disability: ",
        a.disability || "—"
      ] }),
      a.resume_name ? /* @__PURE__ */ jsxs("a", { className: "tool-chip", href: `/api/admin/resume?name=${a.resume_name}`, children: [
        "📄 Download résumé (",
        a.resume_name.split(".").pop()?.toUpperCase(),
        ") ↓"
      ] }) : /* @__PURE__ */ jsx("span", { className: "tool-label", style: { margin: 0, color: "var(--ad-silver-2)" }, children: "No résumé attached" })
    ] }, a.id))
  ] }) });
}

const prerender = false;
const $$Applications = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Applications \xB7 Inovision Studio OS", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ApplicationsPage", ApplicationsPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/ApplicationsPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/applications.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/applications.astro";
const $$url = "/admin/applications";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Applications,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
