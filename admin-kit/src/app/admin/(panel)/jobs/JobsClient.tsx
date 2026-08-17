"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useConfirm, useToast } from "@/components/admin/Dialogs";

export type JobRow = {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  message: string;
  archived: boolean;
  createdAt: string;
};

export default function JobsClient({ rows }: { rows: JobRow[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);
  const confirm = useConfirm();
  const toast = useToast();

  async function act(id: number, action: "archive" | "delete", archived?: boolean) {
    if (
      action === "delete" &&
      !(await confirm({
        title: "Delete this application?",
        body: "This permanently removes the applicant's details.",
        confirmLabel: "Delete",
        danger: true,
      }))
    )
      return;
    setBusy(id);
    await fetch("/api/admin/jobs", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, action, archived }),
    }).catch(() => null);
    setBusy(null);
    toast(action === "delete" ? "Application deleted" : "Application updated");
    router.refresh();
  }

  if (rows.length === 0) {
    return (
      <div className="card p-5">
        <p className="font-display text-2xl">No applications yet.</p>
        <p className="mt-2 max-w-prose text-sm text-white/60">
          Applications submitted from the Careers page land here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-3">
      {rows.map((r) => (
        <div key={r.id} className={`card p-5 ${r.archived ? "opacity-50" : ""}`}>
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-display text-xl leading-tight">{r.name}</h2>
              <p className="mt-0.5 text-sm text-[var(--accent)]">{r.position}</p>
            </div>
            <span className="shrink-0 text-xs text-white/40">
              {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-3 text-sm">
            {r.email ? (
              <a href={`mailto:${r.email}`} className="text-white/80 underline-offset-2 hover:underline">
                {r.email}
              </a>
            ) : null}
            {r.phone ? (
              <a href={`tel:${r.phone.replace(/[^\d+]/g, "")}`} className="text-white/80 underline-offset-2 hover:underline">
                {r.phone}
              </a>
            ) : null}
          </div>

          {r.message ? (
            <p className="mt-3 whitespace-pre-wrap text-sm text-white/70">{r.message}</p>
          ) : null}

          <div className="mt-4 flex gap-2">
            <button
              type="button"
              disabled={busy === r.id}
              onClick={() => act(r.id, "archive", !r.archived)}
              className="rounded-full border border-white/20 px-4 py-1.5 text-sm text-white/80 hover:bg-white/5 disabled:opacity-50"
            >
              {r.archived ? "Unarchive" : "Archive"}
            </button>
            <button
              type="button"
              disabled={busy === r.id}
              onClick={() => act(r.id, "delete")}
              className="rounded-full border border-red-500/40 px-4 py-1.5 text-sm text-red-200 hover:bg-red-500/10 disabled:opacity-50"
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
