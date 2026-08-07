import { jsxs, jsx } from 'react/jsx-runtime';
import { A as AdminShell } from './AdminShell_DPOdjpGZ.mjs';
import { useState, useCallback, useRef } from 'react';

const TEMPLATES = [
  {
    value: "editorial",
    name: "Editorial",
    desc: "Hero image + drop-cap body. The default."
  },
  {
    value: "gallery",
    name: "Gallery",
    desc: "All images in a grid, then body text."
  },
  {
    value: "photo-essay",
    name: "Photo Essay",
    desc: "Images stacked with captions between."
  },
  {
    value: "minimal",
    name: "Minimal",
    desc: "Pure typography, no images shown."
  }
];
function PostEditor({
  initial,
  mode
}) {
  const [draft, setDraft] = useState(initial);
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const bodyRef = useRef(null);
  const update = useCallback((key, value) => {
    setDraft((d) => ({ ...d, [key]: value }));
  }, []);
  function insertImageToken(n) {
    const ta = bodyRef.current;
    const tok = "[img:" + n + "]";
    const body = draft.body || "";
    let at = body.length;
    if (ta && typeof ta.selectionStart === "number") at = ta.selectionStart;
    let before = body.slice(0, at).replace(/\s+$/, "");
    const after = body.slice(at).replace(/^\s+/, "");
    const next = (before ? before + "\n\n" : "") + tok + (after ? "\n\n" + after : "\n\n");
    update("body", next);
    const caret = (before ? before.length + 2 : 0) + tok.length;
    requestAnimationFrame(() => {
      if (ta) {
        ta.focus();
        try {
          ta.setSelectionRange(caret, caret);
        } catch {
        }
      }
    });
  }
  async function uploadFiles(files) {
    setError("");
    setUploading(true);
    try {
      const arr = Array.from(files).slice(0, Math.max(0, 20 - draft.images.length));
      const next = [];
      for (const file of arr) {
        if (!file.type.startsWith("image/")) continue;
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          body: fd
        });
        const j = await res.json().catch(() => ({}));
        if (!res.ok) {
          setError(j?.error || "Upload failed");
          break;
        }
        next.push({ url: j.url, alt: "" });
      }
      if (next.length) {
        update("images", [...draft.images, ...next].slice(0, 20));
      }
    } finally {
      setUploading(false);
    }
  }
  function onDrop(e) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files?.length) {
      uploadFiles(e.dataTransfer.files);
    }
  }
  function removeImage(idx) {
    update(
      "images",
      draft.images.filter((_, i) => i !== idx)
    );
  }
  async function save(publish) {
    setError("");
    setPending(true);
    const payload = {
      ...draft,
      published: publish !== void 0 ? publish : draft.published
    };
    try {
      const url = mode === "create" ? "/api/admin/posts" : `/api/admin/posts/${draft.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const j = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(j?.error || "Save failed");
        setPending(false);
        return;
      }
      window.location.href = "/admin/posts";
    } catch {
      setError("Network error");
      setPending(false);
    }
  }
  async function remove() {
    if (mode !== "edit" || !draft.id) return;
    if (!confirm("Delete this post? This cannot be undone.")) return;
    setPending(true);
    try {
      const res = await fetch(`/api/admin/posts/${draft.id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" }
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || "Delete failed");
        setPending(false);
        return;
      }
      window.location.href = "/admin/posts";
    } catch {
      setError("Network error");
      setPending(false);
    }
  }
  function applyTemplateText(t) {
    if (draft.body.trim().length > 0) {
      update("template", t);
      return;
    }
    const stub = {
      editorial: "Open with a single strong sentence that promises something specific.\n\nFollow with two or three paragraphs that deliver on the promise. Keep sentences varied — long, then short. Long, then short.\n\nClose with one line the reader will remember.",
      gallery: "A few sentences of context for the images above.\n\nWho the work was for, what the brief asked, and one specific decision you made along the way.\n\nKeep it brief. The work is the point.",
      "photo-essay": "Use the body for the overall narrative.\n\nThe captions on each image carry the specific story beats.\n\nLet the rhythm of image, breath, image, breath do most of the work.",
      minimal: "Pure prose, no images shown.\n\nUse this template for thinking pieces, manifestos, or short essays where the typography is the design.\n\nGive every sentence room to land."
    };
    setDraft((d) => ({ ...d, template: t, body: stub[t] }));
  }
  return /* @__PURE__ */ jsxs("div", { className: "iv-editor", children: [
    /* @__PURE__ */ jsxs("div", { children: [
      /* @__PURE__ */ jsxs("div", { className: "iv-editor-field", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "ed-title", children: "Title" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "ed-title",
            type: "text",
            className: "iv-title",
            value: draft.title,
            onChange: (e) => update("title", e.target.value),
            placeholder: "A title worth reading.",
            maxLength: 200
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "iv-editor-field", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "ed-sub", children: "Subtitle (optional)" }),
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "ed-sub",
            type: "text",
            value: draft.subtitle,
            onChange: (e) => update("subtitle", e.target.value),
            placeholder: "A short line that earns the click.",
            maxLength: 240
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "iv-editor-field", children: [
        /* @__PURE__ */ jsx("label", { htmlFor: "ed-body", children: "Body" }),
        /* @__PURE__ */ jsx(
          "textarea",
          {
            id: "ed-body",
            ref: bodyRef,
            className: "iv-body",
            value: draft.body,
            onChange: (e) => update("body", e.target.value),
            placeholder: "Write here. Line breaks are preserved. Drag an image thumbnail straight into the text to place it.",
            maxLength: 5e4,
            onDragOver: (ev) => {
              ev.stopPropagation();
            },
            onDrop: (ev) => {
              ev.stopPropagation();
            }
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              marginTop: 6,
              fontSize: 11,
              color: "var(--muted)",
              textAlign: "right"
            },
            children: [
              draft.body.length.toLocaleString(),
              " characters"
            ]
          }
        )
      ] }),
      error && /* @__PURE__ */ jsx("div", { className: "iv-form-error", role: "alert", style: { marginTop: 12 }, children: error }),
      /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            display: "flex",
            gap: 10,
            marginTop: 24,
            flexWrap: "wrap"
          },
          children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "iv-admin-btn iv-admin-btn-primary",
                disabled: pending,
                onClick: () => save(true),
                children: pending ? "Saving…" : draft.published ? "Update & Publish" : "Publish"
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "iv-admin-btn",
                disabled: pending,
                onClick: () => save(false),
                children: "Save as Draft"
              }
            ),
            mode === "edit" && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "iv-admin-btn iv-admin-btn-danger",
                disabled: pending,
                onClick: remove,
                style: { marginLeft: "auto" },
                children: "Delete"
              }
            ),
            /* @__PURE__ */ jsx(
              "a",
              {
                href: "/admin/posts",
                className: "iv-admin-btn",
                style: { marginLeft: mode === "edit" ? 0 : "auto" },
                children: "Cancel"
              }
            )
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxs("aside", { className: "iv-editor-side", children: [
      /* @__PURE__ */ jsxs("div", { className: "iv-editor-panel", children: [
        /* @__PURE__ */ jsx("h3", { children: "Template" }),
        /* @__PURE__ */ jsx("div", { className: "iv-template-grid", children: TEMPLATES.map((t) => /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            className: `iv-template-option ${draft.template === t.value ? "selected" : ""}`,
            onClick: () => applyTemplateText(t.value),
            children: [
              /* @__PURE__ */ jsx("div", { className: "name", children: t.name }),
              /* @__PURE__ */ jsx("div", { className: "desc", children: t.desc })
            ]
          },
          t.value
        )) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "iv-editor-panel", children: [
        /* @__PURE__ */ jsx("h3", { children: "Images (max 20)" }),
        /* @__PURE__ */ jsxs(
          "label",
          {
            htmlFor: "ed-files",
            className: `iv-dropzone ${dragging ? "dragging" : ""}`,
            onDragOver: (e) => {
              e.preventDefault();
              setDragging(true);
            },
            onDragLeave: () => setDragging(false),
            onDrop,
            children: [
              uploading ? "Uploading…" : draft.images.length >= 20 ? "Maximum 20 images reached" : "Drag images here or click to browse",
              /* @__PURE__ */ jsx(
                "input",
                {
                  id: "ed-files",
                  type: "file",
                  accept: "image/*",
                  multiple: true,
                  disabled: draft.images.length >= 20,
                  onChange: (e) => {
                    if (e.target.files) uploadFiles(e.target.files);
                    e.target.value = "";
                  }
                }
              )
            ]
          }
        ),
        draft.images.length > 0 && /* @__PURE__ */ jsx("div", { className: "iv-image-grid", children: draft.images.map((it, i) => {
          const url = typeof it === "string" ? it : it && it.url || "";
          const altText = typeof it === "string" ? "" : it && it.alt || "";
          return /* @__PURE__ */ jsxs("div", {
            className: "iv-image-thumb",
            draggable: true,
            title: "Drag me into the body text — or use the button below",
            style: { cursor: "grab" },
            onDragStart: (ev) => {
              try {
                ev.dataTransfer.setData("text/plain", "\n\n[img:" + (i + 1) + "]\n\n");
                ev.dataTransfer.effectAllowed = "copy";
              } catch {
              }
            },
            children: [
            /* @__PURE__ */ jsx("img", { src: url, alt: altText, loading: "lazy", decoding: "async", draggable: false }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                className: "iv-image-remove",
                "aria-label": "Remove image",
                onClick: () => removeImage(i),
                children: "×"
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: altText,
                placeholder: `Alt text — image ${i + 1}`,
                "aria-label": `Alt text for image ${i + 1}`,
                onChange: (ev) => update("images", draft.images.map((w, z) => z === i ? { url, alt: ev.target.value } : typeof w === "string" ? { url: w, alt: "" } : w)),
                style: { width: "100%", marginTop: 6, fontSize: 11, padding: "4px 6px", background: "rgba(0,0,0,.25)", border: "1px solid var(--border)", borderRadius: 4, color: "var(--text)" }
              }
            ),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                title: "Insert this image at the cursor position in the body",
                onClick: () => insertImageToken(i + 1),
                style: { marginTop: 4, fontSize: 11, width: "100%", padding: "4px 6px", cursor: "pointer", background: "transparent", border: "1px solid var(--border)", borderRadius: 4, color: "var(--muted)" },
                children: `Insert [img:${i + 1}] in text`
              }
            )
          ] }, url + "#" + i);
        }) }),
        /* @__PURE__ */ jsx(
          "p",
          {
            style: {
              fontSize: 11,
              color: "var(--muted)",
              marginTop: 10,
              lineHeight: 1.55
            },
            children: 'JPG, PNG, WebP, or GIF. 10 MB max each, auto-compressed to WebP on upload. Up to 20 per post. Fill in alt text for SEO and screen readers. Use "Insert in text" to place an image between paragraphs; anything not placed is arranged by the template. In the body, start a line with ## for a heading, ### for a sub-heading, #### for a sub-sub-heading.'
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "iv-editor-panel", children: [
        /* @__PURE__ */ jsx("h3", { children: "Status" }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              color: "var(--muted)"
            },
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  className: `iv-pill ${draft.published ? "iv-pill-pub" : "iv-pill-draft"}`,
                  children: draft.published ? "Published" : "Draft"
                }
              ),
              /* @__PURE__ */ jsxs(
                "label",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    cursor: "pointer"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: draft.published,
                        onChange: (e) => update("published", e.target.checked)
                      }
                    ),
                    /* @__PURE__ */ jsx("span", { style: { fontSize: 12 }, children: "Visible on /blog" })
                  ]
                }
              )
            ]
          }
        )
      ] })
    ] })
  ] });
}

function AdminPostEditorPage({
  mode,
  title,
  subtitle,
  initial
}) {
  return /* @__PURE__ */ jsx(AdminShell, { active: "posts", title, subtitle, children: /* @__PURE__ */ jsx(PostEditor, { mode, initial }) });
}

export { AdminPostEditorPage as A };
