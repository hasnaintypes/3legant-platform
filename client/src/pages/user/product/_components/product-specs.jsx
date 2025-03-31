export default function ProductSpecs({ product }) {
  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Product Specifications</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-muted/30 p-5 rounded-lg">
          <h3 className="font-semibold text-lg mb-3">General</h3>
          <ul className="space-y-3">
            <li className="flex justify-between">
              <span className="text-muted-foreground">Brand</span>
              <span className="font-medium">{product.brand}</span>
            </li>
            <li className="flex justify-between">
              <span className="text-muted-foreground">Category</span>
              <span className="font-medium">
                {product.category?.join(", ")}
              </span>
            </li>
            {product.SKU && (
              <li className="flex justify-between">
                <span className="text-muted-foreground">SKU</span>
                <span className="font-medium">{product.SKU}</span>
              </li>
            )}
          </ul>
        </div>

        {(product.colors?.length > 0 || product.sizes?.length > 0) && (
          <div className="bg-muted/30 p-5 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Options</h3>
            <ul className="space-y-3">
              {product.colors?.length > 0 && (
                <li className="flex justify-between">
                  <span className="text-muted-foreground">
                    Available Colors
                  </span>
                  <span className="font-medium">
                    {product.colors.join(", ")}
                  </span>
                </li>
              )}
              {product.sizes?.length > 0 && (
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Available Sizes</span>
                  <span className="font-medium">
                    {product.sizes.join(", ")}
                  </span>
                </li>
              )}
              <li className="flex justify-between">
                <span className="text-muted-foreground">In Stock</span>
                <span className="font-medium">{product.stock} units</span>
              </li>
            </ul>
          </div>
        )}

        {(product.warranty || product.returnPolicy) && (
          <div className="bg-muted/30 p-5 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Warranty & Returns</h3>
            <ul className="space-y-3">
              {product.warranty && (
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Warranty</span>
                  <span className="font-medium">{product.warranty}</span>
                </li>
              )}
              {product.returnPolicy && (
                <li className="flex justify-between">
                  <span className="text-muted-foreground">Return Policy</span>
                  <span className="font-medium">{product.returnPolicy}</span>
                </li>
              )}
            </ul>
          </div>
        )}
      </div>
    </section>
  );
}
