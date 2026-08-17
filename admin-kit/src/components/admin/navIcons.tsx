/** Inline paths only — the site's CSP blocks external icon fonts/CDNs. */
export const NAV_ICONS: Record<string, React.ReactNode> = {
  "/admin": <path d="M3 12l9-8 9 8v8a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-8z" />,
  "/admin/edit": <path d="M4 4h16v3H4V4zm0 5h10v11H4V9zm12 0h4v5h-4V9zm0 7h4v4h-4v-4z" />,
  "/admin/content": <path d="M4 4h16v2H4V4zm0 5h16v2H4V9zm0 5h11v2H4v-2zm0 5h11v2H4v-2zm13-3.2l1.6 3.4 3.4.5-2.5 2.4.6 3.4-3.1-1.7-3 1.7.6-3.4-2.5-2.4 3.4-.5L17 15.8z" />,
  "/admin/theme": <path d="M12 3a9 9 0 1 0 0 18c1 0 1.7-.8 1.7-1.7 0-.5-.2-.9-.5-1.2-.3-.3-.5-.7-.5-1.1 0-1 .8-1.7 1.7-1.7H16a5 5 0 0 0 5-5c0-4-4-7.3-9-7.3zM6.5 12a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />,
  "/admin/staff": <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zm-8 9a8 8 0 0 1 16 0v1H4v-1z" />,
  "/admin/blog": <path d="M5 3h11l4 4v14a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm2 6v2h10V9H7zm0 4v2h10v-2H7zm0 4v2h7v-2H7z" />,
  "/admin/products": <path d="M12 2l9 5v10l-9 5-9-5V7l9-5zm0 2.3L5.5 8 12 11.6 18.5 8 12 4.3zM5 9.7v6.1l6 3.3v-6.1L5 9.7zm14 0l-6 3.3v6.1l6-3.3V9.7z" />,
  "/admin/coupons": <path d="M3 7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v3a2 2 0 0 0 0 4v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-3a2 2 0 0 0 0-4V7zm12 1l-6 8h1.6l6-8H15z" />,
  "/admin/galleries": <path d="M3 5h18v14H3V5zm2 2v7l4-4 3 3 3-3 3 3V7H5zm3 2.5a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3z" />,
  "/admin/reviews": <path d="M12 2l2.9 6.3 6.9.8-5.1 4.7 1.4 6.8L12 17.2 5.9 20.6l1.4-6.8L2.2 9.1l6.9-.8L12 2z" />,
  "/admin/jobs": <path d="M9 4h6a1 1 0 0 1 1 1v2h4a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h4V5a1 1 0 0 1 1-1zm1 3h4V6h-4v1z" />,
  "/admin/emails": <path d="M3 5h18v14H3V5zm2.3 2L12 12l6.7-5H5.3z" />,
  "/admin/orders": <path d="M6.2 6h13.3l-1.5 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.65L5.3 3.9A1 1 0 0 0 4.32 3H2.6v2h1.05l1.8 9.9A4 4 0 0 0 9.2 18h6.8a4 4 0 0 0 3.94-3.26L22 4H6.2v2zM9.5 22a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2zm7 0a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z" />,
  "/admin/settings": <path d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zm9.4 4a7.4 7.4 0 0 0-.1-1.2l2-1.6-2-3.4-2.4 1a7.5 7.5 0 0 0-2-1.2L16.5 3h-4l-.4 2.6c-.7.3-1.4.7-2 1.2l-2.4-1-2 3.4 2 1.6a7.4 7.4 0 0 0 0 2.4l-2 1.6 2 3.4 2.4-1c.6.5 1.3.9 2 1.2l.4 2.6h4l.4-2.6c.7-.3 1.4-.7 2-1.2l2.4 1 2-3.4-2-1.6c.1-.4.1-.8.1-1.2z" />,
};

export function NavIcon({ href, className = "" }: { href: string; className?: string }) {
  const path = NAV_ICONS[href];
  if (!path) return null;
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      {path}
    </svg>
  );
}
