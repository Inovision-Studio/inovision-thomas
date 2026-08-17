"use client";
import { useConfirm, useToast } from "@/components/admin/Dialogs";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, inputClass } from "@/components/admin/ui";

type Hour = { day: number; label: string; closed: boolean; open: string; close: string };
type Staff = { id: number; name: string; active: boolean; weeklyHours: number };
type Task = { id: number; text: string; done: boolean; doneBy: string | null };

async function postStaff(body: unknown) {
  return fetch("/api/admin/staff", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export default function StaffClient({ hours, staff, tasks }: { hours: Hour[]; staff: Staff[]; tasks: Task[] }) {
  const confirm = useConfirm();
  const toast = useToast();
  const router = useRouter();
  const [rows, setRows] = useState<Hour[]>(hours);
  const [savingHours, setSavingHours] = useState(false);
  const [name, setName] = useState("");
  const [pin, setPin] = useState("");
  const [staffErr, setStaffErr] = useState("");
  const [taskText, setTaskText] = useState("");

  function setRow(day: number, patch: Partial<Hour>) {
    setRows((rs) => rs.map((r) => (r.day === day ? { ...r, ...patch } : r)));
  }

  async function saveHours() {
    setSavingHours(true);
    await fetch("/api/admin/hours", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ hours: rows }),
    });
    setSavingHours(false);
    router.refresh();
  }

  async function addStaff() {
    setStaffErr("");
    const res = await postStaff({ action: "addStaff", name, pin });
    if (!res.ok) {
      setStaffErr((await res.json().catch(() => ({}))).error || "Failed");
      return;
    }
    setName("");
    setPin("");
    router.refresh();
  }

  async function addTask() {
    if (!taskText.trim()) return;
    await postStaff({ action: "addTask", text: taskText });
    setTaskText("");
    router.refresh();
  }

  async function mutate(body: unknown) {
    await postStaff(body);
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <h2 className="mb-4 font-display text-xl">Business hours</h2>
        <div className="flex flex-col gap-2">
          {rows.map((r) => (
            <div key={r.day} className="flex items-center gap-2">
              <span className="w-10 text-sm text-white/60">{r.label}</span>
              <input
                className={`${inputClass} flex-1`}
                placeholder="Open"
                value={r.open}
                disabled={r.closed}
                onChange={(e) => setRow(r.day, { open: e.target.value })}
              />
              <input
                className={`${inputClass} flex-1`}
                placeholder="Close"
                value={r.close}
                disabled={r.closed}
                onChange={(e) => setRow(r.day, { close: e.target.value })}
              />
              <label className="flex items-center gap-1 text-xs text-white/70">
                <input type="checkbox" checked={r.closed} onChange={(e) => setRow(r.day, { closed: e.target.checked })} />
                Closed
              </label>
            </div>
          ))}
        </div>
        <button onClick={saveHours} disabled={savingHours} className="btn-accent mt-4 text-sm">
          {savingHours ? "Saving…" : "Save hours"}
        </button>
      </Card>

      <Card>
        <h2 className="mb-4 font-display text-xl">Staff members</h2>
        <div className="mb-4 flex flex-col gap-2">
          <input className={inputClass} placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input className={inputClass} placeholder="PIN" value={pin} onChange={(e) => setPin(e.target.value)} />
          {staffErr && <p className="text-sm text-red-400">{staffErr}</p>}
          <button onClick={addStaff} className="btn-accent self-start text-sm">
            Add staff
          </button>
        </div>
        <div className="flex flex-col gap-2">
          {staff.map((s) => (
            <div key={s.id} className="flex items-center justify-between border-t border-white/10 py-2 text-sm">
              <div>
                <div className="font-medium">{s.name}</div>
                <div className="text-xs text-white/50">{s.weeklyHours}h this week</div>
              </div>
              <div className="flex items-center gap-3">
                <label className="flex items-center gap-1 text-xs text-white/70">
                  <input
                    type="checkbox"
                    checked={s.active}
                    onChange={(e) => mutate({ action: "toggleStaff", id: s.id, active: e.target.checked })}
                  />
                  Active
                </label>
                <button onClick={async () => { if (await confirm({ title: "Remove this staff member?", confirmLabel: "Remove", danger: true })) mutate({ action: "deleteStaff", id: s.id }); }} className="text-red-400 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))}
          {staff.length === 0 && <p className="text-sm text-white/40">No staff yet.</p>}
        </div>
      </Card>

      <Card className="lg:col-span-2">
        <h2 className="mb-4 font-display text-xl">Task list</h2>
        <div className="mb-4 flex gap-2">
          <input
            className={inputClass}
            placeholder="New task"
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addTask()}
          />
          <button onClick={addTask} className="btn-accent text-sm">
            Add
          </button>
        </div>
        <div className="flex flex-col gap-1">
          {tasks.map((t) => (
            <div key={t.id} className="flex items-center gap-3 border-t border-white/10 py-2 text-sm">
              <input
                type="checkbox"
                checked={t.done}
                onChange={(e) => mutate({ action: "toggleTask", id: t.id, done: e.target.checked })}
              />
              <span className={t.done ? "text-white/40 line-through" : ""}>{t.text}</span>
              {t.done && t.doneBy && <span className="text-xs text-white/40">by {t.doneBy}</span>}
              <button onClick={() => mutate({ action: "deleteTask", id: t.id })} className="ml-auto text-red-400 hover:underline">
                Delete
              </button>
            </div>
          ))}
          {tasks.length === 0 && <p className="text-sm text-white/40">No tasks yet.</p>}
        </div>
      </Card>
    </div>
  );
}
