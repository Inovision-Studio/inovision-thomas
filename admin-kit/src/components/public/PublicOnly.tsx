"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Hides staff-irrelevant public chrome on /admin and /clock, and inside the
 * visual editor's iframe (same origin, ?edit=1) so overlays like the age gate
 * or spin wheel don't sit on top of the page being edited. The iframe check is
 * client-only, decided after mount, so it never causes a hydration mismatch.
 */
export default function PublicOnly({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [inEditFrame, setInEditFrame] = useState(false);

  useEffect(() => {
    try {
      setInEditFrame(window.self !== window.top && new URLSearchParams(location.search).get("edit") === "1");
    } catch {
      setInEditFrame(false);
    }
  }, []);

  if (pathname.startsWith("/admin") || pathname.startsWith("/clock") || inEditFrame) return null;
  return <>{children}</>;
}
