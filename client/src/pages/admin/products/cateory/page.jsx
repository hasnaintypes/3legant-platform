import { ComingSoon } from "@/components/shared/coming-soon";

export function CategoriesPage() {
  return (
    <ComingSoon
      title="Product Categories"
      description="We're working on a comprehensive category management system that will allow you to organize your products efficiently."
      returnPath="/admin/products"
      returnLabel="Back to Products"
      estimatedTime="Coming in 2 weeks"
    />
  );
}

export default CategoriesPage;
