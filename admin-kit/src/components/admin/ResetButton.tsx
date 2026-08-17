"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useConfirm, useToast } from "@/components/admin/Dialogs";

// Reset a section's settings back to the original scraped defaults.
export default function ResetButton({ scope, label = "Reset to default" }: { scope: string; label?: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const confirm = useConfirm();
  const toast = useToast();

  async function reset() {
    if (
      !(await confirm({
        title: "Reset to original values?",
        body: "Your changes in this section will be overwritten. This cannot be undone.",
        confirmLabel: "Reset",
        danger: true,
      }))
    )
      return;
    setBusy(true);
    const res = await fetch("/api/admin/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ scope }),
    });
    setBusy(false);
    if (res.ok) {
      toast("Section reset to defaults");
      router.refresh();
    } else {
      toast("Reset failed — try again", "error");
    }
  }

  return (
    <button
      type="button"
      onClick={reset}
      disabled={busy}
      className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:border-white/40 hover:bg-white/5 disabled:opacity-50"
    >
      {busy ? "Resetting…" : `↺ ${label}`}
    </button>
  );
}
