"use client";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { useProductStore } from "@/store/useProductStore";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";

import { ProductCard } from "./product-card";
import { ProductEditModal } from "./product-edit-modal";
import { ProductFilters } from "./product-filters";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function AllProducts() {
  const navigate = useNavigate();
  const {
    products,
    pagination,
    categories: availableCategories,
    isLoading,
    error,
    getProducts,
    getProductCategories,
    updateProduct,
    deleteProduct,
  } = useProductStore();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(12);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deleteProductId, setDeleteProductId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({
    categories: [],
    inStock: false,
    featured: false,
    onSale: false,
    priceRange: null,
  });
  const [sortOption, setSortOption] = useState("newest");

  // Calculate pagination
  const totalPages = pagination?.totalPages || 1;
  const { pages, showLeftEllipsis, showRightEllipsis } = usePagination({
    currentPage,
    totalPages,
    paginationItemsToDisplay: 5,
  });

  // Fetch products and categories on component mount and when filters change
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Build query params
        const params = {
          page: currentPage,
          limit: itemsPerPage,
          search: searchQuery || undefined,
          category:
            filters.categories.length > 0
              ? filters.categories.join(",")
              : undefined,
          inStock: filters.inStock || undefined,
          featured: filters.featured || undefined,
          onSale: filters.onSale || undefined,
        };

        // Add sorting
        switch (sortOption) {
          case "price-asc":
            params.sort = "finalPrice";
            break;
          case "price-desc":
            params.sort = "-finalPrice";
            break;
          case "name-asc":
            params.sort = "name";
            break;
          case "name-desc":
            params.sort = "-name";
            break;
          case "stock-asc":
            params.sort = "stock";
            break;
          case "stock-desc":
            params.sort = "-stock";
            break;
          default: // newest
            params.sort = "-createdAt";
        }

        await Promise.all([getProducts(params), getProductCategories()]);
      } catch (err) {
        toast.error("Failed to fetch products", {
          description: err.message || "Please try again later",
        });
      }
    };

    fetchData();
  }, [
    currentPage,
    itemsPerPage,
    searchQuery,
    filters,
    sortOption,
    getProducts,
    getProductCategories,
  ]);

  // Show error toast when API call fails
  useEffect(() => {
    if (error) {
      toast.error("Operation failed", {
        description: error,
      });
    }
  }, [error]);

  // Handlers
  const handleEditProduct = (product) => {
    setEditingProduct(product);
    setIsEditModalOpen(true);
  };

  const handleSaveProduct = async (updatedProduct) => {
    const result = await updateProduct(updatedProduct.id, updatedProduct);
    if (result) {
      setIsEditModalOpen(false);
      setEditingProduct(null);
      // Refresh products list
      getProducts({ page: currentPage, limit: itemsPerPage });
    }
  };

  const handleDeleteProduct = (id) => {
    setDeleteProductId(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (deleteProductId) {
      const success = await deleteProduct(deleteProductId);
      if (success) {
        setIsDeleteDialogOpen(false);
        setDeleteProductId(null);
        // Refresh products list
        getProducts({ page: currentPage, limit: itemsPerPage });
      }
    }
  };

  const handleToggleFeatured = async (id, isFeatured) => {
    const product = products.find((p) => p.id === id);
    if (product) {
      await updateProduct(id, { ...product, isFeatured });
      // Refresh products list
      getProducts({ page: currentPage, limit: itemsPerPage });
    }
  };

  const handleDuplicateProduct = async (id) => {
    const productToDuplicate = products.find((p) => p.id === id);
    if (productToDuplicate) {
      const duplicatedProduct = {
        ...productToDuplicate,
        name: `${productToDuplicate.name} (Copy)`,
        SKU: `${productToDuplicate.SKU}-COPY`,
      };
      // Remove id to create a new product
      delete duplicatedProduct.id;
      const result = await useProductStore
        .getState()
        .createProduct(duplicatedProduct);
      if (result) {
        // Refresh products list
        getProducts({ page: currentPage, limit: itemsPerPage });
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold">Products</h1>
          <p className="text-sm text-muted-foreground">
            Manage your products, inventory, and categories
          </p>
        </div>
        <Button onClick={() => navigate("/admin/add-product")}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </div>

      <Separator className="mb-6" />

      <ProductFilters
        onSearch={setSearchQuery}
        onFilterChange={setFilters}
        onSortChange={setSortOption}
        activeFilters={filters}
        categories={availableCategories}
      />

      {isLoading ? (
        <div className="flex h-60 items-center justify-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-primary" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex h-60 flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center">
          <h3 className="mb-2 text-lg font-medium">No products found</h3>
          <p className="mb-4 text-sm text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
          <Button
            variant="outline"
            onClick={() => {
              setSearchQuery("");
              setFilters({
                categories: [],
                inStock: false,
                featured: false,
                onSale: false,
                priceRange: null,
              });
            }}
          >
            Reset Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onDelete={handleDeleteProduct}
                onToggleFeatured={handleToggleFeatured}
                onDuplicate={handleDuplicateProduct}
              />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    aria-disabled={currentPage === 1 ? true : undefined}
                  />
                </PaginationItem>

                {showLeftEllipsis && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                {pages.map((page) => (
                  <PaginationItem key={page}>
                    <PaginationLink
                      isActive={page === currentPage}
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                {showRightEllipsis && (
                  <PaginationItem>
                    <PaginationEllipsis />
                  </PaginationItem>
                )}

                <PaginationItem>
                  <PaginationNext
                    className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    aria-disabled={
                      currentPage === totalPages ? true : undefined
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}

      {/* Edit Modal */}
      <ProductEditModal
        product={editingProduct}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProduct(null);
        }}
        onSave={handleSaveProduct}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              product and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteProduct}
              className="bg-destructive text-destructive-foreground"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
