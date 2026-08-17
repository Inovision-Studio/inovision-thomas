import { db } from "@/lib/db";
import { PageHeader, Stat, Card } from "@/components/admin/ui";
import { HBars } from "@/components/admin/charts";
import LedgerClient from "./LedgerClient";

export const dynamic = "force-dynamic";
const usd = (n: number) => `$${n.toFixed(2)}`;

function monthRange(m: string) {
  const [y, mo] = m.split("-").map(Number);
  const start = new Date(y, mo - 1, 1), end = new Date(y, mo, 1);
  return { start, end };
}

export default async function LedgerPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const sp = await searchParams;
  const now = new Date();
  const month = /^\d{4}-\d{2}$/.test(sp.month || "") ? sp.month! : `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
  const { start, end } = monthRange(month);
  const [entries, cats] = await Promise.all([
    db.ledger.findMany({ where: { ts: { gte: start, lt: end } }, orderBy: { ts: "desc" } }),
    db.ledger.findMany({ distinct: ["category"], select: { category: true }, where: { category: { not: "" } } }),
  ]);
  const income = entries.filter((e) => e.kind === "income").reduce((s, e) => s + e.amount, 0);
  const expense = entries.filter((e) => e.kind === "expense").reduce((s, e) => s + e.amount, 0);
  const byCat = Object.entries(entries.filter((e) => e.kind === "expense").reduce<Record<string, number>>((m, e) => ((m[e.category || "uncategorized"] = (m[e.category || "uncategorized"] || 0) + e.amount), m), {}))
    .sort((a, b) => b[1] - a[1]).slice(0, 8).map(([label, value]) => ({ label, value: Math.round(value) }));

  return (
    <div>
      <PageHeader title="Ledger" sub="Money in, money out — the simple book" />
      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <Stat label="INCOME" value={usd(income)} index={0} />
        <Stat label="EXPENSES" value={usd(expense)} index={1} />
        <Stat label="NET" value={usd(income - expense)} accent index={2} />
      </div>
      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <LedgerClient month={month} categories={cats.map((c) => c.category)} entries={entries.map((e) => ({ id: e.id, ts: e.ts.toISOString(), kind: e.kind, category: e.category, amount: e.amount, note: e.note }))} />
        <Card>
          <h2 className="mb-3 font-display text-xl">Expenses by category</h2>
          <HBars rows={byCat} label="Expenses by category" empty="No expenses this month." />
        </Card>
      </div>
    </div>
  );
}
