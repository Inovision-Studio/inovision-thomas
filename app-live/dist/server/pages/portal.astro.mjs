import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead, o as Fragment, h as addAttribute } from '../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/Base_-4rjFWta.mjs';
/* empty css                                   */
import { N as Nav, F as Footer } from '../chunks/Footer_CTcSx4kn.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { g as getClientSession } from '../chunks/clientauth_C72sOTMC.mjs';
import { at as getClientByEmail, a1 as listMilestones, P as PIPELINE } from '../chunks/db_xJ927fmw.mjs';
import { C as COMPANY } from '../chunks/legal_DA6HfMMm.mjs';
export { renderers } from '../renderers.mjs';

function PortalLogin() {
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(e) {
    e.preventDefault();
    setErr("");
    setBusy(true);
    try {
      const r = await fetch("/api/portal/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pw })
      });
      const d = await r.json();
      if (d.ok) {
        window.location.href = "/portal";
        return;
      }
      setBusy(false);
      setErr(d.error || "Sign-in failed.");
    } catch {
      setBusy(false);
      setErr("Network error — please try again.");
    }
  }
  return /* @__PURE__ */ jsxs("form", { className: "ob-body", onSubmit: submit, children: [
    /* @__PURE__ */ jsxs("label", { className: "ob-field", children: [
      /* @__PURE__ */ jsx("span", { children: "Email" }),
      /* @__PURE__ */ jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), autoComplete: "email" })
    ] }),
    /* @__PURE__ */ jsxs("label", { className: "ob-field", children: [
      /* @__PURE__ */ jsx("span", { children: "Password" }),
      /* @__PURE__ */ jsx("input", { type: "password", value: pw, onChange: (e) => setPw(e.target.value), autoComplete: "current-password" })
    ] }),
    err && /* @__PURE__ */ jsx("p", { className: "ob-err", style: { margin: 0 }, children: err }),
    /* @__PURE__ */ jsx("button", { className: "s-btn s-btn-primary", disabled: busy, style: { justifyContent: "center" }, children: busy ? "Signing in…" : "Sign in" })
  ] });
}

function PortalThread() {
  const [msgs, setMsgs] = useState([]);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const load = async () => {
    try {
      const d = await (await fetch("/api/portal/messages")).json();
      setMsgs(d.items || []);
    } catch {
    }
    setLoaded(true);
  };
  useEffect(() => {
    load();
  }, []);
  async function send(e) {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    setBusy(true);
    try {
      const d = await (await fetch("/api/portal/messages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ body: t }) })).json();
      if (d.items) setMsgs(d.items);
      setText("");
    } catch {
    }
    setBusy(false);
  }
  return /* @__PURE__ */ jsxs("div", { className: "thr", children: [
    /* @__PURE__ */ jsxs("div", { className: "thr-list", children: [
      loaded && msgs.length === 0 && /* @__PURE__ */ jsx("p", { className: "thr-empty", children: "No messages yet. Ask us anything about your project — we'll reply here." }),
      msgs.map((m) => /* @__PURE__ */ jsxs("div", { className: `thr-msg ${m.sender === "client" ? "me" : "them"}`, children: [
        /* @__PURE__ */ jsx("div", { className: "thr-bubble", children: m.body }),
        /* @__PURE__ */ jsxs("span", { className: "thr-meta", children: [
          m.sender === "client" ? "You" : m.author || "Inovision Studios",
          " · ",
          new Date(m.created_at).toLocaleDateString()
        ] })
      ] }, m.id))
    ] }),
    /* @__PURE__ */ jsxs("form", { className: "thr-compose", onSubmit: send, children: [
      /* @__PURE__ */ jsx("input", { value: text, onChange: (e) => setText(e.target.value), placeholder: "Message the team…" }),
      /* @__PURE__ */ jsx("button", { className: "s-btn s-btn-primary", disabled: busy || !text.trim(), children: busy ? "…" : "Send" })
    ] })
  ] });
}

const $$Astro = createAstro("https://inovisionstudios.com");
const prerender = false;
const $$Index = createComponent(async ($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const session = await getClientSession(Astro2.cookies);
  const c = session ? getClientByEmail(session.email) : void 0;
  const milestones = c ? listMilestones(c.id) : [];
  const welcome = Astro2.url.searchParams.get("welcome");
  const sub = Astro2.url.searchParams.get("sub");
  const money = (n) => "$" + Number(n || 0).toLocaleString();
  let stageIdx = -1;
  if (c && c.stage && c.stage !== "onboarding") stageIdx = PIPELINE.findIndex((s) => s.key === c.stage);
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Client Portal \u2014 Inovision Studios", "description": "Track your project, view your agreement, and manage payments securely." }, { "default": async ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="studio"> <div class="studio-grain"></div> ${renderComponent($$result2, "Nav", Nav, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Nav", "client:component-export": "default" })} <section class="s-section page-hero-top"> <div class="s-wrap portal-wrap"> <nav class="iv-crumb" aria-label="Breadcrumb"><a href="/">Home</a><span class="sep">/</span><span class="cur">Client Portal</span></nav> ${!c && renderTemplate`<div class="pt-login"> <p class="s-kicker">Client Portal</p> <h1 class="s-display">Sign in</h1> <p class="s-lead" style="font-size:1rem;">Track your build, view your agreement, and manage payments.</p> <div class="pt-card">${renderComponent($$result2, "PortalLogin", PortalLogin, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/PortalLogin", "client:component-export": "default" })}</div> <p class="ob-signin">New here? <a href="/start">Start a project →</a></p> </div>`} ${c && renderTemplate`${renderComponent($$result2, "Fragment", Fragment, {}, { "default": async ($$result3) => renderTemplate`${welcome === "1" && renderTemplate`<div class="pt-welcome">Deposit received — welcome aboard. Your project is now in our queue and you'll see it move through the stages below.</div>`}${welcome === "pending" && renderTemplate`<div class="pt-welcome" style="background:rgba(230,190,110,0.1);border-color:rgba(230,190,110,0.3);color:#f0c674;">Account created. If your deposit didn't finish processing, you can complete it below to start the build.</div>`}${sub === "1" && renderTemplate`<div class="pt-welcome">Monthly service is active — thank you. Your hosting${c.ai > 0 ? " and AI integration" : ""} will rebill automatically each month.</div>`}<div class="pt-head"> <div><p class="s-kicker">Client Portal</p><h1>${c.name}</h1></div> ${c.plan && renderTemplate`<span class="pt-plan-badge">${c.plan} plan</span>`} </div> <div class="pt-card"> <div class="pt-track"> ${PIPELINE.map((s, i) => renderTemplate`<div${addAttribute(`pt-stage ${stageIdx < 0 ? "pending" : i < stageIdx ? "done" : i === stageIdx ? "current" : "pending"}`, "class")}> <span class="pt-dot">${stageIdx >= 0 && i < stageIdx ? "\u2713" : i + 1}</span> <span class="pt-stage-txt"> <b>${s.label}</b> <span>${stageIdx < 0 ? "Starts after deposit" : i < stageIdx ? "Complete" : i === stageIdx ? "In progress" : "Upcoming"}</span> </span> </div>`)} </div> <ul class="pt-rows"> <li><span>Deposit (50%)</span><b>${c.deposit_paid ? `Paid \xB7 ${money(c.deposit_amount)}` : `Due \xB7 ${money(c.deposit_amount)}`}</b></li> <li><span>Balance at launch</span><b>${money((c.project_fee || 0) - (c.deposit_amount || 0))}</b></li> <li><span>Hosting</span><b>$20/mo · ${c.sub_active ? "active" : c.launched_at ? "ready to start" : "starts at launch"}</b></li> ${c.ai > 0 && renderTemplate`<li><span>AI integration</span><b>$70/mo · ${c.sub_active ? "active" : c.launched_at ? "ready to start" : "starts at launch"}</b></li>`} </ul> ${!c.deposit_paid && renderTemplate`<a class="s-btn s-btn-primary pt-pay" href="/api/portal/pay-deposit" style="justify-content:center;width:100%;">Complete deposit — ${money(c.deposit_amount)} <span class="ico">→</span></a>`} ${c.deposit_paid && c.launched_at && !c.sub_active && renderTemplate`<a class="s-btn s-btn-primary pt-pay" href="/api/portal/subscribe" style="justify-content:center;width:100%;">
Start monthly service — $${20 + (c.ai > 0 ? 70 : 0)}/mo <span class="ico">→</span> </a>`} ${c.sub_active && renderTemplate`<p class="pt-active">✓ Monthly service active — billed automatically each month.</p>`} </div> ${milestones.length > 0 && renderTemplate`<div class="pt-card" style="margin-top:1.4rem;"> <h2 class="pt-sub">Milestones</h2> <ul class="pt-ms"> ${milestones.map((m) => renderTemplate`<li${addAttribute(m.done ? "done" : "", "class")}> <span class="pt-ms-box">${m.done ? "\u2713" : ""}</span> <span class="pt-ms-t">${m.title}${m.due ? renderTemplate`<em> · ${m.due}</em>` : null}</span> </li>`)} </ul> </div>`}<div class="pt-card" style="margin-top:1.4rem;"> <h2 class="pt-sub">Messages</h2> ${renderComponent($$result3, "PortalThread", PortalThread, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/PortalThread", "client:component-export": "default" })} </div> <p class="ob-signin" style="margin-top:1.6rem;">
Questions? <a${addAttribute(`mailto:${COMPANY.email}`, "href")}>${COMPANY.email}</a> · ${COMPANY.phone} </p> <form method="POST" action="/api/portal/logout" style="text-align:center;margin-top:0.6rem;"> <button class="pt-logout" type="submit">Sign out</button> </form> ` })}`} </div> </section> ${renderComponent($$result2, "Footer", Footer, {})} </div> ` })}`;
}, "D:/wix/Inovision/web/src/pages/portal/index.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/portal/index.astro";
const $$url = "/portal";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
