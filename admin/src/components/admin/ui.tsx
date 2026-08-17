import Link from "next/link";
import CountUp from "./CountUp";

export function PageHeader({ title, sub, action }: { title: string; sub?: string; action?: React.ReactNode }) {
  return (
    <div className="mb-6 flex items-start justify-between gap-4">
      <div>
        <div className="text-[11px] font-bold tracking-widest text-[var(--accent)]">ADMIN</div>
        <h1 className="text-4xl font-display">{title}</h1>
        {sub && <p className="mt-1 text-sm text-white/60">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`card p-5 ${className}`}>{children}</div>;
}

export function Stat({
  label,
  value,
  href,
  accent = false,
  index = 0,
  sub,
  chart,
}: {
  label: string;
  value: React.ReactNode;
  /** Makes the tile tappable — a number you cannot act on is just decoration. */
  href?: string;
  accent?: boolean;
  index?: number;
  /** small line under the number (delta, context) */
  sub?: React.ReactNode;
  /** sparkline or similar, right-aligned */
  chart?: React.ReactNode;
}) {
  const body = (
    <>
      <div className="text-[11px] font-bold tracking-widest text-white/50">{label}</div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <div className={`mt-1 text-3xl font-display ${accent ? "stat-value" : ""}`}>
            {typeof value === "number" ? <CountUp value={value} /> : value}
          </div>
          {sub ? <div className="mt-0.5">{sub}</div> : null}
        </div>
        {chart ? <div className="shrink-0">{chart}</div> : null}
      </div>
    </>
  );
  const base = `card admin-rise block p-5 ${accent ? "border-[var(--accent)]/40" : ""}`;
  return href ? (
    <Link
      href={href}
      style={{ ["--i" as string]: index }}
      className={`${base} hover:border-[var(--accent)]/60 active:scale-[0.98]`}
    >
      {body}
    </Link>
  ) : (
    <div className={base} style={{ ["--i" as string]: index }}>
      {body}
    </div>
  );
}

/** Big tap target for the handful of things an owner does most often. */
export function QuickAction({
  href,
  label,
  hint,
  index = 0,
}: {
  href: string;
  label: string;
  hint?: string;
  index?: number;
}) {
  return (
    <Link
      href={href}
      style={{ ["--i" as string]: index }}
      className="card admin-rise flex min-h-[76px] flex-col justify-center p-4 hover:border-[var(--accent)]/60 active:scale-[0.98]"
    >
      <span className="font-semibold leading-tight">{label}</span>
      {hint ? <span className="mt-0.5 text-xs text-white/50">{hint}</span> : null}
    </Link>
  );
}

export function LinkButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link href={href} className="btn-accent text-sm">
      {children}
    </Link>
  );
}

export const inputClass =
  "w-full rounded-lg bg-black/40 border border-white/10 px-3 py-2 text-white outline-none focus:ring-2 ring-[var(--accent)]";
