"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWishlistStore } from "@/store/useWishlistStore";
import { useCartStore } from "@/store/useCartStore";
import { useState, useEffect } from "react";

export function ProductCard({
  id,
  name,
  price,
  image,
  rating,
  badge,
  category,
  colors,
}) {
  const navigate = useNavigate();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { addToCart, isLoading } = useCartStore();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  useEffect(() => {
    const checkWishlistStatus = async () => {
      const status = await isInWishlist(id);
      setIsWishlisted(status);
    };
    checkWishlistStatus();
  }, [id, isInWishlist]);

  const handleProductClick = () => {
    navigate(`/product/${id}`);
  };

  const handleWishlistClick = async () => {
    if (isWishlisted) {
      await removeFromWishlist(id);
      setIsWishlisted(false);
    } else {
      await addToWishlist(id);
      setIsWishlisted(true);
    }
  };

  const handleAddToCart = async () => {
    try {
      // If colors are available, use the first color as default
      const defaultColor = colors && colors.length > 0 ? colors[0] : "default";
      // Use default size if size is not applicable
      const defaultSize = "default";
      
      const result = await addToCart(id, 1, defaultColor, defaultSize);
      if (result) {
        setIsAddedToCart(true);
        setTimeout(() => setIsAddedToCart(false), 2000);
      }
    } catch (error) {
      console.error("Failed to add item to cart:", error);
    }
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
        <div className="cursor-pointer" onClick={handleProductClick}>
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.target.src = "/placeholder.svg";
            }}
          />
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-all duration-200 group-hover:opacity-100 bg-gradient-to-t from-black/80 to-transparent">
          <Button
            className={`w-full transition-colors duration-300 ${isAddedToCart ? "bg-green-500 hover:bg-green-600 text-white" : "bg-white text-black hover:bg-black hover:text-white"}`}
            onClick={handleAddToCart}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : isAddedToCart ? "Added to cart" : "Add to cart"}
          </Button>
        </div>
      </div>
      <div className="mt-4 space-y-1">
        <div className="flex items-center justify-between mb-1">
          {category && category.length > 0 && (
            <Badge variant="outline" className="text-xs">
              {category[0]}
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              className={`h-4 w-4 ${i < rating ? "fill-yellow-400" : "fill-gray-200"}`}
              viewBox="0 0 24 24"
            >
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
          ))}
        </div>
        <h3 className="font-medium line-clamp-2">{name}</h3>
        <p className="text-sm text-gray-600">${price.toFixed(2)}</p>
        {colors && colors.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {colors.slice(0, 3).map((color, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {color}
              </Badge>
            ))}
            {colors.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{colors.length - 3}
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
