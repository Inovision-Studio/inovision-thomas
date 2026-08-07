import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
export { renderers } from '../../renderers.mjs';

const BRIDGE = "http://localhost:8787/vex";
function MockupPage() {
  const [engine, setEngine] = useState("fast");
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState([]);
  const [html, setHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [needsKey, setNeedsKey] = useState(null);
  const [saved, setSaved] = useState([]);
  const [name, setName] = useState("");
  const [curId, setCurId] = useState(null);
  const scrollRef = useRef(null);
  function loadList() {
    fetch("/api/admin/mockups").then((r) => r.json()).then((d) => setSaved(d.items || []));
  }
  useEffect(() => {
    loadList();
  }, []);
  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setErr("");
    setNeedsKey(null);
    const next = [...msgs, { role: "user", content: text }];
    setMsgs(next);
    setInput("");
    setLoading(true);
    const apiMsgs = [...html ? [{ role: "assistant", content: "Current page HTML:\n" + html }] : [], ...next];
    const useBridge = engine === "claude" || engine === "codex";
    try {
      const d = useBridge ? await (await fetch(BRIDGE, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ engine, messages: apiMsgs }) })).json() : await (await fetch("/api/admin/generate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ mode: "mockup", engine: "fast", messages: apiMsgs }) })).json();
      if (d.needsKey) {
        setNeedsKey(d.env);
        setMsgs([...next, { role: "assistant", content: "Add the API key to start building." }]);
      } else if (d.error) {
        setErr(d.error);
        setMsgs([...next, { role: "assistant", content: "Hit an error — try again." }]);
      } else {
        setHtml(d.output);
        setMsgs([...next, { role: "assistant", content: html ? "Updated the page — see the preview." : "Built your first draft. Tell me what to change." }]);
      }
    } catch {
      if (useBridge) setErr("Can't reach the local Vex bridge. On your machine run:  node vex-bridge.mjs");
      else setErr("Network error.");
    }
    setLoading(false);
    requestAnimationFrame(() => scrollRef.current?.scrollTo({ top: 1e9 }));
  }
  async function save() {
    const nm = (name || "Untitled").trim();
    const d = await (await fetch("/api/admin/mockups", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: curId, name: nm, html, messages: msgs }) })).json();
    if (d.id) {
      setCurId(d.id);
      loadList();
    }
  }
  async function load(id) {
    if (!id) return;
    const d = await (await fetch("/api/admin/mockups?id=" + id)).json();
    if (d.mockup) {
      setHtml(d.mockup.html);
      setMsgs(d.mockup.messages || []);
      setName(d.mockup.name);
      setCurId(d.mockup.id);
    }
  }
  function download() {
    const b = new Blob([html], { type: "text/html" });
    const u = URL.createObjectURL(b);
    const a = document.createElement("a");
    a.href = u;
    a.download = (name || "mockup") + ".html";
    a.click();
    URL.revokeObjectURL(u);
  }
  return /* @__PURE__ */ jsx(AdminShell, { active: "mockup", title: "Vex Studio", subtitle: "Chat with the Vex agent — it writes the code and renders live. Save progress per client.", children: /* @__PURE__ */ jsxs("div", { className: "tool", children: [
    needsKey && /* @__PURE__ */ jsxs("div", { className: "tool-note", children: [
      "Add ",
      /* @__PURE__ */ jsx("code", { children: "MERCURY_API_KEY" }),
      " + ",
      /* @__PURE__ */ jsx("code", { children: "MERCURY_BASE_URL" }),
      " to the server ",
      /* @__PURE__ */ jsx("code", { children: ".env" }),
      " for the Fast engine."
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "tool-row", children: [
      /* @__PURE__ */ jsx("span", { className: "tool-label", style: { margin: 0 }, children: "Engine" }),
      /* @__PURE__ */ jsx("button", { className: `tool-chip${engine === "fast" ? " on" : ""}`, onClick: () => setEngine("fast"), children: "Fast · Mercury" }),
      /* @__PURE__ */ jsx("button", { className: `tool-chip${engine === "claude" ? " on" : ""}`, onClick: () => setEngine("claude"), children: "Claude · account" }),
      /* @__PURE__ */ jsx("button", { className: `tool-chip${engine === "codex" ? " on" : ""}`, onClick: () => setEngine("codex"), children: "Codex · account" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "tool-row", style: { gap: "0.6rem" }, children: [
      /* @__PURE__ */ jsx("input", { className: "tool-input", style: { maxWidth: 220 }, value: name, placeholder: "Client / project name", onChange: (e) => setName(e.target.value) }),
      /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: save, disabled: !html && msgs.length === 0, children: "Save progress" }),
      /* @__PURE__ */ jsxs("select", { className: "tool-select", value: "", onChange: (e) => load(Number(e.target.value)), children: [
        /* @__PURE__ */ jsx("option", { value: "", children: "Load saved…" }),
        saved.map((s) => /* @__PURE__ */ jsx("option", { value: s.id, children: s.name }, s.id))
      ] }),
      html && /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: download, children: "Download .html" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "vex", children: [
      /* @__PURE__ */ jsxs("div", { className: "vex-chat", children: [
        /* @__PURE__ */ jsxs("div", { className: "vex-log", ref: scrollRef, children: [
          msgs.length === 0 && /* @__PURE__ */ jsx("p", { className: "vex-hint", children: "Describe a site to build, then keep refining: “make the hero taller”, “add a testimonials row”. Pick Claude/Codex · account to use your subscription via the local bridge." }),
          msgs.map((m, i) => /* @__PURE__ */ jsxs("div", { className: `vex-msg vex-${m.role}`, children: [
            /* @__PURE__ */ jsx("span", { className: "vex-who", children: m.role === "user" ? "You" : "Vex" }),
            /* @__PURE__ */ jsx("p", { children: m.content })
          ] }, i)),
          loading && /* @__PURE__ */ jsxs("div", { className: "vex-msg vex-assistant", children: [
            /* @__PURE__ */ jsx("span", { className: "vex-who", children: "Vex" }),
            /* @__PURE__ */ jsx("p", { className: "vex-typing", children: "Building…" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "vex-input", children: [
          /* @__PURE__ */ jsx(
            "textarea",
            {
              value: input,
              onChange: (e) => setInput(e.target.value),
              onKeyDown: (e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  send();
                }
              },
              placeholder: msgs.length ? "Refine the page…" : "Describe the site to build…",
              rows: 2
            }
          ),
          /* @__PURE__ */ jsx("button", { className: "tool-btn", disabled: loading || !input.trim(), onClick: send, children: loading ? "…" : "Send" })
        ] }),
        err && /* @__PURE__ */ jsx("p", { className: "tool-err", children: err })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "vex-preview", children: [
        /* @__PURE__ */ jsxs("div", { className: "c2s-bar", children: [
          /* @__PURE__ */ jsx("i", {}),
          /* @__PURE__ */ jsx("i", {}),
          /* @__PURE__ */ jsx("i", {}),
          /* @__PURE__ */ jsx("span", { className: "c2s-tab", children: "preview" }),
          /* @__PURE__ */ jsx("span", { className: "c2s-engine", children: html ? "LIVE" : "EMPTY" })
        ] }),
        html ? /* @__PURE__ */ jsx("iframe", { title: "Live preview", sandbox: "allow-scripts", srcDoc: html }) : /* @__PURE__ */ jsx("div", { className: "vex-empty", children: "Your site renders here in real time." })
      ] })
    ] })
  ] }) });
}

const prerender = false;
const $$Mockup = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Mockup Studio \xB7 Inovision Studio OS", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "MockupPage", MockupPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/MockupPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/mockup.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/mockup.astro";
const $$url = "/admin/mockup";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Mockup,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
