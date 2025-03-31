import { ComingSoon } from "@/components/shared/coming-soon";

export function InventoryPage() {
  return (
    <ComingSoon
      title="Inventory Management"
      description="Advanced inventory tracking, stock alerts, and warehouse management features are on the way."
      returnPath="/admin/products"
      returnLabel="Back to Products"
      estimatedTime="Coming in 4 weeks"
    />
  );
}

export default InventoryPage;
