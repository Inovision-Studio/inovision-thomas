import Link from "next/link";
import { db } from "@/lib/db";
import { PageHeader, Card } from "@/components/admin/ui";
import OrderStatusButton from "./OrderStatusButton";

export const dynamic = "force-dynamic";

const TABS = [
  { key: "open", label: "Open" },
  { key: "picked_up", label: "Picked up" },
  { key: "all", label: "All" },
] as const;

function itemsText(items: unknown): string {
  if (Array.isArray(items)) {
    return items
      .map((it) => {
        if (typeof it === "string") return it;
        if (it && typeof it === "object") {
          const o = it as Record<string, unknown>;
          if (o.note && !o.name) return `Note: ${o.note}`; // reservation note rides along as the last item
          const name = o.name ?? o.title ?? JSON.stringify(o);
          return o.qty ? `${name} ×${o.qty}` : String(name);
        }
        return String(it);
      })
      .join(", ");
  }
  return items ? JSON.stringify(items) : "—";
}

export default async function OrdersPage({ searchParams }: { searchParams: Promise<{ tab?: string }> }) {
  const { tab } = await searchParams;
  const active = TABS.find((t) => t.key === tab)?.key ?? "open";
  const where = active === "all" ? {} : { status: active };
  const orders = await db.order.findMany({ where, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Orders" sub="In-store pickup orders" />

      <div className="mb-5 flex gap-2">
        {TABS.map((t) => (
          <Link
            key={t.key}
            href={`/admin/orders?tab=${t.key}`}
            className={`rounded-full px-4 py-1.5 text-sm ${
              active === t.key ? "btn-accent" : "border border-white/20 text-white/70 hover:bg-white/5"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {orders.length === 0 ? (
        <Card>
          <p className="text-sm text-white/50">No orders in this view.</p>
        </Card>
      ) : (
        <div className="grid gap-3">
          {orders.map((o) => (
            <Card key={o.id} className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-display text-lg">{o.customer || "Guest"}</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${
                      o.status === "open" ? "bg-[var(--accent)]/20 text-[var(--accent)]" : "bg-white/10 text-white/60"
                    }`}
                  >
                    {o.status === "open" ? "OPEN" : "PICKED UP"}
                  </span>
                </div>
                <div className="mt-1 text-sm text-white/60">{o.phone || "no phone"}</div>
                <div className="mt-1 text-sm text-white/80">{itemsText(o.items)}</div>
                <div className="mt-1 text-xs text-white/40">{new Date(o.createdAt).toLocaleString()}</div>
              </div>
              <OrderStatusButton id={o.id} status={o.status} />
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
