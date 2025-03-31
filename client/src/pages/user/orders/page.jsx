import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { OrdersTable } from "./_components/orders-table";
import { useOrderStore } from "@/store/useOrderStore";

export default function OrdersPage() {
  const { orders, getUserOrders, isLoading } = useOrderStore();

  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Order History</CardTitle>
        <CardDescription>View and manage your recent orders</CardDescription>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              You haven't placed any orders yet.
            </p>
          </div>
        ) : (
          <OrdersTable orders={orders} />
        )}
      </CardContent>
    </Card>
  );
}
