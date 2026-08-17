import Link from "next/link";

export type Issue = { label: string; hint: string; href: string; level: "warn" | "info" };

/** Concrete gaps in the live site, not vanity metrics. Renders nothing when clean. */
export default function SiteHealth({ issues }: { issues: Issue[] }) {
  if (issues.length === 0) {
    return (
      <div className="card p-5">
        <p className="font-display text-xl">Everything looks set up</p>
        <p className="mt-1 text-sm text-white/60">No missing contact details, images, or empty sections.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {issues.map((i, idx) => (
        <Link
          key={i.label}
          href={i.href}
          style={{ ["--i" as string]: idx }}
          className={`card admin-rise ${i.level === "warn" ? "admin-sheen border-amber-400/30" : ""} flex items-start gap-3 p-4 hover:border-[var(--accent)]/60`}
        >
          <span
            aria-hidden="true"
            className={`mt-1 h-2 w-2 shrink-0 rounded-full ${i.level === "warn" ? "bg-amber-400" : "bg-white/30"}`}
          />
          <span className="min-w-0">
            <span className="block font-semibold leading-tight">{i.label}</span>
            <span className="mt-0.5 block text-sm text-white/60">{i.hint}</span>
          </span>
          <span className="ml-auto shrink-0 self-center text-sm text-[var(--accent)]">Fix →</span>
        </Link>
      ))}
    </div>
  );
}
