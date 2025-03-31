import { useId } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { TagInput } from "emblor";

export function ProductInventory({
  formData,
  colors,
  sizes,
  activeColorIndex,
  activeSizeIndex,
  onInputChange,
  setColors,
  setSizes,
  setActiveColorIndex,
  setActiveSizeIndex,
}) {
  const colorsId = useId();
  const sizesId = useId();

  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="stock">Stock Quantity</Label>
          <Input
            id="stock"
            name="stock"
            type="number"
            min="0"
            placeholder="0"
            value={formData.stock}
            onChange={onInputChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="SKU">SKU (Stock Keeping Unit)</Label>
          <Input
            id="SKU"
            name="SKU"
            placeholder="Auto-generated if left blank"
            value={formData.SKU}
            onChange={onInputChange}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Leave blank to auto-generate
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor={colorsId}>Available Colors</Label>
          <TagInput
            id={colorsId}
            tags={colors}
            setTags={setColors}
            placeholder="Add a color"
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
            activeTagIndex={activeColorIndex}
            setActiveTagIndex={setActiveColorIndex}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Example: Red, Blue, Black
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor={sizesId}>Available Sizes</Label>
          <TagInput
            id={sizesId}
            tags={sizes}
            setTags={setSizes}
            placeholder="Add a size"
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
            activeTagIndex={activeSizeIndex}
            setActiveTagIndex={setActiveSizeIndex}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Example: S, M, L, XL or 6, 7, 8, 9
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="warranty">Warranty</Label>
          <Input
            id="warranty"
            name="warranty"
            placeholder="e.g., 1 Year Manufacturer Warranty"
            value={formData.warranty}
            onChange={onInputChange}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="returnPolicy">Return Policy</Label>
          <Input
            id="returnPolicy"
            name="returnPolicy"
            placeholder="e.g., 30-day return policy"
            value={formData.returnPolicy}
            onChange={onInputChange}
          />
        </div>
      </div>
    </div>
  );
}
