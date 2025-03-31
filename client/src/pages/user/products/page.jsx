"use client";

import { useState, useEffect } from "react";
import { ProductCard } from "./_components/product-card";
import PriceRangeFilter from "./_components/price-range-filter";
import ColorFilter from "./_components/color-filter";
import SizeFilter from "./_components/size-filter";
import ProductPagination from "./_components/product-pagination";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, SlidersHorizontal, Loader2 } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { toast } from "sonner";

export default function ProductsPage() {
  const {
    products,
    categories: apiCategories,
    pagination,
    getProducts,
    getProductCategories,
    isLoading,
    error,
  } = useProductStore();

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 600]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [sortOption, setSortOption] = useState("featured");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  // Mobile filter visibility
  const [showFilters, setShowFilters] = useState(false);

  // Fetch products and categories on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        await Promise.all([getProducts(), getProductCategories()]);
      } catch (err) {
        toast.error("Failed to load products");
      }
    };

    fetchData();
  }, [getProducts, getProductCategories]);

  // Display error if any
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  // Handle adding to cart
  const handleAddToCart = (id) => {
    console.log(`Added product ${id} to cart`);
    toast.success("Product added to cart");
  };

  // Handle adding to wishlist
  const handleAddToWishlist = (id) => {
    console.log(`Added product ${id} to wishlist`);
    toast.success("Product added to wishlist");
  };

  // Prepare categories for filtering
  const categories = ["All", ...(apiCategories || [])];

  // Fetch products and categories when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Build query params
        const params = {
          page: currentPage,
          limit: productsPerPage,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          colors:
            selectedColors.length > 0 ? selectedColors.join(",") : undefined,
          sizes: selectedSizes.length > 0 ? selectedSizes.join(",") : undefined,
          category: selectedCategory !== "All" ? selectedCategory : undefined,
        };

        // Add sorting
        switch (sortOption) {
          case "price-low-high":
            params.sort = "finalPrice";
            break;
          case "price-high-low":
            params.sort = "-finalPrice";
            break;
          case "rating":
            params.sort = "-rating";
            break;
          default: // featured
            params.sort = "-featured";
        }

        await getProducts(params);
      } catch (err) {
        toast.error("Failed to load products");
      }
    };

    fetchData();
  }, [
    currentPage,
    priceRange,
    selectedColors,
    selectedSizes,
    selectedCategory,
    sortOption,
    getProducts,
    productsPerPage,
  ]);

  // Remove the manual filtering logic since it's now handled by the API
  const filteredProducts = products;

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortOption) {
      case "price-low-high":
        return a.price - b.price;
      case "price-high-low":
        return b.price - a.price;
      case "rating":
        return b.rating - a.rating;
      default:
        return 0; // Featured - no specific sorting
    }
  });

  // Calculate pagination using API response
  const totalPages = pagination?.totalPages || 1;
  const currentProducts = products || [];
  const indexOfFirstProduct = (currentPage - 1) * productsPerPage;
  const indexOfLastProduct = indexOfFirstProduct + productsPerPage;

  // Handle page change
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Handle color selection
  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
    setCurrentPage(1);
  };

  // Handle size selection
  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
    setCurrentPage(1);
  };

  // Reset all filters
  const resetFilters = () => {
    setPriceRange([0, 600]);
    setSelectedColors([]);
    setSelectedSizes([]);
    setSelectedCategory("All");
    setSortOption("featured");
    setCurrentPage(1);
  };

  // Effect to close filters on larger screens
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setShowFilters(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="bg-background">
      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Page title */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold">Shop</h2>
          <p className="text-muted-foreground">
            Discover our curated collection of elegant home decor and furniture
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-[280px_1fr] gap-8">
          {/* Mobile filter button */}
          <div className="lg:hidden mb-4 flex justify-between items-center">
            <Button
              variant="outline"
              onClick={() => setShowFilters(true)}
              className="flex items-center gap-2"
            >
              <SlidersHorizontal className="h-4 w-4" />
              Filters
            </Button>

            <Select value={sortOption} onValueChange={setSortOption}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="featured">Featured</SelectItem>
                <SelectItem value="price-low-high">
                  Price: Low to High
                </SelectItem>
                <SelectItem value="price-high-low">
                  Price: High to Low
                </SelectItem>
                <SelectItem value="rating">Top Rated</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile filter sidebar */}
          {showFilters && (
            <div className="fixed inset-0 z-50 bg-background p-6 overflow-y-auto lg:hidden">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold">Filters</h3>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowFilters(false)}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>

              <div className="space-y-8">
                <div>
                  <h4 className="font-medium mb-4">Category</h4>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <Button
                        key={category}
                        variant={
                          selectedCategory === category ? "default" : "outline"
                        }
                        className="mr-2 mb-2"
                        onClick={() => {
                          setSelectedCategory(category);
                          setCurrentPage(1);
                        }}
                      >
                        {category}
                      </Button>
                    ))}
                  </div>
                </div>

                <PriceRangeFilter value={priceRange} onChange={setPriceRange} />
                <ColorFilter
                  onColorChange={handleColorChange}
                  selectedColors={selectedColors}
                />
                <SizeFilter
                  onSizeChange={handleSizeChange}
                  selectedSizes={selectedSizes}
                />

                <div className="pt-4 flex gap-4">
                  <Button
                    variant="outline"
                    onClick={resetFilters}
                    className="flex-1"
                  >
                    Reset
                  </Button>
                  <Button
                    onClick={() => setShowFilters(false)}
                    className="flex-1"
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Desktop sidebar */}
          <aside className="hidden lg:block space-y-8">
            <div>
              <h4 className="font-medium mb-4">Category</h4>
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={
                      selectedCategory === category ? "default" : "outline"
                    }
                    className="mr-2 mb-2"
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </div>

            <PriceRangeFilter value={priceRange} onChange={setPriceRange} />
            <ColorFilter
              onColorChange={handleColorChange}
              selectedColors={selectedColors}
            />
            <SizeFilter
              onSizeChange={handleSizeChange}
              selectedSizes={selectedSizes}
            />

            <Button variant="outline" onClick={resetFilters} className="w-full">
              Reset Filters
            </Button>
          </aside>

          {/* Product grid section */}
          <div>
            {/* Desktop sorting */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-muted-foreground">
                Showing {indexOfFirstProduct + 1}-
                {Math.min(indexOfLastProduct, sortedProducts.length)} of{" "}
                {sortedProducts.length} products
              </p>

              <Select value={sortOption} onValueChange={setSortOption}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-low-high">
                    Price: Low to High
                  </SelectItem>
                  <SelectItem value="price-high-low">
                    Price: High to Low
                  </SelectItem>
                  <SelectItem value="rating">Top Rated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Loading state */}
            {isLoading ? (
              <div className="py-12 text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p>Loading products...</p>
              </div>
            ) : currentProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentProducts.map((product) => (
                  <ProductCard
                    key={product._id}
                    id={product._id}
                    name={product.name}
                    price={product.finalPrice || product.price}
                    image={product.images?.[0] || "/placeholder.svg"}
                    rating={product.rating || 0}
                    badge={
                      product.badge ||
                      (product.discountPercentage > 0 ? "Sale" : null)
                    }
                    onAddToCart={handleAddToCart}
                    onAddToWishlist={handleAddToWishlist}
                    category={product.category}
                    colors={product.colors}
                  />
                ))}
              </div>
            ) : (
              <div className="py-12 text-center">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">
                  Try adjusting your filters to find what you're looking for.
                </p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            )}

            {/* Pagination */}
            {sortedProducts.length > productsPerPage && (
              <div className="mt-12">
                <ProductPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
