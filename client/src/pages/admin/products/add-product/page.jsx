import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

import { ProductFormHeader } from "./_components/product-form-header";
import { ProductBasicInfo } from "./_components/product-basic-info";
import { ProductPricing } from "./_components/product-pricing";
import { ProductInventory } from "./_components/product-inventory";
import { ProductMedia } from "./_components/product-media";

import { useProductStore } from "@/store/useProductStore";
import { uploadFile } from "@/utils/uploadFile";

export default function AddProduct() {
  const navigate = useNavigate();
  const {
    createProduct,
    getProductCategories,
    getProductBrands,
    isLoading,
    error,
  } = useProductStore();

  // State for available categories and brands from API
  const [availableCategories, setAvailableCategories] = useState([]);
  const [availableBrands, setAvailableBrands] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    discountPercentage: "0",
    brand: "",
    stock: "0",
    SKU: "",
    warranty: "",
    returnPolicy: "",
    isFeatured: false,
    badge: "",
  });

  // Tags state
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);
  const [categories, setCategories] = useState([]);

  const [activeColorIndex, setActiveColorIndex] = useState(null);
  const [activeSizeIndex, setActiveSizeIndex] = useState(null);
  const [activeCategoryIndex, setActiveCategoryIndex] = useState(null);

  // Images state
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Calculate final price
  const finalPrice =
    formData.price && formData.discountPercentage
      ? Number.parseFloat(formData.price) -
        (Number.parseFloat(formData.price) *
          Number.parseFloat(formData.discountPercentage)) /
          100
      : 0;

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle switch changes
  const handleSwitchChange = (checked) => {
    setFormData((prev) => ({ ...prev, isFeatured: checked }));
  };

  // Handle select changes
  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    if (e.target.files) {
      const fileArray = Array.from(e.target.files);
      const newImages = [...images, ...fileArray];
      setImages(newImages);

      // Create preview URLs
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remove image
  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...imagePreviews];
    URL.revokeObjectURL(newPreviews[index]); // Clean up URL object
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  // Fetch categories and brands on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const categories = await getProductCategories();
        const brands = await getProductBrands();

        if (categories) {
          setAvailableCategories(categories);
        }

        if (brands) {
          setAvailableBrands(brands);
        }
      } catch (err) {
        toast.error("Failed to load product data", {
          description: err.message || "Please try again later",
        });
      }
    };

    fetchData();
  }, [getProductCategories, getProductBrands]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Validate required fields
      if (!formData.name || !formData.description || !formData.price) {
        toast.error("Missing required fields", {
          description: "Please fill in all required fields",
        });
        return;
      }

      if (categories.length === 0) {
        toast.error("Category is required", {
          description: "Please add at least one category",
        });
        return;
      }

      if (images.length === 0) {
        toast.error("Product images are required", {
          description: "Please upload at least one product image",
        });
        return;
      }

      // Upload images first
      setIsUploading(true);
      const imageUrls = [];
      const bucketId = import.meta.env.VITE_APPWRITE_BUCKET_PRODUCTS;

      if (!bucketId) {
        throw new Error("Product images bucket is not configured");
      }

      // Upload each image and collect URLs
      for (const image of images) {
        const result = await uploadFile(image, bucketId);
        if (result.success) {
          imageUrls.push(result.url);
        } else {
          throw new Error(result.error || "Failed to upload image");
        }
      }

      // Prepare data for submission
      const productData = {
        ...formData,
        price: Number.parseFloat(formData.price),
        discountPercentage: Number.parseFloat(formData.discountPercentage),
        finalPrice,
        stock: Number.parseInt(formData.stock),
        colors: colors.map((tag) => tag.text),
        sizes: sizes.map((tag) => tag.text),
        category: categories.map((tag) => tag.text),
        images: imageUrls,
      };

      // Create product
      const result = await createProduct(productData);

      if (result) {
        toast.success("Product created successfully");
        navigate("/admin/products");
      } else {
        throw new Error("Failed to create product");
      }
    } catch (err) {
      toast.error("Failed to create product", {
        description: err.message || "Please try again later",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCancel = () => {
    navigate("/admin/products");
  };

  return (
    <div className="p-8">
      <form onSubmit={handleSubmit} className="max-w-6xl mx-auto space-y-8">
        <ProductFormHeader onCancel={handleCancel} />

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:w-fit">
            <TabsTrigger value="basic">Basic Info</TabsTrigger>
            <TabsTrigger value="pricing">Pricing</TabsTrigger>
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>

          {/* Basic Info Tab */}
          <TabsContent value="basic" className="pt-6">
            <ProductBasicInfo
              formData={formData}
              categories={categories}
              activeCategoryIndex={activeCategoryIndex}
              onInputChange={handleInputChange}
              onSwitchChange={handleSwitchChange}
              onSelectChange={handleSelectChange}
              setCategories={setCategories}
              setActiveCategoryIndex={setActiveCategoryIndex}
            />
          </TabsContent>

          {/* Pricing Tab */}
          <TabsContent value="pricing" className="pt-6">
            <ProductPricing
              formData={formData}
              finalPrice={finalPrice}
              onInputChange={handleInputChange}
            />
          </TabsContent>

          {/* Inventory Tab */}
          <TabsContent value="inventory" className="pt-6">
            <ProductInventory
              formData={formData}
              colors={colors}
              sizes={sizes}
              activeColorIndex={activeColorIndex}
              activeSizeIndex={activeSizeIndex}
              onInputChange={handleInputChange}
              setColors={setColors}
              setSizes={setSizes}
              setActiveColorIndex={setActiveColorIndex}
              setActiveSizeIndex={setActiveSizeIndex}
            />
          </TabsContent>

          {/* Media Tab */}
          <TabsContent value="media" className="pt-6">
            <ProductMedia
              imagePreviews={imagePreviews}
              onImageUpload={handleImageUpload}
              onRemoveImage={removeImage}
            />
          </TabsContent>
        </Tabs>

        <Separator className="my-8" />

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading || isUploading}>
            {(isLoading || isUploading) && (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            )}
            {isLoading || isUploading ? "Saving..." : "Save Product"}
          </Button>
        </div>
      </form>
    </div>
  );
}
