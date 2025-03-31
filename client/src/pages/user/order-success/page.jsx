import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, PackageSearch, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useOrderStore } from "@/store/useOrderStore";

export default function OrderSuccessPage() {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId");
  const { getOrderById, order, isLoading } = useOrderStore();
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!orderId) {
        setError("Order ID not found");
        return;
      }
      await getOrderById(orderId);
    };

    fetchOrder();
  }, [orderId, getOrderById]);

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <div className="mb-6 text-red-500">
          <PackageSearch className="mx-auto h-16 w-16" />
        </div>
        <h1 className="mb-4 text-2xl font-bold">Order Not Found</h1>
        <p className="mb-8 text-muted-foreground">{error}</p>
        <Button asChild>
          <a href="/">Continue Shopping</a>
        </Button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <Loader2 className="mx-auto h-16 w-16 animate-spin" />
        <p className="mt-4 text-muted-foreground">Loading order details...</p>
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="mb-12 text-center">
        <div className="mb-6 text-green-500">
          <CheckCircle2 className="mx-auto h-16 w-16" />
        </div>
        <h1 className="mb-4 text-3xl font-bold">Order Confirmed!</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Thank you for your purchase. Your order has been confirmed and will be
          shipped soon.
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <Card className="p-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">Order Details</h3>
              <p className="text-sm text-muted-foreground">
                Order #{order._id}
              </p>
            </div>

            <Separator />

            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex items-center justify-between gap-4"
                >
                  <div className="flex items-center gap-4">
                    <div className="min-w-[120px]">
                      <p className="text-sm text-muted-foreground">
                        {item.color} / {item.size} × {item.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-right">
                    ${(item.finalPrice * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex justify-between">
                <p className="text-muted-foreground">Subtotal</p>
                <p>${order.subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Shipping</p>
                <p>${order.shippingCost.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p className="text-muted-foreground">Tax</p>
                <p>
                  $
                  {(
                    order.finalTotal -
                    order.subtotal -
                    order.shippingCost
                  ).toFixed(2)}
                </p>
              </div>
              <div className="flex justify-between font-medium text-lg">
                <p>Total</p>
                <p>${order.finalTotal.toFixed(2)}</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="mb-2 text-lg font-semibold">Shipping Address</h3>
              <p>
                {order.shippingAddress.firstName}{" "}
                {order.shippingAddress.lastName}
              </p>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.city}, {order.shippingAddress.postalCode}
              </p>
              <p>{order.shippingAddress.country}</p>
              <p>{order.shippingAddress.phone}</p>
            </div>

            <div className="flex flex-col sm:flex-row justify-between gap-4">
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <a href="/">Continue Shopping</a>
              </Button>
              <Button asChild className="w-full sm:w-auto">
                <a href="/profile/orders">
                  View Orders
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
