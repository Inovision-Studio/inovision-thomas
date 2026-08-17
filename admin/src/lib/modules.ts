/** Every admin module: nav label, group, route, and the permission key staff can be granted. */
export type Module = { key: string; label: string; href: string; group: "" | "Work" | "Money" | "Content" | "Inbox" | "Studio" };
export const MODULES: Module[] = [
  { key: "dashboard", label: "Dashboard", href: "/admin", group: "" },
  { key: "clients", label: "Clients", href: "/admin/clients", group: "Work" },
  { key: "projects", label: "Projects", href: "/admin/projects", group: "Work" },
  { key: "audits", label: "Audits", href: "/admin/audits", group: "Work" },
  { key: "invoices", label: "Invoices", href: "/admin/invoices", group: "Money" },
  { key: "ledger", label: "Ledger", href: "/admin/ledger", group: "Money" },
  { key: "posts", label: "Posts", href: "/admin/posts", group: "Content" },
  { key: "gallery", label: "Work gallery", href: "/admin/gallery", group: "Content" },
  { key: "team", label: "Team page", href: "/admin/team", group: "Content" },
  { key: "news", label: "News feed", href: "/admin/news", group: "Content" },
  { key: "inbox", label: "Inbox", href: "/admin/inbox", group: "Inbox" },
  { key: "applications", label: "Applications", href: "/admin/applications", group: "Inbox" },
  { key: "mockups", label: "Mockups", href: "/admin/mockups", group: "Studio" },
  { key: "analytics", label: "Analytics", href: "/admin/analytics", group: "Studio" },
  { key: "settings", label: "Settings", href: "/admin/settings", group: "Studio" },
  { key: "admins", label: "Admins", href: "/admin/admins", group: "Studio" },
];
export const OWNER_ONLY = new Set(["invoices", "ledger", "settings", "admins"]);
export const canSee = (role: string, permissions: string[], key: string) => role === "owner" || (!OWNER_ONLY.has(key) && permissions.includes(key));
