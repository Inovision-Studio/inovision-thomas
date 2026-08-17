import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import CouponsClient from "./CouponsClient";

export const dynamic = "force-dynamic";

export default async function CouponsPage() {
  const coupons = await db.coupon.findMany({ orderBy: { id: "asc" } });
  return (
    <div>
      <PageHeader title="Coupons" sub="Slot-machine prizes and manual discount codes." />
      <CouponsClient coupons={coupons} />
    </div>
  );
}
