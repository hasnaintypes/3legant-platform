"use client";
import { useId } from "react";

export default function ColorFilter({ onColorChange, selectedColors = [] }) {
  const id = useId();

  const colors = [
    { value: "white", label: "White", class: "bg-white" },
    { value: "black", label: "Black", class: "bg-black" },
    { value: "gray", label: "Gray", class: "bg-gray-500" },
    { value: "brown", label: "Brown", class: "bg-amber-800" },
    { value: "beige", label: "Beige", class: "bg-amber-100" },
    { value: "blue", label: "Blue", class: "bg-blue-500" },
    { value: "pink", label: "Pink", class: "bg-pink-500" },
    { value: "red", label: "Red", class: "bg-red-500" },
    { value: "orange", label: "Orange", class: "bg-orange-500" },
    { value: "green", label: "Green", class: "bg-green-500" },
    { value: "emerald", label: "Emerald", class: "bg-emerald-500" },
    {
      value: "multicolor",
      label: "Multi",
      class: "bg-gradient-to-r from-pink-500 via-blue-500 to-green-500",
    },
  ];

  return (
    <fieldset className="space-y-4">
      <legend className="text-foreground text-sm leading-none font-medium mb-3">
        Color
      </legend>
      <div className="flex flex-wrap gap-2">
        {colors.map((color) => (
          <button
            key={`${id}-${color.value}`}
            onClick={() => onColorChange(color.value)}
            aria-label={color.label}
            className={`size-8 rounded-full border-2 transition-all ${
              color.class
            } ${
              selectedColors.includes(color.value)
                ? "border-primary ring-2 ring-primary/20"
                : "border-transparent hover:border-gray-300"
            }`}
            title={color.label}
          />
        ))}
      </div>
    </fieldset>
  );
}
