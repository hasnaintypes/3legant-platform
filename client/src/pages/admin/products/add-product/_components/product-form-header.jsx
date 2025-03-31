"use client";

import { Button } from "@/components/ui/button";

export function ProductFormHeader() {
  return (
    <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
      <div>
        <h1 className="text-2xl font-bold">Add New Product</h1>
        <p className="text-sm text-muted-foreground">
          Create a new product to add to your store
        </p>
      </div>
    </div>
  );
}
