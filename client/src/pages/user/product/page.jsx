import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Loader2,
} from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

// Import components
import ProductGallery from "./_components/product-gallery";
import ProductInfo from "./_components/product-info";
import ProductDescription from "./_components/product-desc";
import ProductSpecs from "./_components/product-specs";
import ReviewSection from "./_components/review-section";
import RelatedProducts from "./_components/related-product";
import { ErrorDisplay } from "@/components/shared/error-display";

export default function ProductDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { product, getProductById, getProducts, isLoading, error } =
    useProductStore();

  const [relatedProducts, setRelatedProducts] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (id) {
        await getProductById(id);
      }
    };

    fetchProduct();

    return () => {
      // Clear product state when component unmounts
      useProductStore.getState().clearProductState();
    };
  }, [id, getProductById]);

  useEffect(() => {
    // Fetch related products based on category
    const fetchRelatedProducts = async () => {
      if (product && product.category) {
        // Get products from the same category
        const params = {
          category: product.category[0],
          limit: 4,
        };
        const result = await getProducts(params);
        if (result && result.products) {
          // Filter out the current product
          const filtered = result.products.filter((p) => p._id !== id);
          setRelatedProducts(filtered.slice(0, 4));
        }
      }
    };

    fetchRelatedProducts();
  }, [product, getProducts, id]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <ErrorDisplay message={error} onBack={() => navigate(-1)} />;
  }

  if (!product) {
    return (
      <ErrorDisplay message="Product not found" onBack={() => navigate(-1)} />
    );
  }

  return (
    <div className="bg-background min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2 hover:bg-transparent hover:text-primary"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to products
        </Button>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Gallery */}
          <ProductGallery images={product.images} badge={product.badge} />

          {/* Product Info */}
          <ProductInfo
            product={product}
            onAddToCart={() => toast.success("Product added to cart")}
            onAddToWishlist={() => toast.success("Product added to wishlist")}
          />
        </div>

        <div className="mt-16 grid gap-16">
          {/* Product Description */}
          <ProductDescription description={product.description} />

          {/* Product Specifications */}
          <ProductSpecs product={product} />

          {/* Reviews Section */}
          <ReviewSection
            reviews={product.reviews || []}
            averageRating={product.ratings?.averageRating || 0}
            totalReviews={product.ratings?.totalReviews || 0}
            productId={product._id}
          />

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <RelatedProducts products={relatedProducts} />
          )}
        </div>
      </div>
    </div>
  );
}
