import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
export { renderers } from '../../renderers.mjs';

function SecurityPage() {
  const [me, setMe] = useState({ email: "", name: "" });
  const [cur, setCur] = useState("");
  const [nw, setNw] = useState("");
  const [nw2, setNw2] = useState("");
  const [msg, setMsg] = useState("");
  const [err, setErr] = useState("");
  useEffect(() => {
    fetch("/api/admin/me").then((r) => r.json()).then((d) => setMe({ email: d.email, name: d.name }));
  }, []);
  async function change() {
    setMsg("");
    setErr("");
    if (nw !== nw2) {
      setErr("New passwords don't match.");
      return;
    }
    if (nw.length < 6) {
      setErr("New password must be at least 6 characters.");
      return;
    }
    const d = await (await fetch("/api/admin/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ current: cur, next: nw }) })).json();
    if (d.error) setErr(d.error);
    else {
      setMsg("Password changed. It's active immediately.");
      setCur("");
      setNw("");
      setNw2("");
    }
  }
  return /* @__PURE__ */ jsx(AdminShell, { active: "security", title: "Security", subtitle: `Your account — ${me.name || me.email || "…"}`, children: /* @__PURE__ */ jsxs("div", { className: "tool", children: [
    /* @__PURE__ */ jsxs("div", { className: "tool-panel", style: { maxWidth: 480 }, children: [
      /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Change your password" }),
      /* @__PURE__ */ jsxs("div", { style: { display: "grid", gap: "0.7rem" }, children: [
        /* @__PURE__ */ jsx("input", { className: "tool-input", type: "password", placeholder: "Current password", value: cur, onChange: (e) => setCur(e.target.value), autoComplete: "current-password" }),
        /* @__PURE__ */ jsx("input", { className: "tool-input", type: "password", placeholder: "New password (min 6 characters)", value: nw, onChange: (e) => setNw(e.target.value), autoComplete: "new-password" }),
        /* @__PURE__ */ jsx("input", { className: "tool-input", type: "password", placeholder: "Confirm new password", value: nw2, onChange: (e) => setNw2(e.target.value), autoComplete: "new-password" }),
        /* @__PURE__ */ jsx("button", { className: "tool-btn", onClick: change, disabled: !cur || !nw, style: { justifySelf: "start" }, children: "Update password" }),
        msg && /* @__PURE__ */ jsx("p", { className: "tool-label", style: { color: "#58d6a0", margin: 0 }, children: msg }),
        err && /* @__PURE__ */ jsx("p", { className: "tool-err", style: { margin: 0 }, children: err })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "tool-panel", style: { maxWidth: 480 }, children: [
      /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Session" }),
      /* @__PURE__ */ jsxs("p", { style: { color: "var(--ad-silver)", fontSize: "0.9rem", lineHeight: 1.6, margin: 0 }, children: [
        "Signed in as ",
        /* @__PURE__ */ jsx("b", { style: { color: "#fff" }, children: me.name }),
        " (",
        me.email,
        "). Sessions are signed, HTTP-only, and expire after 12 hours. Only your own password can be changed here — each admin has their own."
      ] })
    ] })
  ] }) });
}

const prerender = false;
const $$Security = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Security \xB7 Inovision Studio OS", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "SecurityPage", SecurityPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/SecurityPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/security.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/security.astro";
const $$url = "/admin/security";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Security,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
