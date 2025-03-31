"use client";

import { useNavigate } from "react-router-dom";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

function CartSummary({ cart }) {
  const navigate = useNavigate();

  const handleCheckout = () => {
    navigate("/checkout");
  };

  if (!cart) return null;

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span>Subtotal ({cart.totalItems} items)</span>
          <span>${cart.subtotal.toFixed(2)}</span>
        </div>

        {cart.discount > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${cart.discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between">
          <span>Shipping</span>
          <span>Calculated at checkout</span>
        </div>

        <Separator />

        <div className="flex justify-between font-bold text-lg">
          <span>Total</span>
          <span>${cart.finalTotal.toFixed(2)}</span>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button
          className="w-full"
          size="lg"
          onClick={handleCheckout}
          disabled={!cart.totalItems}
        >
          Checkout
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => navigate("/products")}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          Continue Shopping
        </Button>
      </CardFooter>
    </Card>
  );
}

export default CartSummary;
