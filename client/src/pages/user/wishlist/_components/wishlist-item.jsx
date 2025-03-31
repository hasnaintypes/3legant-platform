"use client";

import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function WishlistItem({ item, onRemove }) {
  const navigate = useNavigate();
  const discount = item.originalPrice
    ? Math.round(((item.originalPrice - item.price) / item.originalPrice) * 100)
    : 0;

  const handleProductClick = () => {
    navigate(`/product/${item._id}`);
  };

  return (
    <Card className="overflow-hidden cursor-pointer">
      <div className="relative">
        <img
          src={item.images?.[0] || "/placeholder.svg"}
          alt={item.name}
          className="w-full h-48 object-cover"
          onClick={handleProductClick}
        />
        {discount > 0 && (
          <Badge className="absolute top-2 right-2 bg-red-500">
            {discount}% OFF
          </Badge>
        )}
        {item.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="outline" className="text-white border-white">
              Out of Stock
            </Badge>
          </div>
        )}
      </div>
      <CardContent className="p-4">
        <h3 className="font-medium line-clamp-2 h-12">{item.name}</h3>
        <div className="mt-2 flex items-center">
          <span className="font-bold text-lg">${item.price.toFixed(2)}</span>
          {item.originalPrice && (
            <span className="ml-2 text-sm text-muted-foreground line-through">
              ${item.originalPrice.toFixed(2)}
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex gap-2">
        <Button className="flex-1" size="sm" disabled={item.stock === 0}>
          <ShoppingCart className="mr-2 h-4 w-4" />
          Add to Cart
        </Button>
        <Button variant="outline" size="sm" onClick={onRemove}>
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
