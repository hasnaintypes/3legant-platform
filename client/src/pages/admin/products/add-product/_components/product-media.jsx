import { X, Upload, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export function ProductMedia({ imagePreviews, onImageUpload, onRemoveImage }) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label>Product Images</Label>
        <div className="border-2 border-dashed rounded-lg p-8 text-center">
          <input
            type="file"
            id="images"
            multiple
            accept="image/*"
            className="hidden"
            onChange={onImageUpload}
          />
          <label
            htmlFor="images"
            className="flex flex-col items-center justify-center cursor-pointer"
          >
            <Upload className="h-12 w-12 text-muted-foreground mb-3" />
            <h3 className="text-lg font-medium">
              Drag & drop or click to upload
            </h3>
            <p className="text-sm text-muted-foreground mt-2 mb-4">
              Upload product images (PNG, JPG, WEBP)
            </p>
            <Button type="button" variant="outline" size="sm">
              <Plus className="h-4 w-4 mr-2" /> Select Files
            </Button>
          </label>
        </div>
      </div>

      {imagePreviews.length > 0 && (
        <div className="space-y-3">
          <Label>Image Previews</Label>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="h-32 w-full object-cover rounded-md border"
                />
                <button
                  type="button"
                  onClick={() => onRemoveImage(index)}
                  className="absolute top-2 right-2 bg-background/80 text-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X className="h-4 w-4" />
                </button>
                {index === 0 && (
                  <span className="absolute bottom-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-md">
                    Main
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
