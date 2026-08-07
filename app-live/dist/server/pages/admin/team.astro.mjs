import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useRef, useEffect } from 'react';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
export { renderers } from '../../renderers.mjs';

const STATUSES = ["Active", "On hold", "In review", "Done"];
function TeamPage() {
  const [tab, setTab] = useState("Messages");
  const [me, setMe] = useState({ email: "", name: "" });
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [sending, setSending] = useState(false);
  const [projects, setProjects] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [pname, setPname] = useState("");
  const [draft, setDraft] = useState({});
  const fileRef = useRef(null);
  const logRef = useRef(null);
  const loadMsgs = () => fetch("/api/admin/team").then((r) => r.json()).then((d) => setMsgs(d.items || []));
  const loadProjects = () => fetch("/api/admin/projects").then((r) => r.json()).then((d) => {
    setProjects(d.projects || []);
    setUpdates(d.updates || []);
  });
  useEffect(() => {
    fetch("/api/admin/me").then((r) => r.json()).then((d) => setMe({ email: d.email, name: d.name }));
    loadMsgs();
    loadProjects();
  }, []);
  useEffect(() => {
    const id = setInterval(() => {
      if (tab === "Messages") loadMsgs();
    }, 12e3);
    return () => clearInterval(id);
  }, [tab]);
  useEffect(() => {
    logRef.current?.scrollTo({ top: 1e9 });
  }, [msgs]);
  async function send() {
    if (!text.trim() && !img || sending) return;
    setSending(true);
    const fd = new FormData();
    fd.append("body", text);
    if (img) fd.append("image", img);
    try {
      await fetch("/api/admin/team", { method: "POST", body: fd });
      setText("");
      setImg(null);
      if (fileRef.current) fileRef.current.value = "";
      await loadMsgs();
    } catch {
    }
    setSending(false);
  }
  const delMsg = async (id) => {
    await fetch("/api/admin/team?id=" + id, { method: "DELETE" });
    loadMsgs();
  };
  async function addProject() {
    if (!pname.trim()) return;
    await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name: pname }) });
    setPname("");
    loadProjects();
  }
  async function setStatus(p, status) {
    await fetch("/api/admin/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: p.id, name: p.name, status }) });
    loadProjects();
  }
  const delProject = async (id) => {
    if (!confirm("Delete this project and its updates?")) return;
    await fetch("/api/admin/projects?id=" + id, { method: "DELETE" });
    loadProjects();
  };
  async function post(pid, kind) {
    const body = (draft[pid] || "").trim();
    if (!body) return;
    await fetch("/api/admin/project-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ project_id: pid, body, kind }) });
    setDraft((d) => ({ ...d, [pid]: "" }));
    loadProjects();
  }
  const delUpdate = async (id) => {
    await fetch("/api/admin/project-post?id=" + id, { method: "DELETE" });
    loadProjects();
  };
  const time = (t) => new Date(t).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  return /* @__PURE__ */ jsx(AdminShell, { active: "team", title: "Team", subtitle: `Internal comms & project tracking — signed in as ${me.name || me.email || "…"}`, children: /* @__PURE__ */ jsxs("div", { className: "tool", children: [
    /* @__PURE__ */ jsx("div", { className: "tool-row", children: ["Messages", "Projects"].map((t) => /* @__PURE__ */ jsx("button", { className: `tool-chip${tab === t ? " on" : ""}`, onClick: () => setTab(t), children: t }, t)) }),
    tab === "Messages" && /* @__PURE__ */ jsxs("div", { className: "tm", children: [
      /* @__PURE__ */ jsxs("div", { className: "tm-log", ref: logRef, children: [
        msgs.length === 0 && /* @__PURE__ */ jsx("p", { className: "tool-label", children: "No messages yet — start the conversation." }),
        msgs.map((m) => {
          const mine = m.author_email === me.email;
          return /* @__PURE__ */ jsx("div", { className: `tm-msg${mine ? " mine" : ""}`, children: /* @__PURE__ */ jsxs("div", { className: "tm-bubble", children: [
            /* @__PURE__ */ jsx("span", { className: "tm-who", children: m.author_name || m.author_email }),
            m.body && /* @__PURE__ */ jsx("p", { children: m.body }),
            m.image && /* @__PURE__ */ jsx("a", { href: m.image, target: "_blank", rel: "noreferrer", children: /* @__PURE__ */ jsx("img", { src: m.image, alt: "shared" }) }),
            /* @__PURE__ */ jsxs("span", { className: "tm-time", children: [
              time(m.created_at),
              mine && /* @__PURE__ */ jsx("button", { className: "tm-del", onClick: () => delMsg(m.id), title: "Delete", children: "✕" })
            ] })
          ] }) }, m.id);
        })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "tm-input", children: [
        img && /* @__PURE__ */ jsxs("span", { className: "tm-attach", children: [
          "📎 ",
          img.name,
          /* @__PURE__ */ jsx("button", { onClick: () => {
            setImg(null);
            if (fileRef.current) fileRef.current.value = "";
          }, children: "✕" })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => fileRef.current?.click(), title: "Attach image", children: "📷" }),
        /* @__PURE__ */ jsx("input", { ref: fileRef, type: "file", accept: "image/*", hidden: true, onChange: (e) => setImg(e.target.files?.[0] || null) }),
        /* @__PURE__ */ jsx("textarea", { value: text, onChange: (e) => setText(e.target.value), onKeyDown: (e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            send();
          }
        }, placeholder: "Message…", rows: 1 }),
        /* @__PURE__ */ jsx("button", { className: "tool-btn", onClick: send, disabled: sending || !text.trim() && !img, children: "Send" })
      ] })
    ] }),
    tab === "Projects" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "tool-row", children: [
        /* @__PURE__ */ jsx("input", { className: "tool-input", style: { maxWidth: 280 }, value: pname, placeholder: "New project name", onChange: (e) => setPname(e.target.value), onKeyDown: (e) => e.key === "Enter" && addProject() }),
        /* @__PURE__ */ jsx("button", { className: "tool-btn", onClick: addProject, children: "Add project" })
      ] }),
      projects.length === 0 && /* @__PURE__ */ jsx("p", { className: "tool-label", children: "No projects yet." }),
      projects.map((p) => {
        const ups = updates.filter((u) => u.project_id === p.id);
        return /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
          /* @__PURE__ */ jsxs("div", { className: "tool-row", style: { justifyContent: "space-between" }, children: [
            /* @__PURE__ */ jsx("b", { style: { color: "#fff", fontSize: "1.1rem" }, children: p.name }),
            /* @__PURE__ */ jsxs("div", { className: "tool-row", children: [
              /* @__PURE__ */ jsx("select", { className: "tool-select", value: p.status, onChange: (e) => setStatus(p, e.target.value), children: STATUSES.map((s) => /* @__PURE__ */ jsx("option", { children: s }, s)) }),
              /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => delProject(p.id), children: "✕" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "tm-input", style: { marginTop: "0.7rem" }, children: [
            /* @__PURE__ */ jsx("textarea", { value: draft[p.id] || "", onChange: (e) => setDraft((d) => ({ ...d, [p.id]: e.target.value })), placeholder: "Post an update or milestone…", rows: 1 }),
            /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => post(p.id, "update"), children: "Update" }),
            /* @__PURE__ */ jsx("button", { className: "tool-chip on", onClick: () => post(p.id, "milestone"), children: "★ Milestone" })
          ] }),
          /* @__PURE__ */ jsx("div", { className: "pu-list", children: ups.map((u) => /* @__PURE__ */ jsxs("div", { className: `pu${u.kind === "milestone" ? " ms" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { className: "pu-dot" }),
            /* @__PURE__ */ jsxs("div", { className: "pu-body", children: [
              /* @__PURE__ */ jsx("p", { children: u.body }),
              /* @__PURE__ */ jsxs("span", { className: "pu-meta", children: [
                u.kind === "milestone" ? "★ Milestone · " : "",
                u.author_name || "",
                " · ",
                time(u.created_at)
              ] })
            ] }),
            /* @__PURE__ */ jsx("button", { className: "tm-del", onClick: () => delUpdate(u.id), children: "✕" })
          ] }, u.id)) })
        ] }, p.id);
      })
    ] })
  ] }) });
}

const prerender = false;
const $$Team = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Team \xB7 Inovision Studio OS", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "TeamPage", TeamPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/TeamPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/team.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/team.astro";
const $$url = "/admin/team";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Team,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
