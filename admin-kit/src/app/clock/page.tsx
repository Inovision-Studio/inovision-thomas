import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import ClockClient from "./ClockClient";

export const dynamic = "force-dynamic";

export default async function ClockPage() {
  const s = await getSession();
  if (!s || s.role !== "staff") redirect("/admin/login");

  const tasks = await db.staffTask.findMany({ orderBy: { id: "asc" } });

  return (
    <main className="mx-auto max-w-lg px-5 py-10">
      <div className="text-[11px] font-bold tracking-widest text-[var(--accent)]">STAFF</div>
      <h1 className="font-display text-4xl">Hi, {s.name}</h1>
      <ClockClient tasks={tasks.map((t) => ({ id: t.id, text: t.text, done: t.done, doneBy: t.doneBy }))} />
    </main>
  );
}
