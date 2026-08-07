import { f as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/Base_-4rjFWta.mjs';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { N as Nav, F as Footer } from '../chunks/Footer_CTcSx4kn.mjs';
import { B as Breadcrumbs } from '../chunks/Breadcrumbs_CbOPbxvn.mjs';
import { useRef, useEffect } from 'react';
import { R as Reveal } from '../chunks/Reveal_Bpa_el4Q.mjs';
import { M as Magnetic } from '../chunks/Magnetic_DTfGLSqE.mjs';
import { g as getSettings } from '../chunks/db_xJ927fmw.mjs';
export { renderers } from '../renderers.mjs';

function Tilt3D({
  children,
  className,
  style,
  intensity = 8,
  glare = true
}) {
  const ref = useRef(null);
  const glareRef = useRef(null);
  const rafRef = useRef(null);
  const enabled = useRef(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fineCursor = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      enabled.current = fineCursor.matches && !reduced.matches;
      if (!enabled.current) {
        el.style.transform = "";
        if (glareRef.current) glareRef.current.style.opacity = "0";
      }
    };
    update();
    fineCursor.addEventListener("change", update);
    reduced.addEventListener("change", update);
    let mouseX = 0;
    let mouseY = 0;
    let tx = 0;
    let ty = 0;
    let active = false;
    const animate = () => {
      tx += (mouseX - tx) * 0.15;
      ty += (mouseY - ty) * 0.15;
      const rotX = (-ty * intensity).toFixed(2);
      const rotY = (tx * intensity).toFixed(2);
      el.style.transform = `perspective(1100px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(0)`;
      if (glare && glareRef.current) {
        const gx = 50 + tx * 60;
        const gy = 50 + ty * 60;
        glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18) 0%, transparent 55%)`;
        glareRef.current.style.opacity = active ? "1" : "0";
      }
      if (active || Math.abs(mouseX - tx) > 1e-3 || Math.abs(mouseY - ty) > 1e-3) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        rafRef.current = null;
      }
    };
    const onMove = (e) => {
      if (!enabled.current) return;
      const rect = el.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      active = true;
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(animate);
    };
    const onLeave = () => {
      if (!enabled.current) return;
      mouseX = 0;
      mouseY = 0;
      active = false;
      if (rafRef.current == null) rafRef.current = requestAnimationFrame(animate);
    };
    el.addEventListener("pointermove", onMove);
    el.addEventListener("pointerleave", onLeave);
    return () => {
      el.removeEventListener("pointermove", onMove);
      el.removeEventListener("pointerleave", onLeave);
      fineCursor.removeEventListener("change", update);
      reduced.removeEventListener("change", update);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [intensity, glare]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref,
      className: `iv-tilt ${className ?? ""}`,
      style: {
        transformStyle: "preserve-3d",
        willChange: "transform",
        transition: "transform 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
        ...style
      },
      children: [
        glare && /* @__PURE__ */ jsx(
          "div",
          {
            ref: glareRef,
            "aria-hidden": "true",
            style: {
              position: "absolute",
              inset: 0,
              pointerEvents: "none",
              opacity: 0,
              transition: "opacity 0.3s ease",
              zIndex: 2,
              mixBlendMode: "overlay"
            }
          }
        ),
        children
      ]
    }
  );
}

const SITE_URL = "https://inovisionstudios.com";
const principles = [
  {
    n: "01",
    title: "Inevitable, not loud",
    body: "The best design feels like it was always there. We aim for inevitability over cleverness — sites that read effortlessly the first time and still hold up the hundredth."
  },
  {
    n: "02",
    title: "Mobile is the canvas",
    body: "We start at 360 px and refine outward. Phone-first isn't a constraint — it's where 90% of vape and smoke shop customers live, and it forces us to cut everything that isn't earning its place."
  },
  {
    n: "03",
    title: "Editorial typography",
    body: "Type does most of the work in luxury design. We pair display serifs with refined sans, sweat the letter-spacing, balance every line, and let the headline breathe."
  },
  {
    n: "04",
    title: "Craft over template",
    body: "We don't ship templated work. Every project gets a custom layout, a custom palette, custom motion, and a custom component library. The investment shows."
  },
  {
    n: "05",
    title: "Conversion is craft",
    body: "Beautiful that doesn't move product is decoration. We measure success in walk-ins, online orders, and product sales — and design backwards from those."
  },
  {
    n: "06",
    title: "Stay in the work",
    body: "Small team, limited slots, deep focus. We work with a handful of clients each year so every project gets the founder's full attention from kickoff through launch."
  }
];
const capabilities = [
  {
    label: "Web",
    title: "Web Design",
    body: "Editorial layouts, age-gated commerce, product catalogs, and refined interactions that match the brand's shop."
  },
  {
    label: "Brand",
    title: "Brand Identity",
    body: "Wordmarks, palette systems, typographic voice, and the rules that hold every touchpoint together over time."
  },
  {
    label: "Print",
    title: "Print & Packaging",
    body: "Packaging, labels, lookbooks, and in-store signage. The same editorial sensibility, on physical objects."
  },
  {
    label: "Mobile",
    title: "Mobile Experiences",
    body: "Phone-first design and build. We test on real devices before we ship, not in a browser inspector."
  },
  {
    label: "Character",
    title: "Character Design",
    body: "Original mascots and brand characters that become the soul of a brand. Pixar-quality craft, original IP."
  },
  {
    label: "Strategy",
    title: "Brand Strategy",
    body: "Positioning, voice, audience, and the underlying story. We dig into the brief before we open a design file."
  }
];
const aboutJsonLd = {
  "@context": "https://schema.org",
  "@type": "AboutPage",
  url: `${SITE_URL}/about`,
  mainEntity: {
    "@type": "Person",
    name: "Bartlomiej Krawiecki",
    jobTitle: "Founder & Creative Director",
    worksFor: { "@id": `${SITE_URL}/#organization` },
    image: `${SITE_URL}/bartlomiejkrawiecki.webp`,
    knowsAbout: [
      "Web Design",
      "Vape Shop Web Design",
      "Smoke Shop Branding",
      "Vape Brand Design",
      "Typography",
      "Mobile UX",
      "Brand Identity"
    ]
  }
};
function AboutPage({ founderImg }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("section", { className: "iv-section", style: { paddingTop: 130 }, children: /* @__PURE__ */ jsxs("div", { className: "iv-container", children: [
        /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { name: "Home", href: "/" },
              { name: "About", href: "/about" }
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Reveal, { className: "iv-section-head", style: { maxWidth: 780 }, children: [
          /* @__PURE__ */ jsx("div", { className: "iv-eyebrow", children: "The Studio" }),
          /* @__PURE__ */ jsxs("h1", { children: [
            "A small studio. ",
            /* @__PURE__ */ jsx("em", { children: "Big standards." })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { color: "#bcbcbc", marginTop: 16, fontSize: 17, lineHeight: 1.65 }, children: "Inovision Studios is a boutique design practice based in the American Midwest. We build sophisticated, mobile-first websites and brand systems for vape shops, smoke shops, and premium vape brands who care about how their store looks when no one's looking." })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "iv-studio-hero", style: { marginTop: 64 }, children: [
          /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx(Tilt3D, { intensity: 5, className: "iv-studio-hero-image", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: founderImg || "/bartlomiejkrawiecki.webp",
              alt: "Bartlomiej Krawiecki, Founder & Creative Director of Inovision Studios",
              width: 720,
              height: 900,
              sizes: "(max-width: 860px) 100vw, 45vw"
            }
          ) }) }),
          /* @__PURE__ */ jsxs(Reveal, { children: [
            /* @__PURE__ */ jsx("div", { className: "iv-eyebrow", children: "Founder" }),
            /* @__PURE__ */ jsx(
              "h3",
              {
                style: {
                  fontFamily: "var(--font-display), serif",
                  fontSize: "2.1rem",
                  fontWeight: 400,
                  marginBottom: 10,
                  letterSpacing: "-0.02em",
                  lineHeight: 1.1
                },
                children: "Bartlomiej Krawiecki"
              }
            ),
            /* @__PURE__ */ jsx(
              "p",
              {
                style: {
                  color: "var(--accent)",
                  marginBottom: 24,
                  fontSize: 12,
                  letterSpacing: 1.8,
                  textTransform: "uppercase"
                },
                children: "Founder & Creative Director"
              }
            ),
            /* @__PURE__ */ jsx("p", { style: { marginBottom: 16, color: "#cfcfcf" }, children: "I founded Inovision Studios on the belief that the best digital experiences feel inevitable — where brand, craft, and technology meet at the highest level. Most of the web feels assembled. We try to make work that feels designed." }),
            /* @__PURE__ */ jsx("p", { style: { marginBottom: 16, color: "#cfcfcf" }, children: "My background is half graphic design, half digital product. I've spent years at the intersection of typography, motion, and modern web architecture — and I bring all of it into every project, whether it's a single-page vape shop launch or a full brand identity system." }),
            /* @__PURE__ */ jsx("p", { style: { color: "#cfcfcf" }, children: "We work with a deliberately small number of clients each year so every project receives obsessive attention and care. If you're here, we probably already share an aesthetic." })
          ] })
        ] })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "iv-container", children: /* @__PURE__ */ jsx("div", { className: "iv-divider" }) }),
      /* @__PURE__ */ jsx(
        "section",
        {
          className: "iv-section",
          style: { background: "var(--surface-2)" },
          children: /* @__PURE__ */ jsxs("div", { className: "iv-container", children: [
            /* @__PURE__ */ jsxs(
              Reveal,
              {
                className: "iv-section-head",
                style: { maxWidth: 720, marginBottom: 18 },
                children: [
                  /* @__PURE__ */ jsx("div", { className: "iv-eyebrow", children: "Manifesto" }),
                  /* @__PURE__ */ jsxs("h2", { children: [
                    "What we ",
                    /* @__PURE__ */ jsx("em", { children: "believe." })
                  ] }),
                  /* @__PURE__ */ jsx("p", { style: { color: "#aaa", marginTop: 14 }, children: "Six convictions that shape every project we take on. We won't budge on these — and that's exactly what makes the work feel coherent." })
                ]
              }
            ),
            /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs("blockquote", { className: "iv-pullquote", style: { margin: "40px 0 56px", maxWidth: 820 }, children: [
              "“We'd rather ship one extraordinary website than ten competent ones. Most studios optimize for volume.",
              " ",
              /* @__PURE__ */ jsx("em", { children: "We optimize for the room it walks into." }),
              "”",
              /* @__PURE__ */ jsx("span", { className: "iv-pullquote-attr", children: "Bartlomiej Krawiecki · Founder" })
            ] }) }),
            /* @__PURE__ */ jsx("div", { className: "iv-principles", children: principles.map((p) => /* @__PURE__ */ jsxs(Reveal, { className: "iv-principle", children: [
              /* @__PURE__ */ jsx("span", { className: "num", children: p.n }),
              /* @__PURE__ */ jsx("h3", { children: p.title }),
              /* @__PURE__ */ jsx("p", { children: p.body })
            ] }, p.n)) })
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "iv-container", children: /* @__PURE__ */ jsx("div", { className: "iv-divider" }) }),
      /* @__PURE__ */ jsx("section", { className: "iv-section", children: /* @__PURE__ */ jsxs("div", { className: "iv-container", children: [
        /* @__PURE__ */ jsxs(
          Reveal,
          {
            className: "iv-section-head",
            style: { maxWidth: 720, marginBottom: 36 },
            children: [
              /* @__PURE__ */ jsx("div", { className: "iv-eyebrow", children: "Capabilities" }),
              /* @__PURE__ */ jsxs("h2", { children: [
                "What we make, ",
                /* @__PURE__ */ jsx("em", { children: "end to end." })
              ] }),
              /* @__PURE__ */ jsx("p", { style: { color: "#aaa", marginTop: 14 }, children: "We move fluidly between web, brand, packaging, and motion. Most engagements touch more than one. The advantage of a small, generalist studio is that you don't have to manage a handoff between three vendors." })
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { className: "iv-capabilities", children: capabilities.map((c) => /* @__PURE__ */ jsxs(Reveal, { className: "iv-cap", children: [
          /* @__PURE__ */ jsx("div", { className: "iv-cap-label", children: c.label }),
          /* @__PURE__ */ jsx("h3", { children: c.title }),
          /* @__PURE__ */ jsx("p", { children: c.body })
        ] }, c.title)) })
      ] }) }),
      /* @__PURE__ */ jsx("div", { className: "iv-container", children: /* @__PURE__ */ jsx("div", { className: "iv-divider granite" }) }),
      /* @__PURE__ */ jsx(
        "section",
        {
          className: "iv-section",
          style: { background: "var(--surface-2)" },
          children: /* @__PURE__ */ jsxs("div", { className: "iv-container", children: [
            /* @__PURE__ */ jsxs(
              Reveal,
              {
                className: "iv-section-head",
                style: { maxWidth: 720 },
                children: [
                  /* @__PURE__ */ jsx("div", { className: "iv-eyebrow", children: "Who We Work With" }),
                  /* @__PURE__ */ jsxs("h2", { children: [
                    "Ambitious operators. ",
                    /* @__PURE__ */ jsx("em", { children: "Patient owners." })
                  ] })
                ]
              }
            ),
            /* @__PURE__ */ jsxs("div", { className: "iv-two-col", style: { marginTop: 32 }, children: [
              /* @__PURE__ */ jsxs(Reveal, { children: [
                /* @__PURE__ */ jsx("p", { style: { color: "#cfcfcf", marginBottom: 18 }, children: "Our best work happens with clients who already understand that design is part of how a brand makes money — not a finishing layer applied at the end. The vape shops and smoke shops we've worked with all share a few traits:" }),
                /* @__PURE__ */ jsxs(
                  "ul",
                  {
                    style: {
                      color: "#cfcfcf",
                      paddingLeft: 22,
                      margin: "0 0 22px",
                      display: "grid",
                      gap: 10
                    },
                    children: [
                      /* @__PURE__ */ jsx("li", { children: "They have a clear point of view about what they sell." }),
                      /* @__PURE__ */ jsx("li", { children: "They've invested in the physical space or product first." }),
                      /* @__PURE__ */ jsx("li", { children: "They want the digital presence to match — not lag." }),
                      /* @__PURE__ */ jsx("li", { children: "They give honest, decisive feedback." }),
                      /* @__PURE__ */ jsx("li", { children: "They understand timelines and respect process." })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("p", { style: { color: "#cfcfcf" }, children: "If that sounds like you, the conversation usually starts easily. Send us a note from the contact page — even a rough one — and we'll reply within a business day." })
              ] }),
              /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 12,
                    padding: 32
                  },
                  children: [
                    /* @__PURE__ */ jsx("div", { className: "iv-eyebrow", children: "Reach" }),
                    /* @__PURE__ */ jsx(
                      "h3",
                      {
                        style: {
                          fontFamily: "var(--font-display), serif",
                          fontSize: "1.6rem",
                          fontWeight: 400,
                          letterSpacing: "-0.01em",
                          marginBottom: 14
                        },
                        children: "Based in the Midwest. Working nationwide."
                      }
                    ),
                    /* @__PURE__ */ jsx("p", { style: { color: "var(--muted)", fontSize: 14, marginBottom: 18 }, children: "Most engagements run fully remote — kickoff and presentations over video, async feedback through shared documents and live design files. We travel for the occasional flagship engagement." }),
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        style: {
                          display: "grid",
                          gridTemplateColumns: "1fr 1fr",
                          gap: 14,
                          marginTop: 18,
                          paddingTop: 18,
                          borderTop: "1px solid var(--border)"
                        },
                        children: [
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx("div", { className: "iv-eyebrow", children: "Founded" }),
                            /* @__PURE__ */ jsx("div", { style: { color: "#f5f3ee", fontSize: 15 }, children: "2024" })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx("div", { className: "iv-eyebrow", children: "Slots / Year" }),
                            /* @__PURE__ */ jsx("div", { style: { color: "#f5f3ee", fontSize: 15 }, children: "~12" })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx("div", { className: "iv-eyebrow", children: "Verticals" }),
                            /* @__PURE__ */ jsx("div", { style: { color: "#f5f3ee", fontSize: 15 }, children: "Vape, Smoke, Glass" })
                          ] }),
                          /* @__PURE__ */ jsxs("div", { children: [
                            /* @__PURE__ */ jsx("div", { className: "iv-eyebrow", children: "Avg Engagement" }),
                            /* @__PURE__ */ jsx("div", { style: { color: "#f5f3ee", fontSize: 15 }, children: "5–9 wks" })
                          ] })
                        ]
                      }
                    )
                  ]
                }
              ) })
            ] })
          ] })
        }
      ),
      /* @__PURE__ */ jsx("div", { className: "iv-container", children: /* @__PURE__ */ jsx("div", { className: "iv-divider" }) }),
      /* @__PURE__ */ jsx("section", { className: "iv-section", style: { textAlign: "center" }, children: /* @__PURE__ */ jsx("div", { className: "iv-container-narrow", children: /* @__PURE__ */ jsxs(Reveal, { children: [
        /* @__PURE__ */ jsx("div", { className: "iv-eyebrow", style: { justifyContent: "center" }, children: "Begin" }),
        /* @__PURE__ */ jsxs(
          "h2",
          {
            className: "iv-display iv-display-lg",
            style: { marginBottom: 18 },
            children: [
              "Ready to start the ",
              /* @__PURE__ */ jsx("em", { children: "conversation?" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("p", { style: { color: "#aaa", marginBottom: 28 }, children: "Tell us about your brand. We reply within one business day — usually faster." }),
        /* @__PURE__ */ jsx(Magnetic, { children: /* @__PURE__ */ jsx("a", { href: "/contact", className: "iv-hero-cta", children: "Start a Project" }) })
      ] }) }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {}),
    /* @__PURE__ */ jsx(
      "script",
      {
        type: "application/ld+json",
        dangerouslySetInnerHTML: { __html: JSON.stringify(aboutJsonLd) }
      }
    )
  ] });
}

const prerender = false;
const $$About = createComponent(($$result, $$props, $$slots) => {
  const S = getSettings();
  const founderImg = S["content.about.founder"] || "/bartlomiejkrawiecki.webp";
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "About \u2014 Inovision Studios \xB7 Custom Web Design, AI & SEO", "description": "Inovision Studios is a boutique creative-technology studio in Warren, Michigan \u2014 custom web design, AI integrations, and SEO for small business and enterprise. Meet the team and the process behind the work." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AboutPage", AboutPage, { "founderImg": founderImg, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/AboutPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/about.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/about.astro";
const $$url = "/about";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$About,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
