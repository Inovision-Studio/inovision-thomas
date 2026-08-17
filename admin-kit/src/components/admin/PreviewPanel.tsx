"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";

const KEY = "sb_preview";
const MIN = 320;
const MAX = 900;

/** Fires whenever an admin save should refresh any live preview on screen. */
export function notifySaved() {
  window.dispatchEvent(new Event("site:saved"));
}

/**
 * Live-site iframe docked to the right of every admin page (desktop only).
 * Reloads on `site:saved` (dispatched by toasts + notifySaved) and shortly
 * after any form submit, since server actions expose no completion event.
 */
export default function PreviewPanel() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [width, setWidth] = useState(480);
  const [hydrated, setHydrated] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const dragging = useRef(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // remembered state
  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const v = JSON.parse(raw);
        if (typeof v.open === "boolean") setOpen(v.open);
        if (typeof v.width === "number") setWidth(Math.max(MIN, Math.min(MAX, v.width)));
      }
    } catch {}
    setHydrated(true);
  }, []);
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(KEY, JSON.stringify({ open, width }));
    } catch {}
  }, [open, width, hydrated]);

  // refresh triggers (debounced)
  useEffect(() => {
    const reload = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => {
        try {
          iframeRef.current?.contentWindow?.location.reload();
        } catch {}
      }, 300);
    };
    const onSubmit = () => setTimeout(reload, 1500);
    window.addEventListener("site:saved", reload);
    document.addEventListener("submit", onSubmit, true);
    return () => {
      window.removeEventListener("site:saved", reload);
      document.removeEventListener("submit", onSubmit, true);
    };
  }, []);

  // resize divider
  useEffect(() => {
    const move = (e: PointerEvent) => {
      if (!dragging.current) return;
      setWidth(Math.max(MIN, Math.min(MAX, window.innerWidth - e.clientX)));
    };
    const up = () => (dragging.current = false);
    window.addEventListener("pointermove", move);
    window.addEventListener("pointerup", up);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerup", up);
    };
  }, []);

  // the visual editor has its own iframe; don't double up
  if (pathname.startsWith("/admin/edit")) return null;

  return (
    <>
      {/* toggle lives in the sidebar footer via a portal-free trick: fixed button bottom-right */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-pressed={open}
        className="fixed bottom-4 right-4 z-40 hidden items-center gap-2 rounded-full border border-white/15 bg-[#0d110d] px-4 py-2 text-sm font-semibold shadow-lg hover:border-[var(--accent)]/60 lg:flex"
      >
        <span aria-hidden="true">🖥</span>
        {open ? "Hide preview" : "Preview site"}
      </button>

      {open ? (
        <aside
          style={{ width }}
          className="sticky top-0 hidden h-screen shrink-0 border-l border-white/10 bg-[#0a0e0a] lg:flex lg:flex-col"
          aria-label="Live site preview"
        >
          <div
            role="separator"
            aria-orientation="vertical"
            title="Drag to resize"
            onPointerDown={(e) => {
              e.preventDefault();
              dragging.current = true;
            }}
            className="absolute inset-y-0 -left-[3px] w-[6px] cursor-col-resize hover:bg-[var(--accent)]/40"
          />
          <div className="flex items-center gap-2 border-b border-white/10 px-3 py-2 text-xs text-white/60">
            <span className="font-semibold text-white/80">Live site</span>
            <span className="ml-auto" />
            <button type="button" onClick={() => iframeRef.current?.contentWindow?.location.reload()} className="rounded px-2 py-1 hover:bg-white/5">
              ↻ Reload
            </button>
            <a href="/" target="_blank" rel="noopener noreferrer" className="rounded px-2 py-1 hover:bg-white/5">
              Open ↗
            </a>
          </div>
          <iframe ref={iframeRef} src="/" title="Live site" className="min-h-0 flex-1 border-0" />
        </aside>
      ) : null}
    </>
  );
}
