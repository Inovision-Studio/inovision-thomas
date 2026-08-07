import { f as createComponent, r as renderTemplate, m as maybeRenderHead, e as createAstro, k as renderComponent, h as addAttribute, u as unescapeHTML } from '../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/Base_-4rjFWta.mjs';
/* empty css                                   */
/* empty css                                 */
import 'clsx';
import { jsxs, jsx } from 'react/jsx-runtime';
import { useState, useRef, useEffect, useCallback } from 'react';
import { F as Footer, N as Nav } from '../chunks/Footer_CTcSx4kn.mjs';
import { C as ContactForm } from '../chunks/ContactForm_YCdy7B-x.mjs';
import * as THREE from 'three';
import { G as GALLERY } from '../chunks/gallery_YWiXHYbc.mjs';
import { g as getSettings, H as galleryCount, J as listGallery } from '../chunks/db_xJ927fmw.mjs';
export { renderers } from '../renderers.mjs';

var __freeze$2 = Object.freeze;
var __defProp$2 = Object.defineProperty;
var __template$2 = (cooked, raw) => __freeze$2(__defProp$2(cooked, "raw", { value: __freeze$2(cooked.slice()) }));
var _a$2;
const $$DeviceShowcase = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$2 || (_a$2 = __template$2(["", `<div class="dev-stage" id="devStage"> <div class="dev-rig" id="devRig"> <!-- ===================== DESKTOP ===================== --> <div class="dev-desktop"> <div class="dev-bar"> <span class="dev-dot"></span><span class="dev-dot"></span><span class="dev-dot"></span> <span class="dev-url">inovision.studio / app</span> </div> <div class="dev-screen"> <div class="dsh-grid"> <!-- area chart --> <div class="dsh-card dsh-chart"> <div class="dsh-head"><span>Realtime render load</span><b class="dsh-live">LIVE</b></div> <svg viewBox="0 0 320 130" preserveAspectRatio="none" class="dsh-svg"> <defs> <linearGradient id="fillG" x1="0" y1="0" x2="0" y2="1"> <stop offset="0" stop-color="#e6c878" stop-opacity="0.35"></stop> <stop offset="1" stop-color="#e6c878" stop-opacity="0"></stop> </linearGradient> </defs> <path class="dsh-area" d="M0,110 L0,90 C30,70 50,95 80,72 C110,50 130,78 160,55 C190,34 210,60 240,40 C270,22 300,46 320,30 L320,130 L0,130 Z" fill="url(#fillG)"></path> <path class="dsh-line" d="M0,90 C30,70 50,95 80,72 C110,50 130,78 160,55 C190,34 210,60 240,40 C270,22 300,46 320,30" fill="none" stroke="#f6e2a6" stroke-width="2"></path> <circle class="dsh-dot" r="3.5" fill="#fff"></circle> <rect class="dsh-scan" x="0" y="0" width="2" height="130" fill="rgba(246,226,166,0.25)"></rect> </svg> </div> <!-- bars --> <div class="dsh-card dsh-bars"> <div class="dsh-head"><span>Throughput</span></div> <div class="dsh-barwrap"> <i style="--h:42%;--d:0s"></i><i style="--h:70%;--d:.1s"></i> <i style="--h:55%;--d:.2s"></i><i style="--h:88%;--d:.3s"></i> <i style="--h:64%;--d:.4s"></i><i style="--h:96%;--d:.5s"></i> </div> </div> <!-- mermaid-style pipeline --> <div class="dsh-card dsh-flow"> <div class="dsh-head"><span>AI pipeline</span></div> <svg viewBox="0 0 620 90" class="dsh-svg"> <g class="flow-edges" stroke="#e6c878" stroke-width="1.6" fill="none"> <path class="fe" d="M132 45 H190"></path> <path class="fe" d="M322 45 H380"></path> <path class="fe" d="M512 45 H560"></path> </g> <g class="flow-nodes"> <g class="fn" style="--d:0s"><rect x="14" y="26" width="118" height="38" rx="10"></rect><text x="73" y="50">Input</text></g> <g class="fn" style="--d:.25s"><rect x="190" y="26" width="132" height="38" rx="10"></rect><text x="256" y="50">Model</text></g> <g class="fn" style="--d:.5s"><rect x="380" y="26" width="132" height="38" rx="10"></rect><text x="446" y="50">Tooling</text></g> <g class="fn" style="--d:.75s"><rect x="560" y="26" width="46" height="38" rx="10"></rect><text x="583" y="50">Ship</text></g> </g> <circle class="pkt p1" r="3" fill="#fff"></circle> <circle class="pkt p2" r="3" fill="#fff"></circle> <circle class="pkt p3" r="3" fill="#fff"></circle> </svg> </div> </div> </div> </div> <!-- ===================== PHONE ===================== --> <div class="dev-phone"> <span class="dev-notch"></span> <div class="dev-pscreen"> <div class="ph-head"> <div> <div class="ph-eyebrow">Studio OS</div> <div class="ph-title">Good evening,<br>let's build.</div> </div> <span class="ph-orb"></span> </div> <!-- progress ring --> <div class="ph-ring"> <svg viewBox="0 0 120 120"> <circle cx="60" cy="60" r="50" fill="none" stroke="rgba(255,255,255,0.08)" stroke-width="9"></circle> <circle class="ph-prog" cx="60" cy="60" r="50" fill="none" stroke="#e6c878" stroke-width="9" stroke-linecap="round" transform="rotate(-90 60 60)"></circle> </svg> <div class="ph-ring-num"><b>87</b><span>%</span></div> </div> <!-- waveform --> <div class="ph-wave"> <i style="--d:0s"></i><i style="--d:.08s"></i><i style="--d:.16s"></i><i style="--d:.24s"></i> <i style="--d:.32s"></i><i style="--d:.4s"></i><i style="--d:.48s"></i><i style="--d:.56s"></i> <i style="--d:.2s"></i><i style="--d:.12s"></i><i style="--d:.3s"></i><i style="--d:.06s"></i> </div> <!-- cards --> <div class="ph-list"> <div class="ph-row" style="--d:0s"><span class="ph-ic"></span><span class="ph-bars"><b style="width:70%"></b><b style="width:40%"></b></span></div> <div class="ph-row" style="--d:.15s"><span class="ph-ic"></span><span class="ph-bars"><b style="width:55%"></b><b style="width:32%"></b></span></div> <div class="ph-row" style="--d:.3s"><span class="ph-ic"></span><span class="ph-bars"><b style="width:80%"></b><b style="width:48%"></b></span></div> </div> </div> </div> </div> </div> <script>
  (function () {
    var stage = document.getElementById("devStage");
    var rig = document.getElementById("devRig");
    if (!stage || !rig) return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // touch \u2192 leave the float anim
    stage.addEventListener("pointermove", function (e) {
      var r = stage.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      rig.style.setProperty("--tx", (-x * 16).toFixed(2) + "deg");
      rig.style.setProperty("--ty", (y * 12).toFixed(2) + "deg");
    });
    stage.addEventListener("pointerleave", function () {
      rig.style.setProperty("--tx", "-14deg");
      rig.style.setProperty("--ty", "8deg");
    });
  })();
<\/script>`])), maybeRenderHead());
}, "D:/Wix/Inovision/web/src/components/DeviceShowcase.astro", void 0);

const CODE = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<style>
  :root{ --gold:#e6c878; --ink:#08080c }
  *{ box-sizing:border-box; margin:0 }
  body{ font-family:system-ui,sans-serif; background:var(--ink); color:#fff }
  .hero{ min-height:100vh; display:grid; place-items:center; text-align:center;
    background:
      radial-gradient(60% 50% at 50% 28%, rgba(230,200,120,.20), transparent 70%),
      var(--ink) }
  .eyebrow{ letter-spacing:.34em; font-size:11px; color:var(--gold) }
  h1{ font-size:clamp(40px,11vw,120px); line-height:.95; margin:14px 0 0;
    background:linear-gradient(92deg,#fff,var(--gold)); -webkit-background-clip:text;
    background-clip:text; color:transparent }
  p{ color:#9a9ea8; max-width:34ch; margin:18px auto 0 }
  .btn{ display:inline-block; margin-top:26px; padding:14px 30px; border-radius:99px;
    background:linear-gradient(100deg,#f6e2a6,#b8923f); color:#1a1407;
    font-weight:700; text-decoration:none }
</style>
</head>
<body>
  <section class="hero">
    <div>
      <p class="eyebrow">VAPOR &middot; CO</p>
      <h1>Built to glow.</h1>
      <p>Premium devices, designed in Michigan. Age-gated, fast, unforgettable.</p>
      <a class="btn" href="#">Shop the drop &rarr;</a>
    </div>
  </section>
</body>
</html>`;
function CodeToSite() {
  const [typed, setTyped] = useState("");
  const [rendered, setRendered] = useState(false);
  const iref = useRef(null);
  const preRef = useRef(null);
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setTyped(CODE);
      setRendered(true);
      if (iref.current) iref.current.srcdoc = CODE;
      return;
    }
    let i = 0;
    let phase = "type";
    let hold = 0;
    let raf = 0;
    const tick = () => {
      if (phase === "type") {
        i = Math.min(CODE.length, i + Math.ceil(Math.random() * 4) + 2);
        setTyped(CODE.slice(0, i));
        if (preRef.current) preRef.current.scrollTop = preRef.current.scrollHeight;
        if (i >= CODE.length) {
          phase = "render";
        }
      } else if (phase === "render") {
        if (iref.current) iref.current.srcdoc = CODE;
        setRendered(true);
        phase = "hold";
        hold = 0;
      } else if (phase === "hold") {
        hold += 1;
        if (hold > 230) phase = "reset";
      } else {
        i = 0;
        setTyped("");
        setRendered(false);
        if (iref.current) iref.current.srcdoc = "";
        phase = "type";
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return /* @__PURE__ */ jsxs("div", { className: "c2s", children: [
    /* @__PURE__ */ jsxs("div", { className: "c2s-pane c2s-code", children: [
      /* @__PURE__ */ jsxs("div", { className: "c2s-bar", children: [
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("span", { className: "c2s-tab", children: "vex.html" }),
        /* @__PURE__ */ jsx("span", { className: "c2s-engine", children: "VEX ENGINE" })
      ] }),
      /* @__PURE__ */ jsx("pre", { ref: preRef, className: "c2s-pre", children: /* @__PURE__ */ jsxs("code", { children: [
        typed,
        /* @__PURE__ */ jsx("span", { className: "c2s-cursor" })
      ] }) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: `c2s-pane c2s-view${rendered ? " on" : ""}`, children: [
      /* @__PURE__ */ jsxs("div", { className: "c2s-bar", children: [
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("i", {}),
        /* @__PURE__ */ jsx("span", { className: "c2s-tab", children: "vapor.co" }),
        /* @__PURE__ */ jsx("span", { className: "c2s-engine", children: rendered ? "LIVE" : "BUILDING…" })
      ] }),
      /* @__PURE__ */ jsx("iframe", { ref: iref, title: "Generated site preview", className: "c2s-frame", sandbox: "allow-scripts" })
    ] })
  ] });
}

var __freeze$1 = Object.freeze;
var __defProp$1 = Object.defineProperty;
var __template$1 = (cooked, raw) => __freeze$1(__defProp$1(cooked, "raw", { value: __freeze$1(cooked.slice()) }));
var _a$1;
const $$Intro = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate(_a$1 || (_a$1 = __template$1(["", '<div class="intro" id="intro" aria-hidden="true" data-astro-cid-tsh42aop> <span class="ld-orb a" aria-hidden="true" data-astro-cid-tsh42aop></span> <span class="ld-orb b" aria-hidden="true" data-astro-cid-tsh42aop></span> <span class="ld-vignette" aria-hidden="true" data-astro-cid-tsh42aop></span> <span class="ld-grain" aria-hidden="true" data-astro-cid-tsh42aop></span> <div class="ld-stage" data-astro-cid-tsh42aop> <div class="ld-word" data-astro-cid-tsh42aop> <div class="ld-main" data-astro-cid-tsh42aop>INOVISION</div> <div class="ld-sub" data-astro-cid-tsh42aop>STUDIOS</div> </div> <div class="ld-track" data-astro-cid-tsh42aop><i id="introBar" data-astro-cid-tsh42aop></i></div> <div class="ld-foot" data-astro-cid-tsh42aop> <span class="ld-label" data-astro-cid-tsh42aop>Loading the experience</span> <span class="ld-count" data-astro-cid-tsh42aop><b id="introCount" data-astro-cid-tsh42aop>0</b>%</span> </div> </div> </div> <script>\n  (function () {\n    var intro = document.getElementById("intro");\n    if (!intro) return;\n    var root = document.documentElement;\n    var lock = function (v) { root.style.overflow = v ? "hidden" : ""; };\n    if (sessionStorage.getItem("iv_intro")) {\n      intro.style.display = "none";\n      root.classList.add("intro-done");\n      return;\n    }\n    lock(true);\n    var count = document.getElementById("introCount");\n    var bar = document.getElementById("introBar");\n    var n = 0;\n    var iv = setInterval(function () {\n      n += Math.random() * 7 + 3;\n      if (n >= 100) { n = 100; clearInterval(iv); finish(); }\n      if (count) count.textContent = Math.floor(n);\n      if (bar) bar.style.transform = "scaleX(" + n / 100 + ")";\n    }, 95);\n    function finish() {\n      setTimeout(function () {\n        intro.classList.add("done");\n        root.classList.add("intro-done");\n        sessionStorage.setItem("iv_intro", "1");\n        lock(false);\n        setTimeout(function () { intro.style.display = "none"; }, 1400);\n      }, 520);\n    }\n  })();\n<\/script> '])), maybeRenderHead());
}, "D:/Wix/Inovision/web/src/components/Intro.astro", void 0);

function HeroVideo({ src }) {
  const videoRef = useRef(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  useEffect(() => {
    const mql = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mql.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, []);
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (reducedMotion) {
      v.pause();
      return;
    }
    const play = () => v.play().catch(() => {
    });
    if (v.readyState >= 2) play();
    else v.addEventListener("loadeddata", play, { once: true });
  }, [reducedMotion]);
  return /* @__PURE__ */ jsx("div", { className: "iv-hero-bg", children: /* @__PURE__ */ jsx(
    "video",
    {
      ref: videoRef,
      autoPlay: !reducedMotion,
      muted: true,
      loop: true,
      playsInline: true,
      preload: "metadata",
      "aria-hidden": "true",
      style: {
        width: "100%",
        height: "100%",
        objectFit: "cover"
      },
      children: /* @__PURE__ */ jsx("source", { src, type: "video/mp4" })
    }
  ) });
}

function Gallery3D({ items }) {
  const [active, setActive] = useState(0);
  const trackRef = useRef(null);
  const startX = useRef(0);
  const slide = useCallback(
    (dir) => {
      setActive((cur) => (cur + dir + items.length) % items.length);
    },
    [items.length]
  );
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const first = track.children[0];
    if (!first) return;
    const cardWidth = first.offsetWidth + 14;
    track.style.transform = `translateX(-${active * cardWidth}px)`;
  }, [active]);
  useEffect(() => {
    const id = setInterval(() => slide(1), 5200);
    return () => clearInterval(id);
  }, [slide]);
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const onStart = (e) => {
      startX.current = e.touches[0].clientX;
    };
    const onEnd = (e) => {
      const endX = e.changedTouches[0].clientX;
      if (endX - startX.current > 50) slide(-1);
      if (startX.current - endX > 50) slide(1);
    };
    track.addEventListener("touchstart", onStart, { passive: true });
    track.addEventListener("touchend", onEnd);
    return () => {
      track.removeEventListener("touchstart", onStart);
      track.removeEventListener("touchend", onEnd);
    };
  }, [slide]);
  return /* @__PURE__ */ jsxs("div", { className: "iv-gallery-3d", children: [
    /* @__PURE__ */ jsx("div", { className: "iv-gallery-track", ref: trackRef, children: items.map((it, i) => /* @__PURE__ */ jsxs(
      "div",
      {
        className: `iv-gallery-card ${i === active ? "active" : ""}`,
        children: [
          /* @__PURE__ */ jsx(
            "img",
            {
              src: it.src,
              alt: it.alt,
              width: 1200,
              height: 750,
              loading: "lazy",
              sizes: "(max-width: 860px) 100vw, 78vw"
            }
          ),
          /* @__PURE__ */ jsxs("div", { className: "info", children: [
            /* @__PURE__ */ jsx("h3", { children: it.title }),
            /* @__PURE__ */ jsx("span", { children: it.subtitle })
          ] })
        ]
      },
      it.src
    )) }),
    /* @__PURE__ */ jsxs("div", { className: "iv-gallery-controls", children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "iv-gallery-btn",
          onClick: () => slide(-1),
          "aria-label": "Previous project",
          children: "← Prev"
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          className: "iv-gallery-btn",
          onClick: () => slide(1),
          "aria-label": "Next project",
          children: "Next →"
        }
      )
    ] })
  ] });
}

const PHONES_DEFAULT = [
  { name: "Mi Budz", img: "/phone-mibudz.webp", url: "https://mi-budz.com", tag: "Smoke shop · retail" },
  { name: "Smoker's Alley", img: "/phone-smokersalley.webp", url: "https://smokersalleys.com", tag: "Smoke shop · 3 locations" },
  { name: "Smoker's Alley Shop", img: "/phone-smokersalley-shop.webp", url: "https://smokersalleys.com/gallery/shop", tag: "Reserve for pickup · in-store menu" },
  { name: "Summer Skin", img: "/phone-summerskin.webp", url: "https://summerskinmi.com", tag: "Beauty studio · booking" },
  { name: "ServiceLens", img: "/phone-diagbuddy.webp", url: "https://diagbuddygo.com", tag: "AI diagnostics · SaaS" },
  { name: "HypeLead SEO", img: "/phone-hypelead.webp", url: "https://hypeleadseo.com", tag: "Contractor SEO · leads" },
  { name: "Genesis Repair", img: "/phone-genesis.webp", url: "https://genesisappliancerepair.com", tag: "Appliance repair · local" },
  { name: "Fix Appliances", img: "/phone-fixappliances.webp", url: "https://fixappliancesnow.com", tag: "Appliance service · local" }
];
function PhoneCarousel(P) {
  const PHONES = P && Array.isArray(P.phones) && P.phones.length ? P.phones : PHONES_DEFAULT;
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(null);
  const n = PHONES.length;
  const go = (d) => setActive((a) => (a + d + n) % n);
  useEffect(() => {
    if (zoom !== null) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), 5e3);
    return () => clearInterval(id);
  }, [zoom, n]);
  useEffect(() => {
    const onKey = (e) => {
      if (zoom !== null) {
        if (e.key === "Escape") setZoom(null);
        return;
      }
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [zoom]);
  return /* @__PURE__ */ jsxs("div", { className: "pc", children: [
    /* @__PURE__ */ jsx("div", { className: "pc-stage", children: PHONES.map((p, i) => {
      let off = i - active;
      if (off > n / 2) off -= n;
      if (off < -n / 2) off += n;
      const abs = Math.abs(off);
      if (abs > 2) return null;
      const style = {
        transform: `translateX(${off * 62}%) translateZ(${-abs * 120}px) rotateY(${off * -34}deg) scale(${abs === 0 ? 1 : 0.9 - abs * 0.05})`,
        zIndex: 20 - abs,
        opacity: abs > 2 ? 0 : 1,
        filter: abs === 0 ? "none" : `brightness(${0.7 - abs * 0.12})`,
        cursor: "pointer"
      };
      return /* @__PURE__ */ jsxs(
        "div",
        {
          className: `pc-phone${i === active ? " active" : ""}`,
          style,
          onClick: () => i === active ? setZoom(i) : setActive(i),
          role: "button",
          "aria-label": i === active ? `Zoom ${p.name}` : `Focus ${p.name}`,
          children: [
            /* @__PURE__ */ jsxs("div", { className: "phone3d-body", children: [
              /* @__PURE__ */ jsx("span", { className: "phone3d-island" }),
              /* @__PURE__ */ jsx("img", { src: p.img, alt: `${p.name} — mobile site by Inovision Studios`, loading: "lazy" })
            ] }),
            i === active && /* @__PURE__ */ jsx("span", { className: "pc-tap", children: "Tap to zoom" })
          ]
        },
        p.name
      );
    }) }),
    /* @__PURE__ */ jsxs("div", { className: "pc-meta", children: [
      /* @__PURE__ */ jsx("b", { children: PHONES[active].name }),
      /* @__PURE__ */ jsx("span", { children: PHONES[active].tag })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "pc-controls", children: [
      /* @__PURE__ */ jsx("button", { className: "pc-arw", onClick: () => go(-1), "aria-label": "Previous", children: "‹" }),
      /* @__PURE__ */ jsx("div", { className: "pc-dots", children: PHONES.map((p, i) => /* @__PURE__ */ jsx("button", { className: i === active ? "on" : "", onClick: () => setActive(i), "aria-label": `Show ${p.name}` }, p.name)) }),
      /* @__PURE__ */ jsx("button", { className: "pc-arw", onClick: () => go(1), "aria-label": "Next", children: "›" })
    ] }),
    zoom !== null && /* @__PURE__ */ jsxs("div", { className: "pc-zoom", onClick: () => setZoom(null), children: [
      /* @__PURE__ */ jsx("button", { className: "pc-zoom-x", onClick: () => setZoom(null), "aria-label": "Close", children: "✕" }),
      /* @__PURE__ */ jsxs("div", { className: "pc-zoom-inner", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsxs("div", { className: "phone3d-body pc-big", children: [
          /* @__PURE__ */ jsx("span", { className: "phone3d-island" }),
          /* @__PURE__ */ jsx("div", { className: "pc-scroll", children: /* @__PURE__ */ jsx("img", { src: PHONES[zoom].img, alt: PHONES[zoom].name }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "pc-zoom-meta", children: [
          /* @__PURE__ */ jsx("b", { children: PHONES[zoom].name }),
          /* @__PURE__ */ jsx("span", { children: PHONES[zoom].tag }),
          /* @__PURE__ */ jsxs("a", { href: PHONES[zoom].url, target: "_blank", rel: "noreferrer", children: [
            "Visit live site ",
            /* @__PURE__ */ jsx("span", { "aria-hidden": "true", children: "↗" })
          ] })
        ] })
      ] })
    ] })
  ] });
}

function MonitorShowcase({ services }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = services.length;
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), 4200);
    return () => clearInterval(id);
  }, [paused, n]);
  const cur = services[active];
  return /* @__PURE__ */ jsxs("div", { className: "mon", onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false), children: [
    /* @__PURE__ */ jsxs("div", { className: "mon-rig", children: [
      /* @__PURE__ */ jsxs("div", { className: "mon-monitor", children: [
        /* @__PURE__ */ jsxs("div", { className: "mon-screen", children: [
          services.map((s, i) => /* @__PURE__ */ jsx("img", { src: s.img, alt: s.t, className: i === active ? "on" : "", loading: "lazy" }, s.t)),
          /* @__PURE__ */ jsx("span", { className: "mon-glass", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "mon-scan", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "mon-cam", "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "mon-neck", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx("div", { className: "mon-foot", "aria-hidden": "true" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "mon-info", children: [
      /* @__PURE__ */ jsxs("span", { className: "mon-num", children: [
        cur.n,
        " / ",
        String(n).padStart(2, "0")
      ] }),
      /* @__PURE__ */ jsx("h3", { children: cur.t }, cur.t),
      /* @__PURE__ */ jsx("p", { children: cur.d }, cur.d),
      /* @__PURE__ */ jsx("div", { className: "mon-tabs", children: services.map((s, i) => /* @__PURE__ */ jsxs("button", { className: i === active ? "on" : "", onClick: () => setActive(i), children: [
        /* @__PURE__ */ jsx("span", { className: "mon-tab-n", children: s.n }),
        /* @__PURE__ */ jsx("span", { children: s.t })
      ] }, s.t)) })
    ] })
  ] });
}

const SCREENS = [
  { key: "dash", label: "Analytics Dashboard", tag: "SaaS · data-dense UI" },
  { key: "shop", label: "Commerce Storefront", tag: "Retail · product grid" },
  { key: "land", label: "Landing Page", tag: "Brand · conversion hero" },
  { key: "chat", label: "AI Assistant", tag: "Product · conversational UI" }
];
const PRODUCTS = [
  { name: "Aura Lamp", price: "$129" },
  { name: "Nova Vase", price: "$64" },
  { name: "Orbit Clock", price: "$88" },
  { name: "Halo Mirror", price: "$210" },
  { name: "Drift Chair", price: "$340" },
  { name: "Ember Candle", price: "$24" }
];
function DesignScreens() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = SCREENS.length;
  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => setActive((a) => (a + 1) % n), 5200);
    return () => clearInterval(id);
  }, [paused, n]);
  const cur = SCREENS[active];
  return /* @__PURE__ */ jsxs("div", { className: "ds", onMouseEnter: () => setPaused(true), onMouseLeave: () => setPaused(false), children: [
    /* @__PURE__ */ jsxs("div", { className: "ds-rig", children: [
      /* @__PURE__ */ jsxs("div", { className: "ds-monitor", children: [
        /* @__PURE__ */ jsxs("div", { className: "ds-screen", children: [
          /* @__PURE__ */ jsxs("div", { className: `ds-ui ds-dash${active === 0 ? " on" : ""}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "ds-topbar", children: [
              /* @__PURE__ */ jsxs("span", { className: "ds-brand", children: [
                /* @__PURE__ */ jsx("i", { className: "ds-logo" }),
                "Overview"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "ds-navtxt", children: "Analytics" }),
              /* @__PURE__ */ jsx("span", { className: "ds-navtxt", children: "Reports" }),
              /* @__PURE__ */ jsx("span", { className: "ds-navtxt", children: "Team" }),
              /* @__PURE__ */ jsx("span", { className: "ds-dot g push" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "ds-dash-body", children: [
              /* @__PURE__ */ jsxs("div", { className: "ds-side", children: [
                /* @__PURE__ */ jsx("span", { className: "ds-sq" }),
                /* @__PURE__ */ jsx("span", { className: "ds-navi", children: "Home" }),
                /* @__PURE__ */ jsx("span", { className: "ds-navi act", children: "Analytics" }),
                /* @__PURE__ */ jsx("span", { className: "ds-navi", children: "Orders" }),
                /* @__PURE__ */ jsx("span", { className: "ds-navi", children: "Users" }),
                /* @__PURE__ */ jsx("span", { className: "ds-navi", children: "Settings" })
              ] }),
              /* @__PURE__ */ jsxs("div", { className: "ds-main", children: [
                /* @__PURE__ */ jsxs("div", { className: "ds-stats", children: [
                  /* @__PURE__ */ jsxs("div", { className: "ds-stat", children: [
                    /* @__PURE__ */ jsx("b", { children: "$48.2K" }),
                    /* @__PURE__ */ jsx("span", { children: "Revenue · +12%" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "ds-stat", children: [
                    /* @__PURE__ */ jsx("b", { children: "1,204" }),
                    /* @__PURE__ */ jsx("span", { children: "Active users" })
                  ] }),
                  /* @__PURE__ */ jsxs("div", { className: "ds-stat", children: [
                    /* @__PURE__ */ jsx("b", { children: "98.6%" }),
                    /* @__PURE__ */ jsx("span", { children: "Uptime" })
                  ] })
                ] }),
                /* @__PURE__ */ jsxs("div", { className: "ds-chart-wrap", children: [
                  /* @__PURE__ */ jsx("span", { className: "ds-chart-label", children: "Traffic — last 7 days" }),
                  /* @__PURE__ */ jsxs("div", { className: "ds-chart", children: [
                    /* @__PURE__ */ jsx("i", { style: { ["--h"]: "45%" } }),
                    /* @__PURE__ */ jsx("i", { style: { ["--h"]: "72%" } }),
                    /* @__PURE__ */ jsx("i", { style: { ["--h"]: "38%" } }),
                    /* @__PURE__ */ jsx("i", { style: { ["--h"]: "88%" } }),
                    /* @__PURE__ */ jsx("i", { style: { ["--h"]: "60%" } }),
                    /* @__PURE__ */ jsx("i", { style: { ["--h"]: "78%" } }),
                    /* @__PURE__ */ jsx("i", { style: { ["--h"]: "52%" } })
                  ] })
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `ds-ui ds-shop${active === 1 ? " on" : ""}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "ds-topbar", children: [
              /* @__PURE__ */ jsxs("span", { className: "ds-brand", children: [
                /* @__PURE__ */ jsx("i", { className: "ds-logo" }),
                "LUMEN"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "ds-navtxt push", children: "Shop" }),
              /* @__PURE__ */ jsx("span", { className: "ds-navtxt", children: "About" }),
              /* @__PURE__ */ jsx("span", { className: "ds-cart", children: "Cart · 2" })
            ] }),
            /* @__PURE__ */ jsx("div", { className: "ds-grid", children: PRODUCTS.map((p, i) => /* @__PURE__ */ jsxs("div", { className: "ds-prod", children: [
              /* @__PURE__ */ jsx("span", { className: "ds-prod-img", style: { ["--d"]: `${i * 0.1}s` } }),
              /* @__PURE__ */ jsx("span", { className: "ds-prod-name", children: p.name }),
              /* @__PURE__ */ jsx("span", { className: "ds-prod-price", children: p.price })
            ] }, p.name)) }),
            /* @__PURE__ */ jsx("span", { className: "ds-cta", children: "Add to cart" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `ds-ui ds-land${active === 2 ? " on" : ""}`, children: [
            /* @__PURE__ */ jsx("span", { className: "ds-orb" }),
            /* @__PURE__ */ jsxs("div", { className: "ds-topbar", children: [
              /* @__PURE__ */ jsxs("span", { className: "ds-brand", children: [
                /* @__PURE__ */ jsx("i", { className: "ds-logo" }),
                "STUDIO"
              ] }),
              /* @__PURE__ */ jsx("span", { className: "ds-navtxt push", children: "Work" }),
              /* @__PURE__ */ jsx("span", { className: "ds-navtxt", children: "About" }),
              /* @__PURE__ */ jsx("span", { className: "ds-navtxt", children: "Contact" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "ds-hero", children: [
              /* @__PURE__ */ jsx("span", { className: "ds-eyebrow-t", children: "NEW · 2026" }),
              /* @__PURE__ */ jsx("span", { className: "ds-h1-t", children: "Design that moves people." }),
              /* @__PURE__ */ jsx("span", { className: "ds-lead-t", children: "Custom web, built to convert — fast, beautiful, and unmistakably yours." }),
              /* @__PURE__ */ jsxs("div", { className: "ds-hero-cta", children: [
                /* @__PURE__ */ jsx("span", { className: "ds-cta", children: "Start free" }),
                /* @__PURE__ */ jsx("span", { className: "ds-ghost", children: "Watch demo" })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: `ds-ui ds-chat${active === 3 ? " on" : ""}`, children: [
            /* @__PURE__ */ jsxs("div", { className: "ds-topbar", children: [
              /* @__PURE__ */ jsx("span", { className: "ds-dot gold" }),
              /* @__PURE__ */ jsx("span", { className: "ds-brand", children: "Vex Assistant" }),
              /* @__PURE__ */ jsx("span", { className: "ds-navtxt push", children: "online" })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "ds-thread", children: [
              /* @__PURE__ */ jsx("div", { className: "ds-msg in", children: /* @__PURE__ */ jsx("span", { className: "ds-t", children: "Want me to draft your homepage hero?" }) }),
              /* @__PURE__ */ jsx("div", { className: "ds-msg out", children: /* @__PURE__ */ jsx("span", { className: "ds-t", children: "Yes — make it bold." }) }),
              /* @__PURE__ */ jsx("div", { className: "ds-msg in", children: /* @__PURE__ */ jsx("span", { className: "ds-t", children: "On it. Big type, gold accents, one clear CTA. Preview in ~10s." }) }),
              /* @__PURE__ */ jsxs("div", { className: "ds-typing", children: [
                /* @__PURE__ */ jsx("span", {}),
                /* @__PURE__ */ jsx("span", {}),
                /* @__PURE__ */ jsx("span", {})
              ] })
            ] }),
            /* @__PURE__ */ jsxs("div", { className: "ds-input", children: [
              /* @__PURE__ */ jsx("span", { className: "ds-input-t", children: "Ask anything…" }),
              /* @__PURE__ */ jsx("span", { className: "ds-send" })
            ] })
          ] }),
          /* @__PURE__ */ jsx("span", { className: "ds-glass", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "ds-scan", "aria-hidden": "true" })
        ] }),
        /* @__PURE__ */ jsx("span", { className: "ds-cam", "aria-hidden": "true" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "ds-neck", "aria-hidden": "true" }),
      /* @__PURE__ */ jsx("div", { className: "ds-foot", "aria-hidden": "true" })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "ds-info", children: [
      /* @__PURE__ */ jsx("span", { className: "ds-kicker", children: "Live mockups · pure CSS" }),
      /* @__PURE__ */ jsx("h3", { children: cur.label }, cur.label),
      /* @__PURE__ */ jsx("p", { children: cur.tag }, cur.tag),
      /* @__PURE__ */ jsx("div", { className: "ds-tabs", children: SCREENS.map((s, i) => /* @__PURE__ */ jsx("button", { className: i === active ? "on" : "", onClick: () => setActive(i), "aria-label": s.label }, s.key)) })
    ] })
  ] });
}

function Hero3D({
  className = "iv-hero3d"
}) {
  const mountRef = useRef(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
    camera.position.z = 4.2;
    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });
    renderer.setClearColor(0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    const group = new THREE.Group();
    scene.add(group);
    const vertexShader = (
      /* glsl */
      `
      uniform float uTime;
      uniform float uAmp;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vDisp;

      // classic simplex noise (Ashima)
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
      float snoise(vec3 v){
        const vec2 C=vec2(1.0/6.0,1.0/3.0);const vec4 D=vec4(0.0,0.5,1.0,2.0);
        vec3 i=floor(v+dot(v,C.yyy));vec3 x0=v-i+dot(i,C.xxx);
        vec3 g=step(x0.yzx,x0.xyz);vec3 l=1.0-g;vec3 i1=min(g.xyz,l.zxy);vec3 i2=max(g.xyz,l.zxy);
        vec3 x1=x0-i1+C.xxx;vec3 x2=x0-i2+C.yyy;vec3 x3=x0-D.yyy;
        i=mod(i,289.0);
        vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0));
        float n_=1.0/7.0;vec3 ns=n_*D.wyz-D.xzx;
        vec4 j=p-49.0*floor(p*ns.z*ns.z);
        vec4 x_=floor(j*ns.z);vec4 y_=floor(j-7.0*x_);
        vec4 x=x_*ns.x+ns.yyyy;vec4 y=y_*ns.x+ns.yyyy;vec4 h=1.0-abs(x)-abs(y);
        vec4 b0=vec4(x.xy,y.xy);vec4 b1=vec4(x.zw,y.zw);
        vec4 s0=floor(b0)*2.0+1.0;vec4 s1=floor(b1)*2.0+1.0;vec4 sh=-step(h,vec4(0.0));
        vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
        vec3 p0=vec3(a0.xy,h.x);vec3 p1=vec3(a0.zw,h.y);vec3 p2=vec3(a1.xy,h.z);vec3 p3=vec3(a1.zw,h.w);
        vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
        p0*=norm.x;p1*=norm.y;p2*=norm.z;p3*=norm.w;
        vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);m=m*m;
        return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
      }

      void main(){
        vNormal = normalize(normalMatrix * normal);
        float n = snoise(normal * 1.6 + uTime * 0.25);
        n += 0.5 * snoise(normal * 3.2 - uTime * 0.18);
        vDisp = n;
        vec3 pos = position + normal * n * uAmp;
        vec4 mv = modelViewMatrix * vec4(pos, 1.0);
        vView = normalize(-mv.xyz);
        gl_Position = projectionMatrix * mv;
      }
    `
    );
    const fragmentShader = (
      /* glsl */
      `
      precision highp float;
      uniform float uTime;
      varying vec3 vNormal;
      varying vec3 vView;
      varying float vDisp;

      void main(){
        float fres = pow(1.0 - max(dot(vNormal, vView), 0.0), 2.4);
        // iridescent core: shift hue by displacement + view
        vec3 a = vec3(0.92, 0.78, 0.42);  // gold
        vec3 b = vec3(0.86, 0.88, 0.93);  // silver
        vec3 c = vec3(1.0, 0.90, 0.62);   // bright gold
        float t = 0.5 + 0.5 * sin(vDisp * 3.0 + uTime * 0.5);
        vec3 core = mix(mix(a, b, t), c, fres * 0.6);
        vec3 col = core * (0.18 + vDisp * 0.25) + core * fres * 1.5;
        float alpha = clamp(0.32 + fres * 0.9, 0.0, 1.0);
        gl_FragColor = vec4(col, alpha);
      }
    `
    );
    const uniforms = {
      uTime: { value: 0 },
      uAmp: { value: 0.55 }
    };
    const geo = new THREE.IcosahedronGeometry(1.25, 64);
    const mat = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });
    const crystal = new THREE.Mesh(geo, mat);
    group.add(crystal);
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(1.45, 3),
      new THREE.MeshBasicMaterial({
        color: 13214794,
        wireframe: true,
        transparent: true,
        opacity: 0.08
      })
    );
    group.add(shell);
    const COUNT = 900;
    const positions = new Float32Array(COUNT * 3);
    for (let i = 0; i < COUNT; i++) {
      const r = 2.4 + Math.random() * 4.5;
      const th = Math.random() * Math.PI * 2;
      const ph = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = r * Math.sin(ph) * Math.cos(th);
      positions[i * 3 + 1] = r * Math.sin(ph) * Math.sin(th);
      positions[i * 3 + 2] = r * Math.cos(ph);
    }
    const pGeo = new THREE.BufferGeometry();
    pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 15124600,
      size: 0.018,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      depthWrite: false
    });
    const points = new THREE.Points(pGeo, pMat);
    scene.add(points);
    const target = { x: 0, y: 0 };
    const cur = { x: 0, y: 0 };
    const onPointer = (e) => {
      const r = mount.getBoundingClientRect();
      target.x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      target.y = ((e.clientY - r.top) / r.height - 0.5) * 2;
    };
    window.addEventListener("pointermove", onPointer, { passive: true });
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    const clock = new THREE.Clock();
    let raf = 0;
    const render = () => {
      const t = clock.getElapsedTime();
      uniforms.uTime.value = t;
      cur.x += (target.x - cur.x) * 0.04;
      cur.y += (target.y - cur.y) * 0.04;
      group.rotation.y = t * 0.12 + cur.x * 0.5;
      group.rotation.x = cur.y * 0.35;
      points.rotation.y = -t * 0.03;
      camera.position.x = cur.x * 0.3;
      camera.position.y = -cur.y * 0.3;
      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
      if (!reduced) raf = requestAnimationFrame(render);
    };
    if (reduced) {
      uniforms.uTime.value = 1.2;
      render();
    } else {
      raf = requestAnimationFrame(render);
    }
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onPointer);
      ro.disconnect();
      geo.dispose();
      mat.dispose();
      pGeo.dispose();
      pMat.dispose();
      shell.geometry.dispose();
      shell.material.dispose();
      renderer.dispose();
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
    };
  }, []);
  return /* @__PURE__ */ jsx("div", { ref: mountRef, className, "aria-hidden": "true" });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const $$Astro = createAstro("https://inovisionstudios.com");
const prerender = false;
const $$Index = createComponent(($$result, $$props, $$slots) => {
  const Astro2 = $$result.createAstro($$Astro, $$props, $$slots);
  Astro2.self = $$Index;
  const SET = getSettings();
  const ov = (k, d) => SET["content." + k] || d;
  const phones = PHONES_DEFAULT.map((p, i) => ({ ...p, img: ov("phone." + i + ".img", p.img) }));
  const GAL = galleryCount() ? listGallery().map((r) => ({ src: r.url, title: r.title || "", category: r.category || "" })) : GALLERY;
  const reel1 = GAL.slice(0, 13);
  const reel2 = GAL.slice(13, 26);
  const ICON = '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">';
  const services = [
    {
      n: "01",
      t: "3D & Visual Display",
      d: "Real-time WebGL, shader craft, and cinematic motion that makes a brand impossible to scroll past. Worlds, not pages.",
      img: "/character-vex-01.webp",
      icon: `${ICON}<path d="M12 2 3 7v10l9 5 9-5V7l-9-5Z"/><path d="m3 7 9 5 9-5"/><path d="M12 12v10"/></svg>`
    },
    {
      n: "02",
      t: "AI Integrations",
      d: "LLM features, copilots, and automation wired into your product and your operations \u2014 shipped to production, not slideware.",
      img: "/mibudz-render-raspberry.webp",
      icon: `${ICON}<circle cx="5" cy="6" r="1.8"/><circle cx="5" cy="18" r="1.8"/><circle cx="12" cy="12" r="1.8"/><circle cx="19" cy="12" r="1.8"/><path d="M6.6 6.8 10.4 11M6.6 17.2 10.4 13M13.8 12H17"/></svg>`
    },
    {
      n: "03",
      t: "Tooling Solutions",
      d: "Internal dashboards, pipelines, and custom software that make your team measurably faster.",
      img: "/btk-vape-design.webp",
      icon: `${ICON}<rect x="3" y="4" width="18" height="16" rx="2"/><path d="m7 9 3 3-3 3M13 15h4"/></svg>`
    },
    {
      n: "04",
      t: "Custom Frameworks",
      d: "Bespoke design systems and engineering foundations, built to scale from first launch to enterprise.",
      img: "/btk-archviz-bath-white.webp",
      icon: `${ICON}<rect x="3" y="3" width="7" height="7" rx="1.2"/><rect x="14" y="3" width="7" height="7" rx="1.2"/><rect x="3" y="14" width="7" height="7" rx="1.2"/><rect x="14" y="14" width="7" height="7" rx="1.2"/></svg>`
    }
  ];
  const capabilities = [
    "WebGL / Three.js",
    "Shader Craft",
    "GLSL",
    "GSAP Motion",
    "AI Copilots",
    "LLM Pipelines",
    "RAG",
    "Next \xB7 Astro",
    "Design Systems",
    "Headless CMS",
    "Real-time 3D",
    "Custom Tooling",
    "Brand Worlds",
    "Type Systems"
  ];
  const work = [
    { src: ov("work.0.img", "/portfolio-mi-budz.webp"), alt: "Mi Budz brand site", title: ov("work.0.title", "Mi Budz"), subtitle: ov("work.0.sub", "Brand site \xB7 character world") },
    { src: ov("work.1.img", "/portfolio-redeye.webp?v=2"), alt: "Redeye Fenton site", title: ov("work.1.title", "Redeye Fenton"), subtitle: ov("work.1.sub", "Boutique retail web") },
    { src: ov("work.2.img", "/portfolio-cornerstore.webp?v=2"), alt: "Your Corner Store site", title: ov("work.2.title", "Your Corner Store"), subtitle: ov("work.2.sub", "Commerce \xB7 RAW outlet") },
    { src: ov("work.3.img", "/portfolio-summerskin.webp"), alt: "Summer Skin site", title: ov("work.3.title", "Summer Skin"), subtitle: ov("work.3.sub", "Beauty studio \xB7 booking web") }
  ];
  const stats = [
    { b: "100%", s: "custom-built" },
    { b: "60fps", s: "real-time motion" },
    { b: "3D", s: "in-house webgl" },
    { b: "AI", s: "native" }
  ];
  const PSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">';
  const partners = [
    { name: "Anthropic", svg: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.3041 3.541h-3.6718l6.696 16.918H24Zm-10.6082 0L0 20.459h3.7442l1.3693-3.5527h7.0052l1.3693 3.5528h3.7442L10.5363 3.5409Zm-.3712 10.2232 2.2914-5.9456 2.2914 5.9456Z"/></svg>` },
    { name: "Google", svg: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"/></svg>` },
    { name: "HubSpot", svg: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.164 7.93V5.084a2.198 2.198 0 001.267-1.978v-.067A2.2 2.2 0 0017.238.845h-.067a2.2 2.2 0 00-2.193 2.193v.067a2.196 2.196 0 001.252 1.973l.013.006v2.852a6.22 6.22 0 00-2.969 1.31l.012-.01-7.828-6.095A2.497 2.497 0 104.3 4.656l-.012.006 7.697 5.991a6.176 6.176 0 00-1.038 3.446c0 1.343.425 2.588 1.147 3.607l-.013-.02-2.342 2.343a1.968 1.968 0 00-.58-.095h-.002a2.033 2.033 0 102.033 2.033 1.978 1.978 0 00-.1-.595l.005.014 2.317-2.317a6.247 6.247 0 104.782-11.134l-.036-.005zm-.964 9.378a3.206 3.206 0 113.215-3.207v.002a3.206 3.206 0 01-3.207 3.207z"/></svg>` },
    { name: "Adobe", svg: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.966 22.624l-1.69-4.281H8.122l3.892-9.144 5.662 13.425zM8.884 1.376H0v21.248zm15.116 0h-8.884L24 22.624Z"/></svg>` },
    { name: "Blender", svg: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12.51 13.214c.046-.8.438-1.506 1.03-2.006a3.424 3.424 0 0 1 2.212-.79c.85 0 1.631.3 2.211.79.592.5.983 1.206 1.028 2.005.045.823-.285 1.586-.865 2.153a3.389 3.389 0 0 1-2.374.938 3.393 3.393 0 0 1-2.376-.938c-.58-.567-.91-1.33-.865-2.152M7.35 14.831c.006.314.106.922.256 1.398a7.372 7.372 0 0 0 1.593 2.757 8.227 8.227 0 0 0 2.787 2.001 8.947 8.947 0 0 0 3.66.76 8.964 8.964 0 0 0 3.657-.772 8.285 8.285 0 0 0 2.785-2.01 7.428 7.428 0 0 0 1.592-2.762 6.964 6.964 0 0 0 .25-3.074 7.123 7.123 0 0 0-1.016-2.779 7.764 7.764 0 0 0-1.852-2.043h.002L13.566 2.55l-.02-.015c-.492-.378-1.319-.376-1.86.002-.547.382-.609 1.015-.123 1.415l-.001.001 3.126 2.543-9.53.01h-.013c-.788.001-1.545.518-1.695 1.172-.154.665.38 1.217 1.2 1.22V8.9l4.83-.01-8.62 6.617-.034.025c-.813.622-1.075 1.658-.563 2.313.52.667 1.625.668 2.447.004L7.414 14s-.069.52-.063.831zm12.09 1.741c-.97.988-2.326 1.548-3.795 1.55-1.47.004-2.827-.552-3.797-1.538a4.51 4.51 0 0 1-1.036-1.622 4.282 4.282 0 0 1 .282-3.519 4.702 4.702 0 0 1 1.153-1.371c.942-.768 2.141-1.183 3.396-1.185 1.256-.002 2.455.41 3.398 1.175.48.391.87.854 1.152 1.367a4.28 4.28 0 0 1 .522 1.706 4.236 4.236 0 0 1-.239 1.811 4.54 4.54 0 0 1-1.035 1.626"/></svg>` },
    { name: "Meta AI", svg: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M6.915 4.03c-1.968 0-3.683 1.28-4.871 3.113C.704 9.208 0 11.883 0 14.449c0 .706.07 1.369.21 1.973a6.624 6.624 0 0 0 .265.86 5.297 5.297 0 0 0 .371.761c.696 1.159 1.818 1.927 3.593 1.927 1.497 0 2.633-.671 3.965-2.444.76-1.012 1.144-1.626 2.663-4.32l.756-1.339.186-.325c.061.1.121.196.183.3l2.152 3.595c.724 1.21 1.665 2.556 2.47 3.314 1.046.987 1.992 1.22 3.06 1.22 1.075 0 1.876-.355 2.455-.843a3.743 3.743 0 0 0 .81-.973c.542-.939.861-2.127.861-3.745 0-2.72-.681-5.357-2.084-7.45-1.282-1.912-2.957-2.93-4.716-2.93-1.047 0-2.088.467-3.053 1.308-.652.57-1.257 1.29-1.82 2.05-.69-.875-1.335-1.547-1.958-2.056-1.182-.966-2.315-1.303-3.454-1.303zm10.16 2.053c1.147 0 2.188.758 2.992 1.999 1.132 1.748 1.647 4.195 1.647 6.4 0 1.548-.368 2.9-1.839 2.9-.58 0-1.027-.23-1.664-1.004-.496-.601-1.343-1.878-2.832-4.358l-.617-1.028a44.908 44.908 0 0 0-1.255-1.98c.07-.109.141-.224.211-.327 1.12-1.667 2.118-2.602 3.358-2.602zm-10.201.553c1.265 0 2.058.791 2.675 1.446.307.327.737.871 1.234 1.579l-1.02 1.566c-.757 1.163-1.882 3.017-2.837 4.338-1.191 1.649-1.81 1.817-2.486 1.817-.524 0-1.038-.237-1.383-.794-.263-.426-.464-1.13-.464-2.046 0-2.221.63-4.535 1.66-6.088.454-.687.964-1.226 1.533-1.533a2.264 2.264 0 0 1 1.088-.285z"/></svg>` },
    { name: "Google Analytics", svg: `<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M22.84 2.9982v17.9987c.0086 1.6473-1.3197 2.9897-2.967 2.9984a2.9808 2.9808 0 01-.3677-.0208c-1.528-.226-2.6477-1.5558-2.6105-3.1V3.1204c-.0369-1.5458 1.0856-2.8762 2.6157-3.1 1.6361-.1915 3.1178.9796 3.3093 2.6158.014.1201.0208.241.0202.3619zM4.1326 18.0548c-1.6417 0-2.9726 1.331-2.9726 2.9726C1.16 22.6691 2.4909 24 4.1326 24s2.9726-1.3309 2.9726-2.9726-1.331-2.9726-2.9726-2.9726zm7.8728-9.0098c-.0171 0-.0342 0-.0513.0003-1.6495.0904-2.9293 1.474-2.891 3.1256v7.9846c0 2.167.9535 3.4825 2.3505 3.763 1.6118.3266 3.1832-.7152 3.5098-2.327.04-.1974.06-.3983.0593-.5998v-8.9585c.003-1.6474-1.33-2.9852-2.9773-2.9882z"/></svg>` },
    { name: "Inception Labs", svg: `${PSVG}<path d="M12 3 21 19H3Z"/><path d="M12 9 16.5 17h-9Z"/></svg>` },
    { name: "DAIEJA 2.0 AI", href: "#", svg: `${PSVG}<path d="M12 3 19.5 7.5v9L12 21 4.5 16.5v-9Z"/><circle cx="12" cy="12" r="2.2"/><path d="M12 3v6.8M12 14.2V21M19.5 7.5l-5.6 3.4M4.5 7.5l5.6 3.4"/></svg>` }
  ];
  const clients = ["Mi Budz", "Redeye Fenton", "Your Corner Store"];
  const team = [
    { initials: "TG", name: "Thomas Garren", role: "Technical Director", org: "DAIEJA 2.0" },
    { initials: "BK", name: "Bartlomiej Krawiecki", role: "Founder & Creative Director", org: "Inovision" }
  ];
  const FT = "rgba(246,226,166,0.22)", FL = "rgba(230,200,120,0.12)", FR = "rgba(230,200,120,0.05)";
  const GS = 'stroke="#e6c878" stroke-width="1" stroke-linejoin="round"';
  function cube(cx, ty, w, h) {
    const hh = w / 2;
    return `<path d="M${cx},${ty} l${w},${hh} l${-w},${hh} l${-w},${-hh} Z" fill="${FT}" ${GS}/><path d="M${cx - w},${ty + hh} l0,${h} l${w},${hh} l0,${-h} Z" fill="${FL}" ${GS}/><path d="M${cx + w},${ty + hh} l0,${h} l${-w},${hh} l0,${-h} Z" fill="${FR}" ${GS}/>`;
  }
  const SVG = (inner) => `<svg viewBox="0 0 220 200" fill="none" xmlns="http://www.w3.org/2000/svg" class="iso"><ellipse cx="110" cy="166" rx="58" ry="13" fill="rgba(230,200,120,0.06)"/>${inner}</svg>`;
  const ISO_BASE = `<path d="M110 70 L182 106 L110 142 L38 106 Z" fill="rgba(230,200,120,0.03)" stroke="rgba(230,200,120,0.3)" stroke-width="1"/><path d="M74 88 L146 124 M146 88 L74 124" stroke="rgba(230,200,120,0.12)" stroke-width="0.6"/>`;
  const entCaps = [
    {
      t: "Security & compliance",
      d: "SSO, hardened data handling, and privacy-first architecture \u2014 built to pass review.",
      art: SVG(`${ISO_BASE}<g class="iso-obj"><path d="M110,52 L148,68 L148,98 Q148,122 110,138 Q72,122 72,98 L72,68 Z" fill="${FT}" ${GS}/><path d="M148,68 l8,4 v30 q0,22 -38,40 l-8,-4" fill="${FR}" ${GS}/><circle cx="110" cy="92" r="8" ${GS} fill="${FL}"/><path d="M110,92 v12" stroke="#f6e2a6" stroke-width="2" stroke-linecap="round"/></g>`)
    },
    {
      t: "Dedicated senior team",
      d: "No juniors, no hand-offs. You work directly with the people building it.",
      art: SVG(`${ISO_BASE}<path d="M78,98 L142,98 M78,98 L110,70 M142,98 L110,70" stroke="rgba(230,200,120,0.45)" stroke-width="1" stroke-dasharray="2 3"/><g class="iso-obj"><g><circle cx="110" cy="58" r="8" ${GS} fill="${FT}"/><path d="M98,86 q12,-20 12,-20 q12,0 12,20 Z" fill="${FL}" ${GS}/></g><g><circle cx="78" cy="86" r="7" ${GS} fill="${FT}"/><path d="M67,110 q11,-18 11,-18 q11,0 11,18 Z" fill="${FL}" ${GS}/></g><g><circle cx="142" cy="86" r="7" ${GS} fill="${FT}"/><path d="M131,110 q11,-18 11,-18 q11,0 11,18 Z" fill="${FR}" ${GS}/></g></g>`)
    },
    {
      t: "Scalable architecture",
      d: "Load-tested and monitored, built to grow from launch to enterprise traffic.",
      art: SVG(`${ISO_BASE}<g class="iso-obj">${cube(110, 96, 32, 20)}${cube(110, 72, 26, 18)}${cube(110, 50, 20, 16)}<path d="M150,70 l16,-8 M154,86 l16,-8" stroke="rgba(246,226,166,0.5)" stroke-width="1" stroke-linecap="round"/></g>`)
    },
    {
      t: "SLAs & support",
      d: "Response guarantees and proactive care that continue long after go-live.",
      art: SVG(`${ISO_BASE}<g class="iso-obj"><path d="M70,84 v22 a40,20 0 0 0 80,0 v-22" fill="${FL}" ${GS}/><ellipse cx="110" cy="84" rx="40" ry="20" fill="${FT}" ${GS}/><ellipse cx="110" cy="84" rx="28" ry="14" stroke="rgba(230,200,120,0.4)" stroke-width="0.8" fill="none"/><path d="M110,84 l0,-10 M110,84 l9,5" stroke="#f6e2a6" stroke-width="2" stroke-linecap="round"/><circle cx="110" cy="84" r="2.5" fill="#f6e2a6"/></g>`)
    },
    {
      t: "Accessibility, WCAG",
      d: "Inclusive, standards-compliant interfaces \u2014 accessible by default, not afterthought.",
      art: SVG(`${ISO_BASE}<g class="iso-obj"><ellipse cx="110" cy="96" rx="50" ry="25" stroke="#e6c878" stroke-width="1.4" fill="none"/><ellipse cx="110" cy="96" rx="34" ry="17" stroke="rgba(230,200,120,0.3)" stroke-width="0.8" fill="none"/><circle cx="110" cy="60" r="7" ${GS} fill="${FT}"/><path d="M110,68 v20 M96,78 h28 M110,88 l-10,18 M110,88 l10,18" stroke="#f6e2a6" stroke-width="2" stroke-linecap="round" fill="none"/></g>`)
    },
    {
      t: "Performance budgets",
      d: "Measured speed with real budgets and monitoring \u2014 fast, and kept fast.",
      art: SVG(`${ISO_BASE}<g class="iso-obj"><path d="M62,112 A50,50 0 0 1 158,112" stroke="#e6c878" stroke-width="1.5" fill="none"/><path d="M70,112 l-7,2 M110,62 v-8 M150,112 l7,2 M84,82 l-5,-6 M136,82 l5,-6" stroke="rgba(230,200,120,0.45)" stroke-width="1" stroke-linecap="round"/><path d="M110,112 L138,84" stroke="#f6e2a6" stroke-width="2.4" stroke-linecap="round"/><circle cx="110" cy="112" r="5" ${GS} fill="${FT}"/><path d="M118,48 l-12,18 h9 l-3,16 14,-22 h-9 l5,-12 Z" fill="${FT}" ${GS}/></g>`)
    }
  ];
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Inovision Studios \u2014 Custom Web Design, Engineering & SEO", "description": "Inovision Studios designs and builds custom websites on hand-engineered stacks \u2014 fast, beautiful, and built to rank. Web design, development & SEO." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", " ", '<div class="scrollbar" aria-hidden="true"><i id="scrollProg"></i></div> <div class="studio"> <div class="studio-aurora"></div> <div class="studio-grain"></div> ', ' <!-- HERO --> <header class="s-hero" id="top"> <div class="s-hero-video"> ', ' </div> <div class="s-hero-overlay" aria-hidden="true"></div> <div class="s-hero-sweep" aria-hidden="true"></div> <div class="s-hero-inner"> <p class="s-kicker reveal">', '</p> <h1 class="s-display reveal reveal-d1"> ', ' <span class="s-grad-text">', '</span> </h1> <p class="s-lead reveal reveal-d2"> ', ' </p> <div class="s-cta-row reveal reveal-d3"> <a class="s-btn s-btn-primary" href="/contact">Start a project <span class="ico">\u2192</span></a> <a class="s-btn s-btn-ghost" href="/work">See the work <span class="ico">\u2197</span></a> </div> </div> </header> <!-- SHOWREEL (dual-direction image marquee) --> <section class="reel-section" aria-label="Selected visuals"> <div class="reel"> <div class="reel-row r1"> ', ' </div> <div class="reel-row r2"> ', ' </div> </div> </section> <!-- SERVICES --> <section class="s-section" id="services"> <div class="s-wrap"> <div class="s-head"> <p class="s-kicker reveal">What we do</p> <h2 class="s-display reveal reveal-d1">\nA studio for the <span class="s-grad-text">next web.</span> </h2> <p class="s-lead reveal reveal-d2">\nFour disciplines, one team. We design it, engineer it, and ship it.\n</p> </div> <div class="reveal reveal-d2"> ', ' </div> <div class="s-figures reveal reveal-d2"> ', ' </div> </div> </section> <!-- MOBILE SHOWCASE (3D phones) --> <section class="s-section" id="mobile"> <div class="s-wrap"> <div class="s-head" style="margin-inline:auto;text-align:center;"> <p class="s-kicker reveal" style="justify-content:center;">Mobile-first</p> <h2 class="s-display reveal reveal-d1">Built for the <span class="s-grad-text">phone in your hand.</span></h2> <p class="s-lead reveal reveal-d2" style="margin-inline:auto;">\nEvery build is designed on the small screen first \u2014 fast, tactile, and beautiful\n            where most of your traffic actually lives. Real client sites, shipped.\n</p> </div> <div class="reveal reveal-d3"> ', ' </div> </div> </section> <!-- WORK --> <section class="s-section" id="work"> <div class="s-wrap"> <div class="s-head"> <p class="s-kicker reveal">Selected work</p> <h2 class="s-display reveal reveal-d1">\nBrands we made <span class="s-grad-text">move.</span> </h2> </div> <div class="reveal reveal-d2" style="margin-top:2.5rem;"> ', ' </div> <div class="s-cta-row reveal reveal-d3" style="margin-top:2.6rem;"> <a class="s-btn s-btn-primary" href="/work">Open the full archive <span class="ico">\u2192</span></a> </div> </div> </section> <!-- ASSEMBLY (3D UI coming together) --> <section class="s-section" id="assembly"> <div class="s-wrap"> <div class="s-head" style="margin-inline:auto;text-align:center;"> <p class="s-kicker reveal" style="justify-content:center;">For your business</p> <h2 class="s-display reveal reveal-d1">Every piece, <span class="s-grad-text">engineered to fit.</span></h2> <p class="s-lead reveal reveal-d2" style="margin-inline:auto;">\nNavigation, layout, data, controls \u2014 we design each component, then assemble them into\n            one interface built around how your business actually runs.\n</p> </div> <div class="assy" data-assy> <div class="assy-stage"> <div class="assy-ui"> <div class="assy-piece assy-nav" style="--sy:-150px;--srx:38deg;--d:0"> <span class="assy-logo"></span><span class="assy-pill w48"></span> <span class="assy-pill w28"></span><span class="assy-pill w28"></span> <span class="assy-av"></span> </div> <div class="assy-piece assy-side" style="--sx:-150px;--sry:-40deg;--d:1"> <span class="assy-ico gold"></span><span class="assy-ico"></span><span class="assy-ico"></span><span class="assy-ico"></span> </div> <div class="assy-piece assy-stat" style="--sx:-70px;--sy:130px;--sz:-220px;--d:2"><b>$48K</b><span>Revenue</span></div> <div class="assy-piece assy-stat" style="--sy:160px;--sz:-280px;--d:3"><b>2,940</b><span>Signups</span></div> <div class="assy-piece assy-stat" style="--sx:70px;--sy:130px;--sz:-220px;--d:4"><b>99.9%</b><span>Uptime</span></div> <div class="assy-piece assy-chart" style="--sy:170px;--srx:-30deg;--d:5"> <i style="--h:45%"></i><i style="--h:70%"></i><i style="--h:38%"></i><i style="--h:86%"></i><i style="--h:58%"></i><i style="--h:76%"></i><i style="--h:50%"></i><i style="--h:82%"></i> </div> </div> <span class="assy-btn" style="--d:6">Publish</span> <span class="assy-cursor" style="--d:7" aria-hidden="true"></span> </div> </div> </div> </section> <!-- ENTERPRISE --> <section class="s-section" id="enterprise"> <div class="s-wrap"> <div class="s-head"> <p class="s-kicker reveal">Enterprise</p> <h2 class="s-display reveal reveal-d1">\nBuilt to <span class="s-grad-text">enterprise standard.</span> </h2> <p class="s-lead reveal reveal-d2">\nBoutique craft, run with the rigor large organizations require \u2014\n            security, scale, accessibility, and senior accountability from day one.\n</p> </div> <div class="ec reveal reveal-d2"> <div class="ec-panel"> <span class="ec-scan" aria-hidden="true"></span> <div class="ec-head"> <span class="ec-live"><i></i>Enterprise readiness</span> <span class="ec-badges"><b>SOC 2</b><b>WCAG 2.2</b><b>99.99% SLA</b></span> </div> <div class="ec-metrics"> <div class="ec-metric"><b>99.99%</b><span>Uptime target</span></div> <div class="ec-metric"><b>24/7</b><span>Senior support</span></div> <div class="ec-metric"><b>Zero</b><span>Hand-offs</span></div> </div> <div class="ec-rows"> ', ` </div> </div> </div> </div> </section> <!-- MOCKUP STUDIO (animated CSS UI screens) --> <section class="s-section" id="mockups"> <div class="s-wrap"> <div class="s-head" style="margin-inline:auto;text-align:center;"> <p class="s-kicker reveal" style="justify-content:center;">Mockup studio</p> <h2 class="s-display reveal reveal-d1">Every interface, <span class="s-grad-text">designed to move.</span></h2> <p class="s-lead reveal reveal-d2" style="margin-inline:auto;">
Dashboards, storefronts, landing pages, conversational UI \u2014 we prototype the full spectrum.
            Here's a live, code-drawn preview of the range, no stock screenshots.
</p> </div> <div class="reveal reveal-d2"> `, ` </div> </div> </section> <!-- STATEMENT (scroll-scrub reveal) --> <section class="s-section s-statement"> <p class="scrub" id="scrubText"> <span>We</span> <span>don't</span> <span>make</span> <span>websites</span> <span>\u2014</span> <span>we</span> <span>engineer</span> <span>experiences</span> <span>that</span> <span>move,</span> <span>think,</span> <span>and</span> <span>convert.</span> <span>Custom</span> <span>design,</span> <span>real</span> <span>engineering,</span> <span>and</span> <span>AI</span> <span>that</span> <span>actually</span> <span>ships</span> <span>\u2014</span> <span>built</span> <span>to</span> <span>rank,</span> <span>built</span> <span>to</span> <span>last.</span> </p> </section> <!-- LIVE INTERFACES --> <section class="s-section" id="interfaces"> <div class="s-wrap"> <div class="s-head" style="margin-inline:auto;text-align:center;"> <p class="s-kicker reveal">Live interfaces</p> <h2 class="s-display reveal reveal-d1">
Designs that <span class="s-grad-text">move.</span> </h2> <p class="s-lead reveal reveal-d2" style="margin-inline:auto;">
Animated UI, real-time data, 3D \u2014 every screen we ship is alive.
            Move your cursor over it.
</p> </div> <div class="reveal reveal-d2"> `, ' </div> </div> </section> <!-- CODE -> SITE (Vex engine live build) --> <section class="s-section" id="build"> <div class="s-wrap"> <div class="s-head" style="margin-inline:auto;text-align:center;"> <p class="s-kicker reveal" style="justify-content:center;">From prompt to page</p> <h2 class="s-display reveal reveal-d1">\nWatch it <span class="s-grad-text">build.</span> </h2> <p class="s-lead reveal reveal-d2" style="margin-inline:auto;">\nOur Vex engine writes the code, then the site renders \u2014 live. Design\n            and build, one motion.\n</p> </div> <div class="reveal reveal-d2"> ', ' </div> </div> </section> <!-- CAPABILITY MARQUEE --> <div class="s-marquee" aria-hidden="true"> <div class="s-marquee-track"> ', ' </div> </div> <!-- 3D CORE --> <section class="s-section" id="core" style="position:relative;"> <div class="s-blueprint" aria-hidden="true"></div> <div class="s-wrap"> <div class="s-core"> <div class="s-core-stage reveal"> ', ' </div> <div class="reveal reveal-d1"> <p class="s-kicker">The engine room</p> <h2 class="s-display" style="font-size:clamp(2rem,5vw,4rem);">\nCraft you can <span class="s-grad-text">feel.</span> </h2> <p class="s-lead" style="margin-top:1rem;">\nEvery project rides on real engineering \u2014 shaders, AI pipelines,\n              and custom tooling, not plugins. That gold core? Drag it.\n</p> <ul class="s-feat-list"> ', ' </ul> </div> </div> </div> </section> <!-- PROCESS --> <section class="s-section" id="process"> <div class="s-wrap"> <div class="s-head"> <p class="s-kicker reveal">How we work</p> <h2 class="s-display reveal reveal-d1">\nFrom idea to <span class="s-grad-text">live.</span> </h2> <p class="s-lead reveal reveal-d2">\nA tight, senior team. No hand-offs to junior shops, no template\n            factories. You talk to the people building it.\n</p> </div> <div class="proc"> ', ' </div> </div> </section> <!-- PARTNERS / TRUSTED / TEAM --> <section class="s-section" id="studio"> <div class="s-wrap"> <div class="s-head" style="margin-inline:auto;text-align:center;"> <p class="s-kicker reveal" style="justify-content:center;">Powered by the best</p> <h2 class="s-display reveal reveal-d1">\nWe build with <span class="s-grad-text">industry-leading tools.</span> </h2> <p class="s-lead reveal reveal-d2" style="margin-inline:auto;">\nThe tools and intelligence behind every build \u2014 Blender and Adobe for\n            craft, DAIEJA 2.0 AI for our AI tooling, plus HubSpot, Google and Meta AI,\n            all wired in and production-grade.\n</p> </div> <div class="logo-wall reveal reveal-d2"> ', ' </div> <div class="trusted reveal reveal-d3"> <span class="trusted-label">Trusted by</span> <div class="trusted-names"> ', ' </div> </div> <div class="s-head" style="margin:5.5rem auto 0;text-align:center;"> <p class="s-kicker reveal" style="justify-content:center;">The team</p> <h2 class="s-display reveal reveal-d1" style="font-size:clamp(1.8rem,4.5vw,3.2rem);">\nSenior hands, <span class="s-grad-text">start to ship.</span> </h2> </div> <div class="team2"> ', ` </div> </div> </section> <!-- CONTACT --> <section class="s-section" id="contact"> <div class="s-wrap"> <div class="s-head" style="margin-inline:auto;text-align:center;"> <p class="s-kicker reveal">Start a project</p> <h2 class="s-display reveal reveal-d1">
Let's build something <span class="s-grad-text">unforgettable.</span> </h2> <p class="s-lead reveal reveal-d2" style="margin-inline:auto;">
Tell us what you're making. We reply fast.
</p> </div> <div class="reveal reveal-d3" style="margin-top:2.5rem;"> `, " </div> </div> </section> ", ' </div> <script>\n    (function () {\n      var io = new IntersectionObserver(\n        function (entries) {\n          entries.forEach(function (e) {\n            if (e.isIntersecting) {\n              e.target.classList.add("in");\n              io.unobserve(e.target);\n            }\n          });\n        },\n        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }\n      );\n      document.querySelectorAll(".reveal").forEach(function (el) {\n        io.observe(el);\n      });\n      document.querySelectorAll("[data-glow]").forEach(function (card) {\n        card.addEventListener("pointermove", function (ev) {\n          var r = card.getBoundingClientRect();\n          card.style.setProperty("--mx", ((ev.clientX - r.left) / r.width) * 100 + "%");\n          card.style.setProperty("--my", ((ev.clientY - r.top) / r.height) * 100 + "%");\n        });\n      });\n\n      // scroll-scrub statement: light words as the line moves through view\n      var scrub = document.getElementById("scrubText");\n      if (scrub) {\n        var words = [].slice.call(scrub.querySelectorAll("span"));\n        var ticking = false;\n        var paint = function () {\n          ticking = false;\n          var r = scrub.getBoundingClientRect();\n          var vh = window.innerHeight || 800;\n          var p = (vh * 0.95 - r.top) / (vh * 0.34);\n          if (p < 0) p = 0;\n          if (p > 1) p = 1;\n          var n = Math.round(p * words.length);\n          for (var i = 0; i < words.length; i++) {\n            var lit = i < n;\n            if (words[i].classList.contains("lit") !== lit)\n              words[i].classList.toggle("lit", lit);\n          }\n        };\n        var onScroll = function () {\n          if (!ticking) { ticking = true; requestAnimationFrame(paint); }\n        };\n        window.addEventListener("scroll", onScroll, { passive: true });\n        window.addEventListener("resize", onScroll, { passive: true });\n        paint();\n      }\n\n      // gyroscope 3D \u2014 tilt the device showcase + parallax the hero on phones\n      if (window.DeviceOrientationEvent && window.matchMedia("(pointer: coarse)").matches) {\n        var rig = document.getElementById("devRig");\n        var heroInner = document.querySelector(".s-hero-inner");\n        var gyroTick = false;\n        var ga = 0, be = 0;\n        window.addEventListener("deviceorientation", function (e) {\n          ga = Math.max(-1, Math.min(1, (e.gamma || 0) / 26));\n          be = Math.max(-1, Math.min(1, ((e.beta || 0) - 42) / 26));\n          if (!gyroTick) {\n            gyroTick = true;\n            requestAnimationFrame(function () {\n              gyroTick = false;\n              if (rig) {\n                rig.style.setProperty("--tx", (-12 + ga * 11).toFixed(1) + "deg");\n                rig.style.setProperty("--ty", (8 - be * 7).toFixed(1) + "deg");\n              }\n              if (heroInner) {\n                heroInner.style.transform =\n                  "translate3d(" + (ga * 10).toFixed(1) + "px," + (be * 7).toFixed(1) + "px,0)";\n              }\n            });\n          }\n        }, true);\n      }\n\n      // scroll progress bar\n      var prog = document.getElementById("scrollProg");\n      // section guide dots\n      var dots = [].slice.call(document.querySelectorAll(".secdots a"));\n      var secs = dots\n        .map(function (d) { return document.getElementById(d.getAttribute("data-sec")); })\n        .filter(Boolean);\n      var progTick = false;\n      var onProg = function () {\n        if (progTick) return;\n        progTick = true;\n        requestAnimationFrame(function () {\n          progTick = false;\n          var h = document.documentElement;\n          var max = h.scrollHeight - h.clientHeight;\n          var p = max > 0 ? h.scrollTop / max : 0;\n          if (prog) prog.style.transform = "scaleX(" + p + ")";\n          // active dot = section nearest the viewport middle\n          var mid = window.scrollY + window.innerHeight * 0.4;\n          var idx = 0;\n          for (var i = 0; i < secs.length; i++) {\n            if (secs[i].offsetTop <= mid) idx = i;\n          }\n          for (var j = 0; j < dots.length; j++) {\n            dots[j].classList.toggle("active", j === idx);\n          }\n        });\n      };\n      window.addEventListener("scroll", onProg, { passive: true });\n      window.addEventListener("resize", onProg, { passive: true });\n      onProg();\n    })();\n\n    // 3D UI assembly: scrub pieces together at viewport center, apart when leaving\n    (function () {\n      var assy = document.querySelector("[data-assy]");\n      if (!assy) return;\n      var ticking = false;\n      var paint = function () {\n        ticking = false;\n        var r = assy.getBoundingClientRect();\n        var elCenter = r.top + r.height / 2;\n        var viewCenter = window.innerHeight / 2;\n        var dist = Math.abs(elCenter - viewCenter);\n        var dead = window.innerHeight * 0.09;                       // hold assembled near center\n        var max = window.innerHeight * 0.5 + r.height * 0.5;        // fully apart as it leaves view\n        var p = (dist - dead) / (max - dead);\n        p = Math.max(0, Math.min(p, 1));\n        assy.style.setProperty("--p", p.toFixed(3));\n      };\n      var onScroll = function () { if (!ticking) { ticking = true; requestAnimationFrame(paint); } };\n      window.addEventListener("scroll", onScroll, { passive: true });\n      window.addEventListener("resize", onScroll, { passive: true });\n      paint();\n    })();\n  <\/script> '])), renderComponent($$result2, "Intro", $$Intro, {}), maybeRenderHead(), renderComponent($$result2, "Nav", Nav, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Nav", "client:component-export": "default" }), renderComponent($$result2, "HeroVideo", HeroVideo, { "src": ov("hero.video", "/hero-vex-video.mp4"), "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/HeroVideo", "client:component-export": "default" }), ov("hero.kicker", "Web Design \xB7 Custom Stacks \xB7 SEO"), ov("hero.title", "Web design that"), ov("hero.accent", "ranks."), ov("hero.lead", "Custom websites on hand-engineered stacks \u2014 fast, beautiful, and built to rank. We design, develop, and optimize every layer for search from day one, for small business and enterprise."), [...reel1, ...reel1].map((g) => renderTemplate`<a class="reel-item" href="/work"${addAttribute(g.title, "aria-label")}> <img${addAttribute(g.src, "src")}${addAttribute(g.title, "alt")} loading="lazy" decoding="async"> <span class="reel-cap">${g.category}</span> </a>`), [...reel2, ...reel2].map((g) => renderTemplate`<a class="reel-item" href="/work"${addAttribute(g.title, "aria-label")}> <img${addAttribute(g.src, "src")}${addAttribute(g.title, "alt")} loading="lazy" decoding="async"> <span class="reel-cap">${g.category}</span> </a>`), renderComponent($$result2, "MonitorShowcase", MonitorShowcase, { "services": services.map((sv, i) => ({ n: sv.n, t: ov(`svc.${i}.title`, sv.t), d: ov(`svc.${i}.desc`, sv.d), img: ov(`svc.${i}.img`, sv.img) })), "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/components/MonitorShowcase", "client:component-export": "default" }), stats.map((st) => renderTemplate`<div class="s-figure"> <b class="s-grad-text">${st.b}</b> <span>${st.s}</span> </div>`), renderComponent($$result2, "PhoneCarousel", PhoneCarousel, { "phones": phones, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/components/PhoneCarousel", "client:component-export": "default" }), renderComponent($$result2, "Gallery3D", Gallery3D, { "items": work, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/components/Gallery3D", "client:component-export": "default" }), entCaps.map((c, i) => renderTemplate`<div class="ec-row"${addAttribute(`--i:${i}`, "style")}> <span class="ec-light" aria-hidden="true"></span> <div class="ec-info"><b>${c.t}</b><span>${c.d}</span></div> <div class="ec-meter"><i></i></div> <span class="ec-ok">Operational</span> </div>`), renderComponent($$result2, "DesignScreens", DesignScreens, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/components/DesignScreens", "client:component-export": "default" }), renderComponent($$result2, "DeviceShowcase", $$DeviceShowcase, {}), renderComponent($$result2, "CodeToSite", CodeToSite, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/components/CodeToSite", "client:component-export": "default" }), [...capabilities, ...capabilities].map((c) => renderTemplate`<span class="s-marquee-item">${c}<span class="s-marquee-dot"></span></span>`), renderComponent($$result2, "Hero3D", Hero3D, { "className": "s-core-canvas", "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/components/Hero3D", "client:component-export": "default" }), [
    "Real-time WebGL & custom shaders",
    "Production AI \u2014 copilots, RAG, automation",
    "Bespoke tooling & internal software",
    "Design systems engineered to scale"
  ].map((f) => renderTemplate`<li> <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--gold)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="m5 13 4 4L19 7"></path></svg> ${f} </li>`), [
    { n: "01", t: "Discover", d: "We learn your business, your customer, and what winning actually looks like." },
    { n: "02", t: "Design", d: "Cinematic concepts and a real design system \u2014 never a template." },
    { n: "03", t: "Build", d: "Production engineering: 3D, AI, and the custom tooling underneath." },
    { n: "04", t: "Ship", d: "Launched, measured, iterated. We stay after go-live." }
  ].map((p, i) => renderTemplate`<div${addAttribute(`proc-step reveal reveal-d${i % 4 + 1}`, "class")}> <span class="proc-n">${p.n}</span> <div class="proc-body"> <h3>${p.t}</h3> <p>${p.d}</p> </div> </div>`), partners.map((p) => p.href ? renderTemplate`<a class="logo-chip"${addAttribute(p.href, "href")} target="_blank" rel="noopener noreferrer"> <span>${unescapeHTML(p.svg)}</span> <b>${p.name}</b> </a>` : renderTemplate`<div class="logo-chip"> <span>${unescapeHTML(p.svg)}</span> <b>${p.name}</b> </div>`), clients.map((c) => renderTemplate`<span>${c}</span>`), team.map((m) => renderTemplate`<div class="team2-row reveal"> <span class="team2-name">${m.name}</span> <span class="team2-role">${m.role} · <b>${m.org}</b></span> </div>`), renderComponent($$result2, "ContactForm", ContactForm, { "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/components/ContactForm", "client:component-export": "default" }), renderComponent($$result2, "Footer", Footer, {})) })}`;
}, "D:/wix/Inovision/web/src/pages/index.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/index.astro";
const $$url = "";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Index,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
