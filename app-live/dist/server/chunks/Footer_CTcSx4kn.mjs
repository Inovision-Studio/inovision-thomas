import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import { useState, useEffect } from 'react';
import { g as getSettings } from './db_xJ927fmw.mjs';

function Logo() {
  return /* @__PURE__ */ jsxs("div", { className: "iv-logo", children: [
    /* @__PURE__ */ jsx("span", { className: "iv-logo-main", children: "INOVISION" }),
    /* @__PURE__ */ jsx("span", { className: "iv-logo-sub", children: "STUDIOS" })
  ] });
}

const usePathname = () => typeof window !== "undefined" ? window.location.pathname : "/";
const links = [
  { href: "/work", label: "Work" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/news", label: "News" },
  { href: "/blog", label: "Journal" },
  { href: "/careers", label: "Careers" },
  { href: "/faq", label: "FAQ" },
  { href: "/team", label: "Team" },
  { href: "/contact", label: "Contact" }
];
function Nav() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 6);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const close = () => setOpen(false);
  const isActive = (href) => href === "/" ? pathname === "/" : pathname.startsWith(href);
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("nav", { className: `nv ${scrolled ? "nv-scrolled" : ""}`, children: /* @__PURE__ */ jsxs("div", { className: "nv-pill", children: [
      /* @__PURE__ */ jsx("a", { href: "/", className: "nv-logo", "aria-label": "Inovision Studios — Home", children: /* @__PURE__ */ jsx(Logo, {}) }),
      /* @__PURE__ */ jsx("div", { className: "nv-links", children: links.map((l) => /* @__PURE__ */ jsx(
        "a",
        {
          href: l.href,
          className: isActive(l.href) ? "active" : "",
          children: l.label
        },
        l.href
      )) }),
      /* @__PURE__ */ jsx("a", { href: "/portal", className: "nv-portal", children: "Client Login" }),
      /* @__PURE__ */ jsx("a", { href: "/start", className: "nv-cta", children: "Start a project" }),
      /* @__PURE__ */ jsxs(
        "button",
        {
          type: "button",
          "aria-label": "Menu",
          "aria-expanded": open,
          className: `nv-burger ${open ? "on" : ""}`,
          onClick: () => setOpen((v) => !v),
          children: [
            /* @__PURE__ */ jsx("span", {}),
            /* @__PURE__ */ jsx("span", {})
          ]
        }
      )
    ] }) }),
    /* @__PURE__ */ jsxs("div", { className: `nv-overlay ${open ? "on" : ""}`, "aria-hidden": !open, children: [
      /* @__PURE__ */ jsx("div", { className: "nv-overlay-bg", "aria-hidden": "true" }),
      /* @__PURE__ */ jsxs("nav", { className: "nv-menu", children: [
        links.map((l, i) => /* @__PURE__ */ jsxs(
          "a",
          {
            href: l.href,
            onClick: close,
            className: `nv-mlink ${isActive(l.href) ? "active" : ""}`,
            style: { ["--i"]: i },
            children: [
              /* @__PURE__ */ jsx("span", { className: "nv-mnum", children: String(i + 1).padStart(2, "0") }),
              /* @__PURE__ */ jsx("span", { className: "nv-mlabel", children: l.label }),
              /* @__PURE__ */ jsx("span", { className: "nv-marrow", "aria-hidden": "true", children: "↗" })
            ]
          },
          l.href
        )),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/start",
            onClick: close,
            className: "nv-mcta",
            style: { ["--i"]: links.length },
            children: [
              "Start a project ",
              /* @__PURE__ */ jsx("span", { className: "ico", children: "→" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "a",
          {
            href: "/portal",
            onClick: close,
            className: "nv-mportal",
            style: { ["--i"]: links.length + 1 },
            children: [
              "Client Portal Login ",
              /* @__PURE__ */ jsx("span", { className: "ico", children: "→" })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "nv-mfoot",
            style: { ["--i"]: links.length + 2 },
            children: [
              /* @__PURE__ */ jsx("span", { className: "nv-mfoot-h", children: "Inovision Studios" }),
              /* @__PURE__ */ jsx("a", { className: "nv-mfoot-link", href: "mailto:Inovisionstudiosllc@gmail.com", onClick: close, children: "Inovisionstudiosllc@gmail.com" }),
              /* @__PURE__ */ jsx(
                "a",
                {
                  className: "nv-mfoot-link",
                  href: "https://www.google.com/maps/search/?api=1&query=445+S+Livernois+Rd+Suite+333+Rochester+Hills+MI+48307",
                  target: "_blank",
                  rel: "noreferrer",
                  onClick: close,
                  children: "445 S Livernois Rd, Suite 333, Rochester Hills, MI 48307"
                }
              ),
              /* @__PURE__ */ jsx("a", { className: "nv-mfoot-link nv-mfoot-sx", href: "#", target: "_blank", rel: "noreferrer", onClick: close, children: "Powered by DAIEJA 2.0" })
            ]
          }
        )
      ] })
    ] })
  ] });
}

function SmileyAdmin() {
  const [exploding, setExploding] = useState(false);
  function handleClick(e) {
    e.preventDefault();
    if (exploding) return;
    setExploding(true);
    setTimeout(() => {
      window.location.href = "/admin/login";
    }, 620);
  }
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href: "/admin/login",
      onClick: handleClick,
      "aria-label": "Studio admin",
      title: "hello",
      className: `iv-smiley ${exploding ? "boom" : ""}`,
      children: [
        /* @__PURE__ */ jsx("span", { className: "iv-smiley-face", "aria-hidden": "true", children: ":)" }),
        exploding && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx("span", { className: "iv-smiley-particle p1", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "iv-smiley-particle p2", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "iv-smiley-particle p3", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "iv-smiley-particle p4", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "iv-smiley-particle p5", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "iv-smiley-particle p6", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "iv-smiley-particle p7", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "iv-smiley-particle p8", "aria-hidden": "true" }),
          /* @__PURE__ */ jsx("span", { className: "iv-smiley-flash", "aria-hidden": "true" })
        ] })
      ]
    }
  );
}

const year = (/* @__PURE__ */ new Date()).getFullYear();
const CONTACT_EMAIL = "Inovisionstudiosllc@gmail.com";
const SOCIAL_LINKS = [
  { k: "instagram", label: "Instagram", icon: "/social-instagram.webp" },
  { k: "facebook", label: "Facebook", icon: "/social-facebook.webp" },
  { k: "x", label: "X", icon: "/social-x.webp" },
  { k: "linkedin", label: "LinkedIn", icon: "/social-linkedin.webp" },
  { k: "youtube", label: "YouTube", icon: "/social-youtube.webp" }
];
function socialUrls() {
  try {
    const s = getSettings();
    return {
      instagram: s["content.social.instagram"] || "",
      facebook: s["content.social.facebook"] || "",
      x: s["content.social.x"] || "",
      linkedin: s["content.social.linkedin"] || "",
      youtube: s["content.social.youtube"] || ""
    };
  } catch {
    return { instagram: "", facebook: "", x: "", linkedin: "", youtube: "" };
  }
}
function Footer() {
  return /* @__PURE__ */ jsxs("footer", { className: "iv-footer", children: [
    /* @__PURE__ */ jsxs("div", { className: "iv-footer-grid", children: [
      /* @__PURE__ */ jsxs("div", { className: "iv-footer-col", children: [
        /* @__PURE__ */ jsx("a", { href: "/", className: "block mb-3", children: /* @__PURE__ */ jsx(Logo, {}) }),
        /* @__PURE__ */ jsx("p", { style: { maxWidth: 320 }, children: "Cutting-edge graphic design and web for vape shops, smoke shops, and premium vape brands." }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              marginTop: 16,
              display: "flex",
              gap: 18,
              alignItems: "center"
            },
            children: SOCIAL_LINKS.map((s) => {
              const href = socialUrls()[s.k];
              if (!href) return null;
              return /* @__PURE__ */ jsx(
                "a",
                {
                  href,
                  "aria-label": s.label,
                  target: "_blank",
                  rel: "noopener noreferrer me",
                  children: /* @__PURE__ */ jsx(
                    "img",
                    {
                      src: s.icon,
                      alt: s.label,
                      width: 18,
                      height: 18,
                      loading: "lazy",
                      style: { opacity: 0.85 }
                    }
                  )
                },
                s.k
              );
            })
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "iv-footer-col", children: [
        /* @__PURE__ */ jsx("h4", { children: "EXPLORE" }),
        /* @__PURE__ */ jsx("a", { href: "/", children: "Work" }),
        /* @__PURE__ */ jsx("a", { href: "/pricing", children: "Pricing" }),
        /* @__PURE__ */ jsx("a", { href: "/about", children: "About" }),
        /* @__PURE__ */ jsx("a", { href: "/blog", children: "Journal" }),
        /* @__PURE__ */ jsx("a", { href: "/careers", children: "Careers" }),
        /* @__PURE__ */ jsx("a", { href: "/start", children: "Start a project" }),
        /* @__PURE__ */ jsx("a", { href: "/portal", children: "Client Portal →" })
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "iv-footer-col", children: [
        /* @__PURE__ */ jsx("h4", { children: "CONTACT" }),
        /* @__PURE__ */ jsx("a", { href: `mailto:${CONTACT_EMAIL}`, children: CONTACT_EMAIL }),
        /* @__PURE__ */ jsxs("p", { style: { marginTop: 8, fontSize: 13, lineHeight: 1.5 }, children: [
          "445 S Livernois Rd, Suite 333",
          /* @__PURE__ */ jsx("br", {}),
          "Rochester Hills, MI 48307"
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "iv-footer-bottom", children: [
      /* @__PURE__ */ jsxs("div", { className: "iv-footer-line", children: [
        "© ",
        year,
        " Inovision Studio. All rights reserved. · Powered by",
        " ",
        /* @__PURE__ */ jsx(
          "a",
          {
            href: "#",
            target: "_blank",
            rel: "noopener noreferrer",
            className: "iv-footer-sophiaxt",
            children: "DAIEJA 2.0"
          }
        )
      ] }),
      /* @__PURE__ */ jsxs("div", { className: "iv-footer-legal", children: [
        /* @__PURE__ */ jsx("a", { href: "/privacy", children: "Privacy Policy" }),
        /* @__PURE__ */ jsx("a", { href: "/terms", children: "Terms" }),
        /* @__PURE__ */ jsx("a", { href: "/careers#apply", children: "Equal Opportunity" })
      ] }),
      /* @__PURE__ */ jsx("div", { className: "iv-footer-smiley-row", children: /* @__PURE__ */ jsx(SmileyAdmin, {}) })
    ] }),
    /* @__PURE__ */ jsxs("div", { className: "iv-map", children: [
      /* @__PURE__ */ jsx(
        "iframe",
        {
          className: "iv-map-frame",
          title: "Inovision Studios location",
          loading: "lazy",
          referrerPolicy: "no-referrer-when-downgrade",
          src: "https://maps.google.com/maps?q=445%20S%20Livernois%20Rd%20Suite%20333%20Rochester%20Hills%20MI%2048307&z=15&output=embed"
        }
      ),
      /* @__PURE__ */ jsx(
        "a",
        {
          className: "iv-map-veil",
          href: "https://www.google.com/maps/search/?api=1&query=445+S+Livernois+Rd+Suite+333+Rochester+Hills+MI+48307",
          target: "_blank",
          rel: "noreferrer",
          "aria-label": "Open Inovision Studios location in Google Maps",
          children: /* @__PURE__ */ jsxs("span", { className: "iv-map-card", children: [
            /* @__PURE__ */ jsx("b", { children: "Inovision Studios" }),
            /* @__PURE__ */ jsx("span", { children: "445 S Livernois Rd, Suite 333 · Rochester Hills, MI 48307" }),
            /* @__PURE__ */ jsx("i", { children: "Open in Maps ↗" })
          ] })
        }
      )
    ] })
  ] });
}

export { Footer as F, Nav as N };
