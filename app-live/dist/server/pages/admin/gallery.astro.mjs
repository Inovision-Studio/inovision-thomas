import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
export { renderers } from '../../renderers.mjs';

function GalleryEditorPage() {
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
    fetch("/api/admin/gallery").then((r) => r.json()).then(
      (d) => setItems((d.items || []).map((g) => ({ url: g.url, title: g.title || "", category: g.category || "" })))
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
  const add = (url) => {
    setItems((a) => [{ url, title: "", category: "" }, ...a]);
    setAdding(false);
    dirty();
  };
  async function upload(files) {
    if (!files?.length) return;
    setUploading(true);
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", f);
      try {
        await fetch("/api/admin/media", { method: "POST", body: fd });
      } catch {
      }
    }
    loadLib();
    setUploading(false);
  }
  async function save() {
    setSaving(true);
    try {
      await fetch("/api/admin/gallery", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ items }) });
      setSaved(true);
    } catch {
    }
    setSaving(false);
  }
  return /* @__PURE__ */ jsx(AdminShell, { active: "gallery", title: "Gallery Editor", subtitle: "Add, remove, reorder, and re-caption the work showcase.", children: /* @__PURE__ */ jsxs("div", { className: "tool", children: [
    /* @__PURE__ */ jsxs("div", { className: "tool-row", children: [
      /* @__PURE__ */ jsx("button", { className: "tool-btn", onClick: () => setAdding((v) => !v), children: adding ? "Close" : "Add image" }),
      /* @__PURE__ */ jsx("button", { className: "tool-btn tool-ghost", disabled: uploading, onClick: () => fileRef.current?.click(), children: uploading ? "Uploading…" : "Upload new" }),
      /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: "image/*", multiple: true, hidden: true, onChange: (e) => upload(e.target.files) }),
      /* @__PURE__ */ jsx("button", { className: "tool-btn", disabled: saving, onClick: save, children: saving ? "Saving…" : "Save & publish" }),
      saved && /* @__PURE__ */ jsx("span", { className: "tool-label", style: { margin: 0, color: "#58d6a0" }, children: "Saved — live." }),
      /* @__PURE__ */ jsxs("span", { className: "tool-label", style: { margin: 0 }, children: [
        items.length,
        " images"
      ] })
    ] }),
    adding && /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
      /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Pick from library" }),
      library.length === 0 ? /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Upload images first." }) : /* @__PURE__ */ jsx("div", { className: "tool-grid", children: library.map((m) => /* @__PURE__ */ jsx("button", { className: "media-thumb", onClick: () => add(m.url), children: /* @__PURE__ */ jsx("img", { src: m.url, alt: m.ref }) }, m.name)) })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "gal-list", children: items.map((it, i) => /* @__PURE__ */ jsxs("div", { className: "gal-row", children: [
      /* @__PURE__ */ jsx("img", { className: "gal-thumb", src: it.url, alt: it.title }),
      /* @__PURE__ */ jsxs("div", { className: "gal-fields", children: [
        /* @__PURE__ */ jsx("input", { className: "tool-input", value: it.title, placeholder: "Title", onChange: (e) => edit(i, "title", e.target.value) }),
        /* @__PURE__ */ jsx("input", { className: "tool-input", value: it.category, placeholder: "Category", onChange: (e) => edit(i, "category", e.target.value) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "gal-act", children: [
        /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => move(i, -1), title: "Up", children: "↑" }),
        /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => move(i, 1), title: "Down", children: "↓" }),
        /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => remove(i), title: "Remove", children: "✕" })
      ] })
    ] }, it.url + i)) })
  ] }) });
}

const prerender = false;
const $$Gallery = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Gallery Editor \xB7 Inovision Studio OS", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "GalleryEditorPage", GalleryEditorPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/GalleryEditorPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/gallery.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/gallery.astro";
const $$url = "/admin/gallery";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Gallery,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
