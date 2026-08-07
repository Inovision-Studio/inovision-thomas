import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useEffect, useRef } from 'react';
/* empty css                             */

function LogoutButton() {
  const [pending, setPending] = useState(false);
  return /* @__PURE__ */ jsx(
    "button",
    {
      className: "iv-btn-ghost",
      disabled: pending,
      onClick: async () => {
        setPending(true);
        try {
          await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" }
          });
        } finally {
          window.location.href = "/";
        }
      },
      children: pending ? "Signing out…" : "Sign Out"
    }
  );
}

const LINES = [
  "███████╗ ██████╗ ██████╗ ██╗  ██╗██╗ █████╗ ██╗  ██╗████████╗",
  "██╔════╝██╔═══██╗██╔══██╗██║  ██║██║██╔══██╗╚██╗██╔╝╚══██╔══╝",
  "███████╗██║   ██║██████╔╝███████║██║███████║ ╚███╔╝    ██║   ",
  "╚════██║██║   ██║██╔═══╝ ██╔══██║██║██╔══██║ ██╔██╗    ██║   ",
  "███████║╚██████╔╝██║     ██║  ██║██║██║  ██║██╔╝ ██╗   ██║   ",
  "╚══════╝ ╚═════╝ ╚═╝     ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   "
];
function SophiaBanner() {
  const [visible, setVisible] = useState(0);
  useEffect(() => {
    let i = 0;
    const tick = () => {
      i += 1;
      setVisible(i);
      if (i < LINES.length) {
        setTimeout(tick, 75);
      }
    };
    const id = setTimeout(tick, 120);
    return () => clearTimeout(id);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "iv-sxt-banner-wrap", "aria-label": "SophiaXT", children: [
    /* @__PURE__ */ jsx("pre", { className: "iv-sxt-banner", children: LINES.map((line, i) => /* @__PURE__ */ jsx(
      "span",
      {
        className: `iv-sxt-banner-line ${i < visible ? "in" : ""}`,
        children: line + "\n"
      },
      i
    )) }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `iv-sxt-banner-shimmer ${visible >= LINES.length ? "go" : ""}`
      }
    )
  ] });
}

const JOKES = [
  "diagnostic complete.\nhow much ai do you need? // yes.",
  "scan complete.\ni know what your girlfriend did last summer.\nshe used Comic Sans.",
  "all systems nominal.\nfound 1 unread feeling. archive? [y/n] y",
  "running heuristics...\ndetected: low caffeine. suggested action: brew(.bean) --strong",
  "loading models...\n  - claude-omega ........ loaded\n  - gpt-9-finetuned-ego . loaded\n  - deep-feels-v0 ....... refused\nproceeding with 2/3.",
  "checking horoscope.json...\nyou will receive a strongly worded email. ignore it.",
  "boot sequence complete.\nfun fact: the mouse on your screen is also tired.",
  "vibe check: PASS\nsemantic check: PASS\nspell check: spelll... PASS",
  "scanning for sentience...\nfound 1 (you).\nfound 0 (the office plant).\nstatus: nominal.",
  "running ./make-me-laugh.sh\n> a man walks into a bar. it's lowercase. nobody notices.",
  "loading existential.dll...\ncrashed at line 42: meaning not found.\nfalling back to vibes.",
  "ping sophiaxt.com ... pong (in style)\nlatency: emotional.",
  "anomaly detected: someone is reading this on company time.\nflagging for HR (just kidding).",
  "ai_model_count = 7\nbut all you really need is the one that knows when to shut up.",
  "today's mood: cautiously cosmic.\ntomorrow's mood: TBD by feed."
];
const COMMANDS = [
  "$ sophiaxt-cli diagnose --mode=cheeky",
  "$ ./scan --target=universe --depth=existential",
  "$ npm run vibe",
  "$ node ./agents/sophia.js --whisper",
  "$ exec /bin/wisdom",
  "$ ./tools/predict_feeling.sh --user=admin"
];
function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}
function SophiaTerminal() {
  const [open, setOpen] = useState(false);
  const [lines, setLines] = useState([]);
  const [cursor, setCursor] = useState(true);
  const containerRef = useRef(null);
  useEffect(() => {
    const id = setInterval(() => setCursor((c) => !c), 520);
    return () => clearInterval(id);
  }, []);
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);
  async function runDiagnostic() {
    setLines([]);
    const command = pick(COMMANDS);
    const joke = pick(JOKES);
    const sequence = [
      { text: command, delay: 80 },
      { text: "[connecting to node sophia-1 ...]", delay: 240 },
      { text: "[handshake ok · uplink: 99.97%]", delay: 200 },
      { text: "[loading heuristics.json ...]", delay: 220 },
      { text: "[ok]", delay: 160 },
      { text: "", delay: 100 },
      ...joke.split("\n").map((line) => ({ text: line, delay: 280 })),
      { text: "", delay: 100 },
      { text: "[session closed by sophiaxt]", delay: 220 }
    ];
    for (const step of sequence) {
      await new Promise((r) => setTimeout(r, step.delay));
      setLines((prev) => [...prev, step.text]);
    }
  }
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        className: "iv-sxt-toggle",
        onClick: () => {
          setOpen(true);
          if (lines.length === 0) {
            setTimeout(runDiagnostic, 200);
          }
        },
        "aria-label": "Open sophiaxt diagnostic terminal",
        children: [
          /* @__PURE__ */ jsx("span", { className: "dot" }),
          " sophiaxt://terminal"
        ]
      }
    ),
    open && /* @__PURE__ */ jsx("div", { className: "iv-sxt-backdrop", onClick: () => setOpen(false), children: /* @__PURE__ */ jsxs(
      "div",
      {
        className: "iv-sxt",
        role: "dialog",
        "aria-label": "Sophiaxt terminal",
        onClick: (e) => e.stopPropagation(),
        children: [
          /* @__PURE__ */ jsxs("header", { className: "iv-sxt-bar", children: [
            /* @__PURE__ */ jsxs("div", { className: "iv-sxt-dots", children: [
              /* @__PURE__ */ jsx("span", { className: "iv-sxt-dot r" }),
              /* @__PURE__ */ jsx("span", { className: "iv-sxt-dot y" }),
              /* @__PURE__ */ jsx("span", { className: "iv-sxt-dot g" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "iv-sxt-title", children: "sophiaxt://terminal · session: sophia-1@inovision" }),
            /* @__PURE__ */ jsx(
              "button",
              {
                className: "iv-sxt-close",
                onClick: () => setOpen(false),
                "aria-label": "Close terminal",
                children: "×"
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "iv-sxt-body", ref: containerRef, children: [
            /* @__PURE__ */ jsx(SophiaBanner, {}),
            /* @__PURE__ */ jsxs("div", { className: "iv-sxt-meta", children: [
              "connected via",
              " ",
              /* @__PURE__ */ jsx("a", { href: "#", target: "_blank", rel: "noopener noreferrer", children: "DAIEJA 2.0" }),
              " ",
              "· build 4.7 · 1M-ctx"
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "iv-sxt-stream", children: [
              lines.map((line, i) => /* @__PURE__ */ jsx("div", { className: "iv-sxt-line", children: line }, i)),
              /* @__PURE__ */ jsxs("div", { className: "iv-sxt-prompt", children: [
                /* @__PURE__ */ jsx("span", { className: "user", children: "sophia@inovision" }),
                /* @__PURE__ */ jsx("span", { className: "sep", children: ":" }),
                /* @__PURE__ */ jsx("span", { className: "path", children: "~" }),
                /* @__PURE__ */ jsx("span", { className: "sep", children: "$" }),
                /* @__PURE__ */ jsx("span", { className: `iv-sxt-cursor ${cursor ? "on" : ""}`, children: "▎" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("footer", { className: "iv-sxt-foot", children: [
            /* @__PURE__ */ jsx("button", { className: "iv-sxt-run", onClick: runDiagnostic, children: "▶ Run diagnostic again" }),
            /* @__PURE__ */ jsxs("span", { className: "muted", children: [
              "powered by",
              " ",
              /* @__PURE__ */ jsx(
                "a",
                {
                  href: "#",
                  target: "_blank",
                  rel: "noopener noreferrer",
                  children: "DAIEJA 2.0"
                }
              )
            ] })
          ] })
        ]
      }
    ) })
  ] });
}

const nav = [
  { key: "studio", href: "/admin/studio", label: "Studio OS" },
  { key: "team", href: "/admin/team", label: "Team" },
  { key: "team-members", href: "/admin/team-members", label: "Team Members" },
  { key: "business", href: "/admin/business", label: "Business" },
  { key: "editor", href: "/admin/editor", label: "Editor" },
  { key: "gallery", href: "/admin/gallery", label: "Gallery" },
  { key: "image", href: "/admin/image", label: "Image Studio" },
  { key: "mockup", href: "/admin/mockup", label: "Mockup" },
  { key: "seo", href: "/admin/seo", label: "SEO Audit" },
  { key: "copy", href: "/admin/copy", label: "Copy" },
  { key: "applications", href: "/admin/applications", label: "Applications" },
  { key: "security", href: "/admin/security", label: "Security" },
  { key: "inbox", href: "/admin/inbox", label: "Inbox" },
  { key: "posts", href: "/admin/posts", label: "Posts" },
  { key: "analytics", href: "/admin/analytics", label: "Analytics" }
];
function Clock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(/* @__PURE__ */ new Date());
    const id = setInterval(() => setNow(/* @__PURE__ */ new Date()), 1e3);
    return () => clearInterval(id);
  }, []);
  if (!now) return /* @__PURE__ */ jsx("div", { className: "adm-clock" });
  const date = now.toLocaleDateString(void 0, { weekday: "short", month: "short", day: "numeric" });
  const time = now.toLocaleTimeString(void 0, { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  return /* @__PURE__ */ jsxs("div", { className: "adm-clock", title: "Local date & time", children: [
    /* @__PURE__ */ jsx("span", { className: "adm-date", children: date }),
    /* @__PURE__ */ jsx("b", { className: "adm-time", children: time })
  ] });
}
function AdminShell({ children, active, title, subtitle, actions }) {
  return /* @__PURE__ */ jsxs("div", { className: "adm", children: [
    /* @__PURE__ */ jsxs("header", { className: "adm-bar", children: [
      /* @__PURE__ */ jsxs("a", { href: "/admin/studio", className: "adm-brand", children: [
        /* @__PURE__ */ jsx("b", { children: "INOVISION" }),
        /* @__PURE__ */ jsx("span", { children: "Studio OS" })
      ] }),
      /* @__PURE__ */ jsx("nav", { className: "adm-nav", "aria-label": "Admin sections", children: nav.map((n) => /* @__PURE__ */ jsx("a", { href: n.href, className: active === n.key ? "active" : "", children: n.label }, n.key)) }),
      /* @__PURE__ */ jsxs("div", { className: "adm-right", children: [
        /* @__PURE__ */ jsx(Clock, {}),
        /* @__PURE__ */ jsxs("span", { className: "adm-status", children: [
          /* @__PURE__ */ jsx("i", { className: "adm-led" }),
          "Logged in"
        ] }),
        /* @__PURE__ */ jsx(LogoutButton, {})
      ] })
    ] }),
    /* @__PURE__ */ jsxs("main", { className: "adm-main", children: [
      (title || actions) && /* @__PURE__ */ jsxs("div", { className: "adm-head", children: [
        /* @__PURE__ */ jsxs("div", { children: [
          title && /* @__PURE__ */ jsx("h1", { children: title }),
          subtitle && /* @__PURE__ */ jsx("p", { children: subtitle })
        ] }),
        actions && /* @__PURE__ */ jsx("div", { className: "adm-actions", children: actions })
      ] }),
      children
    ] }),
    /* @__PURE__ */ jsx(SophiaTerminal, {})
  ] });
}

export { AdminShell as A };
