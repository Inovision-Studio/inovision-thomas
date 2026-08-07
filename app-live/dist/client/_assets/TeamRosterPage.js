import { j as e } from "./jsx-runtime.ClP7wGfN.js";
import { N as Nav } from "./Nav.sZqEGKhi.js";
import { B as Breadcrumbs, F as Footer } from "./Breadcrumbs.CwXZO9UN.js";
import { R as Reveal } from "./Reveal.B3f00t5K.js";

function TeamRosterPage({ members }) {
  return e.jsxs(e.Fragment, { children: [
    e.jsx(Nav, {}),
    e.jsxs("main", { children: [
      e.jsx("section", { className: "iv-section", style: { paddingTop: 130, paddingBottom: 100 }, children: e.jsxs("div", { className: "iv-container", children: [
        e.jsx(Breadcrumbs, { items: [{ name: "Home", href: "/" }, { name: "Team", href: "/team" }] }),
        e.jsxs(Reveal, { className: "iv-section-head", style: { maxWidth: 780 }, children: [
          e.jsx("div", { className: "iv-eyebrow", children: "The People" }),
          e.jsxs("h1", { children: ["Meet the ", e.jsx("em", { children: "team." })] }),
          e.jsx("p", { style: { color: "#bcbcbc", marginTop: 16, fontSize: 17, lineHeight: 1.65 }, children: "The people behind the work." })
        ] }),
        (members || []).length === 0
          ? e.jsx(Reveal, { children: e.jsx("p", { style: { color: "#aaa", marginTop: 48 }, children: "Team roster coming soon." }) })
          : e.jsx("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 28, marginTop: 56 }, children: members.map((m) => e.jsxs(Reveal, { children: [
              e.jsx("div", { style: { aspectRatio: "3 / 4", borderRadius: 12, overflow: "hidden", background: "var(--surface-2)", marginBottom: 16 }, children: m.image ? e.jsx("img", { src: m.image, alt: m.name, style: { width: "100%", height: "100%", objectFit: "cover" } }) : null }),
              e.jsx("h3", { style: { fontFamily: "var(--font-display), serif", fontSize: "1.3rem", fontWeight: 400, marginBottom: 4, letterSpacing: "-0.01em" }, children: m.name }),
              m.title ? e.jsx("p", { style: { color: "var(--accent)", fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" }, children: m.title }) : null
            ] }, m.id)) })
      ] }) })
    ] }),
    e.jsx(Footer, {})
  ] });
}

export { TeamRosterPage as default };
