import { e as createAstro, f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState } from 'react';
export { renderers } from '../../renderers.mjs';

function EyeIcon() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z" }),
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
      ]
    }
  );
}
function EyeOffIcon() {
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: "18",
      height: "18",
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: "1.6",
      strokeLinecap: "round",
      strokeLinejoin: "round",
      "aria-hidden": "true",
      children: [
        /* @__PURE__ */ jsx("path", { d: "M17.94 17.94A10.94 10.94 0 0 1 12 19c-6.5 0-10-7-10-7a18.45 18.45 0 0 1 5.06-5.94" }),
        /* @__PURE__ */ jsx("path", { d: "M9.9 4.24A10.94 10.94 0 0 1 12 4c6.5 0 10 7 10 7a18.56 18.56 0 0 1-2.16 3.19" }),
        /* @__PURE__ */ jsx("path", { d: "M14.12 14.12A3 3 0 1 1 9.88 9.88" }),
        /* @__PURE__ */ jsx("line", { x1: "2", y1: "2", x2: "22", y2: "22" })
      ]
    }
  );
}
function LoginForm({ redirectTo }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  async function onSubmit(e) {
    e.preventDefault();
    setPending(true);
    setError("");
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "");
    const password = String(fd.get("password") || "");
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        setError(j?.error || "Login failed");
        setPending(false);
        return;
      }
      window.location.href = redirectTo;
    } catch {
      setError("Network error");
      setPending(false);
    }
  }
  return /* @__PURE__ */ jsxs("form", { className: "iv-login-form", onSubmit, noValidate: true, children: [
    /* @__PURE__ */ jsxs("div", { className: "iv-login-field", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "al-email", children: "Email" }),
      /* @__PURE__ */ jsx("div", { className: "iv-login-input", children: /* @__PURE__ */ jsx(
        "input",
        {
          id: "al-email",
          name: "email",
          type: "email",
          autoComplete: "username",
          required: true,
          autoFocus: true,
          placeholder: "you@example.com"
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "iv-login-field", children: [
      /* @__PURE__ */ jsx("label", { htmlFor: "al-pw", children: "Password" }),
      /* @__PURE__ */ jsxs("div", { className: "iv-login-input", children: [
        /* @__PURE__ */ jsx(
          "input",
          {
            id: "al-pw",
            name: "password",
            type: showPw ? "text" : "password",
            autoComplete: "current-password",
            required: true,
            placeholder: "••••••••"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            className: "iv-login-eye",
            onClick: () => setShowPw((v) => !v),
            "aria-label": showPw ? "Hide password" : "Show password",
            "aria-pressed": showPw,
            tabIndex: -1,
            children: showPw ? /* @__PURE__ */ jsx(EyeOffIcon, {}) : /* @__PURE__ */ jsx(EyeIcon, {})
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxs("button", { type: "submit", className: "iv-login-submit", disabled: pending, children: [
      /* @__PURE__ */ jsx("span", { children: pending ? "Signing in…" : "Sign In" }),
      /* @__PURE__ */ jsx("span", { className: "arrow", "aria-hidden": "true", children: "→" })
    ] }),
    error && /* @__PURE__ */ jsx("div", { className: "iv-form-error", role: "alert", children: error })
  ] });
}

const $$Astro = createAstro("https://inovisionstudios.com");
const prerender = false;
const $$Login = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Login;
  const from = Astro2.url.searchParams.get("from");
  const redirectTo = from || "/admin/inbox";
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Admin Login \xB7 Inovision Studios", "noindex": true }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<div class="iv-login-shell"> <div class="iv-login-grain" aria-hidden="true"></div> <a href="/" class="iv-login-back" aria-label="Back to inovision.vision">
← Back to site
</a> <div class="iv-login-card"> <div class="iv-login-card-inner"> <div class="iv-login-brand"> <div class="brand-main">INOVISION</div> <div class="brand-sub">Studios · Admin</div> </div> <h1 class="iv-login-title">
Welcome <em>back.</em> </h1> <p class="iv-login-sub">
Sign in to read inquiries, write a post, or check what&apos;s
          happening across the site.
</p> ${renderComponent($$result2, "LoginForm", LoginForm, { "redirectTo": redirectTo, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/LoginForm", "client:component-export": "default" })} <div class="iv-login-foot"> <span>Encrypted session · admin only</span> </div> </div> </div> <div class="iv-login-corner-tl" aria-hidden="true"></div> <div class="iv-login-corner-br" aria-hidden="true"></div> </div> ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/login.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/login.astro";
const $$url = "/admin/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
