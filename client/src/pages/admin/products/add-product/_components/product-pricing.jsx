import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

export function ProductPricing({ formData, finalPrice, onInputChange }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-6 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="price">Price</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              $
            </span>
            <Input
              id="price"
              name="price"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              className="pl-7"
              value={formData.price}
              onChange={onInputChange}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="discountPercentage">Discount (%)</Label>
          <div className="relative">
            <Input
              id="discountPercentage"
              name="discountPercentage"
              type="number"
              min="0"
              max="100"
              placeholder="0"
              value={formData.discountPercentage}
              onChange={onInputChange}
            />
            <span className="absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
              %
            </span>
          </div>
        </div>
        <div className="space-y-2">
          <Label>Final Price</Label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
              $
            </span>
            <Input
              value={finalPrice.toFixed(2)}
              readOnly
              className="pl-7 bg-muted"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Automatically calculated
          </p>
        </div>
      </div>
    </div>
  );
}
