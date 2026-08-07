import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
export { renderers } from '../../renderers.mjs';

const ASPECTS = ["1:1", "16:9", "9:16", "4:3", "3:4", "3:2", "2:3", "21:9"];
function ImageStudioPage() {
  const [mode, setMode] = useState("generate");
  const [prompt, setPrompt] = useState("");
  const [aspect, setAspect] = useState("1:1");
  const [library, setLibrary] = useState([]);
  const [selected, setSelected] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [err, setErr] = useState("");
  const [needsKey, setNeedsKey] = useState(false);
  const [savedUrls, setSavedUrls] = useState([]);
  const fileRef = useRef(null);
  const taRef = useRef(null);
  async function loadLibrary() {
    try {
      const d = await (await fetch("/api/admin/media")).json();
      setLibrary(d.items || []);
    } catch {
    }
  }
  useEffect(() => {
    loadLibrary();
  }, []);
  async function saveToLibrary(imgUrl) {
    try {
      const d = await (await fetch("/api/admin/save-image", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ url: imgUrl }) })).json();
      if (d.ok) {
        setSavedUrls((s) => [...s, imgUrl]);
        loadLibrary();
      } else setErr(d.error || "Could not save");
    } catch (e) {
      setErr(String(e));
    }
  }
  async function upload(files) {
    if (!files?.length) return;
    setUploading(true);
    setErr("");
    for (const f of Array.from(files)) {
      const fd = new FormData();
      fd.append("file", f);
      try {
        const d = await (await fetch("/api/admin/media", { method: "POST", body: fd })).json();
        if (d.error) setErr(d.error);
      } catch (e) {
        setErr(String(e));
      }
    }
    setUploading(false);
    loadLibrary();
  }
  function reference(m) {
    setPrompt((p) => p.includes("@" + m.ref) ? p : (p ? p + " " : "") + "@" + m.ref + " ");
    setSelected((s) => s.includes(m.ref) ? s : [...s, m.ref]);
    taRef.current?.focus();
  }
  function unselect(ref) {
    setSelected((s) => s.filter((r) => r !== ref));
    setPrompt((p) => p.replace(new RegExp("@" + ref + "\\s?", "g"), "").trim());
  }
  async function run() {
    setLoading(true);
    setErr("");
    setNeedsKey(false);
    try {
      let d;
      if (mode === "edit") {
        const urls = selected.map((ref) => library.find((m) => m.ref === ref)?.url).filter(Boolean);
        d = await (await fetch("/api/admin/image-edit", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, images: urls, aspect })
        })).json();
      } else {
        d = await (await fetch("/api/admin/image", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt, aspect })
        })).json();
      }
      if (d.needsKey) setNeedsKey(true);
      else if (d.error) setErr(d.error);
      else setImages(d.images || []);
    } catch (e) {
      setErr(String(e));
    }
    setLoading(false);
  }
  const canRun = prompt.trim() && (mode === "generate" || selected.length > 0);
  return /* @__PURE__ */ jsx(AdminShell, { active: "image", title: "AI Image Studio", subtitle: "fal Seedream 4.5 · generate or edit · @-reference your library · capped at 2K.", children: /* @__PURE__ */ jsxs("div", { className: "tool", children: [
    needsKey && /* @__PURE__ */ jsxs("div", { className: "tool-note", children: [
      "Add ",
      /* @__PURE__ */ jsx("code", { children: "FAL_KEY" }),
      " to the server ",
      /* @__PURE__ */ jsx("code", { children: ".env" }),
      " to activate ",
      mode === "edit" ? "image editing" : "image generation",
      "."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "tool-row", children: [
      /* @__PURE__ */ jsx("button", { className: `tool-chip${mode === "generate" ? " on" : ""}`, onClick: () => {
        setMode("generate");
        setAspect("1:1");
      }, children: "Generate" }),
      /* @__PURE__ */ jsx("button", { className: `tool-chip${mode === "edit" ? " on" : ""}`, onClick: () => {
        setMode("edit");
        setAspect("match");
      }, children: "Edit / Seedream" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
      /* @__PURE__ */ jsx("p", { className: "tool-label", children: mode === "edit" ? "Describe the edit (use @ to reference images)" : "Prompt (use @ to reference a style image)" }),
      /* @__PURE__ */ jsx(
        "textarea",
        {
          ref: taRef,
          className: "tool-textarea",
          value: prompt,
          onChange: (e) => setPrompt(e.target.value),
          placeholder: mode === "edit" ? "Make @hero-shot warmer, add gold rim light and a darker background…" : "A cinematic matte-black vape device, gold rim light, studio backdrop…"
        }
      ),
      selected.length > 0 && /* @__PURE__ */ jsx("div", { className: "tool-row", style: { marginTop: "0.7rem" }, children: selected.map((r) => /* @__PURE__ */ jsxs("button", { className: "tool-chip on", onClick: () => unselect(r), children: [
        "@",
        r,
        " ✕"
      ] }, r)) }),
      /* @__PURE__ */ jsx("p", { className: "tool-label", style: { marginTop: "1rem" }, children: mode === "edit" ? "Output aspect ratio" : "Aspect ratio" }),
      /* @__PURE__ */ jsxs("div", { className: "tool-row", children: [
        mode === "edit" && /* @__PURE__ */ jsx("button", { className: `tool-chip${aspect === "match" ? " on" : ""}`, onClick: () => setAspect("match"), children: "Match input" }),
        ASPECTS.map((a) => /* @__PURE__ */ jsx("button", { className: `tool-chip${aspect === a ? " on" : ""}`, onClick: () => setAspect(a), children: a }, a))
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "tool-row", style: { marginTop: "1.2rem" }, children: [
        /* @__PURE__ */ jsx("button", { className: "tool-btn", disabled: loading || !canRun, onClick: run, children: loading ? mode === "edit" ? "Editing…" : "Generating…" : mode === "edit" ? "Apply edit" : "Generate" }),
        /* @__PURE__ */ jsx("span", { className: "tool-label", style: { margin: 0 }, children: "Max 2K" })
      ] }),
      err && /* @__PURE__ */ jsx("p", { className: "tool-err", children: err })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
      /* @__PURE__ */ jsxs("div", { className: "tool-row", style: { justifyContent: "space-between" }, children: [
        /* @__PURE__ */ jsx("p", { className: "tool-label", style: { margin: 0 }, children: "Image library — click to @reference" }),
        /* @__PURE__ */ jsx("button", { className: "tool-btn tool-ghost", disabled: uploading, onClick: () => fileRef.current?.click(), children: uploading ? "Uploading…" : "Upload" }),
        /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: "image/*", multiple: true, hidden: true, onChange: (e) => upload(e.target.files) })
      ] }),
      library.length === 0 ? /* @__PURE__ */ jsx("p", { className: "tool-label", style: { marginTop: "0.8rem" }, children: "No images yet — upload to start." }) : /* @__PURE__ */ jsx("div", { className: "tool-grid", style: { marginTop: "1rem" }, children: library.map((m) => /* @__PURE__ */ jsx("button", { className: `media-thumb${selected.includes(m.ref) ? " on" : ""}`, onClick: () => reference(m), title: "@" + m.ref, children: /* @__PURE__ */ jsx("img", { src: m.url, alt: m.ref }) }, m.name)) })
    ] }),
    images.length > 0 && /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
      /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Results — save any to your library to use it on the site" }),
      /* @__PURE__ */ jsx("div", { className: "tool-grid", children: images.map((src, i) => /* @__PURE__ */ jsxs("div", { className: "res-item", children: [
        /* @__PURE__ */ jsx("a", { href: src, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsx("img", { src, alt: "Result" }) }),
        /* @__PURE__ */ jsx("button", { className: "tool-chip", disabled: savedUrls.includes(src), onClick: () => saveToLibrary(src), children: savedUrls.includes(src) ? "✓ Saved" : "Save to library" })
      ] }, i)) })
    ] })
  ] }) });
}

const prerender = false;
const $$Image = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Image Studio \xB7 Inovision Studio OS", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "ImageStudioPage", ImageStudioPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/ImageStudioPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/image.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/image.astro";
const $$url = "/admin/image";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Image,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
