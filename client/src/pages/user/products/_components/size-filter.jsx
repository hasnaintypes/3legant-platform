"use client";
import { useId } from "react";

export default function SizeFilter({ onSizeChange, selectedSizes = [] }) {
  const id = useId();

  const sizes = [
    { value: "S", label: "Small" },
    { value: "M", label: "Medium" },
    { value: "L", label: "Large" },
    { value: "XL", label: "Extra Large" },
    { value: "XXL", label: "Double Extra Large" },
  ];

  return (
    <fieldset className="space-y-4">
      <legend className="text-foreground text-sm leading-none font-medium">
        Size
      </legend>
      <div className="flex gap-2">
        {sizes.map((size) => (
          <label
            key={`${id}-${size.value}`}
            className={`border-input relative flex size-10 cursor-pointer flex-col items-center justify-center rounded-full border text-center shadow-xs transition-all outline-none hover:border-primary ${
              selectedSizes.includes(size.value)
                ? "border-primary bg-primary text-primary-foreground"
                : ""
            }`}
            onClick={() => onSizeChange(size.value)}
          >
            <span aria-hidden="true" className="text-sm font-medium">
              {size.value}
            </span>
            <span className="sr-only">{size.label}</span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
