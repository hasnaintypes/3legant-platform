"use client";

import * as React from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import { ProductCard } from "../products/_components/product-card";
import { Button } from "@/components/ui/button";
import Autoplay from "embla-carousel-autoplay";
import { useProductStore } from "@/store/useProductStore";
import { Loader2 } from "lucide-react";

export function FeaturedProducts() {
  const plugin = React.useRef(
    Autoplay({ delay: 3000, stopOnInteraction: false })
  );

  const { getProducts, isLoading } = useProductStore();

  const [newArrivals, setNewArrivals] = React.useState([]);
  const [bestSellers, setBestSellers] = React.useState([]);

  React.useEffect(() => {
    const fetchProducts = async () => {
      try {
        const newArrivalsData = await getProducts({
          badge: "new",
          limit: 4,
        });
        setNewArrivals(newArrivalsData?.products || []);

        const bestSellersData = await getProducts({
          badge: "bestseller",
          limit: 4,
        });
        setBestSellers(bestSellersData?.products || []);
      } catch (error) {
        console.error("Error fetching products:", error);
        setNewArrivals([]);
        setBestSellers([]);
      }
    };

    fetchProducts();
  }, []);



  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const renderProductCarousel = (products, title, description, bgClass) => (
    <section className={`py-16 ${bgClass}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="text-4xl font-bold mb-4">{title}</h2>
          <p
            className={
              bgClass === "bg-black" ? "text-gray-300" : "text-gray-700"
            }
          >
            {description}
          </p>
        </div>

        <Carousel
          plugins={[plugin.current]}
          className="w-full"
          opts={{
            align: "start",
            loop: true,
          }}
        >
          <CarouselContent>
            {products.length > 0 ? (
              products.map((product) => (
                <CarouselItem
                  key={product._id}
                  className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4 pl-6"
                >
                  <ProductCard
                    id={product._id}
                    name={product.name}
                    price={product.finalPrice || product.price}
                    image={product.images?.[0]}
                    rating={product.rating}
                    badge={product.badge}
                    category={product.category}
                    colors={product.colors}
                  />
                </CarouselItem>
              ))
            ) : (
              <p className="text-center w-full text-gray-500">
                No products found
              </p>
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  );

  return (
    <>
      {renderProductCarousel(
        newArrivals,
        "New Arrivals",
        "Check out the latest trends and newest additions to our collection.",
        "bg-black text-white"
      )}
      {renderProductCarousel(
        bestSellers,
        "Best Sellers",
        "Explore our best-selling products, loved by customers worldwide.",
        "bg-white"
      )}
    </>
  );
}
