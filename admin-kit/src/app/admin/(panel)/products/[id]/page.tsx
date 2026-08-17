import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { PageHeader } from "@/components/admin/ui";
import ProductForm from "../ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const product = await db.product.findUnique({ where: { id: Number(id) } });
  if (!product) notFound();

  return (
    <div>
      <PageHeader title="Edit product" sub={product.name} />
      <ProductForm init={product} />
    </div>
  );
}
