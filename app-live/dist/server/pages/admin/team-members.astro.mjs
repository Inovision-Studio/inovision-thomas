import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
export { renderers } from '../../renderers.mjs';

function TeamMembersEditorPage() {
  const [items, setItems] = useState([]);
  const [library, setLibrary] = useState([]);
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  function loadLib() {
    fetch("/api/admin/media").then((r) => r.json()).then((d) => setLibrary(d.items || []));
  }
  useEffect(() => {
    fetch("/api/admin/team-members").then((r) => r.json()).then(
      (d) => setItems((d.items || []).map((m) => ({ name: m.name || "", title: m.title || "", image: m.image || "" })))
    );
    loadLib();
  }, []);
  const dirty = () => setSaved(false);
  const move = (i, d) => {
    setItems((arr) => {
      const n = [...arr];
      const j = i + d;
      if (j < 0 || j >= n.length) return n;
      [n[i], n[j]] = [n[j], n[i]];
      return n;
    });
    dirty();
  };
  const remove = (i) => {
    setItems((a) => a.filter((_, k) => k !== i));
    dirty();
  };
  const edit = (i, k, v) => {
    setItems((a) => a.map((it, idx) => idx === i ? { ...it, [k]: v } : it));
    dirty();
  };
  const add = () => {
    setItems((a) => [{ name: "", title: "", image: "" }, ...a]);
    dirty();
  };
  async function upload(i, files) {
    const f = files?.[0];
    if (!f) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", f);
      const r = await fetch("/api/admin/media", { method: "POST", body: fd });
      const d = await r.json();
      if (d?.url) edit(i, "image", d.url);
      loadLib();
    } catch {
    }
    setUploading(false);
  }
  async function save() {
    setSaving(true);
    try {
      await fetch("/api/admin/team-members", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items }) });
      setSaved(true);
    } catch {
    }
    setSaving(false);
  }
  return /* @__PURE__ */ jsx(AdminShell, { active: "team-members", title: "Team Members", subtitle: "Add, remove, reorder, and edit the public team roster.", children: /* @__PURE__ */ jsxs("div", { className: "tool", children: [
    /* @__PURE__ */ jsxs("div", { className: "tool-row", children: [
      /* @__PURE__ */ jsx("button", { className: "tool-btn", onClick: add, children: "Add member" }),
      /* @__PURE__ */ jsx("button", { className: "tool-btn", disabled: saving, onClick: save, children: saving ? "Saving…" : "Save & publish" }),
      saved && /* @__PURE__ */ jsx("span", { className: "tool-label", style: { margin: 0, color: "#58d6a0" }, children: "Saved — live." }),
      /* @__PURE__ */ jsxs("span", { className: "tool-label", style: { margin: 0 }, children: [
        items.length,
        " members"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "gal-list", children: items.map((it, i) => /* @__PURE__ */ jsxs("div", { className: "gal-row", children: [
      it.image ? /* @__PURE__ */ jsx("img", { className: "gal-thumb", src: it.image, alt: it.name }) : /* @__PURE__ */ jsx("div", { className: "gal-thumb", style: { display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#888" }, children: "No photo" }),
      /* @__PURE__ */ jsxs("div", { className: "gal-fields", children: [
        /* @__PURE__ */ jsx("input", { className: "tool-input", value: it.name, placeholder: "Name", onChange: (e) => edit(i, "name", e.target.value) }),
        /* @__PURE__ */ jsx("input", { className: "tool-input", value: it.title, placeholder: "Title", onChange: (e) => edit(i, "title", e.target.value) }),
        /* @__PURE__ */ jsx("input", { type: "file", accept: "image/*", disabled: uploading, onChange: (e) => upload(i, e.target.files) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "gal-act", children: [
        /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => move(i, -1), title: "Up", children: "↑" }),
        /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => move(i, 1), title: "Down", children: "↓" }),
        /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => remove(i), title: "Remove", children: "✕" })
      ] })
    ] }, i)) })
  ] }) });
}

const prerender = false;
const $$TeamMembers = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Team Members \xB7 Inovision Studio OS", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "TeamMembersEditorPage", TeamMembersEditorPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/TeamMembersEditorPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/team-members.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/team-members.astro";
const $$url = "/admin/team-members";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$TeamMembers,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
