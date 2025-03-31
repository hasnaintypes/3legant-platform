import { useState } from "react";
import {
  MoreHorizontal,
  Edit,
  Trash,
  Eye,
  Copy,
  Tag,
  Star,
  StarOff,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function ProductCard({
  product,
  onEdit,
  onDelete,
  onToggleFeatured,
  onDuplicate,
}) {
  const [isHovered, setIsHovered] = useState(false);

  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(price);
  };

  return (
    <Card
      className="overflow-hidden transition-all duration-200 hover:shadow-md"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {product.images && product.images.length > 0 ? (
          <img
            src={product.images[0] || "/placeholder.svg"}
            alt={product.name}
            className="h-full w-full object-cover transition-transform duration-300 ease-in-out"
            style={{ transform: isHovered ? "scale(1.05)" : "scale(1)" }}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-muted-foreground">No image</span>
          </div>
        )}

        {/* Badge */}
        {product.badge && product.badge !== "none" && (
          <Badge className="absolute left-2 top-2 bg-primary text-primary-foreground">
            {product.badge}
          </Badge>
        )}

        {/* Featured indicator */}
        {product.isFeatured && (
          <Badge className="absolute right-2 top-2 bg-amber-500 text-white">
            <Star className="mr-1 h-3 w-3" />
            Featured
          </Badge>
        )}

        {/* Stock indicator */}
        {product.stock <= 5 && (
          <Badge className="absolute bottom-2 left-2 bg-destructive text-destructive-foreground">
            {product.stock === 0
              ? "Out of Stock"
              : `Low Stock: ${product.stock}`}
          </Badge>
        )}

        {/* Actions dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/80 opacity-0 transition-opacity hover:bg-background/90 group-hover:opacity-100"
              style={{ opacity: isHovered ? 1 : 0 }}
            >
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={() => onEdit(product)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => window.open(`/product/${product.id}`, "_blank")}
            >
              <Eye className="mr-2 h-4 w-4" />
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDuplicate(product.id)}>
              <Copy className="mr-2 h-4 w-4" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onToggleFeatured(product.id, !product.isFeatured)}
            >
              {product.isFeatured ? (
                <>
                  <StarOff className="mr-2 h-4 w-4" />
                  Remove Featured
                </>
              ) : (
                <>
                  <Star className="mr-2 h-4 w-4" />
                  Mark as Featured
                </>
              )}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => onDelete(product.id)}
              className="text-destructive focus:text-destructive"
            >
              <Trash className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <CardContent className="p-4">
        <div className="mb-1 flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">
            {product.brand}
          </span>
          {product.category && product.category.length > 0 && (
            <Badge variant="outline" className="flex items-center gap-1">
              <Tag className="h-3 w-3" />
              {product.category[0]}
            </Badge>
          )}
        </div>
        <h3 className="mb-1 font-semibold">{truncateText(product.name, 40)}</h3>
        <p className="mb-2 text-sm text-muted-foreground">
          {truncateText(product.description, 60)}
        </p>

        <div className="flex items-baseline gap-2">
          <span className="text-lg font-bold">
            {formatPrice(product.finalPrice)}
          </span>
          {product.discountPercentage > 0 && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.price)}
            </span>
          )}
          {product.discountPercentage > 0 && (
            <Badge
              variant="outline"
              className="ml-auto text-xs font-normal text-green-600"
            >
              {product.discountPercentage}% OFF
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t p-4">
        <div className="flex flex-wrap gap-1">
          {product.colors &&
            product.colors.slice(0, 3).map((color, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {color}
              </Badge>
            ))}
          {product.colors && product.colors.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{product.colors.length - 3}
            </Badge>
          )}
        </div>
        <Button size="sm" variant="outline" onClick={() => onEdit(product)}>
          <Edit className="mr-2 h-3 w-3" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  );
}
