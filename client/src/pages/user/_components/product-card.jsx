"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useState, useEffect } from "react";

export function ProductCard({
  id,
  name,
  price,
  image,
  rating,
  badge,
  category,
  onAddToCart,
  onAddToWishlist,
}) {
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      const status = await isInWishlist(id);
      setIsWishlisted(status);
    };
    checkWishlistStatus();
  }, [id, isInWishlist]);

  const handleWishlistClick = async () => {
    if (isWishlisted) {
      await removeFromWishlist(id);
      setIsWishlisted(false);
    } else {
      await addToWishlist(id);
      setIsWishlisted(true);
    }
    onAddToWishlist(id);
  };

  return (
    <div className="group relative w-full">
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg bg-gray-100">
        {badge && (
          <Badge className="absolute left-2 top-2 z-10 bg-white text-black">
            {badge}
          </Badge>
        )}
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-2 z-10 hover:bg-white/20"
          onClick={handleWishlistClick}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-black" : ""}`} />
        </Button>
        <Link to={`/product/${id}`}>
          <img
            src={image || "/placeholder.svg"}
            alt={name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />
        </Link>
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-all duration-200 group-hover:opacity-100 bg-gradient-to-t from-black/80 to-transparent">
          <Button
            className="w-full bg-white text-black hover:bg-black hover:text-white transition-colors duration-300"
            onClick={() => onAddToCart(id)}
          >
            Add to cart
          </Button>
        </div>
      </div>
      <div className="mt-4 space-y-1">
        {category && (
          <Badge variant="outline" className="text-xs">
            {Array.isArray(category) ? category[0] : category}
          </Badge>
        )}
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${
                i < rating ? "fill-yellow-400" : "fill-gray-200"
              }`}
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <h3 className="font-medium line-clamp-2">{name}</h3>
        <p className="text-sm text-gray-600">${price.toFixed(2)}</p>
      </div>
    </div>
  );
}
