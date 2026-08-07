import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
export { renderers } from '../../renderers.mjs';

const FONTS = [
  { k: "instrument", l: "Instrument Serif (classy)" },
  { k: "clash", l: "Clash Display (bold)" },
  { k: "geist", l: "Geist (clean)" }
];
const TEXT_FIELDS = [
  { k: "content.hero.kicker", l: "Hero eyebrow", ph: "Web Design · Custom Stacks · SEO" },
  { k: "content.hero.title", l: "Hero headline", ph: "Web design that" },
  { k: "content.hero.accent", l: "Hero headline (gold word)", ph: "ranks." },
  { k: "content.hero.lead", l: "Hero paragraph", ph: "Custom websites on hand-engineered stacks…", big: true }
];
const IMG_SLOTS = [
  { k: "content.hero.video", l: "Hero background (video or image)", def: "/hero-vex-video.mp4", video: true },
  { k: "content.svc.0.img", l: "Service 1 — 3D & Visual", def: "/character-vex-01.webp" },
  { k: "content.svc.1.img", l: "Service 2 — AI Integrations", def: "/mibudz-render-raspberry.webp" },
  { k: "content.svc.2.img", l: "Service 3 — Tooling", def: "/btk-vape-design.webp" },
  { k: "content.svc.3.img", l: "Service 4 — Custom Frameworks", def: "/btk-archviz-bath-white.webp" },
  { k: "content.work.0.img", l: "Selected work 1 — Mi Budz", def: "/portfolio-mi-budz.webp" },
  { k: "content.work.1.img", l: "Selected work 2 — Redeye", def: "/portfolio-redeye.webp" },
  { k: "content.work.2.img", l: "Selected work 3 — Corner Store", def: "/portfolio-cornerstore.webp" },
  { k: "content.work.3.img", l: "Selected work 4 — Summer Skin", def: "/portfolio-summerskin.webp" },
  { k: "content.about.founder", l: "About — founder photo", def: "/bartlomiejkrawiecki.webp" }
];
function EditorPage() {
  const [vals, setVals] = useState({});
  const [library, setLibrary] = useState([]);
  const [picking, setPicking] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef(null);
  useEffect(() => {
    fetch("/api/admin/settings").then((r) => r.json()).then((d) => setVals(d.settings || {})).catch(() => {
    });
    fetch("/api/admin/media").then((r) => r.json()).then((d) => setLibrary(d.items || [])).catch(() => {
    });
  }, []);
  const set = (k, v) => {
    setVals((s) => ({ ...s, [k]: v }));
    setSaved(false);
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
    const d = await (await fetch("/api/admin/media")).json();
    setLibrary(d.items || []);
    setUploading(false);
  }
  async function save() {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(vals)
      });
      setSaved(true);
    } catch {
    }
    setSaving(false);
  }
  return /* @__PURE__ */ jsx(AdminShell, { active: "editor", title: "Site Editor", subtitle: "Change fonts, colors, key images, and text — live on the site. No layout moving.", children: /* @__PURE__ */ jsxs("div", { className: "tool", children: [
    /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
      /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Theme — font" }),
      /* @__PURE__ */ jsx("div", { className: "tool-row", children: FONTS.map((f) => /* @__PURE__ */ jsx("button", { className: `tool-chip${(vals["theme.font"] || "instrument") === f.k ? " on" : ""}`, onClick: () => set("theme.font", f.k), children: f.l }, f.k)) }),
      /* @__PURE__ */ jsx("p", { className: "tool-label", style: { marginTop: "1.4rem" }, children: "Theme — colors" }),
      /* @__PURE__ */ jsxs("div", { className: "tool-row", style: { gap: "1.4rem" }, children: [
        /* @__PURE__ */ jsxs("label", { className: "ed-color", children: [
          "Accent ",
          /* @__PURE__ */ jsx("input", { type: "color", value: vals["theme.accent"] || "#e6c878", onChange: (e) => set("theme.accent", e.target.value) })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "ed-color", children: [
          "Accent bright ",
          /* @__PURE__ */ jsx("input", { type: "color", value: vals["theme.accentBright"] || "#f6e2a6", onChange: (e) => set("theme.accentBright", e.target.value) })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => {
          set("theme.accent", "");
          set("theme.accentBright", "");
          set("theme.font", "");
        }, children: "Reset theme" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
      /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Text" }),
      TEXT_FIELDS.map((f) => /* @__PURE__ */ jsxs("div", { style: { marginBottom: "0.9rem" }, children: [
        /* @__PURE__ */ jsx("label", { className: "ed-flabel", children: f.l }),
        f.big ? /* @__PURE__ */ jsx("textarea", { className: "tool-textarea", value: vals[f.k] || "", placeholder: f.ph, onChange: (e) => set(f.k, e.target.value) }) : /* @__PURE__ */ jsx("input", { className: "tool-input", value: vals[f.k] || "", placeholder: f.ph, onChange: (e) => set(f.k, e.target.value) })
      ] }, f.k))
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
      /* @__PURE__ */ jsxs("div", { className: "tool-row", style: { justifyContent: "space-between" }, children: [
        /* @__PURE__ */ jsx("p", { className: "tool-label", style: { margin: 0 }, children: "Images" }),
        /* @__PURE__ */ jsx("button", { className: "tool-btn tool-ghost", disabled: uploading, onClick: () => fileRef.current?.click(), children: uploading ? "Uploading…" : "Upload to library" }),
        /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: "image/*", multiple: true, hidden: true, onChange: (e) => upload(e.target.files) })
      ] }),
      IMG_SLOTS.map((s) => {
        const cur = vals[s.k] || s.def || "";
        const isVid = /\.mp4$/i.test(cur);
        const custom = !!vals[s.k];
        return /* @__PURE__ */ jsxs("div", { className: "ed-slot", children: [
          /* @__PURE__ */ jsx("div", { className: "ed-slot-prev", children: cur ? isVid ? /* @__PURE__ */ jsx("video", { src: cur, muted: true, loop: true, autoPlay: true, playsInline: true }) : /* @__PURE__ */ jsx("img", { src: cur, alt: s.l }) : /* @__PURE__ */ jsx("span", { className: "ed-none", children: "none" }) }),
          /* @__PURE__ */ jsxs("div", { className: "ed-slot-main", children: [
            /* @__PURE__ */ jsxs("label", { className: "ed-flabel", children: [
              s.l,
              " ",
              /* @__PURE__ */ jsx("em", { className: `ed-tag${custom ? " custom" : ""}`, children: custom ? "custom" : "default" })
            ] }),
            /* @__PURE__ */ jsx("input", { className: "tool-input", value: vals[s.k] || "", placeholder: s.def, onChange: (e) => set(s.k, e.target.value) }),
            /* @__PURE__ */ jsxs("div", { className: "ed-slot-act", children: [
              /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => setPicking(picking === s.k ? null : s.k), children: picking === s.k ? "Close" : "Swap from library" }),
              custom && /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => set(s.k, ""), children: "Reset to default" })
            ] })
          ] }),
          picking === s.k && /* @__PURE__ */ jsxs("div", { className: "ed-picker", children: [
            /* @__PURE__ */ jsx("button", { className: "ed-pick-up", onClick: () => fileRef.current?.click(), children: "+ Upload new" }),
            library.length === 0 ? /* @__PURE__ */ jsx("p", { className: "tool-label", style: { gridColumn: "1 / -1" }, children: 'No images in the library yet — upload one or generate in Image Studio and "Save to library".' }) : library.map((m) => /* @__PURE__ */ jsx("button", { className: `media-thumb${cur === m.url ? " on" : ""}`, onClick: () => {
              set(s.k, m.url);
              setPicking(null);
            }, children: /* @__PURE__ */ jsx("img", { src: m.url, alt: m.ref }) }, m.name))
          ] })
        ] }, s.k);
      })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "tool-row", children: [
      /* @__PURE__ */ jsx("button", { className: "tool-btn", disabled: saving, onClick: save, children: saving ? "Saving…" : "Save & publish" }),
      saved && /* @__PURE__ */ jsx("span", { className: "tool-label", style: { margin: 0, color: "#58d6a0" }, children: "Saved — live on the site." }),
      /* @__PURE__ */ jsx("a", { className: "tool-chip", href: "/", target: "_blank", rel: "noreferrer", children: "View site ↗" })
    ] })
  ] }) });
}

const prerender = false;
const $$Editor = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Site Editor \xB7 Inovision Studio OS", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "EditorPage", EditorPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/EditorPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/editor.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/editor.astro";
const $$url = "/admin/editor";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Editor,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
