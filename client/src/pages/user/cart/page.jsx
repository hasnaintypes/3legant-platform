"use client";

import { useEffect } from "react";
import CartItems from "./_components/cart-items";
import CartSummary from "./_components/cart-summary";
import EmptyCart from "./_components/empty-cart";
import { Skeleton } from "@/components/ui/skeleton";
import { useCartStore } from "@/store/useCartStore";

function CartPage() {
  const { cartItems, isLoading, getCart } = useCartStore();

  useEffect(() => {
    getCart();
  }, [getCart]);

  if (isLoading) {
    return <CartSkeleton />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>

      {!cartItems || cartItems.length === 0 ? (
        <EmptyCart />
      ) : (
        <div className="grid gap-8 md:grid-cols-3">
          <div className="md:col-span-2 space-y-4">
            <CartItems items={cartItems} />
          </div>
          <div>
            <CartSummary
              cart={{
                totalItems: cartItems.length,
                subtotal: cartItems.reduce(
                  (total, item) => total + item.price * item.quantity,
                  0
                ),
                discount: cartItems.reduce(
                  (total, item) =>
                    total + (item.price - item.finalPrice) * item.quantity,
                  0
                ),
                finalTotal: cartItems.reduce(
                  (total, item) => total + item.finalPrice * item.quantity,
                  0
                ),
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}

function CartSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Shopping Cart</h1>
      <div className="grid gap-8 md:grid-cols-3">
        <div className="md:col-span-2 space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border rounded-lg p-4 flex gap-4">
              <Skeleton className="h-24 w-24 rounded-md" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="flex justify-between">
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div>
          <div className="border rounded-lg p-6 sticky top-4 space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
