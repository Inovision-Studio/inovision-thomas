import { bizName } from "@/lib/brand";
import { getSettings } from "@/lib/settings";
import { directionsTarget } from "@/lib/locations";
import AskAiButton from "./AskAiButton";

/** Fixed bottom bar on phones: the three things a walk-in customer actually wants.
 *  Cells render only when the underlying setting exists, so it never shows a dead button. */
export default async function MobileActionBar() {
  const s = await getSettings().catch(() => ({}) as Record<string, string>);
  const name = bizName(s);
  const address = s.address || "";
  const phone = s.phone || "";
  const tel = phone.replace(/[^\d+]/g, "");
  const mapsUrl = await directionsTarget(s);

  const actions = [
    {
      key: "directions",
      label: "Directions",
      href: mapsUrl,
      external: !mapsUrl.startsWith("/"),
      icon: (
        <path d="M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11zm0-8.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z" />
      ),
    },
    tel && {
      key: "call",
      label: "Call",
      href: `tel:${tel}`,
      icon: (
        <path d="M6.6 10.8a15.1 15.1 0 0 0 6.6 6.6l2.2-2.2a1 1 0 0 1 1-.24c1.1.37 2.3.57 3.6.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1C11.4 21 3 12.6 3 2a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.3.2 2.5.57 3.6a1 1 0 0 1-.25 1L6.6 10.8z" />
      ),
    },
    {
      key: "shop",
      label: "Shop",
      href: "/shop",
      icon: (
        <path d="M6.2 6h13.3l-1.5 8.2a2 2 0 0 1-2 1.6H9.2a2 2 0 0 1-2-1.65L5.3 3.9A1 1 0 0 0 4.32 3H2.6v2h1.05l1.8 9.9A4 4 0 0 0 9.2 18h6.8a4 4 0 0 0 3.94-3.26L22 4H6.2v2zM9.5 22a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2zm7 0a1.6 1.6 0 1 0 0-3.2 1.6 1.6 0 0 0 0 3.2z" />
      ),
    },
    {
      key: "ai",
      label: "Ask AI",
      ai: true,
      icon: (
        <path d="M12 2.6l1.9 4.3 4.6.5-3.4 3.1.9 4.6-4-2.3-4 2.3.9-4.6L5.5 7.4l4.6-.5L12 2.6zM4.5 16.4l.9 2 2 .9-2 .9-.9 2-.9-2-2-.9 2-.9.9-2zm14.6 1.2l.7 1.6 1.6.7-1.6.7-.7 1.6-.7-1.6-1.6-.7 1.6-.7.7-1.6z" />
      ),
    },
  ].filter(Boolean) as {
    key: string;
    label: string;
    href?: string;
    external?: boolean;
    ai?: boolean;
    icon: React.ReactNode;
  }[];

  const cellClass =
    "flex min-h-[60px] w-full flex-col items-center justify-center gap-1 border-r border-white/10 py-2 transition-colors last:border-r-0 active:bg-white/5";

  return (
    <>
    {/* spacer keeps the fixed bar from covering the footer; scoped here so admin
        pages (which never render the bar) get no phantom bottom gap */}
    <div className="h-[76px] lg:hidden" aria-hidden="true" />
    <nav
      aria-label="Quick actions"
      className="fixed inset-x-0 bottom-0 z-[95] border-t border-white/10 bg-[#0c100c] pb-[env(safe-area-inset-bottom)] lg:hidden"
    >
      <div className="grid" style={{ gridTemplateColumns: `repeat(${actions.length}, minmax(0, 1fr))` }}>
        {actions.map((a) => {
          const inner = (
            <>
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-5 w-5 text-[color:var(--accent)]">
                {a.icon}
              </svg>
              <span className="font-grotesk text-[0.65rem] uppercase tracking-[0.15em] text-[color:var(--text)]">
                {a.label}
              </span>
            </>
          );
          return a.ai ? (
            <AskAiButton key={a.key} className={cellClass} data-track={`bar:${a.key}`}>
              {inner}
            </AskAiButton>
          ) : (
            <a
              key={a.key}
              href={a.href}
              {...(a.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={cellClass}
              data-track={`bar:${a.key}`}
            >
              {inner}
            </a>
          );
        })}
      </div>
    </nav>
    </>
  );
}
