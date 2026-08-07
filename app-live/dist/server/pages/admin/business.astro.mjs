import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useRef } from 'react';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
export { renderers } from '../../renderers.mjs';

function ClientManage({ clientId, clientName, initialNotes }) {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [ms, setMs] = useState([]);
  const [mt, setMt] = useState("");
  const [md, setMd] = useState("");
  const [notes, setNotes] = useState(initialNotes || "");
  const [noteSaved, setNoteSaved] = useState(false);
  const saveNote = async () => {
    await fetch("/api/admin/client-note", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id: clientId, notes }) });
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 1500);
  };
  const loadMsgs = async () => {
    const d = await (await fetch("/api/admin/messages?client_id=" + clientId)).json();
    setMsgs(d.items || []);
  };
  const loadMs = async () => {
    const d = await (await fetch("/api/admin/milestones?client_id=" + clientId)).json();
    setMs(d.items || []);
  };
  useEffect(() => {
    loadMsgs();
    loadMs();
    setNotes(initialNotes || "");
  }, [clientId]);
  async function send(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    const d = await (await fetch("/api/admin/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client_id: clientId, body: t }) })).json();
    if (d.items) setMsgs(d.items);
    setText("");
  }
  async function addMs(e) {
    e.preventDefault();
    const t = mt.trim();
    if (!t) return;
    const d = await (await fetch("/api/admin/milestones", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client_id: clientId, title: t, due: md }) })).json();
    if (d.items) setMs(d.items);
    setMt("");
    setMd("");
  }
  const toggle = async (m) => {
    await fetch(`/api/admin/milestones?id=${m.id}&done=${m.done ? 0 : 1}`, { method: "PATCH" });
    loadMs();
  };
  const del = async (m) => {
    await fetch("/api/admin/milestones?id=" + m.id, { method: "DELETE" });
    loadMs();
  };
  return /* @__PURE__ */ jsxs("div", { className: "cm", children: [
    /* @__PURE__ */ jsxs("div", { className: "cm-col", children: [
      /* @__PURE__ */ jsx("h4", { children: "Milestones" }),
      /* @__PURE__ */ jsxs("ul", { className: "cm-ms", children: [
        ms.map((m) => /* @__PURE__ */ jsxs("li", { className: m.done ? "done" : "", children: [
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => toggle(m), className: "cm-box", "aria-label": "Toggle", children: m.done ? "✓" : "" }),
          /* @__PURE__ */ jsxs("span", { children: [
            m.title,
            m.due ? ` · ${m.due}` : ""
          ] }),
          /* @__PURE__ */ jsx("button", { type: "button", onClick: () => del(m), className: "cm-x", "aria-label": "Delete", children: "✕" })
        ] }, m.id)),
        ms.length === 0 && /* @__PURE__ */ jsx("li", { className: "cm-empty", children: "No milestones yet." })
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: addMs, className: "cm-add", children: [
        /* @__PURE__ */ jsx("input", { value: mt, onChange: (e) => setMt(e.target.value), placeholder: "New milestone" }),
        /* @__PURE__ */ jsx("input", { value: md, onChange: (e) => setMd(e.target.value), placeholder: "Due (opt)", style: { maxWidth: 96 } }),
        /* @__PURE__ */ jsx("button", { className: "tool-chip", type: "submit", children: "Add" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "cm-col", children: [
      /* @__PURE__ */ jsxs("h4", { children: [
        "Messages with ",
        clientName
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "cm-thread", children: [
        msgs.length === 0 && /* @__PURE__ */ jsx("p", { className: "thr-empty", children: "No messages yet." }),
        msgs.map((m) => /* @__PURE__ */ jsxs("div", { className: `thr-msg ${m.sender === "team" ? "me" : "them"}`, children: [
          /* @__PURE__ */ jsx("div", { className: "thr-bubble", children: m.body }),
          /* @__PURE__ */ jsxs("span", { className: "thr-meta", children: [
            m.sender === "team" ? m.author || "Team" : clientName,
            " · ",
            new Date(m.created_at).toLocaleDateString()
          ] })
        ] }, m.id))
      ] }),
      /* @__PURE__ */ jsxs("form", { onSubmit: send, className: "thr-compose", children: [
        /* @__PURE__ */ jsx("input", { value: text, onChange: (e) => setText(e.target.value), placeholder: "Reply to client…" }),
        /* @__PURE__ */ jsx("button", { className: "s-btn s-btn-primary", type: "submit", children: "Send" })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "cm-col", style: { gridColumn: "1 / -1" }, children: [
      /* @__PURE__ */ jsxs("h4", { children: [
        "Internal notes ",
        /* @__PURE__ */ jsx("span", { style: { color: "var(--ad-silver-2)", fontWeight: 400, textTransform: "none", letterSpacing: 0 }, children: "· team only, never shown to client" })
      ] }),
      /* @__PURE__ */ jsx("textarea", { className: "cm-note", value: notes, onChange: (e) => setNotes(e.target.value), placeholder: "Private notes for the team — status, blockers, account context…" }),
      /* @__PURE__ */ jsx("button", { className: "tool-chip", type: "button", onClick: saveNote, style: { marginTop: "0.5rem" }, children: noteSaved ? "Saved ✓" : "Save notes" })
    ] })
  ] });
}

function AuditManage({ auditId }) {
  const [items, setItems] = useState([]);
  const [f, setF] = useState({ area: "", finding: "", recommendation: "", impact: "medium", effort: "medium" });
  const load = async () => {
    const d = await (await fetch("/api/admin/audit-items?audit_id=" + auditId)).json();
    setItems(d.items || []);
  };
  useEffect(() => {
    load();
  }, [auditId]);
  async function add(e) {
    e.preventDefault();
    if (!f.finding.trim()) return;
    const d = await (await fetch("/api/admin/audit-items", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ audit_id: auditId, ...f }) })).json();
    if (d.items) setItems(d.items);
    setF({ area: "", finding: "", recommendation: "", impact: "medium", effort: "medium" });
  }
  const toggle = async (it) => {
    await fetch(`/api/admin/audit-items?id=${it.id}&done=${it.done ? 0 : 1}`, { method: "PATCH" });
    load();
  };
  const del = async (it) => {
    await fetch("/api/admin/audit-items?id=" + it.id, { method: "DELETE" });
    load();
  };
  return /* @__PURE__ */ jsxs("div", { className: "aud", children: [
    /* @__PURE__ */ jsxs("div", { className: "aud-items", children: [
      items.length === 0 && /* @__PURE__ */ jsx("p", { className: "thr-empty", children: "No findings yet — capture automation & optimization opportunities below." }),
      items.map((it) => /* @__PURE__ */ jsxs("div", { className: `aud-item ${it.done ? "done" : ""}`, children: [
        /* @__PURE__ */ jsx("button", { type: "button", className: "cm-box", onClick: () => toggle(it), "aria-label": "Toggle", children: it.done ? "✓" : "" }),
        /* @__PURE__ */ jsxs("div", { className: "aud-item-body", children: [
          /* @__PURE__ */ jsxs("div", { className: "aud-item-top", children: [
            /* @__PURE__ */ jsx("b", { children: it.finding }),
            it.area && /* @__PURE__ */ jsx("span", { className: "aud-area", children: it.area }),
            /* @__PURE__ */ jsxs("span", { className: `aud-tag imp-${it.impact}`, children: [
              "Impact ",
              it.impact
            ] }),
            /* @__PURE__ */ jsxs("span", { className: `aud-tag eff-${it.effort}`, children: [
              "Effort ",
              it.effort
            ] })
          ] }),
          it.recommendation && /* @__PURE__ */ jsxs("p", { className: "aud-rec", children: [
            "→ ",
            it.recommendation
          ] })
        ] }),
        /* @__PURE__ */ jsx("button", { type: "button", className: "cm-x", onClick: () => del(it), "aria-label": "Delete", children: "✕" })
      ] }, it.id))
    ] }),
    /* @__PURE__ */ jsxs("form", { className: "aud-add", onSubmit: add, children: [
      /* @__PURE__ */ jsxs("div", { className: "tool-row", style: { flexWrap: "wrap", gap: "0.5rem" }, children: [
        /* @__PURE__ */ jsx("input", { className: "tool-input", style: { maxWidth: 150 }, placeholder: "Area (Sales, Ops…)", value: f.area, onChange: (e) => setF({ ...f, area: e.target.value }) }),
        /* @__PURE__ */ jsx("input", { className: "tool-input", style: { flex: "1 1 220px" }, placeholder: "Finding (e.g. Manual invoice entry)", value: f.finding, onChange: (e) => setF({ ...f, finding: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "tool-row", style: { flexWrap: "wrap", gap: "0.5rem" }, children: [
        /* @__PURE__ */ jsx("input", { className: "tool-input", style: { flex: "1 1 220px" }, placeholder: "Recommendation (e.g. auto-sync to QuickBooks)", value: f.recommendation, onChange: (e) => setF({ ...f, recommendation: e.target.value }) }),
        /* @__PURE__ */ jsxs("select", { className: "tool-input", value: f.impact, onChange: (e) => setF({ ...f, impact: e.target.value }), children: [
          /* @__PURE__ */ jsx("option", { value: "high", children: "Impact: High" }),
          /* @__PURE__ */ jsx("option", { value: "medium", children: "Impact: Med" }),
          /* @__PURE__ */ jsx("option", { value: "low", children: "Impact: Low" })
        ] }),
        /* @__PURE__ */ jsxs("select", { className: "tool-input", value: f.effort, onChange: (e) => setF({ ...f, effort: e.target.value }), children: [
          /* @__PURE__ */ jsx("option", { value: "low", children: "Effort: Low" }),
          /* @__PURE__ */ jsx("option", { value: "medium", children: "Effort: Med" }),
          /* @__PURE__ */ jsx("option", { value: "high", children: "Effort: High" })
        ] }),
        /* @__PURE__ */ jsx("button", { className: "tool-btn", type: "submit", children: "Add finding" })
      ] })
    ] })
  ] });
}

const money = (n) => "$" + (Number(n) || 0).toFixed(2);
const fmtB = (n) => {
  if (!n) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let x = n;
  while (x >= 1024 && i < u.length - 1) {
    x /= 1024;
    i++;
  }
  return x.toFixed(x < 10 && i > 0 ? 1 : 0) + " " + u[i];
};
const fmtUp = (s) => {
  const d = Math.floor(s / 86400), h = Math.floor(s % 86400 / 3600), m = Math.floor(s % 3600 / 60);
  return d ? `${d}d ${h}h` : h ? `${h}h ${m}m` : `${m}m`;
};
function Meter({ label, used, total, sub, raw }) {
  const pct = total ? Math.min(100, Math.round(used / total * 100)) : 0;
  const lvl = pct >= 90 ? "high" : pct >= 70 ? "warn" : "ok";
  const amt = raw ? `${used.toFixed(2)} / ${total}` : `${fmtB(used)} / ${fmtB(total)}`;
  return /* @__PURE__ */ jsxs("div", { className: "meter", children: [
    /* @__PURE__ */ jsxs("div", { className: "meter-top", children: [
      /* @__PURE__ */ jsx("span", { children: label }),
      /* @__PURE__ */ jsxs("b", { children: [
        pct,
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "meter-bar", children: /* @__PURE__ */ jsx("i", { "data-lvl": lvl, style: { width: pct + "%" } }) }),
    /* @__PURE__ */ jsxs("div", { className: "meter-sub", children: [
      amt,
      sub ? ` · ${sub}` : ""
    ] })
  ] });
}
const TABS = ["Overview", "Clients", "CRM", "Invoices", "Audits", "Bookkeeping", "Deployments", "Hosting"];
function BusinessPage() {
  const [tab, setTab] = useState("Overview");
  const [hs, setHs] = useState(null);
  const [hsLoad, setHsLoad] = useState(false);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [ledger, setLedger] = useState([]);
  const [deploys, setDeploys] = useState([]);
  const [summary, setSummary] = useState({ income: 0, expenses: 0, net: 0, unpaid: 0, mrr: 0 });
  const [monthly, setMonthly] = useState([]);
  const csvRef = useRef(null);
  const [hosting, setHosting] = useState(null);
  const [system, setSystem] = useState(null);
  const [domain, setDomain] = useState("");
  const [dinfo, setDinfo] = useState(null);
  const [dloading, setDloading] = useState(false);
  const [msg, setMsg] = useState("");
  const [manageId, setManageId] = useState(null);
  const [civ, setCiv] = useState({ description: "", amount: "", recipient: "", client_id: "" });
  const [unread, setUnread] = useState({});
  const [audits, setAudits] = useState([]);
  const [af, setAf] = useState({ company: "", contact: "", email: "", summary: "" });
  const [auditId, setAuditId] = useState(null);
  const loadUnread = () => fetch("/api/admin/messages").then((r) => r.json()).then((d) => setUnread(d.unread || {})).catch(() => {
  });
  const loadAudits = () => fetch("/api/admin/audits").then((r) => r.json()).then((d) => setAudits(d.items || [])).catch(() => {
  });
  const [cf, setCf] = useState({ name: "", email: "", site: "", hosting: true, ai: false, extra: "" });
  const [period, setPeriod] = useState("");
  const [lf, setLf] = useState({ kind: "expense", category: "", amount: "", note: "" });
  const [df, setDf] = useState({ client_id: "", summary: "", url: "" });
  const loadClients = () => fetch("/api/admin/clients").then((r) => r.json()).then((d) => setClients(d.items || []));
  const loadInvoices = () => fetch("/api/admin/invoices").then((r) => r.json()).then((d) => setInvoices(d.items || []));
  const loadLedger = () => fetch("/api/admin/ledger").then((r) => r.json()).then((d) => {
    setLedger(d.rows || []);
    setSummary(d.summary || summary);
    setMonthly(d.monthly || []);
  });
  async function importCsv(file) {
    if (!file) return;
    setMsg("Importing CSV…");
    try {
      const text = await file.text();
      const d = await (await fetch("/api/admin/ledger-import", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ csv: text }) })).json();
      if (d.error) setMsg(d.error);
      else setMsg(`Imported ${d.imported} transactions${d.skipped ? ` (${d.skipped} skipped)` : ""}.`);
      loadLedger();
    } catch (e) {
      setMsg(String(e));
    }
  }
  const loadDeploys = () => fetch("/api/admin/deployments").then((r) => r.json()).then((d) => setDeploys(d.items || []));
  useEffect(() => {
    loadClients();
    loadInvoices();
    loadLedger();
    loadDeploys();
    loadUnread();
    loadAudits();
  }, []);
  useEffect(() => {
    if (manageId === null) loadUnread();
  }, [manageId]);
  useEffect(() => {
    if (tab !== "Hosting") return;
    if (!hosting) fetch("/api/admin/hosting").then((r) => r.json()).then(setHosting);
    fetch("/api/admin/system").then((r) => r.json()).then(setSystem).catch(() => {
    });
  }, [tab]);
  useEffect(() => {
    if (tab !== "CRM" || hs) return;
    setHsLoad(true);
    fetch("/api/admin/hubspot").then((r) => r.json()).then((d) => {
      setHs(d);
      setHsLoad(false);
    }).catch(() => setHsLoad(false));
  }, [tab]);
  async function importFromHubspot(name, email, site) {
    await fetch("/api/admin/hubspot", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, email, site }) });
    loadClients();
    setMsg(`Imported ${name} into Clients`);
  }
  async function saveClient() {
    if (!cf.name.trim()) return;
    await fetch("/api/admin/clients", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...cf, extra: Number(cf.extra || 0) }) });
    setCf({ name: "", email: "", site: "", hosting: true, ai: false, extra: "" });
    loadClients();
    loadLedger();
  }
  const editClient = (c) => {
    setTab("Clients");
    setCf({ id: c.id, name: c.name, email: c.email || "", site: c.site || "", hosting: !!c.hosting, ai: !!c.ai, extra: c.extra ? String(c.extra) : "" });
  };
  const delClient = async (id) => {
    await fetch("/api/admin/clients?id=" + id, { method: "DELETE" });
    loadClients();
    loadLedger();
  };
  const setStage = async (id, stage) => {
    await fetch("/api/admin/client-stage", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, stage }) });
    setMsg(stage === "launch" || stage === "live" ? "Stage set — client can now start monthly billing from their portal." : "Project stage updated in the client portal.");
    loadClients();
  };
  async function genInvoices() {
    const p = period || (/* @__PURE__ */ new Date()).toISOString().slice(0, 7);
    await fetch("/api/admin/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ generateAll: true, period: p }) });
    loadInvoices();
    loadLedger();
  }
  const setStatus = async (id, s) => {
    await fetch(`/api/admin/invoices?id=${id}&status=${s}`, { method: "PATCH" });
    loadInvoices();
    loadLedger();
  };
  const delInvoice = async (id) => {
    await fetch("/api/admin/invoices?id=" + id, { method: "DELETE" });
    loadInvoices();
    loadLedger();
  };
  const createCustom = async () => {
    const amount = parseFloat(civ.amount);
    if (!civ.description.trim() || !(amount > 0)) {
      setMsg("Add a description and an amount over $0.");
      return;
    }
    const d = await (await fetch("/api/admin/invoices", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ custom: true, description: civ.description, amount, recipient: civ.recipient, client_id: civ.client_id ? Number(civ.client_id) : 0 }) })).json();
    if (d.token) {
      const link = `${window.location.origin}/invoice/${d.token}`;
      try {
        await navigator.clipboard.writeText(link);
      } catch {
      }
      setMsg(`Custom invoice created — pay link copied: ${link}`);
    } else setMsg(d.error || "Could not create invoice.");
    setCiv({ description: "", amount: "", recipient: "", client_id: "" });
    loadInvoices();
  };
  const createAudit = async () => {
    if (!af.company.trim()) {
      setMsg("Company name required.");
      return;
    }
    await fetch("/api/admin/audits", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(af) });
    setAf({ company: "", contact: "", email: "", summary: "" });
    loadAudits();
  };
  const auditStatus = async (id, status) => {
    await fetch(`/api/admin/audits?id=${id}&status=${status}`, { method: "PATCH" });
    loadAudits();
  };
  const delAudit = async (id) => {
    await fetch("/api/admin/audits?id=" + id, { method: "DELETE" });
    if (auditId === id) setAuditId(null);
    loadAudits();
  };
  async function addLedger() {
    if (!lf.amount) return;
    await fetch("/api/admin/ledger", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...lf, amount: Number(lf.amount) }) });
    setLf({ kind: "expense", category: "", amount: "", note: "" });
    loadLedger();
  }
  const delLedger = async (id) => {
    await fetch("/api/admin/ledger?id=" + id, { method: "DELETE" });
    loadLedger();
  };
  async function payLink(inv) {
    const iv = inv;
    if (!iv.token) {
      setMsg("This invoice has no pay link yet — regenerate it.");
      return;
    }
    const link = `${window.location.origin}/invoice/${iv.token}`;
    try {
      await navigator.clipboard.writeText(link);
      setMsg(`Pay link copied — send it to ${iv.client_name || "your client"}: ${link}`);
    } catch {
      setMsg(`Pay link: ${link}`);
    }
    window.open(link, "_blank");
  }
  async function emailInvoice(inv) {
    setMsg("Emailing invoice…");
    const d = await (await fetch("/api/admin/invoice-email", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ invoice_id: inv.id }) })).json();
    if (d.needsConfig) setMsg("Add SMTP_USER + SMTP_PASS (your Hostinger mailbox) to the server .env to email invoices for free.");
    else if (d.error) setMsg(d.error);
    else setMsg("Emailed to " + d.to + " ✓");
  }
  async function lookupDomain() {
    if (!domain.trim()) return;
    setDloading(true);
    setDinfo(null);
    try {
      const d = await (await fetch("/api/admin/domain-lookup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ domain }) })).json();
      if (d.ok) setDinfo(d);
      else setMsg(d.error || "Lookup failed");
    } catch (e) {
      setMsg(String(e));
    }
    setDloading(false);
  }
  async function syncHosting() {
    setMsg("Syncing Hostinger costs…");
    const d = await (await fetch("/api/admin/hosting-sync", { method: "POST" })).json();
    if (d.needsKey) setMsg("Add HOSTINGER_API_TOKEN to sync hosting costs.");
    else if (d.error) setMsg(d.error);
    else {
      setMsg(`Posted ${d.posted.length} hosting cost(s): ${money(d.total)}/mo.`);
      loadLedger();
    }
  }
  async function addDeploy() {
    if (!df.client_id || !df.summary.trim()) return;
    await fetch("/api/admin/deployments", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ client_id: Number(df.client_id), summary: df.summary, url: df.url }) });
    setDf({ client_id: "", summary: "", url: "" });
    loadDeploys();
  }
  const delDeploy = async (id) => {
    await fetch("/api/admin/deployments?id=" + id, { method: "DELETE" });
    loadDeploys();
  };
  return /* @__PURE__ */ jsx(AdminShell, { active: "business", title: "Business", subtitle: "Clients, hosting, invoicing, payments & bookkeeping.", children: /* @__PURE__ */ jsxs("div", { className: "tool", children: [
    /* @__PURE__ */ jsx("div", { className: "tool-row", children: TABS.map((t) => /* @__PURE__ */ jsx("button", { className: `tool-chip${tab === t ? " on" : ""}`, onClick: () => setTab(t), children: t }, t)) }),
    msg && /* @__PURE__ */ jsx("div", { className: "tool-note", children: msg }),
    tab === "Overview" && /* @__PURE__ */ jsxs("div", { className: "biz-cards", children: [
      /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
        /* @__PURE__ */ jsx("span", { children: "MRR" }),
        /* @__PURE__ */ jsx("b", { children: money(summary.mrr) }),
        /* @__PURE__ */ jsx("i", { children: "recurring / mo" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
        /* @__PURE__ */ jsx("span", { children: "Income" }),
        /* @__PURE__ */ jsx("b", { children: money(summary.income) }),
        /* @__PURE__ */ jsx("i", { children: "paid to date" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
        /* @__PURE__ */ jsx("span", { children: "Expenses" }),
        /* @__PURE__ */ jsx("b", { children: money(summary.expenses) }),
        /* @__PURE__ */ jsx("i", { children: "tracked" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
        /* @__PURE__ */ jsx("span", { children: "Net" }),
        /* @__PURE__ */ jsx("b", { style: { color: summary.net >= 0 ? "#58d6a0" : "#ff7d6b" }, children: money(summary.net) }),
        /* @__PURE__ */ jsx("i", { children: "profit" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
        /* @__PURE__ */ jsx("span", { children: "Unpaid" }),
        /* @__PURE__ */ jsx("b", { style: { color: "#f6e2a6" }, children: money(summary.unpaid) }),
        /* @__PURE__ */ jsx("i", { children: "outstanding" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
        /* @__PURE__ */ jsx("span", { children: "Clients" }),
        /* @__PURE__ */ jsx("b", { children: clients.length }),
        /* @__PURE__ */ jsx("i", { children: "active" })
      ] })
    ] }),
    tab === "Clients" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "tool-panel biz-form", children: [
        /* @__PURE__ */ jsx("input", { className: "tool-input", placeholder: "Client name", value: cf.name, onChange: (e) => setCf({ ...cf, name: e.target.value }) }),
        /* @__PURE__ */ jsx("input", { className: "tool-input", placeholder: "Email", value: cf.email, onChange: (e) => setCf({ ...cf, email: e.target.value }) }),
        /* @__PURE__ */ jsx("input", { className: "tool-input", placeholder: "Site URL", value: cf.site, onChange: (e) => setCf({ ...cf, site: e.target.value }) }),
        /* @__PURE__ */ jsxs("label", { className: "biz-check", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: cf.hosting, onChange: (e) => setCf({ ...cf, hosting: e.target.checked }) }),
          " Hosting $20"
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "biz-check", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: cf.ai, onChange: (e) => setCf({ ...cf, ai: e.target.checked }) }),
          " AI $50"
        ] }),
        /* @__PURE__ */ jsx("input", { className: "tool-input", style: { maxWidth: 110 }, placeholder: "Extra $", value: cf.extra, onChange: (e) => setCf({ ...cf, extra: e.target.value }) }),
        /* @__PURE__ */ jsx("button", { className: "tool-btn", onClick: saveClient, children: cf.id ? "Save changes" : "Add client" }),
        cf.id && /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => setCf({ name: "", email: "", site: "", hosting: true, ai: false, extra: "" }), children: "Cancel" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "biz-list", children: [
        clients.map((c) => /* @__PURE__ */ jsxs("div", { className: "biz-row", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("b", { children: c.name }),
            /* @__PURE__ */ jsxs("span", { children: [
              c.site || c.email || "",
              c.plan ? ` · ${c.plan}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "biz-tags", children: [
            c.ai ? /* @__PURE__ */ jsx("em", { children: "AI" }) : null,
            c.deposit_paid ? /* @__PURE__ */ jsx("em", { style: { color: "#6fcf97" }, children: "Deposit paid" }) : null,
            c.plan ? (() => {
              const cc = c;
              const st = cc.sub_active ? "on" : cc.launched_at ? "pending" : "off";
              return /* @__PURE__ */ jsxs("span", { className: `biz-hstat ${st}`, children: [
                "Host: ",
                st === "on" ? "active" : st
              ] });
            })() : c.hosting ? /* @__PURE__ */ jsx("em", { children: "Hosting" }) : null
          ] }),
          c.plan ? /* @__PURE__ */ jsxs("select", { className: "tool-input", style: { maxWidth: 140 }, value: c.stage || "onboarding", onChange: (e) => setStage(c.id, e.target.value), children: [
            /* @__PURE__ */ jsx("option", { value: "onboarding", disabled: true, children: "onboarding" }),
            /* @__PURE__ */ jsx("option", { value: "spec", children: "Discovery & Spec" }),
            /* @__PURE__ */ jsx("option", { value: "design", children: "Design" }),
            /* @__PURE__ */ jsx("option", { value: "build", children: "Build" }),
            /* @__PURE__ */ jsx("option", { value: "review", children: "Review & QA" }),
            /* @__PURE__ */ jsx("option", { value: "launch", children: "Launch" }),
            /* @__PURE__ */ jsx("option", { value: "live", children: "Live" })
          ] }) : /* @__PURE__ */ jsxs("b", { className: "biz-amt", children: [
            money(c.monthly),
            "/mo"
          ] }),
          c.plan ? /* @__PURE__ */ jsxs("button", { className: "tool-chip", onClick: () => setManageId(manageId === c.id ? null : c.id), children: [
            manageId === c.id ? "Close" : "Manage",
            unread[c.id] ? /* @__PURE__ */ jsx("span", { className: "biz-badge", children: unread[c.id] }) : null
          ] }) : null,
          /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => editClient(c), children: "Edit" }),
          /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => delClient(c.id), children: "✕" })
        ] }, c.id)),
        clients.length === 0 && /* @__PURE__ */ jsx("p", { className: "tool-label", children: "No clients yet." })
      ] }),
      manageId && /* @__PURE__ */ jsx(ClientManage, { clientId: manageId, clientName: clients.find((c) => c.id === manageId)?.name || "client", initialNotes: clients.find((c) => c.id === manageId)?.notes || "" })
    ] }),
    tab === "CRM" && /* @__PURE__ */ jsxs(Fragment, { children: [
      hsLoad && /* @__PURE__ */ jsx("div", { className: "tool-panel", children: /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Loading HubSpot…" }) }),
      hs?.needsKey && /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
        /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Connect HubSpot" }),
        /* @__PURE__ */ jsxs("p", { style: { color: "var(--ad-silver)", fontSize: "0.9rem", lineHeight: 1.6 }, children: [
          "Add your HubSpot Private App token to the server as ",
          /* @__PURE__ */ jsx("code", { children: "HUBSPOT_TOKEN" }),
          " (format ",
          /* @__PURE__ */ jsx("code", { children: "pat-na2-…" }),
          ") to pull your contacts, companies, and deals here for client management."
        ] })
      ] }),
      hs && !hs.needsKey && /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx("div", { className: "tool-panel", children: /* @__PURE__ */ jsxs("div", { className: "tool-row", style: { justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsxs("p", { className: "tool-label", style: { margin: 0 }, children: [
            "HubSpot CRM ",
            hs.account?.portalId ? `· Portal ${hs.account.portalId}` : ""
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "tool-label", style: { margin: 0 }, children: [
            hs.contacts?.length || 0,
            " contacts · ",
            hs.companies?.length || 0,
            " companies · ",
            hs.deals?.length || 0,
            " deals"
          ] })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
          /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Companies" }),
          /* @__PURE__ */ jsxs("div", { className: "tool-table", children: [
            (hs.companies || []).map((c) => /* @__PURE__ */ jsxs("div", { className: "tool-tr", children: [
              /* @__PURE__ */ jsxs("span", { style: { flex: 1 }, children: [
                /* @__PURE__ */ jsx("b", { style: { color: "#fff" }, children: c.name || "—" }),
                " ",
                /* @__PURE__ */ jsx("i", { style: { color: "var(--ad-silver-2)" }, children: c.domain })
              ] }),
              /* @__PURE__ */ jsx("span", { style: { color: "var(--ad-silver)", fontSize: "0.85rem" }, children: c.industry || c.city }),
              /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => importFromHubspot(c.name, "", c.domain), children: "Add as client" })
            ] }, c.id)),
            (hs.companies || []).length === 0 && /* @__PURE__ */ jsx("p", { className: "tool-label", children: "No companies in HubSpot yet." })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
          /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Contacts" }),
          /* @__PURE__ */ jsxs("div", { className: "tool-table", children: [
            (hs.contacts || []).map((c) => /* @__PURE__ */ jsxs("div", { className: "tool-tr", children: [
              /* @__PURE__ */ jsxs("span", { style: { flex: 1 }, children: [
                /* @__PURE__ */ jsx("b", { style: { color: "#fff" }, children: c.name || c.email || "—" }),
                " ",
                /* @__PURE__ */ jsx("i", { style: { color: "var(--ad-silver-2)" }, children: c.email })
              ] }),
              /* @__PURE__ */ jsxs("span", { style: { color: "var(--ad-silver)", fontSize: "0.85rem" }, children: [
                c.company,
                c.phone ? ` · ${c.phone}` : ""
              ] }),
              /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => importFromHubspot(c.name || c.email, c.email, ""), children: "Add as client" })
            ] }, c.id)),
            (hs.contacts || []).length === 0 && /* @__PURE__ */ jsx("p", { className: "tool-label", children: "No contacts in HubSpot yet." })
          ] })
        ] })
      ] })
    ] }),
    tab === "Invoices" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "tool-row", children: [
        /* @__PURE__ */ jsx("input", { className: "tool-input", style: { maxWidth: 130 }, placeholder: "2026-06", value: period, onChange: (e) => setPeriod(e.target.value) }),
        /* @__PURE__ */ jsx("button", { className: "tool-btn", onClick: genInvoices, children: "Generate month for all clients" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "tool-panel", style: { marginBottom: "0.9rem" }, children: [
        /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Custom invoice — partnership, AI or dev job" }),
        /* @__PURE__ */ jsxs("div", { className: "tool-row", style: { flexWrap: "wrap", gap: "0.5rem" }, children: [
          /* @__PURE__ */ jsx("input", { className: "tool-input", style: { flex: "1 1 220px" }, placeholder: "Description (e.g. AI chatbot build — Acme)", value: civ.description, onChange: (e) => setCiv({ ...civ, description: e.target.value }) }),
          /* @__PURE__ */ jsx("input", { className: "tool-input", style: { maxWidth: 110 }, placeholder: "Amount $", value: civ.amount, onChange: (e) => setCiv({ ...civ, amount: e.target.value }) }),
          /* @__PURE__ */ jsx("input", { className: "tool-input", style: { maxWidth: 170 }, placeholder: "Recipient / company (opt)", value: civ.recipient, onChange: (e) => setCiv({ ...civ, recipient: e.target.value }) }),
          /* @__PURE__ */ jsx("button", { className: "tool-btn", onClick: createCustom, children: "Create + copy pay link" })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "biz-list", children: [
        invoices.map((iv) => /* @__PURE__ */ jsxs("div", { className: "biz-row", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("b", { children: iv.client_name || iv.recipient || "Custom" }),
            /* @__PURE__ */ jsx("span", { children: iv.description || iv.period })
          ] }),
          /* @__PURE__ */ jsx("b", { className: "biz-amt", children: money(iv.amount) }),
          /* @__PURE__ */ jsx("span", { className: `biz-status biz-${iv.status}`, children: iv.status }),
          /* @__PURE__ */ jsx("a", { className: "tool-chip", href: `/api/admin/invoice-pdf?id=${iv.id}`, target: "_blank", rel: "noreferrer", children: "PDF" }),
          /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => emailInvoice(iv), children: "Email" }),
          /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => payLink(iv), children: "Pay link" }),
          /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => setStatus(iv.id, iv.status === "paid" ? "unpaid" : "paid"), children: iv.status === "paid" ? "Unpay" : "Mark paid" }),
          /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => delInvoice(iv.id), children: "✕" })
        ] }, iv.id)),
        invoices.length === 0 && /* @__PURE__ */ jsx("p", { className: "tool-label", children: "No invoices yet — add clients, then generate." })
      ] })
    ] }),
    tab === "Audits" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
        /* @__PURE__ */ jsx("p", { className: "tool-label", children: "New workflow audit — automation, optimization & planning" }),
        /* @__PURE__ */ jsxs("div", { className: "tool-row", style: { flexWrap: "wrap", gap: "0.5rem" }, children: [
          /* @__PURE__ */ jsx("input", { className: "tool-input", style: { flex: "1 1 200px" }, placeholder: "Company", value: af.company, onChange: (e) => setAf({ ...af, company: e.target.value }) }),
          /* @__PURE__ */ jsx("input", { className: "tool-input", style: { maxWidth: 150 }, placeholder: "Contact", value: af.contact, onChange: (e) => setAf({ ...af, contact: e.target.value }) }),
          /* @__PURE__ */ jsx("input", { className: "tool-input", style: { maxWidth: 180 }, placeholder: "Email", value: af.email, onChange: (e) => setAf({ ...af, email: e.target.value }) }),
          /* @__PURE__ */ jsx("button", { className: "tool-btn", onClick: createAudit, children: "Start audit" })
        ] }),
        /* @__PURE__ */ jsx("input", { className: "tool-input", style: { width: "100%", marginTop: "0.5rem" }, placeholder: "Scope / summary (optional)", value: af.summary, onChange: (e) => setAf({ ...af, summary: e.target.value }) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "biz-list", children: [
        audits.map((a) => /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs("div", { className: "biz-row", children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("b", { children: a.company }),
              /* @__PURE__ */ jsxs("span", { children: [
                a.contact || a.email || "",
                a.contact || a.email ? " · " : "",
                a.done,
                "/",
                a.items,
                " findings resolved"
              ] })
            ] }),
            /* @__PURE__ */ jsxs("select", { className: "tool-input", style: { maxWidth: 130 }, value: a.status, onChange: (e) => auditStatus(a.id, e.target.value), children: [
              /* @__PURE__ */ jsx("option", { value: "in_progress", children: "In progress" }),
              /* @__PURE__ */ jsx("option", { value: "delivered", children: "Delivered" }),
              /* @__PURE__ */ jsx("option", { value: "won", children: "Won" }),
              /* @__PURE__ */ jsx("option", { value: "archived", children: "Archived" })
            ] }),
            /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => setAuditId(auditId === a.id ? null : a.id), children: auditId === a.id ? "Close" : "Open" }),
            /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => delAudit(a.id), children: "✕" })
          ] }),
          auditId === a.id && /* @__PURE__ */ jsx(AuditManage, { auditId: a.id })
        ] }, a.id)),
        audits.length === 0 && /* @__PURE__ */ jsx("p", { className: "tool-label", children: "No audits yet. Start one above — capture a company's workflow automation & optimization opportunities." })
      ] })
    ] }),
    tab === "Bookkeeping" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "biz-cards", children: [
        /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
          /* @__PURE__ */ jsx("span", { children: "Income" }),
          /* @__PURE__ */ jsx("b", { children: money(summary.income) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
          /* @__PURE__ */ jsx("span", { children: "Expenses" }),
          /* @__PURE__ */ jsx("b", { children: money(summary.expenses) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
          /* @__PURE__ */ jsx("span", { children: "Net" }),
          /* @__PURE__ */ jsx("b", { style: { color: summary.net >= 0 ? "#58d6a0" : "#ff7d6b" }, children: money(summary.net) })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
        /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Monthly — income vs expenses" }),
        monthly.length === 0 ? /* @__PURE__ */ jsx("p", { className: "tool-label", children: "No monthly data yet." }) : /* @__PURE__ */ jsxs("div", { className: "mtrend", children: [
          monthly.map((m) => {
            const max = Math.max(...monthly.flatMap((x) => [x.income, x.expenses]), 1);
            return /* @__PURE__ */ jsxs("div", { className: "mtrend-row", children: [
              /* @__PURE__ */ jsx("span", { className: "mtrend-mo", children: m.month }),
              /* @__PURE__ */ jsxs("div", { className: "mtrend-bars", children: [
                /* @__PURE__ */ jsx("div", { className: "mtrend-bar in", style: { width: m.income / max * 100 + "%" }, title: "Income " + money(m.income) }),
                /* @__PURE__ */ jsx("div", { className: "mtrend-bar ex", style: { width: m.expenses / max * 100 + "%" }, title: "Expenses " + money(m.expenses) })
              ] }),
              /* @__PURE__ */ jsx("span", { className: "mtrend-net", style: { color: m.net >= 0 ? "#58d6a0" : "#ff7d6b" }, children: money(m.net) })
            ] }, m.month);
          }),
          /* @__PURE__ */ jsxs("div", { className: "mtrend-legend", children: [
            /* @__PURE__ */ jsx("i", { className: "in" }),
            " Income ",
            /* @__PURE__ */ jsx("i", { className: "ex" }),
            " Expenses"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "tool-row", children: [
        /* @__PURE__ */ jsx("button", { className: "tool-btn tool-ghost", onClick: syncHosting, children: "Sync Hostinger costs → expenses" }),
        /* @__PURE__ */ jsx("button", { className: "tool-btn tool-ghost", onClick: () => csvRef.current?.click(), children: "Import CSV" }),
        /* @__PURE__ */ jsx("input", { ref: csvRef, type: "file", accept: ".csv,text/csv", hidden: true, onChange: (e) => importCsv(e.target.files?.[0] || null) })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "tool-panel biz-form", children: [
        /* @__PURE__ */ jsxs("select", { className: "tool-select", value: lf.kind, onChange: (e) => setLf({ ...lf, kind: e.target.value }), children: [
          /* @__PURE__ */ jsx("option", { value: "expense", children: "Expense" }),
          /* @__PURE__ */ jsx("option", { value: "income", children: "Income" })
        ] }),
        /* @__PURE__ */ jsx("input", { className: "tool-input", placeholder: "Category", value: lf.category, onChange: (e) => setLf({ ...lf, category: e.target.value }) }),
        /* @__PURE__ */ jsx("input", { className: "tool-input", style: { maxWidth: 120 }, placeholder: "Amount", value: lf.amount, onChange: (e) => setLf({ ...lf, amount: e.target.value }) }),
        /* @__PURE__ */ jsx("input", { className: "tool-input", placeholder: "Note", value: lf.note, onChange: (e) => setLf({ ...lf, note: e.target.value }) }),
        /* @__PURE__ */ jsx("button", { className: "tool-btn", onClick: addLedger, children: "Add entry" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "biz-list", children: [
        ledger.map((l) => /* @__PURE__ */ jsxs("div", { className: "biz-row", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("b", { children: l.category || l.kind }),
            /* @__PURE__ */ jsx("span", { children: l.note || "" })
          ] }),
          /* @__PURE__ */ jsxs("b", { className: "biz-amt", style: { color: l.kind === "income" ? "#58d6a0" : "#ff7d6b" }, children: [
            l.kind === "income" ? "+" : "−",
            money(l.amount)
          ] }),
          /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => delLedger(l.id), children: "✕" })
        ] }, l.id)),
        ledger.length === 0 && /* @__PURE__ */ jsx("p", { className: "tool-label", children: "No entries yet. Paid invoices count as income automatically." })
      ] })
    ] }),
    tab === "Deployments" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "tool-panel biz-form", children: [
        /* @__PURE__ */ jsxs("select", { className: "tool-select", value: df.client_id, onChange: (e) => setDf({ ...df, client_id: e.target.value }), children: [
          /* @__PURE__ */ jsx("option", { value: "", children: "Client…" }),
          clients.map((c) => /* @__PURE__ */ jsx("option", { value: c.id, children: c.name }, c.id))
        ] }),
        /* @__PURE__ */ jsx("input", { className: "tool-input", placeholder: "What shipped (e.g. New homepage + SEO)", value: df.summary, onChange: (e) => setDf({ ...df, summary: e.target.value }) }),
        /* @__PURE__ */ jsx("input", { className: "tool-input", style: { maxWidth: 200 }, placeholder: "URL (optional)", value: df.url, onChange: (e) => setDf({ ...df, url: e.target.value }) }),
        /* @__PURE__ */ jsx("button", { className: "tool-btn", onClick: addDeploy, children: "Log deployment" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "biz-list", children: [
        deploys.map((d) => /* @__PURE__ */ jsxs("div", { className: "biz-row", children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("b", { children: d.client_name || "—" }),
            /* @__PURE__ */ jsxs("span", { children: [
              d.summary,
              d.url ? ` · ${d.url}` : ""
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "biz-status", children: new Date(d.ts).toLocaleDateString() }),
          /* @__PURE__ */ jsx("button", { className: "tool-chip", onClick: () => delDeploy(d.id), children: "✕" })
        ] }, d.id)),
        deploys.length === 0 && /* @__PURE__ */ jsx("p", { className: "tool-label", children: "No deployments logged yet." })
      ] })
    ] }),
    tab === "Hosting" && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
        /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Domain lookup — registrar, expiry, DNS (free, no key)" }),
        /* @__PURE__ */ jsxs("div", { className: "tool-row", children: [
          /* @__PURE__ */ jsx("input", { className: "tool-input", style: { flex: 1, minWidth: 200 }, value: domain, placeholder: "client-domain.com", onChange: (e) => setDomain(e.target.value), onKeyDown: (e) => e.key === "Enter" && lookupDomain() }),
          /* @__PURE__ */ jsx("button", { className: "tool-btn", disabled: dloading || !domain.trim(), onClick: lookupDomain, children: dloading ? "Looking up…" : "Look up" })
        ] }),
        dinfo && /* @__PURE__ */ jsxs("div", { className: "biz-cards", style: { marginTop: "1rem" }, children: [
          /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
            /* @__PURE__ */ jsx("span", { children: "Registrar" }),
            /* @__PURE__ */ jsx("b", { style: { fontSize: "1rem" }, children: dinfo.rdap.registrar || "—" }),
            /* @__PURE__ */ jsx("i", { children: dinfo.domain })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
            /* @__PURE__ */ jsx("span", { children: "Expires" }),
            /* @__PURE__ */ jsx("b", { style: { fontSize: "1rem" }, children: dinfo.rdap.expires ? dinfo.rdap.expires.slice(0, 10) : "—" }),
            /* @__PURE__ */ jsx("i", { children: "registration" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
            /* @__PURE__ */ jsx("span", { children: "IP (A)" }),
            /* @__PURE__ */ jsx("b", { style: { fontSize: "1rem" }, children: dinfo.dns.a[0] || "—" }),
            /* @__PURE__ */ jsx("i", { children: "where it points" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
            /* @__PURE__ */ jsx("span", { children: "Nameservers" }),
            /* @__PURE__ */ jsx("b", { style: { fontSize: "0.8rem" }, children: (dinfo.rdap.nameservers || dinfo.dns.ns)?.slice(0, 2).join(", ").toLowerCase() || "—" }),
            /* @__PURE__ */ jsx("i", { children: dinfo.dns.mx.length ? "email: " + dinfo.dns.mx[0].split(" ").pop() : "no MX" })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
        /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Server resources — live" }),
        !system && /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Reading…" }),
        system && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsxs("div", { className: "biz-meters", children: [
            system.disk && /* @__PURE__ */ jsx(Meter, { label: "Disk (filesystem)", used: system.disk.used, total: system.disk.total }),
            /* @__PURE__ */ jsx(Meter, { label: "System RAM", used: system.mem.used, total: system.mem.total }),
            /* @__PURE__ */ jsx(Meter, { label: "CPU load (1m avg)", used: system.cpu.load[0] || 0, total: system.cpu.cores, raw: true, sub: `${system.cpu.cores} cores` })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "biz-cards", style: { marginTop: "1.1rem" }, children: [
            /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
              /* @__PURE__ */ jsx("span", { children: "App memory" }),
              /* @__PURE__ */ jsx("b", { children: fmtB(system.mem.rss) }),
              /* @__PURE__ */ jsx("i", { children: "process RSS" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
              /* @__PURE__ */ jsx("span", { children: "App data" }),
              /* @__PURE__ */ jsx("b", { children: fmtB(system.app.footprint) }),
              /* @__PURE__ */ jsx("i", { children: "db + uploads" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
              /* @__PURE__ */ jsx("span", { children: "App uptime" }),
              /* @__PURE__ */ jsx("b", { children: fmtUp(system.app.uptime) }),
              /* @__PURE__ */ jsx("i", { children: "since restart" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "biz-card", children: [
              /* @__PURE__ */ jsx("span", { children: "Node" }),
              /* @__PURE__ */ jsx("b", { style: { fontSize: "1.1rem" }, children: system.app.node }),
              /* @__PURE__ */ jsx("i", { children: system.sys.platform })
            ] })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "tool-panel", children: [
        !hosting && /* @__PURE__ */ jsx("p", { className: "tool-label", children: "Loading from Hostinger…" }),
        hosting?.needsKey && /* @__PURE__ */ jsxs("div", { className: "tool-note", children: [
          "Add ",
          /* @__PURE__ */ jsx("code", { children: "HOSTINGER_API_TOKEN" }),
          " to pull live VPS & subscription data."
        ] }),
        hosting && !hosting.needsKey && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("p", { className: "tool-label", children: "VPS / virtual machines" }),
          /* @__PURE__ */ jsx("pre", { className: "biz-pre", children: JSON.stringify(hosting.vps, null, 2) }),
          /* @__PURE__ */ jsx("p", { className: "tool-label", style: { marginTop: "1rem" }, children: "Subscriptions" }),
          /* @__PURE__ */ jsx("pre", { className: "biz-pre", children: JSON.stringify(hosting.subscriptions, null, 2) })
        ] })
      ] })
    ] })
  ] }) });
}

const prerender = false;
const $$Business = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Business \xB7 Inovision Studio OS", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "BusinessPage", BusinessPage, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/BusinessPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/business.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/business.astro";
const $$url = "/admin/business";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Business,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
