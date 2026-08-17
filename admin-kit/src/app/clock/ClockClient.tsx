"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Task = { id: number; text: string; done: boolean; doneBy: string | null };

function getPosition(): Promise<{ lat: number | null; lng: number | null }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve({ lat: null, lng: null });
    navigator.geolocation.getCurrentPosition(
      (p) => resolve({ lat: p.coords.latitude, lng: p.coords.longitude }),
      () => resolve({ lat: null, lng: null }),
      { timeout: 8000 },
    );
  });
}

export default function ClockClient({ tasks }: { tasks: Task[] }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState("");

  async function punch(kind: "in" | "out") {
    setBusy(true);
    setMsg("");
    const { lat, lng } = await getPosition();
    const res = await fetch("/api/staff/punch", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind, lat, lng }),
    });
    setBusy(false);
    setMsg(res.ok ? `Clocked ${kind} at ${new Date().toLocaleTimeString()}` : "Punch failed");
  }

  async function toggle(id: number, done: boolean) {
    await fetch("/api/staff/task", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, done }),
    });
    router.refresh();
  }

  return (
    <div className="mt-8 flex flex-col gap-8">
      <div className="card p-6">
        <div className="flex gap-3">
          <button onClick={() => punch("in")} disabled={busy} className="btn-accent flex-1 justify-center text-center">
            Clock In
          </button>
          <button
            onClick={() => punch("out")}
            disabled={busy}
            className="flex-1 rounded-full border border-white/20 px-4 py-2 text-center text-white/80 hover:bg-white/5"
          >
            Clock Out
          </button>
        </div>
        {msg && <p className="mt-3 text-sm text-white/60">{msg}</p>}
      </div>

      <div className="card p-6">
        <h2 className="mb-4 font-display text-xl">Task checklist</h2>
        <div className="flex flex-col gap-1">
          {tasks.map((t) => (
            <label key={t.id} className="flex items-center gap-3 border-t border-white/10 py-2 text-sm">
              <input type="checkbox" checked={t.done} onChange={(e) => toggle(t.id, e.target.checked)} />
              <span className={t.done ? "text-white/40 line-through" : ""}>{t.text}</span>
              {t.done && t.doneBy && <span className="text-xs text-white/40">by {t.doneBy}</span>}
            </label>
          ))}
          {tasks.length === 0 && <p className="text-sm text-white/40">No tasks.</p>}
        </div>
      </div>
    </div>
  );
}
