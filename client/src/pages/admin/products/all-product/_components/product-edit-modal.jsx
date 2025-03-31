import { useState, useEffect } from "react";
import { X } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

import { ProductBasicInfo } from "../../add-product/_components/product-basic-info";
import { ProductPricing } from "../../add-product/_components/product-pricing";
import { ProductInventory } from "../../add-product/_components/product-inventory";
import { ProductMedia } from "../../add-product/_components/product-media";

export function ProductEditModal({ product, isOpen, onClose, onSave }) {
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
  const [imagePreviews, setImagePreviews] = useState([]);

  // Calculate final price
  const finalPrice =
    formData.price && formData.discountPercentage
      ? Number.parseFloat(formData.price) -
        (Number.parseFloat(formData.price) *
          Number.parseFloat(formData.discountPercentage)) /
          100
      : 0;

  // Initialize form data when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        discountPercentage: product.discountPercentage.toString(),
        brand: product.brand,
        stock: product.stock.toString(),
        SKU: product.SKU,
        warranty: product.warranty,
        returnPolicy: product.returnPolicy,
        isFeatured: product.isFeatured,
        badge: product.badge,
      });

      // Convert arrays to Tag objects
      setColors(
        product.colors.map((color) => ({
          id: crypto.randomUUID(),
          text: color,
        }))
      );
      setSizes(
        product.sizes.map((size) => ({ id: crypto.randomUUID(), text: size }))
      );
      setCategories(
        product.category.map((cat) => ({ id: crypto.randomUUID(), text: cat }))
      );

      // Set image previews
      setImagePreviews(product.images || []);
    }
  }, [product]);

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

      // Create preview URLs
      const newPreviews = fileArray.map((file) => URL.createObjectURL(file));
      setImagePreviews((prev) => [...prev, ...newPreviews]);
    }
  };

  // Remove image
  const removeImage = (index) => {
    const newPreviews = [...imagePreviews];
    newPreviews.splice(index, 1);
    setImagePreviews(newPreviews);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!product) return;

    // Prepare data for submission
    const updatedProduct = {
      ...product,
      ...formData,
      price: Number.parseFloat(formData.price),
      discountPercentage: Number.parseFloat(formData.discountPercentage),
      finalPrice,
      stock: Number.parseInt(formData.stock),
      colors: colors.map((tag) => tag.text),
      sizes: sizes.map((tag) => tag.text),
      category: categories.map((tag) => tag.text),
      images: imagePreviews,
    };

    onSave(updatedProduct);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-h-[90vh] max-w-4xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
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

          <Separator />

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
