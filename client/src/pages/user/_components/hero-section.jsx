"use client";

import * as React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

import { slides } from "@/assets/hero-sections-image";
import { brands } from "@/assets/brands";
import { Link } from "react-router-dom";

export function HeroSection() {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: false })
  );

  return (
    <section className="relative bg-black text-white">
      <div className="grid lg:grid-cols-12">
        {/* Left Content */}
        <div className="lg:col-span-5 flex flex-col justify-center px-6 lg:px-12 py-16 lg:py-0 min-h-[60vh] lg:min-h-screen">
          <div className="max-w-xl mx-auto text-center lg:text-left space-y-8 lg:space-y-12">
            <h1 className="text-4xl --font-mono-font-serif lg:text-6xl lg:mt-32 font-bold leading-tight tracking-wider">
              Elevate Your Style
            </h1>
            <p className="text-xl lg:text-2xl text-gray-300">
              Discover Timeless Elegance
            </p>
            <Link to="/products">
              <Button
                variant="outline"
                className="mx-auto lg:mx-0 px-8 py-5 text-lg border-2 border-white text-black bg-white hover:bg-black hover:text-white transition-colors duration-300"
              >
                Explore Collection
              </Button>
            </Link>
          </div>
          <div className="mt-auto mb-6 hidden lg:flex flex-col items-center gap-2 text-sm opacity-60">
            <span>Scroll for more</span>
            <ChevronDown className="h-4 w-4 animate-bounce" />
          </div>
        </div>

        {/* Right Carousel */}
        <div className="lg:col-span-7 relative overflow-hidden">
          <Carousel
            plugins={[plugin.current]}
            className="w-full h-full"
            opts={{
              align: "start",
              loop: true,
            }}
          >
            <CarouselContent className="-ml-2">
              {slides.map((slide, index) => (
                <CarouselItem key={index} className="pl-2 md:basis-4/5">
                  <div className="relative h-[60vh] lg:h-screen overflow-hidden">
                    <img
                      src={slide.image || "/placeholder.svg"}
                      alt={slide.alt}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {/* Brand Logos for larger screens */}
      <div className="hidden lg:block bg-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between gap-8">
            {brands.map((brand) => (
              <div
                key={brand.name}
                className="flex items-center justify-center grayscale transition-all hover:grayscale-0"
              >
                <img
                  src={brand.logo || "/placeholder.svg"}
                  alt={brand.name}
                  className="h-8 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
