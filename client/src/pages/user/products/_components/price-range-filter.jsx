"use client";

import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useState, useEffect } from "react";

export default function PriceRangeFilter({ value, onChange }) {
  const [localValue, setLocalValue] = useState(value);

  // Update local value when prop changes
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounce the onChange to avoid too many rerenders
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localValue[0] !== value[0] || localValue[1] !== value[1]) {
        onChange(localValue);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, onChange, value]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <Label className="font-medium">Price Range</Label>
        <output className="text-sm font-medium tabular-nums">
          ${localValue[0]} - ${localValue[1]}
        </output>
      </div>
      <Slider
        value={localValue}
        min={0}
        max={600}
        step={10}
        onValueChange={setLocalValue}
        aria-label="Price range slider"
      />
    </div>
  );
}
