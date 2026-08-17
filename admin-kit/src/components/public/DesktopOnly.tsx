"use client";

import { useEffect, useState, type ReactNode } from "react";

/** Mounts children only on >=768px screens — skips WebGL etc. entirely on phones. */
export default function DesktopOnly({ children }: { children: ReactNode }) {
  const [isDesktop, setIsDesktop] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 768px)");
    setIsDesktop(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsDesktop(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return isDesktop ? <>{children}</> : null;
}
