"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

const STORAGE_KEY = "sb_age_ok";
const REMEMBER_DAYS = 30;

/** Age confirmation shown once per device, then remembered for 30 days.
 *  Rendered client-side only so it never blocks first paint or SEO crawling. */
export default function AgeGate({ logo, name, age, title }: { logo: string; name: string; age: string; title: string }) {
  const heading = title.replace("{age}", age);
  // `null` = still deciding (nothing painted); false = confirmed; true = show gate
  const [needsGate, setNeedsGate] = useState<boolean | null>(null);
  const [isDeclined, setIsDeclined] = useState(false);
  const pathname = usePathname();

  const isStaffRoute = pathname.startsWith("/admin") || pathname.startsWith("/clock");

  useEffect(() => {
    if (isStaffRoute) {
      setNeedsGate(false);
      return;
    }
    let confirmedAt = 0;
    try {
      confirmedAt = Number(localStorage.getItem(STORAGE_KEY)) || 0;
    } catch {
      // private mode / storage blocked — gate every visit rather than skipping it
    }
    const isFresh = confirmedAt > 0 && Date.now() - confirmedAt < REMEMBER_DAYS * 86_400_000;
    setNeedsGate(!isFresh);
  }, [isStaffRoute]);

  // lock scrolling behind the gate
  useEffect(() => {
    if (needsGate !== true) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [needsGate]);

  if (needsGate !== true) return null;

  function confirm() {
    try {
      localStorage.setItem(STORAGE_KEY, String(Date.now()));
    } catch {
      // not fatal — they'll just be asked again next visit
    }
    setNeedsGate(false);
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-title"
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 px-5"
    >
      <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0c100c] p-7 text-center shadow-2xl">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logo} alt={name} className="mx-auto h-14 w-auto object-contain" />

        {isDeclined ? (
          <>
            <h2 id="age-gate-title" className="mt-6 font-display text-3xl">
              Sorry, come back at {age}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
              You must be {age} or older to browse {name}.
            </p>
            <button
              type="button"
              onClick={() => setIsDeclined(false)}
              className="btn-ghost mt-6 w-full text-sm"
            >
              Go back
            </button>
          </>
        ) : (
          <>
            <h2 id="age-gate-title" className="mt-6 font-display text-3xl leading-none">
              {heading}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-[color:var(--muted)]">
              You must be {age}+ to enter this site and purchase our products.
            </p>

            <div className="mt-7 space-y-3">
              <button type="button" onClick={confirm} className="btn-accent w-full text-base">
                Yes, I&apos;m {age} or older
              </button>
              <button
                type="button"
                onClick={() => setIsDeclined(true)}
                className="btn-ghost w-full text-base"
              >
                No, I&apos;m under {age}
              </button>
            </div>

            <p className="mt-6 text-xs leading-relaxed text-[color:var(--muted)]">
              By entering you confirm you are of legal age in your jurisdiction.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
