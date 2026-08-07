import { T as deleteLedger, U as listLedger, O as listInvoices, z as listClients, A as clientMonthly, L as addLedger } from '../../../chunks/db_xJ927fmw.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const json = (d, s = 200) => new Response(JSON.stringify(d), { status: s, headers: { "Content-Type": "application/json" } });
const GET = () => {
  const rows = listLedger();
  const invoices = listInvoices();
  const paidInvoices = invoices.filter((i) => i.status === "paid").reduce((s, i) => s + i.amount, 0);
  const unpaid = invoices.filter((i) => i.status !== "paid").reduce((s, i) => s + i.amount, 0);
  const ledgerIncome = rows.filter((r) => r.kind === "income").reduce((s, r) => s + r.amount, 0);
  const expenses = rows.filter((r) => r.kind === "expense").reduce((s, r) => s + r.amount, 0);
  const income = paidInvoices + ledgerIncome;
  const mrr = listClients().reduce((s, c) => s + clientMonthly(c), 0);
  const mk = (ts) => new Date(ts).toISOString().slice(0, 7);
  const by = {};
  for (const r of rows) {
    const k = mk(r.ts);
    (by[k] ||= { income: 0, expenses: 0 })[r.kind === "income" ? "income" : "expenses"] += r.amount;
  }
  for (const iv of invoices) {
    if (iv.status === "paid" && iv.paid_at) (by[mk(iv.paid_at)] ||= { income: 0, expenses: 0 }).income += iv.amount;
  }
  const monthly = Object.entries(by).map(([month, v]) => ({ month, income: v.income, expenses: v.expenses, net: v.income - v.expenses })).sort((a, b) => b.month.localeCompare(a.month)).slice(0, 12);
  return json({ ok: true, rows, summary: { income, expenses, net: income - expenses, unpaid, mrr }, monthly });
};
const POST = async ({ request }) => {
  let b;
  try {
    b = await request.json();
  } catch {
    return json({ error: "Invalid JSON" }, 400);
  }
  const kind = b.kind === "income" ? "income" : "expense";
  addLedger({ ts: b.ts, kind, category: b.category, amount: Number(b.amount || 0), note: b.note });
  return json({ ok: true });
};
const DELETE = ({ url }) => {
  const id = url.searchParams.get("id");
  if (id) deleteLedger(Number(id));
  return json({ ok: true });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  DELETE,
  GET,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
