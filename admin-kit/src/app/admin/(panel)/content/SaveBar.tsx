"use client";

import { useFormStatus } from "react-dom";

/** Sticky footer bar so Save is reachable without scrolling this long form. */
export default function SaveBar() {
  const { pending } = useFormStatus();
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-[#0d110d]/95 px-4 py-3 backdrop-blur lg:pl-60">
      <div className="mx-auto flex max-w-5xl items-center gap-3">
        <p className="text-sm text-white/55">Changes apply to the live site immediately.</p>
        <button type="submit" disabled={pending} className="btn-accent ml-auto text-sm disabled:opacity-60">
          {pending ? "Saving…" : "Save content"}
        </button>
      </div>
    </div>
  );
}
