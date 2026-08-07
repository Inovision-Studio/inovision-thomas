import { f as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/Base_-4rjFWta.mjs';
/* empty css                                   */
/* empty css                                */
import { F as Footer, N as Nav } from '../chunks/Footer_CTcSx4kn.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useRef, useEffect, useState, useMemo } from 'react';
import * as THREE from 'three';
import { G as GALLERY, a as GALLERY_CATEGORIES } from '../chunks/gallery_YWiXHYbc.mjs';
import { H as galleryCount, J as listGallery } from '../chunks/db_xJ927fmw.mjs';
export { renderers } from '../renderers.mjs';

function GalleryRing({ images }) {
  const mountRef = useRef(null);
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount || images.length === 0) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setClearColor(0, 0);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.width = "100%";
    renderer.domElement.style.height = "100%";
    renderer.domElement.style.display = "block";
    renderer.domElement.style.cursor = "grab";
    const ring = new THREE.Group();
    ring.rotation.x = -0.12;
    scene.add(ring);
    const N = images.length;
    const RAD = Math.max(3.4, N * 0.62);
    const H = 1.7;
    camera.position.set(0, 0.2, RAD + 3.4);
    camera.lookAt(0, 0, 0);
    const loader = new THREE.TextureLoader();
    loader.crossOrigin = "anonymous";
    const meshes = [];
    images.forEach((src, i) => {
      const geo = new THREE.PlaneGeometry(1, 1);
      const mat = new THREE.MeshBasicMaterial({
        color: 2236962,
        transparent: true,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      const a = i / N * Math.PI * 2;
      mesh.position.set(Math.sin(a) * RAD, 0, Math.cos(a) * RAD);
      mesh.rotation.y = a;
      mesh.scale.set(H, H, 1);
      ring.add(mesh);
      meshes.push(mesh);
      loader.load(
        src,
        (tex) => {
          tex.colorSpace = THREE.SRGBColorSpace;
          const aspect = (tex.image.width || 1) / (tex.image.height || 1);
          mesh.scale.set(H * aspect, H, 1);
          mat.map = tex;
          mat.color.set(16777215);
          mat.needsUpdate = true;
        },
        void 0,
        () => {
        }
      );
    });
    let vel = reduced ? 0 : 16e-4;
    let dragging = false;
    let lastX = 0;
    const onDown = (e) => {
      dragging = true;
      lastX = e.clientX;
      renderer.domElement.style.cursor = "grabbing";
    };
    const onMove = (e) => {
      if (!dragging) return;
      const dx = e.clientX - lastX;
      lastX = e.clientX;
      vel = dx * 9e-4;
      ring.rotation.y += dx * 5e-3;
    };
    const onUp = () => {
      dragging = false;
      renderer.domElement.style.cursor = "grab";
    };
    renderer.domElement.addEventListener("pointerdown", onDown);
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    const resize = () => {
      const w = mount.clientWidth || 1;
      const h = mount.clientHeight || 1;
      renderer.setSize(w, h, false);
      const aspect = w / h;
      camera.aspect = aspect;
      const gap = aspect < 1 ? Math.min(3.4 / aspect, 8.5) : 3.4;
      camera.position.set(0, 0.2, RAD + gap);
      camera.lookAt(0, 0, 0);
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(mount);
    let raf = 0;
    const render = () => {
      if (!dragging) {
        ring.rotation.y += vel;
        vel += ((reduced ? 0 : 16e-4) - vel) * 0.02;
      }
      for (const m of meshes) {
        const worldDir = new THREE.Vector3();
        m.getWorldPosition(worldDir);
        const facing = worldDir.z;
        const k = THREE.MathUtils.clamp((facing + RAD) / (RAD * 2), 0, 1);
        m.material.opacity = 0.28 + k * 0.72;
      }
      renderer.render(scene, camera);
      raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(raf);
      renderer.domElement.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      ro.disconnect();
      meshes.forEach((m) => {
        m.geometry.dispose();
        const mm = m.material;
        mm.map?.dispose();
        mm.dispose();
      });
      renderer.dispose();
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
    };
  }, [images]);
  return /* @__PURE__ */ jsx("div", { ref: mountRef, className: "gr-canvas" });
}

function Shot({
  shot,
  onOpen,
  i
}) {
  const ref = useRef(null);
  const onMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${-py * 8}deg`);
    el.style.setProperty("--ry", `${px * 10}deg`);
    el.style.setProperty("--mx", `${(px + 0.5) * 100}%`);
    el.style.setProperty("--my", `${(py + 0.5) * 100}%`);
  };
  const reset = () => {
    const el = ref.current;
    if (!el) return;
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      ref,
      className: "gw-card",
      style: { animationDelay: `${i % 12 * 0.04}s` },
      onPointerMove: onMove,
      onPointerLeave: reset,
      onClick: onOpen,
      "aria-label": `View ${shot.title}`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "gw-frame" }),
        /* @__PURE__ */ jsx("img", { src: shot.src, alt: shot.title, loading: "lazy", decoding: "async" }),
        /* @__PURE__ */ jsxs("span", { className: "gw-meta", children: [
          /* @__PURE__ */ jsx("span", { className: "gw-cat", children: shot.category }),
          /* @__PURE__ */ jsx("span", { className: "gw-title", children: shot.title })
        ] })
      ]
    }
  );
}
function GalleryWall({ data = GALLERY }) {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);
  const items = useMemo(
    () => filter === "All" ? data : data.filter((s) => s.category === filter),
    [filter, data]
  );
  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => o === null ? o : (o + 1) % items.length);
      if (e.key === "ArrowLeft")
        setOpen((o) => o === null ? o : (o - 1 + items.length) % items.length);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, items.length]);
  const cats = ["All", ...GALLERY_CATEGORIES];
  const current = open === null ? null : items[open];
  return /* @__PURE__ */ jsxs("div", { className: "gw", children: [
    /* @__PURE__ */ jsx("div", { className: "gw-filters", children: cats.map((c) => /* @__PURE__ */ jsxs(
      "button",
      {
        className: `gw-chip${filter === c ? " on" : ""}`,
        onClick: () => setFilter(c),
        children: [
          c,
          /* @__PURE__ */ jsx("span", { className: "gw-chip-n", children: c === "All" ? GALLERY.length : GALLERY.filter((s) => s.category === c).length })
        ]
      },
      c
    )) }),
    /* @__PURE__ */ jsx("div", { className: "gw-grid", children: items.map((s, i) => /* @__PURE__ */ jsx(Shot, { shot: s, i, onOpen: () => setOpen(i) }, s.src)) }, filter),
    current && /* @__PURE__ */ jsxs("div", { className: "gw-lb", onClick: () => setOpen(null), children: [
      /* @__PURE__ */ jsx("button", { className: "gw-lb-x", "aria-label": "Close", children: "✕" }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "gw-lb-nav prev",
          "aria-label": "Previous",
          onClick: (e) => {
            e.stopPropagation();
            setOpen((o) => o === null ? o : (o - 1 + items.length) % items.length);
          },
          children: "‹"
        }
      ),
      /* @__PURE__ */ jsxs("figure", { className: "gw-lb-fig", onClick: (e) => e.stopPropagation(), children: [
        /* @__PURE__ */ jsx("img", { src: current.src, alt: current.title }),
        /* @__PURE__ */ jsxs("figcaption", { children: [
          /* @__PURE__ */ jsx("span", { className: "gw-cat", children: current.category }),
          /* @__PURE__ */ jsx("span", { className: "gw-title", children: current.title })
        ] })
      ] }),
      /* @__PURE__ */ jsx(
        "button",
        {
          className: "gw-lb-nav next",
          "aria-label": "Next",
          onClick: (e) => {
            e.stopPropagation();
            setOpen((o) => o === null ? o : (o + 1) % items.length);
          },
          children: "›"
        }
      )
    ] })
  ] });
}

var __freeze = Object.freeze;
var __defProp = Object.defineProperty;
var __template = (cooked, raw) => __freeze(__defProp(cooked, "raw", { value: __freeze(cooked.slice()) }));
var _a;
const prerender = false;
const $$Work = createComponent(($$result, $$props, $$slots) => {
  const GAL = galleryCount() ? listGallery().map((r) => ({ src: r.url, title: r.title || "", category: r.category || "" })) : GALLERY;
  const featuredCats = ["3D Character", "3D Render", "Brand World", "Live Site"];
  let ringImages = GAL.filter((g) => featuredCats.includes(g.category)).map((g) => g.src).slice(0, 16);
  if (ringImages.length < 6) ringImages = GAL.map((g) => g.src).slice(0, 16);
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Work \u2014 Visual Index \xB7 Inovision Studios", "description": "A visual index of Inovision Studios: 3D character renders, brand worlds, product and architectural renders, web and device mockups, and identity systems." }, { "default": ($$result2) => renderTemplate(_a || (_a = __template([" ", '<div class="studio"> <div class="studio-aurora"></div> <div class="studio-grain"></div> ', ' <!-- DISTINCT WORK HERO + 3D RING --> <header class="work-hero"> <nav class="iv-crumb" aria-label="Breadcrumb"><a href="/">Home</a><span class="sep">/</span><span class="cur">Work</span></nav> <p class="s-kicker reveal">The visual index</p> <h1 class="s-display reveal reveal-d1">\nEvery <span class="s-grad-text">pixel</span>, on the record.\n</h1> <p class="s-lead reveal reveal-d2"> ', ' pieces \u2014 3D renders, brand worlds, product and\n        architecture, web and device. Spin the ring. Open anything.\n</p> <div class="gr-section reveal reveal-d3" style="margin-top:1.5rem;"> <div class="gr-stage"> ', ' <div class="gr-hint"><b>Drag</b> to explore</div> </div> </div> </header> <hr class="s-rule"> <!-- FULL GALLERY WALL --> <section class="s-section" id="all"> <div class="s-wrap"> <div class="s-head" style="margin-bottom:1rem;"> <p class="s-kicker reveal">The full archive</p> <h2 class="s-display reveal reveal-d1">\nBrowse the <span class="s-grad-text">whole world.</span> </h2> </div> <div class="reveal reveal-d2"> ', " </div> </div> </section> ", ' </div> <script>\n    (function () {\n      var io = new IntersectionObserver(\n        function (entries) {\n          entries.forEach(function (e) {\n            if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }\n          });\n        },\n        { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }\n      );\n      document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });\n    })();\n  <\/script> '])), maybeRenderHead(), renderComponent($$result2, "Nav", Nav, { "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/Nav", "client:component-export": "default" }), GAL.length, renderComponent($$result2, "GalleryRing", GalleryRing, { "images": ringImages, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/components/GalleryRing", "client:component-export": "default" }), renderComponent($$result2, "GalleryWall", GalleryWall, { "data": GAL, "client:visible": true, "client:component-hydration": "visible", "client:component-path": "@/components/GalleryWall", "client:component-export": "default" }), renderComponent($$result2, "Footer", Footer, {})) })}`;
}, "D:/wix/Inovision/web/src/pages/work.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/work.astro";
const $$url = "/work";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Work,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
