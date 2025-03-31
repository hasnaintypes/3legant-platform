import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TagInput } from "emblor";

// Product categories from the schema
const PRODUCT_CATEGORIES = [
  "Shoes",
  "Dresses",
  "Children",
  "Women",
  "Men",
  "Watches",
  "Bags",
  "Jewelry",
  "Electronics",
  "Laptops",
  "Mobiles",
  "Accessories",
  "Gaming",
  "Furniture",
  "Home Decor",
  "Beauty",
  "Skin Care",
  "Hair Care",
  "Toys",
  "Baby Products",
  "Kitchen Appliances",
  "Books",
  "Sports",
  "Automotive",
  "Pets",
];

// Product badges from the schema
const PRODUCT_BADGES = [
  "Limited",
  "New",
  "Discounted",
  "Best Seller",
  "Trending",
];

export function ProductBasicInfo({
  formData,
  categories,
  activeCategoryIndex,
  onInputChange,
  onSwitchChange,
  onSelectChange,
  setCategories,
  setActiveCategoryIndex,
}) {
  const categoriesId = useId();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Product Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="brand">Brand</Label>
          <Input
            id="brand"
            name="brand"
            placeholder="Enter brand name"
            value={formData.brand}
            onChange={onInputChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Enter product description"
          rows={5}
          value={formData.description}
          onChange={onInputChange}
          required
        />
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={categoriesId}>Categories</Label>
          <TagInput
            id={categoriesId}
            tags={categories}
            setTags={setCategories}
            placeholder="Add a category"
            styleClasses={{
              inlineTagsContainer:
                "border-input rounded-md bg-background shadow-xs transition-[color,box-shadow] focus-within:border-ring outline-none focus-within:ring-[3px] focus-within:ring-ring/50 p-1 gap-1",
              input: "w-full min-w-[80px] shadow-none px-2 h-7",
              tag: {
                body: "h-7 relative bg-background border border-input hover:bg-background rounded-md font-medium text-xs ps-2 pe-7",
                closeButton:
                  "absolute -inset-y-px -end-px p-0 rounded-e-md flex size-7 transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] text-muted-foreground/80 hover:text-foreground",
              },
            }}
            activeTagIndex={activeCategoryIndex}
            setActiveTagIndex={setActiveCategoryIndex}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Select from: {PRODUCT_CATEGORIES.slice(0, 5).join(", ")}...
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="badge">Badge</Label>
          <Select
            onValueChange={(value) => onSelectChange("badge", value)}
            value={formData.badge}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a badge (optional)" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              {PRODUCT_BADGES.map((badge) => (
                <SelectItem key={badge} value={badge}>
                  {badge}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="featured"
          checked={formData.isFeatured}
          onCheckedChange={onSwitchChange}
        />
        <Label htmlFor="featured">Featured Product</Label>
      </div>
    </div>
  );
}
