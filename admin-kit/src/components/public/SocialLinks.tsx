import type { SVGProps } from "react";

/** Inline SVG only — a strict CSP blocks external icon fonts/CDNs. */
function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true" {...props}>
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.2" />
      <circle cx="17.6" cy="6.4" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.45 2.89h-2.33v6.99A10 10 0 0 0 22 12z" />
    </svg>
  );
}

const NETWORKS = [
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
] as const;

/** Renders only the networks that actually have a URL saved in Settings. */
export default function SocialLinks({
  settings,
  className = "",
}: {
  settings: Record<string, string>;
  className?: string;
}) {
  const live = NETWORKS.filter((n) => settings[n.key]?.startsWith("http"));
  if (live.length === 0) return null;

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {live.map(({ key, label, Icon }) => (
        <a
          key={key}
          href={settings[key]}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Follow us on ${label}`}
          title={label}
          className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 text-[color:var(--muted)] transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--accent)]/60 hover:text-[color:var(--accent)] active:scale-95"
        >
          <Icon className="h-5 w-5" />
        </a>
      ))}
    </div>
  );
}
