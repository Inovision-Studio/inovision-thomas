"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Tiny first-party beacon: one pageview per route change, one click event for
 * anything carrying data-track="group:name". Honors Do Not Track. Renders nothing.
 */
export default function Analytics() {
  const pathname = usePathname();

  useEffect(() => {
    if (typeof navigator === "undefined" || navigator.doNotTrack === "1") return;
    if (pathname.startsWith("/admin") || pathname.startsWith("/clock")) return;
    send({ kind: "pageview", path: pathname, ref: document.referrer || "" });
  }, [pathname]);

  useEffect(() => {
    if (typeof navigator === "undefined" || navigator.doNotTrack === "1") return;
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (!el) return;
      send({ kind: "click", path: location.pathname, label: el.dataset.track || "" });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, []);

  return null;
}

function send(payload: Record<string, string>) {
  const body = JSON.stringify(payload);
  try {
    if (navigator.sendBeacon && navigator.sendBeacon("/api/track", body)) return;
  } catch {}
  fetch("/api/track", { method: "POST", body, keepalive: true, headers: { "Content-Type": "text/plain" } }).catch(() => {});
}
