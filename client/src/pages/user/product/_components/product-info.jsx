"use client";

import { useState, useEffect } from "react";
import {
  Star,
  Heart,
  ShoppingCart,
  Truck,
  RefreshCw,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useCartStore } from "@/store/useCartStore";
import { useWishlistStore } from "@/store/useWishlistStore";

export default function ProductInfo({ product }) {
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addToCart, isLoading } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } =
    useWishlistStore();

  useEffect(() => {
    // Set default selected color and size when product loads
    if (product) {
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }
      if (product.sizes && product.sizes.length > 0) {
        setSelectedSize(product.sizes[0]);
      }
      // Check if product is in wishlist
      const checkWishlistStatus = async () => {
        const status = await isInWishlist(product._id);
        setIsWishlisted(status);
      };
      checkWishlistStatus();
    }
  }, [product, isInWishlist]);

  const handleAddToCart = async () => {
    if (!product.stock || product.stock < 1) {
      toast.error("Product is out of stock");
      return;
    }
    if (product.colors?.length > 0 && !selectedColor) {
      toast.error("Please select a color");
      return;
    }
    if (product.sizes?.length > 0 && !selectedSize) {
      toast.error("Please select a size");
      return;
    }

    try {
      const result = await addToCart(
        product._id,
        quantity,
        selectedColor,
        selectedSize
      );
      if (result) {
        toast.success("Product added to cart");
      }
    } catch (error) {
      toast.error("Failed to add product to cart");
    }
  };

  const handleWishlistClick = async () => {
    try {
      if (isWishlisted) {
        await removeFromWishlist(product._id);
        setIsWishlisted(false);
        toast.success("Product removed from wishlist");
      } else {
        await addToWishlist(product._id);
        setIsWishlisted(true);
        toast.success("Product added to wishlist");
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity < 1) return;
    if (product && newQuantity > product.stock) {
      toast.error(`Only ${product.stock} items available`);
      return;
    }
    setQuantity(newQuantity);
  };

  const discountedPrice = product.finalPrice;
  const originalPrice = product.price;
  const discount = product.discountPercentage;
  const hasDiscount = discount > 0;

  return (
    <div className="space-y-6">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">{product.brand}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2 justify-end">
              {hasDiscount && (
                <span className="text-lg text-muted-foreground line-through">
                  ${originalPrice.toFixed(2)}
                </span>
              )}
              <span className="text-2xl font-bold">
                ${discountedPrice.toFixed(2)}
              </span>
            </div>
            {hasDiscount && (
              <Badge variant="destructive" className="ml-2">
                {discount}% OFF
              </Badge>
            )}
          </div>
        </div>

        {/* Ratings */}
        <div className="mt-2 flex items-center gap-2">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${
                  star <= product.ratings?.averageRating
                    ? "fill-yellow-400 text-yellow-400"
                    : "fill-gray-200 text-gray-200"
                }`}
              />
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {product.ratings?.totalReviews || 0} reviews
          </span>
        </div>
      </div>

      <Separator />

      {/* Short description */}
      <div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {product.description.length > 200
            ? `${product.description.substring(0, 200)}...`
            : product.description}
        </p>
      </div>

      {/* Color selection */}
      {product.colors && product.colors.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="color" className="text-base">
              Color: <span className="font-medium">{selectedColor}</span>
            </Label>
            <span className="text-sm text-muted-foreground">
              {product.colors.length} options
            </span>
          </div>
          <div className="flex flex-wrap gap-3">
            {product.colors.map((color) => {
              // Map common color names to hex values
              const colorMap = {
                Red: "#ef4444",
                Blue: "#3b82f6",
                Green: "#22c55e",
                Yellow: "#eab308",
                Purple: "#a855f7",
                Pink: "#ec4899",
                Black: "#000000",
                White: "#ffffff",
                Gray: "#6b7280",
                Orange: "#f97316",
                Brown: "#92400e",
                Silver: "#c0c0c0",
                Gold: "#ffd700",
              };

              const bgColor = colorMap[color] || "#cbd5e1"; // Default to slate-300

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`group relative h-12 w-12 rounded-full transition-all duration-200 ${
                    selectedColor === color
                      ? "ring-2 ring-primary ring-offset-2"
                      : "hover:ring-1 hover:ring-primary/50 hover:ring-offset-1"
                  }`}
                  title={color}
                >
                  <span
                    className="absolute inset-0 rounded-full"
                    style={{ backgroundColor: bgColor }}
                  />
                  {selectedColor === color && (
                    <span className="absolute inset-0 flex items-center justify-center">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-white drop-shadow-md"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </span>
                  )}
                  <span className="sr-only">{color}</span>
                </button>
              );
            })}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Selected: {selectedColor}
          </p>
        </div>
      )}

      {/* Size selection */}
      {product.sizes && product.sizes.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <Label htmlFor="size" className="text-base">
              Size: <span className="font-medium">{selectedSize}</span>
            </Label>
            <span className="text-sm text-muted-foreground">
              {product.sizes.length} options
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {product.sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setSelectedSize(size)}
                className={`flex h-11 w-11 items-center justify-center rounded-md border text-sm font-medium transition-all duration-200 ${
                  selectedSize === size
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-input bg-background hover:bg-accent hover:text-accent-foreground"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Quantity and stock */}
      <div className="flex items-center gap-4">
        <div className="flex items-center">
          <Button
            variant="outline"
            size="icon"
            className="rounded-r-none"
            onClick={() => handleQuantityChange(quantity - 1)}
            disabled={quantity <= 1}
          >
            -
          </Button>
          <div className="flex h-10 w-12 items-center justify-center border-y border-input bg-background">
            {quantity}
          </div>
          <Button
            variant="outline"
            size="icon"
            className="rounded-l-none"
            onClick={() => handleQuantityChange(quantity + 1)}
            disabled={product.stock <= quantity}
          >
            +
          </Button>
        </div>
        <span className="text-sm text-muted-foreground">
          {product.stock > 0 ? (
            <>
              <span className="text-green-600 font-medium">In Stock</span> (
              {product.stock} available)
            </>
          ) : (
            <span className="text-red-500 font-medium">Out of Stock</span>
          )}
        </span>
      </div>

      {/* Add to cart and wishlist */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Button
          className="w-full gap-2 h-12 text-base"
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || isLoading}
        >
          <ShoppingCart className="h-5 w-5" />
          <span>{isLoading ? "Adding..." : "Add to Cart"}</span>
        </Button>
        <Button
          variant="outline"
          className="w-full gap-2 h-12 text-base"
          onClick={handleWishlistClick}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-black" : ""}`} />
          <span className="sm:inline">
            {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          </span>
        </Button>
      </div>

      {/* Mobile sticky add to cart */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-background border-t p-3 z-50 flex gap-2">
        <Button
          className="flex-1 gap-2"
          onClick={handleAddToCart}
          disabled={product.stock <= 0 || isLoading}
        >
          <ShoppingCart className="h-5 w-5" />
          <span>{isLoading ? "Adding..." : "Add to Cart"}</span>
        </Button>
        <Button
          variant="outline"
          size="icon"
          className="h-10 w-10"
          onClick={handleWishlistClick}
        >
          <Heart className={`h-5 w-5 ${isWishlisted ? "fill-black" : ""}`} />
        </Button>
      </div>

      {/* Product info */}
      <div className="space-y-3 text-sm bg-muted/50 p-4 rounded-lg">
        <div className="flex items-center gap-2">
          <Truck className="h-4 w-4 text-muted-foreground" />
          <span>Free shipping on orders over $50</span>
        </div>
        {product.SKU && (
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">SKU:</span>
            <span>{product.SKU}</span>
          </div>
        )}
        {product.warranty && (
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-muted-foreground" />
            <span>{product.warranty}</span>
          </div>
        )}
        {product.returnPolicy && (
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 text-muted-foreground" />
            <span>{product.returnPolicy}</span>
          </div>
        )}
      </div>
    </div>
  );
}
