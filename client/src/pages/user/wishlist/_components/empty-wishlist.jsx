"use client";

import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export function EmptyWishlist() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <Heart className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">Your wishlist is empty</h3>
      <p className="text-muted-foreground mb-6 max-w-md">
        Items added to your wishlist will appear here. Start browsing and save
        items you love for later.
      </p>
      <Button>Start Shopping</Button>
    </div>
  );
}
