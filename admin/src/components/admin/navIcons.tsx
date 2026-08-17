export const NAV_ICONS: Record<string, React.ReactNode> = {
  "/admin": <path d="M3 12l9-8 9 8v8a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8z" />,
  "/admin/clients": <path d="M16 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM8 12a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 2c-3.3 0-6 1.6-6 3.5V20h8v-2.5c0-1 .5-1.9 1.4-2.6A9.5 9.5 0 0 0 8 14zm8 0c-.6 0-1.2.1-1.8.2 1.1.8 1.8 2 1.8 3.3V20h6v-2.5c0-1.9-2.7-3.5-6-3.5z" />,
  "/admin/projects": <path d="M4 5h6l2 2h8v12H4V5zm2 2v10h12V9h-6.8l-2-2H6z" />,
  "/admin/audits": <path d="M5 3h10l4 4v14H5V3zm2 2v14h10V8h-3V5H7zm2 6h6v2H9v-2zm0 4h6v2H9v-2z" />,
  "/admin/invoices": <path d="M6 2h12v20l-3-2-3 2-3-2-3 2V2zm2 2v14.5l1-.7 3 2 3-2 1 .7V4H8zm2 3h6v2h-6V7zm0 4h6v2h-6v-2z" />,
  "/admin/ledger": <path d="M3 5h18v14H3V5zm2 2v10h14V7H5zm2 2h4v6H7V9zm6 0h4v2h-4V9zm0 4h4v2h-4v-2z" />,
  "/admin/posts": <path d="M5 3h11l4 4v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm1 2v15h12V8h-3V5H6zm2 6h8v2H8v-2zm0 4h8v2H8v-2z" />,
  "/admin/gallery": <path d="M3 5h18v14H3V5zm2 2v7l4-4 3 3 3-3 3 3V7H5zm3 2.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />,
  "/admin/team": <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0H4z" />,
  "/admin/news": <path d="M4 4h13v2H4V4zm0 4h16v12H4V8zm2 2v8h12v-8H6zm2 2h4v4H8v-4zm6 0h2v2h-2v-2zm0 3h2v1h-2v-1z" />,
  "/admin/inbox": <path d="M3 5h18v14H3V5zm2.3 2L12 12l6.7-5H5.3z" />,
  "/admin/applications": <path d="M9 4h6a1 1 0 0 1 1 1v2h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h4V5a1 1 0 0 1 1-1zm1 3h4V6h-4v1zM5 9v9h14V9H5z" />,
  "/admin/mockups": <path d="M3 4h18v12H3V4zm2 2v8h14V6H5zm4 12h6v2H9v-2z" />,
  "/admin/analytics": <path d="M4 20V10h3v10H4zm6.5 0V4h3v16h-3zM17 20v-7h3v7h-3z" />,
  "/admin/settings": <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9.4 4a7.4 7.4 0 0 0-.1-1l2.1-1.6-2-3.5-2.5 1a7.6 7.6 0 0 0-1.7-1l-.4-2.7h-4l-.4 2.7c-.6.2-1.2.6-1.7 1l-2.5-1-2 3.5L4.7 11a7.4 7.4 0 0 0 0 2l-2.1 1.6 2 3.5 2.5-1c.5.4 1.1.8 1.7 1l.4 2.7h4l.4-2.7c.6-.2 1.2-.6 1.7-1l2.5 1 2-3.5-2.1-1.6c.1-.3.1-.7.1-1z" />,
  "/admin/admins": <path d="M12 2l8 3v6c0 5-3.4 9.4-8 11-4.6-1.6-8-6-8-11V5l8-3zm0 2.2L6 6.3V11c0 3.9 2.5 7.5 6 8.9 3.5-1.4 6-5 6-8.9V6.3l-6-2.1zM11 8h2v4h-2V8zm0 5h2v2h-2v-2z" />,
};

export function NavIcon({ href, className = "" }: { href: string; className?: string }) {
  const path = NAV_ICONS[href];
  if (!path) return null;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      {path}
    </svg>
  );
}
