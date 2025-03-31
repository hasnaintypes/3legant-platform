import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/useCartStore";

const OrderSummary = ({ onBack, showBackButton }) => {
  const { cartItems, getCart } = useCartStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        await getCart();
      } catch (error) {
        console.error("Failed to load cart:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCart();
  }, [getCart]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const subtotal =
    cartItems?.reduce(
      (sum, item) => sum + (item.product.finalPrice || item.product.price) * item.quantity,
      0
    ) || 0;
  const shippingCost = 10; // You can make this dynamic based on shipping method
  const tax = subtotal * 0.1; // 10% tax rate
  const total = subtotal + shippingCost + tax;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Cart Items */}
        <div className="space-y-4">
          {cartItems?.map((item) => (
            <div key={item._id} className="flex justify-between items-start">
              <div className="flex items-start space-x-4">
                <div
                  className="w-16 h-16 bg-center bg-cover rounded"
                  style={{
                    backgroundImage: `url(${item.product.images[0]})`,
                  }}
                ></div>
                <div>
                  <p className="font-medium">{item.product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    Qty: {item.quantity}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {item.color} / {item.size}
                  </p>
                </div>
              </div>
              <p className="font-medium">
                ${(item.finalPrice * item.quantity).toFixed(2)}
              </p>
            </div>
          ))}
        </div>

        <Separator />

        {/* Order Details */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-muted-foreground">Subtotal</p>
            <p>${subtotal.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground">Shipping</p>
            <p>${shippingCost.toFixed(2)}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-muted-foreground">Tax</p>
            <p>${tax.toFixed(2)}</p>
          </div>
        </div>

        <Separator />

        {/* Total */}
        <div className="flex justify-between font-medium text-lg">
          <p>Total</p>
          <p>${total.toFixed(2)}</p>
        </div>

        {showBackButton && (
          <Button variant="outline" className="w-full mt-4" onClick={onBack}>
            Back
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default OrderSummary;
