import { Link } from "react-router-dom";
import { ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";

function EmptyCart() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted rounded-full p-6 mb-6">
        <ShoppingBag className="h-12 w-12 text-muted-foreground" />
      </div>
      <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
      <p className="text-muted-foreground mb-6 max-w-md">
        Looks like you haven't added anything to your cart yet. Browse our
        products and find something you'll love!
      </p>
      <Link to="/products">
        <Button size="lg">
          <ShoppingBag className="mr-2 h-4 w-4" />
          Start Shopping
        </Button>
      </Link>
    </div>
  );
}

export default EmptyCart;
