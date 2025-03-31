"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export default function ProductGallery({ images = [], badge }) {
  const [selectedImage, setSelectedImage] = useState(0);

  // Use placeholder if no images
  const displayImages = images?.length > 0 ? images : ["/placeholder.svg"];

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square overflow-hidden rounded-xl border bg-background shadow-sm">
        {badge && <Badge className="absolute left-4 top-4 z-10">{badge}</Badge>}
        <img
          src={displayImages[selectedImage] || "/placeholder.svg"}
          alt="Product"
          className="h-full w-full object-cover transition-all duration-300"
        />
      </div>

      {/* Thumbnails */}
      {displayImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
          {displayImages.map((image, index) => (
            <button
              key={index}
              className={cn(
                "relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border transition-all duration-200",
                selectedImage === index
                  ? "ring-2 ring-primary border-primary"
                  : "opacity-70 hover:opacity-100"
              )}
              onClick={() => setSelectedImage(index)}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`Product thumbnail ${index + 1}`}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
