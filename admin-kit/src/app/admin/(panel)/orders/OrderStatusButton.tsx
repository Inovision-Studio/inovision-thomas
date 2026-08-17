"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/admin/Dialogs";

export default function OrderStatusButton({ id, status }: { id: number; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const toast = useToast();
  const isOpen = status === "open";

  async function toggle() {
    setBusy(true);
    const res = await fetch(`/api/admin/orders/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: isOpen ? "picked_up" : "open" }),
    });
    setBusy(false);
    if (res.ok) {
      toast(isOpen ? "Marked picked up" : "Order reopened");
      router.refresh();
    }
    else toast("Couldn't update that order — try again", "error");
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5 disabled:opacity-50"
    >
      {busy ? "…" : isOpen ? "Mark picked up" : "Reopen"}
    </button>
  );
}
