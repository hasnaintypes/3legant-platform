"use client";

import { Link } from "react-router-dom";
import { Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import QuantitySelector from "./quantity-selector";
import { useCartStore } from "@/store/useCartStore";

function CartItem({ item }) {
  const { updateCartItem, removeFromCart } = useCartStore();

  const handleQuantityUpdate = async (newQuantity) => {
    if (newQuantity < 1) return;
    if (newQuantity > item.product.stock) return;
    await updateCartItem(item._id, newQuantity);
  };

  const handleRemoveItem = async () => {
    await removeFromCart(item._id);
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card">
      <div className="flex flex-col sm:flex-row p-4 gap-4">
        <div className="relative w-full sm:w-32 h-32 bg-muted rounded-md overflow-hidden flex-shrink-0">
          <img
            src={item.product.images[0] || "/placeholder.svg"}
            alt={item.product.name}
            className="w-full h-full object-cover"
          />
          {item.product.badge && (
            <Badge className="absolute top-2 left-2">
              {item.product.badge}
            </Badge>
          )}
        </div>

        <div className="flex-1 space-y-3">
          <div>
            <Link
              to={`/product/${item.product._id}`}
              className="hover:underline"
            >
              <h3 className="font-semibold text-lg">{item.product.name}</h3>
            </Link>
            <p className="text-sm text-muted-foreground">
              {item.product.brand} • SKU: {item.product.SKU}
            </p>
          </div>

          <div className="flex flex-wrap gap-2 text-sm">
            <span className="bg-muted px-2 py-1 rounded-md">
              Color: {item.color}
            </span>
            <span className="bg-muted px-2 py-1 rounded-md">
              Size: {item.size}
            </span>
          </div>

          <div className="flex flex-wrap justify-between items-center gap-4 pt-2">
            <QuantitySelector
              quantity={item.quantity}
              maxQuantity={item.product.stock}
              onUpdate={handleQuantityUpdate}
            />

            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleRemoveItem}
                aria-label="Remove item"
              >
                <Trash2 className="h-5 w-5 text-muted-foreground" />
              </Button>

              <div className="text-right">
                {item.price !== item.finalPrice && (
                  <p className="text-sm line-through text-muted-foreground">
                    ${item.price.toFixed(2)}
                  </p>
                )}
                <p className="font-semibold">
                  ${item.finalPrice.toFixed(2)} × {item.quantity}
                </p>
                <p className="font-bold">${item.totalPrice.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartItem;
