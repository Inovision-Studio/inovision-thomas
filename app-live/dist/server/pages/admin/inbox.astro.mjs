import { f as createComponent, k as renderComponent, r as renderTemplate } from '../../chunks/astro/server_BTR06tDd.mjs';
import 'piccolore';
import { $ as $$Base } from '../../chunks/Base_-4rjFWta.mjs';
import { jsx, jsxs, Fragment } from 'react/jsx-runtime';
import { useState, useMemo, useTransition } from 'react';
import { A as AdminShell } from '../../chunks/AdminShell_DPOdjpGZ.mjs';
import { b as listMessages, u as unreadCount } from '../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../renderers.mjs';

function formatWhen(ts) {
  const d = new Date(ts);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit"
  });
}
async function patch(id, action) {
  await fetch(`/api/admin/messages/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action })
  });
}
async function destroy(id) {
  await fetch(`/api/admin/messages/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" }
  });
}
function MessageRow({
  message,
  onChange,
  onDelete
}) {
  const [pending, startTransition] = useTransition();
  const [expanded, setExpanded] = useState(!message.read_at);
  function markReadNow() {
    onChange(message.id, Date.now());
    startTransition(() => {
      patch(message.id, "read");
    });
  }
  function toggle() {
    setExpanded((v) => !v);
    if (!message.read_at) {
      markReadNow();
    }
  }
  function markUnread() {
    onChange(message.id, null);
    startTransition(() => {
      patch(message.id, "unread");
    });
  }
  function remove() {
    if (!confirm("Delete this message? This cannot be undone.")) return;
    startTransition(() => {
      destroy(message.id).then(() => onDelete(message.id));
    });
  }
  return /* @__PURE__ */ jsxs("article", { className: `iv-msg ${message.read_at ? "" : "unread"}`, children: [
    /* @__PURE__ */ jsxs("div", { onClick: toggle, style: { cursor: "pointer" }, children: [
      /* @__PURE__ */ jsxs("div", { className: "iv-msg-from", children: [
        message.name,
        /* @__PURE__ */ jsx(
          "a",
          {
            href: `mailto:${message.email}?subject=Re: ${encodeURIComponent(
              message.subject || "Your inquiry"
            )}`,
            className: "email",
            onClick: (e) => e.stopPropagation(),
            children: message.email
          }
        )
      ] }),
      message.subject && /* @__PURE__ */ jsx("div", { className: "iv-msg-subject", children: message.subject })
    ] }),
    /* @__PURE__ */ jsx("div", { className: "iv-msg-when", children: formatWhen(message.created_at) }),
    expanded && /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("div", { className: "iv-msg-body", children: message.body }),
      /* @__PURE__ */ jsxs("div", { className: "iv-msg-actions", children: [
        message.read_at ? /* @__PURE__ */ jsx(
          "button",
          {
            className: "iv-btn-ghost",
            onClick: markUnread,
            disabled: pending,
            children: "Mark Unread"
          }
        ) : /* @__PURE__ */ jsx(
          "button",
          {
            className: "iv-btn-ghost",
            onClick: markReadNow,
            disabled: pending,
            children: "Mark Read"
          }
        ),
        /* @__PURE__ */ jsx(
          "a",
          {
            className: "iv-btn-ghost",
            href: `mailto:${message.email}?subject=Re: ${encodeURIComponent(
              message.subject || "Your inquiry"
            )}`,
            children: "Reply"
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            className: "iv-btn-ghost",
            onClick: remove,
            disabled: pending,
            style: { marginLeft: "auto", color: "#d9a0a0" },
            children: "Delete"
          }
        )
      ] })
    ] })
  ] });
}
function AdminInboxPage({
  messages: initial
}) {
  const [messages, setMessages] = useState(initial);
  const unread = useMemo(
    () => messages.filter((m) => !m.read_at).length,
    [messages]
  );
  function onChange(id, read_at) {
    setMessages(
      (list) => list.map((m) => m.id === id ? { ...m, read_at } : m)
    );
  }
  function onDelete(id) {
    setMessages((list) => list.filter((m) => m.id !== id));
  }
  return /* @__PURE__ */ jsx(
    AdminShell,
    {
      active: "inbox",
      title: "Inbox",
      subtitle: `${messages.length} total · ${unread} unread`,
      children: messages.length === 0 ? /* @__PURE__ */ jsx("div", { className: "iv-empty", children: "No messages yet. Submissions from the contact form will appear here." }) : /* @__PURE__ */ jsx("div", { className: "iv-msg-list", children: messages.map((m) => /* @__PURE__ */ jsx(
        MessageRow,
        {
          message: m,
          onChange,
          onDelete
        },
        m.id
      )) })
    }
  );
}

const prerender = false;
const $$Inbox = createComponent(($$result, $$props, $$slots) => {
  const messages = listMessages();
  const unread = unreadCount();
  return renderTemplate`${renderComponent($$result, "Base", $$Base, { "title": "Inbox \xB7 Inovision Studios", "noindex": true }, { "default": ($$result2) => renderTemplate` ${renderComponent($$result2, "AdminInboxPage", AdminInboxPage, { "messages": messages, "unread": unread, "client:load": true, "client:component-hydration": "load", "client:component-path": "@/components/pages/AdminInboxPage", "client:component-export": "default" })} ` })}`;
}, "D:/wix/Inovision/web/src/pages/admin/inbox.astro", void 0);

const $$file = "D:/wix/Inovision/web/src/pages/admin/inbox.astro";
const $$url = "/admin/inbox";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Inbox,
  file: $$file,
  prerender,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
