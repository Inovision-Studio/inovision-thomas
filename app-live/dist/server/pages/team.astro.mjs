import { f as createComponent, k as renderComponent, r as renderTemplate } from '../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../chunks/Base_-4rjFWta.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { N as Nav, F as Footer } from '../chunks/Footer_CTcSx4kn.mjs';
import { B as Breadcrumbs } from '../chunks/Breadcrumbs_CbOPbxvn.mjs';
import { R as Reveal } from '../chunks/Reveal_Bpa_el4Q.mjs';
import { listTeamMembers } from '../chunks/db_xJ927fmw.mjs';
export { renderers } from '../renderers.mjs';

function TeamRosterPage({ members }) {
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx(Nav, {}),
    /* @__PURE__ */ jsxs("main", { children: [
      /* @__PURE__ */ jsx("section", { className: "iv-section", style: { paddingTop: 130, paddingBottom: 100 }, children: /* @__PURE__ */ jsxs("div", { className: "iv-container", children: [
        /* @__PURE__ */ jsx(
          Breadcrumbs,
          {
            items: [
              { name: "Home", href: "/" },
              { name: "Team", href: "/team" }
            ]
          }
        ),
        /* @__PURE__ */ jsxs(Reveal, { className: "iv-section-head", style: { maxWidth: 780 }, children: [
          /* @__PURE__ */ jsx("div", { className: "iv-eyebrow", children: "The People" }),
          /* @__PURE__ */ jsxs("h1", { children: [
            "Meet the ",
            /* @__PURE__ */ jsx("em", { children: "team." })
          ] }),
          /* @__PURE__ */ jsx("p", { style: { color: "#bcbcbc", marginTop: 16, fontSize: 17, lineHeight: 1.65 }, children: "The people behind the work." })
        ] }),
        members.length === 0 ? /* @__PURE__ */ jsx(Reveal, { children: /* @__PURE__ */ jsx("p", { style: { color: "#aaa", marginTop: 48 }, children: "Team roster coming soon." }) }) : /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              gap: 28,
              marginTop: 56
            },
            children: members.map((m) => /* @__PURE__ */ jsxs(Reveal, { children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    aspectRatio: "3 / 4",
                    borderRadius: 12,
                    overflow: "hidden",
                    background: "var(--surface-2)",
                    marginBottom: 16
                  },
                  children: m.image ? /* @__PURE__ */ jsx("img", { src: m.image, alt: m.name, style: { width: "100%", height: "100%", objectFit: "cover" } }) : null
                }
              ),
              /* @__PURE__ */ jsx(
                "h3",
                {
                  style: {
                    fontFamily: "var(--font-display), serif",
                    fontSize: "1.3rem",
                    fontWeight: 400,
                    marginBottom: 4,
                    letterSpacing: "-0.01em"
                  },
                  children: m.name
                }
              ),
              m.title ? /* @__PURE__ */ jsx(
                "p",
                {
                  style: {
                    color: "var(--accent)",
                    fontSize: 12,
                    letterSpacing: 1.2,
                    textTransform: "uppercase"
                  },
                  children: m.title
                }
              ) : null
            ] }, m.id))
          }
        )
      ] }) })
    ] }),
    /* @__PURE__ */ jsx(Footer, {})
  ] });
}

const prerender = false;
const $$Team = createComponent(($$result, $$props, $$slots) => {
  const members = listTeamMembers();
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Team \u2014 Inovision Studios", "description": "Meet the team behind Inovision Studios." }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "TeamRosterPage", TeamRosterPage, { "members": members, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/TeamRosterPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/team.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/team.astro";
const $$url = "/team";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Team,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
