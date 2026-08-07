import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/Base_-4rjFWta.mjs';
/* empty css                                   */
import { N as Nav, F as Footer } from '../chunks/Footer_CTcSx4kn.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
export { renderers } from '../renderers.mjs';

const PLANS = [
  { key: "launch", name: "Launch", fee: 500, blurb: "3-page site · mobile-first · SEO" },
  { key: "business", name: "Business", fee: 1e3, blurb: "Up to 10 pages · blog/CMS · gallery" },
  { key: "fullstack", name: "Full-Stack", fee: 3e3, blurb: "Custom app · backend · dashboards" }
];
const money = (n) => "$" + n.toLocaleString();
function OnboardForm() {
  const [step, setStep] = useState(1);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");
  const [f, setF] = useState({
    name: "",
    business: "",
    email: "",
    phone: "",
    plan: "launch",
    aiEnabled: false,
    site: "",
    brief: "",
    password: "",
    password2: "",
    agreeTos: false,
    agreePrivacy: false,
    agreeArbitration: false
  });
  const set = (k, v) => setF((s) => ({ ...s, [k]: v }));
  const plan = PLANS.find((p) => p.key === f.plan);
  const deposit = plan.fee * 0.5;
  const next = () => {
    setErr("");
    if (step === 1) {
      if (!f.name.trim() || !f.email.trim()) return setErr("Please enter your name and email.");
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(f.email)) return setErr("Please enter a valid email.");
    }
    setStep((s) => Math.min(3, s + 1));
  };
  const back = () => {
    setErr("");
    setStep((s) => Math.max(1, s - 1));
  };
  async function submit() {
    setErr("");
    if (f.password.length < 8) return setErr("Choose a password of at least 8 characters.");
    if (f.password !== f.password2) return setErr("Passwords don't match.");
    if (!(f.agreeTos && f.agreePrivacy && f.agreeArbitration)) return setErr("Please accept all three agreements to continue.");
    setBusy(true);
    try {
      const r = await fetch("/api/onboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(f)
      });
      const d = await r.json();
      if (d.url) {
        window.location.href = d.url;
        return;
      }
      if (d.ok && d.needsKey) {
        window.location.href = "/portal";
        return;
      }
      setBusy(false);
      setErr(d.error || "Something went wrong. Please try again.");
    } catch {
      setBusy(false);
      setErr("Network error — please try again.");
    }
  }
  return /* @__PURE__ */ jsxs("div", { className: "ob", children: [
    /* @__PURE__ */ jsx("div", { className: "ob-steps", children: ["Your business", "Your project", "Agree & deposit"].map((t, i) => /* @__PURE__ */ jsxs("div", { className: `ob-step${step === i + 1 ? " on" : ""}${step > i + 1 ? " done" : ""}`, children: [
      /* @__PURE__ */ jsx("span", { className: "ob-step-n", children: step > i + 1 ? "✓" : i + 1 }),
      /* @__PURE__ */ jsx("span", { children: t })
    ] }, t)) }),
    /* @__PURE__ */ jsxs("div", { className: "ob-card", children: [
      step === 1 && /* @__PURE__ */ jsxs("div", { className: "ob-body", children: [
        /* @__PURE__ */ jsxs("div", { className: "ob-grid2", children: [
          /* @__PURE__ */ jsxs("label", { className: "ob-field", children: [
            /* @__PURE__ */ jsx("span", { children: "Your name *" }),
            /* @__PURE__ */ jsx("input", { value: f.name, onChange: (e) => set("name", e.target.value), placeholder: "Jane Smith" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "ob-field", children: [
            /* @__PURE__ */ jsx("span", { children: "Business name" }),
            /* @__PURE__ */ jsx("input", { value: f.business, onChange: (e) => set("business", e.target.value), placeholder: "Acme Co." })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "ob-field", children: [
            /* @__PURE__ */ jsx("span", { children: "Email *" }),
            /* @__PURE__ */ jsx("input", { type: "email", value: f.email, onChange: (e) => set("email", e.target.value), placeholder: "you@business.com" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "ob-field", children: [
            /* @__PURE__ */ jsx("span", { children: "Phone" }),
            /* @__PURE__ */ jsx("input", { value: f.phone, onChange: (e) => set("phone", e.target.value), placeholder: "(248) 555-0100" })
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "ob-lab", children: "Choose your plan *" }),
        /* @__PURE__ */ jsx("div", { className: "ob-plans", children: PLANS.map((p) => /* @__PURE__ */ jsxs("button", { type: "button", className: `ob-plan${f.plan === p.key ? " on" : ""}`, onClick: () => set("plan", p.key), children: [
          /* @__PURE__ */ jsx("b", { children: p.name }),
          /* @__PURE__ */ jsx("span", { className: "ob-plan-fee", children: money(p.fee) }),
          /* @__PURE__ */ jsx("span", { className: "ob-plan-blurb", children: p.blurb })
        ] }, p.key)) }),
        /* @__PURE__ */ jsxs("label", { className: "ob-toggle", children: [
          /* @__PURE__ */ jsx("input", { type: "checkbox", checked: f.aiEnabled, onChange: (e) => set("aiEnabled", e.target.checked) }),
          /* @__PURE__ */ jsxs("span", { children: [
            "Add ",
            /* @__PURE__ */ jsx("b", { children: "AI integration" }),
            " — chat, copilots & automation ",
            /* @__PURE__ */ jsx("em", { children: "(+$70/mo after launch, by DAIEJA 2.0)" })
          ] })
        ] })
      ] }),
      step === 2 && /* @__PURE__ */ jsxs("div", { className: "ob-body", children: [
        /* @__PURE__ */ jsxs("label", { className: "ob-field", children: [
          /* @__PURE__ */ jsx("span", { children: "Current website or domain (if any)" }),
          /* @__PURE__ */ jsx("input", { value: f.site, onChange: (e) => set("site", e.target.value), placeholder: "yourbusiness.com" })
        ] }),
        /* @__PURE__ */ jsxs("label", { className: "ob-field", children: [
          /* @__PURE__ */ jsx("span", { children: "Tell us about the project" }),
          /* @__PURE__ */ jsx("textarea", { rows: 6, value: f.brief, onChange: (e) => set("brief", e.target.value), placeholder: "What does your business do, what pages/features do you need, any references you like, and your goals for the site?" })
        ] }),
        /* @__PURE__ */ jsx("p", { className: "ob-hint", children: "The more detail here, the faster we can spec your build. You can add more in your portal later." })
      ] }),
      step === 3 && /* @__PURE__ */ jsxs("div", { className: "ob-body", children: [
        /* @__PURE__ */ jsxs("div", { className: "ob-summary", children: [
          /* @__PURE__ */ jsxs("div", { className: "ob-sum-row", children: [
            /* @__PURE__ */ jsxs("span", { children: [
              plan.name,
              " project"
            ] }),
            /* @__PURE__ */ jsx("b", { children: money(plan.fee) })
          ] }),
          f.aiEnabled && /* @__PURE__ */ jsxs("div", { className: "ob-sum-row", children: [
            /* @__PURE__ */ jsx("span", { children: "AI integration" }),
            /* @__PURE__ */ jsxs("b", { children: [
              "$70/mo ",
              /* @__PURE__ */ jsx("em", { children: "after launch" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ob-sum-row", children: [
            /* @__PURE__ */ jsx("span", { children: "Hosting" }),
            /* @__PURE__ */ jsxs("b", { children: [
              "$20/mo ",
              /* @__PURE__ */ jsx("em", { children: "after launch" })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "ob-sum-row total", children: [
            /* @__PURE__ */ jsx("span", { children: "Due today — 50% deposit" }),
            /* @__PURE__ */ jsx("b", { children: money(deposit) })
          ] }),
          /* @__PURE__ */ jsxs("p", { className: "ob-sum-note", children: [
            "Remaining ",
            money(plan.fee - deposit),
            " invoiced at launch. Recurring hosting",
            f.aiEnabled ? " + AI" : "",
            " begins only after your site goes live."
          ] })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "ob-lab", children: "Create your portal login" }),
        /* @__PURE__ */ jsxs("div", { className: "ob-grid2", children: [
          /* @__PURE__ */ jsxs("label", { className: "ob-field", children: [
            /* @__PURE__ */ jsx("span", { children: "Password *" }),
            /* @__PURE__ */ jsx("input", { type: "password", value: f.password, onChange: (e) => set("password", e.target.value), placeholder: "8+ characters" })
          ] }),
          /* @__PURE__ */ jsxs("label", { className: "ob-field", children: [
            /* @__PURE__ */ jsx("span", { children: "Confirm password *" }),
            /* @__PURE__ */ jsx("input", { type: "password", value: f.password2, onChange: (e) => set("password2", e.target.value), placeholder: "Repeat password" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "ob-agree", children: [
          /* @__PURE__ */ jsxs("label", { children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: f.agreeTos, onChange: (e) => set("agreeTos", e.target.checked) }),
            " ",
            /* @__PURE__ */ jsxs("span", { children: [
              "I have read and agree to the ",
              /* @__PURE__ */ jsx("a", { href: "/terms", target: "_blank", rel: "noreferrer", children: "Terms of Service" }),
              "."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: f.agreePrivacy, onChange: (e) => set("agreePrivacy", e.target.checked) }),
            " ",
            /* @__PURE__ */ jsxs("span", { children: [
              "I have read and agree to the ",
              /* @__PURE__ */ jsx("a", { href: "/privacy", target: "_blank", rel: "noreferrer", children: "Privacy Policy" }),
              "."
            ] })
          ] }),
          /* @__PURE__ */ jsxs("label", { children: [
            /* @__PURE__ */ jsx("input", { type: "checkbox", checked: f.agreeArbitration, onChange: (e) => set("agreeArbitration", e.target.checked) }),
            " ",
            /* @__PURE__ */ jsxs("span", { children: [
              "I agree that disputes are resolved by ",
              /* @__PURE__ */ jsx("b", { children: "binding arbitration in Michigan" }),
              " on an individual basis, and I waive court and jury trial and class actions (Terms §14–15)."
            ] })
          ] })
        ] })
      ] }),
      err && /* @__PURE__ */ jsx("p", { className: "ob-err", children: err }),
      /* @__PURE__ */ jsxs("div", { className: "ob-nav", children: [
        step > 1 ? /* @__PURE__ */ jsx("button", { type: "button", className: "s-btn s-btn-ghost", onClick: back, disabled: busy, children: "← Back" }) : /* @__PURE__ */ jsx("span", {}),
        step < 3 ? /* @__PURE__ */ jsxs("button", { type: "button", className: "s-btn s-btn-primary", onClick: next, children: [
          "Continue ",
          /* @__PURE__ */ jsx("span", { className: "ico", children: "→" })
        ] }) : /* @__PURE__ */ jsx("button", { type: "button", className: "s-btn s-btn-primary", onClick: submit, disabled: busy, children: busy ? "Starting secure checkout…" : `Pay ${money(deposit)} deposit & start` })
      ] })
    ] })
  ] });
}

const prerender = false;
const $$Start = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Start your project \u2014 Inovision Studios", "description": "Onboard in three steps: pick your plan, tell us about the project, agree, and pay a 50% deposit to begin. Then track your build in a secure client portal." }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="studio"> <div class="studio-aurora"></div> <div class="studio-grain"></div> ${renderComponent($$result2, "Nav", Nav, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Nav", "client:component-export": "default" })} <section class="s-section page-hero-top"> <div class="s-wrap ob-wrap"> <nav class="iv-crumb" aria-label="Breadcrumb"><a href="/">Home</a><span class="sep">/</span><span class="cur">Start a project</span></nav> <p class="s-kicker">Start your project</p> <h1 class="s-display">Let's build <span class="s-grad-text">your thing.</span></h1> <p class="s-lead" style="max-width:60ch;">
Three quick steps, a 50% deposit to begin, and you're in your secure portal tracking the build.
          Transparent pricing — no hidden fees, and add-ons are always discussed before we commit.
</p> ${renderComponent($$result2, "OnboardForm", OnboardForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/OnboardForm", "client:component-export": "default" })} <p class="ob-signin">Already a client? <a href="/portal">Sign in to your portal →</a></p> </div> </section> ${renderComponent($$result2, "Footer", Footer, {})} </div> ` })}`;
}, "D:/wix/Inovision/web/src/pages/start.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/start.astro";
const $$url = "/start";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Start,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
