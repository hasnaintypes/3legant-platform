import { useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { WishlistItem } from "./_components/wishlist-item";
import { EmptyWishlist } from "./_components/empty-wishlist";
import { useWishlistStore } from "@/store/useWishlistStore";
import { Spinner } from "@/components/ui/spinner";

export default function WishlistPage() {
  const {
    items,
    loading,
    pagination,
    getWishlist,
    removeFromWishlist,
    clearWishlist,
  } = useWishlistStore();

  // Fetch wishlist items when component mounts
  useEffect(() => {
    getWishlist();
  }, []);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>My Wishlist</CardTitle>
          <CardDescription>
            {pagination.totalItems}{" "}
            {pagination.totalItems === 1 ? "item" : "items"} saved for later
          </CardDescription>
        </div>
        {items.length > 0 && (
          <Button variant="outline" size="sm" onClick={clearWishlist}>
            Clear All
          </Button>
        )}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-48">
            <Spinner />
          </div>
        ) : items.length === 0 ? (
          <EmptyWishlist />
        ) : (
          <div className="space-y-4">
            {!items.some((item) => item.product.stock > 0) && (
              <Alert variant="warning" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Attention</AlertTitle>
                <AlertDescription>
                  Some items in your wishlist are currently out of stock.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {items.map((item) => (
                <WishlistItem
                  key={item.product._id}
                  item={item.product}
                  onRemove={() => removeFromWishlist(item.product._id)}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
