import { PageHeader } from "@/components/admin/ui";
import ProductForm from "../ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <PageHeader title="New product" />
      <ProductForm />
    </div>
  );
}
