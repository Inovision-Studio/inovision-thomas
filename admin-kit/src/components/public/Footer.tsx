import { bizName, logoOf } from "@/lib/brand";
import Link from "next/link";
import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { DAYS, nowLocal } from "./util";
import OpenStatus from "./OpenStatus";
import SocialLinks from "./SocialLinks";
import { text } from "@/lib/content";
import { directionsTarget } from "@/lib/locations";

const NAV = [
  ["Home", "/"],
  ["Shop", "/shop"],
  ["Blog", "/blog"],
  ["News", "/news"],
  ["Reviews", "/reviews"],
  ["About", "/about"],
  ["Careers", "/careers"],
  ["Contact", "/contact"],
] as const;

export default async function Footer() {
  const [s, hours] = await Promise.all([
    getSettings().catch(() => ({}) as Record<string, string>),
    db.businessHour.findMany({ orderBy: { day: "asc" } }).catch(() => []),
  ]);
  const name = bizName(s);
  const address = s.address || "";
  const phone = s.phone || "";
  const mapsUrl = await directionsTarget(s);
  const today = nowLocal().day;
  // Address/phone/socials are optional settings. With none of them filled the
  // "Visit" column renders as a hole next to the dense Hours list, so fold the
  // directions link into the brand block and let the rest breathe.
  const hasVisitInfo = Boolean(address || phone || s.instagram || s.facebook);
  const directions = (
    <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost text-sm">
      Get directions
    </a>
  );

  return (
    <footer className="mt-24 border-t border-white/10 bg-black/40">
      {/* accent hairline so the footer reads as its own surface, not dead space */}
      <div className="h-px w-full bg-gradient-to-r from-transparent via-[color:var(--accent)]/40 to-transparent" />

      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-12 md:gap-8">
        <div className={hasVisitInfo ? "md:col-span-4" : "md:col-span-5"}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={logoOf(s)} alt={name} className="h-16 w-auto object-contain" />
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-[color:var(--muted)]">
            {text(s, "footer_blurb")}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <OpenStatus />
            {hasVisitInfo ? null : directions}
          </div>
        </div>

        <div className={hasVisitInfo ? "md:col-span-2" : "md:col-span-3"}>
          <h3 className="font-display text-lg tracking-wide text-[color:var(--text)]">Explore</h3>
          <ul className={`mt-4 space-y-2 text-sm ${hasVisitInfo ? "" : "grid grid-cols-2 gap-x-4 space-y-0 gap-y-2"}`}>
            {NAV.map(([label, href]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="group inline-flex items-center gap-1.5 text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
                >
                  <span className="h-px w-0 bg-[color:var(--accent)] transition-all duration-300 group-hover:w-3" />
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {hasVisitInfo ? (
        <div className="md:col-span-3">
          <h3 className="font-display text-lg tracking-wide text-[color:var(--text)]">Visit</h3>
          {address ? (
            <p className="mt-4 text-sm leading-relaxed text-[color:var(--muted)]">{address}</p>
          ) : null}
          <div className="mt-4">{directions}</div>
          {phone ? (
            <a
              href={`tel:${phone.replace(/[^\d+]/g, "")}`}
              className="mt-3 block text-sm text-[color:var(--muted)] transition-colors hover:text-[color:var(--text)]"
            >
              {phone}
            </a>
          ) : null}
          <SocialLinks settings={s} className="mt-5" />
        </div>
        ) : null}

        <div className={hasVisitInfo ? "md:col-span-3" : "md:col-span-4"}>
          <h3 className="font-display text-lg tracking-wide text-[color:var(--text)]">Hours</h3>
          <ul className="mt-4 space-y-1 text-sm">
            {hours.map((h) => {
              const isToday = h.day === today;
              return (
                <li
                  key={h.day}
                  className={`flex items-baseline justify-between gap-4 rounded-md px-2 py-1 ${
                    isToday
                      ? "bg-[color:var(--accent)]/10 font-semibold text-[color:var(--accent)]"
                      : "text-[color:var(--muted)]"
                  }`}
                >
                  <span>{DAYS[h.day]}</span>
                  <span className="tabular-nums">{h.closed ? "Closed" : `${h.open} – ${h.close}`}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 py-5 text-xs text-[color:var(--muted)] sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {name}. All rights reserved.</p>
          <span className="rounded-full border border-white/15 px-3 py-1 font-semibold tracking-wide">
            21+ only
          </span>
        </div>
      </div>
    </footer>
  );
}
