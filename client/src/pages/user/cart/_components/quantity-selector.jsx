"use client";

import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

function QuantitySelector({ quantity, maxQuantity, onUpdate }) {
  const [value, setValue] = useState(quantity.toString());

  useEffect(() => {
    setValue(quantity.toString());
  }, [quantity]);

  const handleInputChange = (e) => {
    const newValue = e.target.value;
    setValue(newValue);

    const numValue = Number.parseInt(newValue);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= maxQuantity) {
      onUpdate(numValue);
    }
  };

  const handleBlur = () => {
    const numValue = Number.parseInt(value);
    if (isNaN(numValue) || numValue < 1) {
      setValue("1");
      onUpdate(1);
    } else if (numValue > maxQuantity) {
      setValue(maxQuantity.toString());
      onUpdate(maxQuantity);
    }
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      onUpdate(quantity - 1);
    }
  };

  const incrementQuantity = () => {
    if (quantity < maxQuantity) {
      onUpdate(quantity + 1);
    }
  };

  return (
    <div className="flex items-center">
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-r-none"
        onClick={decrementQuantity}
        disabled={quantity <= 1}
        aria-label="Decrease quantity"
      >
        <Minus className="h-3 w-3" />
      </Button>
      <Input
        type="text"
        inputMode="numeric"
        pattern="[0-9]*"
        value={value}
        onChange={handleInputChange}
        onBlur={handleBlur}
        className="h-8 w-12 rounded-none text-center [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        aria-label="Quantity"
      />
      <Button
        variant="outline"
        size="icon"
        className="h-8 w-8 rounded-l-none"
        onClick={incrementQuantity}
        disabled={quantity >= maxQuantity}
        aria-label="Increase quantity"
      >
        <Plus className="h-3 w-3" />
      </Button>
    </div>
  );
}

export default QuantitySelector;
