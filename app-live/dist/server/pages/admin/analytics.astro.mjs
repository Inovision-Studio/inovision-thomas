import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsxs, jsx } from 'react/jsx-runtime';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
import { m as messageCount, u as unreadCount, p as postCount, t as totalPostViews, a as topPostsByViews, e as eventsByDay, r as recentEvents, l as listPosts } from '../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../renderers.mjs';

function formatWhen(ts) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 6e4);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
}
function AdminAnalyticsPage({
  totalMessages,
  unread,
  totalPosts,
  publishedPosts,
  views,
  top,
  messageBars,
  viewBars,
  events,
  posts
}) {
  const postsById = new Map(posts.map((p) => [p.id, p]));
  const maxMsg = Math.max(1, ...messageBars.map((b) => b.count));
  const maxView = Math.max(1, ...viewBars.map((b) => b.count));
  return /* @__PURE__ */ jsxs(
    AdminShell,
    {
      active: "analytics",
      title: "Analytics",
      subtitle: "A simple, honest dashboard of what's happening.",
      children: [
        /* @__PURE__ */ jsxs("div", { className: "iv-stats", children: [
          /* @__PURE__ */ jsxs("div", { className: "iv-stat", children: [
            /* @__PURE__ */ jsx("div", { className: "iv-stat-label", children: "Messages" }),
            /* @__PURE__ */ jsx("div", { className: "iv-stat-value", children: totalMessages }),
            /* @__PURE__ */ jsxs("div", { className: "iv-stat-sub", children: [
              unread,
              " unread"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "iv-stat", children: [
            /* @__PURE__ */ jsx("div", { className: "iv-stat-label", children: "Posts" }),
            /* @__PURE__ */ jsx("div", { className: "iv-stat-value", children: totalPosts }),
            /* @__PURE__ */ jsxs("div", { className: "iv-stat-sub", children: [
              publishedPosts,
              " published"
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "iv-stat", children: [
            /* @__PURE__ */ jsx("div", { className: "iv-stat-label", children: "Post Views" }),
            /* @__PURE__ */ jsx("div", { className: "iv-stat-value", children: views }),
            /* @__PURE__ */ jsx("div", { className: "iv-stat-sub", children: "All-time" })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "iv-stat", children: [
            /* @__PURE__ */ jsx("div", { className: "iv-stat-label", children: "Last Activity" }),
            /* @__PURE__ */ jsx("div", { className: "iv-stat-value", style: { fontSize: "1.5rem" }, children: events[0] ? formatWhen(events[0].created_at) : "—" }),
            /* @__PURE__ */ jsx("div", { className: "iv-stat-sub", children: events[0] ? events[0].kind.replace(/_/g, " ") : "no events yet" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "iv-chart", children: [
          /* @__PURE__ */ jsx("h3", { children: "Inquiries — last 14 days" }),
          /* @__PURE__ */ jsx("div", { className: "iv-chart-bars", children: messageBars.map((b) => /* @__PURE__ */ jsx(
            "div",
            {
              className: `iv-chart-bar ${b.count === 0 ? "zero" : ""}`,
              style: { height: `${b.count / maxMsg * 100}%` },
              title: `${b.day}: ${b.count}`,
              children: b.count > 0 && /* @__PURE__ */ jsx("span", { className: "v", children: b.count })
            },
            b.day
          )) }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                marginTop: 10,
                fontSize: 10,
                color: "var(--muted)",
                letterSpacing: 1
              },
              children: [
                /* @__PURE__ */ jsx("span", { children: messageBars[0]?.day }),
                /* @__PURE__ */ jsx("span", { children: "Today" })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "iv-chart", children: [
          /* @__PURE__ */ jsx("h3", { children: "Post views — last 14 days" }),
          /* @__PURE__ */ jsx("div", { className: "iv-chart-bars", children: viewBars.map((b) => /* @__PURE__ */ jsx(
            "div",
            {
              className: `iv-chart-bar ${b.count === 0 ? "zero" : ""}`,
              style: { height: `${b.count / maxView * 100}%` },
              title: `${b.day}: ${b.count}`,
              children: b.count > 0 && /* @__PURE__ */ jsx("span", { className: "v", children: b.count })
            },
            b.day
          )) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "iv-chart", children: [
          /* @__PURE__ */ jsx("h3", { children: "Top posts" }),
          top.length === 0 ? /* @__PURE__ */ jsxs("p", { style: { color: "var(--muted)", fontSize: 14 }, children: [
            "No posts yet. ",
            /* @__PURE__ */ jsx("a", { href: "/admin/posts/new", children: "Write one" }),
            "."
          ] }) : /* @__PURE__ */ jsx("table", { className: "iv-posts-table", style: { margin: 0 }, children: /* @__PURE__ */ jsx("tbody", { children: top.map((p) => /* @__PURE__ */ jsxs("tr", { children: [
            /* @__PURE__ */ jsxs("td", { children: [
              /* @__PURE__ */ jsx("div", { className: "title", children: p.title }),
              /* @__PURE__ */ jsxs("div", { className: "meta", children: [
                "/blog/",
                p.slug
              ] })
            ] }),
            /* @__PURE__ */ jsx("td", { style: { width: 80, textAlign: "right", fontFamily: "var(--font-display), serif", fontStyle: "italic", fontSize: 18 }, children: p.views })
          ] }, p.id)) }) })
        ] }),
        /* @__PURE__ */ jsxs("div", { className: "iv-activity", children: [
          /* @__PURE__ */ jsx("h3", { children: "Recent activity" }),
          events.length === 0 ? /* @__PURE__ */ jsx("p", { style: { color: "var(--muted)", fontSize: 14 }, children: "Nothing tracked yet." }) : events.map((e) => {
            const label = e.kind === "message" ? "New inquiry" : e.kind === "post_view" ? "Post view" : "Page view";
            const target = e.post_id && postsById.has(e.post_id) ? `/blog/${postsById.get(e.post_id).slug}` : e.path || "—";
            return /* @__PURE__ */ jsxs("div", { className: "iv-activity-item", children: [
              /* @__PURE__ */ jsx("span", { className: "kind", children: label }),
              /* @__PURE__ */ jsx("span", { style: { color: "var(--text)" }, children: target }),
              /* @__PURE__ */ jsx("span", { className: "when", children: formatWhen(e.created_at) })
            ] }, e.id);
          })
        ] })
      ]
    }
  );
}

const prerender = false;
const $$Analytics = createComponent(($$result, $$props, $$slots) => {
  const totalMessages = messageCount();
  const unread = unreadCount();
  const totalPosts = postCount();
  const publishedPosts = postCount({ publishedOnly: true });
  const views = totalPostViews();
  const top = topPostsByViews(5);
  const messageBars = eventsByDay("message", 14);
  const viewBars = eventsByDay("post_view", 14);
  const events = recentEvents(20);
  const posts = listPosts({});
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Analytics \xB7 Inovision Studios", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AdminAnalyticsPage", AdminAnalyticsPage, { "totalMessages": totalMessages, "unread": unread, "totalPosts": totalPosts, "publishedPosts": publishedPosts, "views": views, "top": top, "messageBars": messageBars, "viewBars": viewBars, "events": events, "posts": posts, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/AdminAnalyticsPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/analytics.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/analytics.astro";
const $$url = "/admin/analytics";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Analytics,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
