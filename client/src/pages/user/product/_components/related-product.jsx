import { ProductCard } from "../../products/_components/product-card";

export default function RelatedProducts({ products = [] }) {
  if (products.length === 0) return null;

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">You might also like</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            id={product._id}
            name={product.name}
            price={product.finalPrice || product.price}
            image={product.images?.[0] || "/placeholder.svg"}
            rating={product.ratings?.averageRating || 0}
            badge={
              product.badge || (product.discountPercentage > 0 ? "Sale" : null)
            }
            category={product.category}
            colors={product.colors}
          />
        ))}
      </div>
    </section>
  );
}
